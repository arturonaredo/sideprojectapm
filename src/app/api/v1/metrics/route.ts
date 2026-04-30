import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for demo
// In production, use a database
const metricsStore: Map<string, unknown[]> = new Map();
const rateLimitStore: Map<string, number[]> = new Map();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 1000; // 1000 requests per minute

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(apiKey) || [];

  // Filter out old timestamps
  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitStore.set(apiKey, recentTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("X-API-Key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 401 }
      );
    }

    // Validate API key format (demo: accept any sk_live_* key)
    if (!apiKey.startsWith("sk_live_")) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(apiKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();

    // Validate metric
    if (!body.type || !body.name || typeof body.value !== "number") {
      return NextResponse.json(
        { error: "Invalid metric. Required: type, name, value" },
        { status: 400 }
      );
    }

    const validTypes = ["counter", "gauge", "histogram"];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Create metric
    const metric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      apiKey,
      type: body.type,
      name: body.name,
      value: body.value,
      tags: body.tags || {},
      timestamp: body.timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    };

    // Store metric (demo: store in memory)
    const projectMetrics = metricsStore.get(apiKey) || [];
    projectMetrics.push(metric);
    metricsStore.set(apiKey, projectMetrics);

    // Return success (202 Accepted for async processing)
    return NextResponse.json(
      {
        accepted: true,
        id: metric.id,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error processing metric:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}