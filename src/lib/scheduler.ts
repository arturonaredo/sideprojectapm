/**
 * Background Scheduler for Uptime Monitoring
 *
 * Uses node-cron to run periodic uptime checks for all active projects.
 */

import { schedule, validate } from 'node-cron';
import { db, schema } from './db';
import { eq } from 'drizzle-orm';
import { checkUptime, type UptimeCheckResult } from './uptime-checker';
import { generateId } from './utils';

// ============================================================================
// Scheduler state
// ============================================================================

let schedulerJob: {
  stop: () => void;
  start: () => void;
} | null = null;
let isRunning = false;

// Track last check times to avoid duplicate checks
const lastCheckTimes: Map<string, Date> = new Map();

// ============================================================================
// Check interval configuration
// ============================================================================

// Default: every 5 minutes
const CHECK_INTERVAL_CRON = '*/5 * * * *';

// Minimum time between checks for same project (ms)
const MIN_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

// ============================================================================
// Uptime check job
// ============================================================================

/**
 * Run uptime checks for all active projects
 */
export async function runUptimeChecks(): Promise<{
  checked: number;
  failed: number;
  results: Map<string, UptimeCheckResult>;
}> {
  const projects = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.status, 'active'));

  const results = new Map<string, UptimeCheckResult>();
  let checked = 0;
  let failed = 0;

  console.log(`[Scheduler] Starting uptime checks for ${projects.length} projects`);

  for (const project of projects) {
    try {
      // Skip if no URL configured
      if (!project.url) {
        console.log(`[Scheduler] Skipping ${project.name} - no URL configured`);
        continue;
      }

      // Skip if checked recently
      const lastCheck = lastCheckTimes.get(project.id);
      if (lastCheck) {
        const timeSinceLastCheck = Date.now() - lastCheck.getTime();
        if (timeSinceLastCheck < MIN_CHECK_INTERVAL_MS) {
          console.log(`[Scheduler] Skipping ${project.name} - checked ${Math.round(timeSinceLastCheck / 1000)}s ago`);
          continue;
        }
      }

      // Run uptime check
      const result = await checkUptime(project.url);
      lastCheckTimes.set(project.id, result.checkedAt);
      results.set(project.id, result);
      checked++;

      // Store result in database
      await db.insert(schema.uptimeChecks).values({
        id: generateId('check'),
        projectId: project.id,
        status: result.status,
        latency: result.latency,
        checkedAt: result.checkedAt.toISOString(),
      });

      console.log(`[Scheduler] ${project.name}: ${result.status} (${result.latency}ms)`);
    } catch (error) {
      console.error(`[Scheduler] Error checking ${project.name}:`, error);
      failed++;

      // Store failed check
      if (project.url) {
        await db.insert(schema.uptimeChecks).values({
          id: generateId('check'),
          projectId: project.id,
          status: 'down',
          latency: 0,
          checkedAt: new Date().toISOString(),
        });
      }
    }
  }

  console.log(`[Scheduler] Completed: ${checked} checked, ${failed} failed`);
  return { checked, failed, results };
}

// ============================================================================
// Scheduler control
// ============================================================================

/**
 * Start the uptime monitoring scheduler
 */
export function startScheduler(): void {
  if (schedulerJob) {
    console.log('[Scheduler] Already running');
    return;
  }

  console.log('[Scheduler] Starting uptime monitor...');
  isRunning = true;

  schedulerJob = schedule(
    CHECK_INTERVAL_CRON,
    async () => {
      if (!isRunning) return;
      try {
        await runUptimeChecks();
      } catch (error) {
        console.error('[Scheduler] Error in scheduled job:', error);
      }
    },
    {
      scheduled: true,
      runOnInit: false, // Don't run immediately on start
    }
  );

  console.log(`[Scheduler] Started with interval: ${CHECK_INTERVAL_CRON}`);
}

/**
 * Stop the uptime monitoring scheduler
 */
export function stopScheduler(): void {
  if (schedulerJob) {
    schedulerJob.stop();
    schedulerJob = null;
    isRunning = false;
    console.log('[Scheduler] Stopped');
  }
}

/**
 * Check if scheduler is running
 */
export function isSchedulerRunning(): boolean {
  return isRunning && schedulerJob !== null;
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): {
  running: boolean;
  interval: string;
  lastChecks: Map<string, Date>;
} {
  return {
    running: isSchedulerRunning(),
    interval: CHECK_INTERVAL_CRON,
    lastChecks: new Map(lastCheckTimes),
  };
}