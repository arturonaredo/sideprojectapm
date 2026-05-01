/**
 * Next.js Instrumentation
 *
 * Runs when the server starts. Used to initialize background services.
 */

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Initializing server...');

    // Initialize scheduler for uptime monitoring
    const { startScheduler } = await import('@/lib/scheduler');

    // Start the scheduler
    startScheduler();

    console.log('[Instrumentation] Server initialized');
  }
}