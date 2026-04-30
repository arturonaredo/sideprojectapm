import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Activity, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

// Demo data for MVP
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
    status: "down" as const,
    uptime: 85.3,
    errorRate: 45,
    avgLatency: 890,
  },
];

function StatusDot({ status }: { status: "healthy" | "degraded" | "down" }) {
  const colors = {
    healthy: "bg-green-500",
    degraded: "bg-amber-500",
    down: "bg-red-500",
  };

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[status]} ${
        status === "down" ? "animate-pulse" : ""
      }`}
    />
  );
}

function ProjectCard({ project }: { project: (typeof demoProjects)[0] }) {
  const statusLabel = {
    healthy: "🟢",
    degraded: "🟡",
    down: "🔴",
  };

  return (
    <Card variant="interactive" className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{statusLabel[project.status]}</span>
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">{project.url}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Uptime</span>
          </div>
          <span className="font-medium text-gray-900">{project.uptime}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Errors</span>
          </div>
          <span className="font-medium text-gray-900">{project.errorRate}/day</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Latency</span>
          </div>
          <span className="font-medium text-gray-900">{project.avgLatency}ms</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">Last 24h</span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <PageLayout
      title="My Projects"
      description="Monitor your side projects"
      actions={
        <Link href="/dashboard/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      }
    >
      {demoProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No projects yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first project to start monitoring
            </p>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/${project.id}`}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}