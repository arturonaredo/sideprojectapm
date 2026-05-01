import { NextResponse } from "next/server";

// Demo data store (in production, use database)
const demoProjects = [
  {
    id: "1",
    name: "Midwiser",
    url: "https://midwiser.app",
    status: "healthy" as const,
    uptime: 99.9,
    errorRate: 2,
    avgLatency: 120,
  },
  {
    id: "2",
    name: "DiffScan",
    url: "https://diffscan.app",
    status: "degraded" as const,
    uptime: 98.2,
    errorRate: 15,
    avgLatency: 340,
  },
  {
    id: "3",
    name: "VoltAssistant",
    url: "https://voltassistant.app",
    status: "critical" as const,
    uptime: 85.3,
    errorRate: 45,
    avgLatency: 890,
  },
];

export async function GET() {
  return NextResponse.json({
    projects: demoProjects,
    total: demoProjects.length,
  });
}