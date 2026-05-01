/**
 * Admin API: Manual Uptime Check Trigger
 *
 * POST /api/admin/check-uptime
 * Triggers an immediate uptime check for all projects or a specific project.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { checkUptime } from '@/lib/uptime-checker';
import { generateId } from '@/lib/utils';

/**
 * POST /api/admin/check-uptime
 *
 * Body:
 * - projectId?: string - Specific project to check (optional, checks all if omitted)
 *
 * Response:
 * - checked: number of projects checked
 * - results: array of check results
 */
export async function POST(request: NextRequest) {
  try {
    // Parse optional body
    let projectId: string | undefined;
    try {
      const body = await request.json();
      projectId = body.projectId;
    } catch {
      // No body, check all projects
    }

    // Get projects to check
    let projects;
    if (projectId) {
      const result = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId))
        .limit(1);
      projects = result;
    } else {
      projects = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.status, 'active'));
    }

    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'No projects found' },
        { status: 404 }
      );
    }

    const results: Array<{
      projectId: string;
      projectName: string;
      status: 'up' | 'down' | 'degraded';
      latency: number;
      statusCode?: number;
      error?: string;
    }> = [];

    for (const project of projects) {
      // Skip if no URL configured
      if (!project.url) {
        continue;
      }

      // Run uptime check
      const result = await checkUptime(project.url);

      // Store result in database
      await db.insert(schema.uptimeChecks).values({
        id: generateId('check'),
        projectId: project.id,
        status: result.status,
        latency: result.latency,
        checkedAt: result.checkedAt.toISOString(),
      });

      results.push({
        projectId: project.id,
        projectName: project.name,
        status: result.status,
        latency: result.latency,
        statusCode: result.statusCode,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      checked: results.length,
      checkedAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('[Admin] Error in manual uptime check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/check-uptime
 *
 * Returns scheduler status and last check times
 */
export async function GET() {
  // Import scheduler functions dynamically to avoid circular deps
  const { getSchedulerStatus, isSchedulerRunning } = await import('@/lib/scheduler');

  const status = getSchedulerStatus();

  // Convert lastChecks Map to plain object for JSON
  const lastChecks: Record<string, string> = {};
  status.lastChecks.forEach((date, projectId) => {
    lastChecks[projectId] = date.toISOString();
  });

  return NextResponse.json({
    scheduler: {
      running: isSchedulerRunning(),
      interval: status.interval,
    },
    lastChecks,
    timestamp: new Date().toISOString(),
  });
}