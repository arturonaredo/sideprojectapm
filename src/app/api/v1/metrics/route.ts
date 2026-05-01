import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 1000; // 1000 requests per minute

// In-memory rate limit store (for demo - use Redis in production)
const rateLimitStore: Map<string, number[]> = new Map();

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

    // Find project by API key
    const projects = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.apiKey, apiKey))
      .limit(1);

    const project = projects[0];

    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
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

    const validTypes = ["counter", "gauge", "histogram"] as const;
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Create metric
    const metricId = generateId("metric");
    const timestamp = body.timestamp || new Date().toISOString();

    await db.insert(schema.metrics).values({
      id: metricId,
      projectId: project.id,
      type: body.type,
      name: body.name,
      value: body.value,
      tags: body.tags || {},
      timestamp,
      receivedAt: new Date().toISOString(),
    });

    // Return success (202 Accepted for async processing)
    return NextResponse.json(
      {
        accepted: true,
        id: metricId,
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