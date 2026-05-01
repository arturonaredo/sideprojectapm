/**
 * Uptime Checker - HTTP endpoint monitoring
 *
 * Performs HTTP HEAD/GET requests to check endpoint availability
 * and measures response latency.
 */

export type UptimeStatus = 'up' | 'down' | 'degraded';

export interface UptimeCheckResult {
  status: UptimeStatus;
  latency: number; // milliseconds
  statusCode?: number;
  error?: string;
  checkedAt: Date;
}

export interface UptimeCheckOptions {
  timeout?: number; // milliseconds, default 10000
  method?: 'HEAD' | 'GET';
  expectedStatusCodes?: number[];
}

// Default expected status codes (2xx and 3xx redirects are OK)
const DEFAULT_EXPECTED_CODES = [200, 201, 202, 204, 301, 302, 303, 307, 308];

// Latency thresholds for degraded status
const LATENCY_WARNING_MS = 2000; // 2 seconds
const LATENCY_CRITICAL_MS = 5000; // 5 seconds

/**
 * Check uptime of a URL
 *
 * @param url - The URL to check
 * @param options - Check options (timeout, method, expected codes)
 * @returns UptimeCheckResult with status, latency, and optional error
 */
export async function checkUptime(
  url: string,
  options: UptimeCheckOptions = {}
): Promise<UptimeCheckResult> {
  const {
    timeout = 10000,
    method = 'HEAD',
    expectedStatusCodes = DEFAULT_EXPECTED_CODES,
  } = options;

  const checkedAt = new Date();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const startTime = Date.now();

    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'SideProjectAPM-UptimeChecker/1.0',
      },
    });

    const latency = Date.now() - startTime;
    clearTimeout(timeoutId);

    const statusCode = response.status;

    // Check if status code is expected
    const isExpectedCode = expectedStatusCodes.includes(statusCode);

    if (!isExpectedCode) {
      return {
        status: 'down',
        latency,
        statusCode,
        error: `Unexpected status code: ${statusCode}`,
        checkedAt,
      };
    }

    // Determine status based on latency
    let status: UptimeStatus = 'up';
    if (latency >= LATENCY_CRITICAL_MS) {
      status = 'degraded';
    } else if (latency >= LATENCY_WARNING_MS) {
      status = 'degraded';
    }

    return {
      status,
      latency,
      statusCode,
      checkedAt,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Distinguish between timeout and other errors
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: 'down',
        latency: timeout,
        error: `Timeout after ${timeout}ms`,
        checkedAt,
      };
    }

    return {
      status: 'down',
      latency: 0,
      error: errorMessage,
      checkedAt,
    };
  }
}

/**
 * Calculate uptime percentage from check results
 *
 * @param checks - Array of uptime check results
 * @returns Percentage of successful checks (0-100)
 */
export function calculateUptimePercentage(checks: UptimeCheckResult[]): number {
  if (checks.length === 0) return 0;

  const upChecks = checks.filter((c) => c.status !== 'down').length;
  return Math.round((upChecks / checks.length) * 100 * 10) / 10; // 1 decimal
}

/**
 * Get average latency from check results
 *
 * @param checks - Array of uptime check results
 * @returns Average latency in ms (excluding failed checks)
 */
export function getAverageLatency(checks: UptimeCheckResult[]): number {
  const successfulChecks = checks.filter((c) => c.status !== 'down');

  if (successfulChecks.length === 0) return 0;

  const totalLatency = successfulChecks.reduce((sum, c) => sum + c.latency, 0);
  return Math.round(totalLatency / successfulChecks.length);
}