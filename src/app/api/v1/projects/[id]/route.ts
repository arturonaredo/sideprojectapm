import { NextRequest, NextResponse } from "next/server";

// Demo data store (in production, use database)
const demoProjects: Record<string, {
  id: string;
  name: string;
  url: string;
  description: string;
  status: "healthy" | "degraded" | "critical";
  apiKey: string;
  createdAt: string;
  lastHeartbeat: string | null;
}> = {
  "1": {
    id: "1",
    name: "Midwiser",
    url: "https://midwiser.app",
    description: "AI-powered decision journal for indie hackers",
    status: "healthy",
    apiKey: "sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    createdAt: "2025-01-15T00:00:00.000Z",
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  "2": {
    id: "2",
    name: "DiffScan",
    url: "https://diffscan.app",
    description: "Website change detection and monitoring",
    status: "degraded",
    apiKey: "sk_live_d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
    createdAt: "2025-02-10T00:00:00.000Z",
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  "3": {
    id: "3",
    name: "VoltAssistant",
    url: "https://voltassistant.app",
    description: "Solar energy monitoring and optimization",
    status: "critical",
    apiKey: "sk_live_g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
    createdAt: "2025-03-01T00:00:00.000Z",
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
};

// Generate demo metrics for a project
function generateDemoMetrics(projectId: string) {
  const baseUptime = projectId === "3" ? 85.3 : projectId === "2" ? 98.2 : 99.9;
  const baseErrorRate = projectId === "3" ? 45 : projectId === "2" ? 15 : 2;
  const baseLatency = projectId === "3" ? 890 : projectId === "2" ? 340 : 120;

  // Generate 7 days of data
  const uptimeData = [];
  const errorsData = [];
  const latencyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const variance = (Math.random() - 0.5) * 2;
    const uptime = Math.max(0, Math.min(100, baseUptime + variance));
    const errors = Math.max(0, Math.round(baseErrorRate * (0.5 + Math.random())));

    uptimeData.push({
      date: dayName,
      uptime: Math.round(uptime * 10) / 10,
      errors,
    });

    errorsData.push({
      date: dayName,
      count: errors,
    });
  }

  // Generate 24h latency data
  for (let h = 0; h < 24; h += 4) {
    const variance = (Math.random() - 0.5) * 50;
    latencyData.push({
      time: `${h.toString().padStart(2, "0")}:00`,
      latency: Math.round(baseLatency + variance),
    });
  }

  return {
    uptime: baseUptime,
    errorRate: baseErrorRate,
    avgLatency: baseLatency,
    totalRequests: Math.round(30000 + Math.random() * 30000),
    uptimeData,
    errorsData,
    latencyData,
  };
}

// Generate demo errors
function generateDemoErrors(projectId: string) {
  const errorTemplates = [
    { message: "Connection timeout to database", severity: "critical" },
    { message: 'TypeError: Cannot read property "id" of undefined', severity: "error" },
    { message: "Rate limit exceeded for API endpoint", severity: "warning" },
    { message: "Failed to fetch external resource", severity: "warning" },
    { message: "Invalid JSON response from upstream", severity: "error" },
    { message: "Memory usage exceeded threshold", severity: "warning" },
    { message: "SSL certificate expires soon", severity: "info" },
    { message: "Slow query detected (>5s)", severity: "warning" },
  ];

  const numErrors = projectId === "3" ? 8 : projectId === "2" ? 5 : 2;

  return errorTemplates
    .slice(0, numErrors)
    .map((template, idx) => ({
      id: `err_${projectId}_${idx}`,
      message: template.message,
      severity: template.severity,
      count: Math.round(1 + Math.random() * 10),
      lastSeen: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
    }))
    .sort((a, b) => {
      const order = { critical: 0, error: 1, warning: 2, info: 3 };
      return order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order];
    });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = demoProjects[id];

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  // Get demo metrics and errors
  const metrics = generateDemoMetrics(id);
  const errors = generateDemoErrors(id);

  return NextResponse.json({
    project: {
      ...project,
      // Mask API key in response
      apiKey: project.apiKey.slice(0, 12) + "••••" + project.apiKey.slice(-4),
    },
    metrics,
    errors,
  });
}