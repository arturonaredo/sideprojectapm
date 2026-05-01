import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge, type Status } from "@/components/dashboard/status-badge";
import {
  Activity,
  AlertCircle,
  Clock,
  Globe,
  Key,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { maskApiKey, formatRelativeTime } from "@/lib/utils";

// Demo data for project detail
const demoProject = {
  id: "1",
  name: "Midwiser",
  url: "https://midwiser.app",
  description: "AI-powered decision journal for indie hackers",
  status: "healthy" as Status,
  apiKey: "sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  createdAt: new Date("2025-01-15"),
  lastHeartbeat: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
};

// Demo metrics (last 24 hours)
const demoMetrics = {
  uptime: 99.9,
  errorRate: 2,
  avgLatency: 120,
  totalRequests: 45678,
};

// Demo uptime data (last 7 days)
const uptimeData = [
  { date: "Mon", uptime: 100, errors: 0 },
  { date: "Tue", uptime: 99.8, errors: 3 },
  { date: "Wed", uptime: 100, errors: 0 },
  { date: "Thu", uptime: 99.5, errors: 8 },
  { date: "Fri", uptime: 100, errors: 0 },
  { date: "Sat", uptime: 99.9, errors: 2 },
  { date: "Sun", uptime: 100, errors: 0 },
];

// Demo recent errors
const demoErrors = [
  {
    id: "err_1",
    message: "Connection timeout to database",
    severity: "critical" as const,
    count: 2,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "err_2",
    message: 'TypeError: Cannot read property "id" of undefined',
    severity: "error" as const,
    count: 5,
    lastSeen: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "err_3",
    message: "Rate limit exceeded for API endpoint",
    severity: "warning" as const,
    count: 12,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "err_4",
    message: "Failed to fetch external resource",
    severity: "warning" as const,
    count: 3,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
];

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  error: "bg-red-50 text-red-600 border-red-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  info: "bg-blue-50 text-blue-600 border-blue-100",
};

const severityDotColors: Record<string, string> = {
  critical: "bg-red-500",
  error: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
};

function ErrorRow({
  error,
}: {
  error: (typeof demoErrors)[0];
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div
        className={`mt-1 w-2 h-2 rounded-full ${severityDotColors[error.severity]}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {error.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {error.count} occurrence{error.count > 1 ? "s" : ""} • Last seen{" "}
          {formatRelativeTime(error.lastSeen)}
        </p>
      </div>
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${severityColors[error.severity]}`}
      >
        {error.severity}
      </span>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: Fetch project data from API using id
  // For now, use demo data
  const project = demoProject;

  return (
    <PageLayout
      title={
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span>{project.name}</span>
          <StatusBadge status={project.status} size="sm" />
        </div>
      }
      description={
        <div className="flex items-center gap-2 text-gray-500">
          <Globe className="w-4 h-4" />
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            {project.url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      }
      actions={
        <div className="flex gap-2">
          <Button variant="secondary">
            <Activity className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      }
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Uptime"
          value={`${demoMetrics.uptime}%`}
          subtitle="Last 24 hours"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 0.2, label: "vs yesterday", direction: "up" }}
        />
        <MetricCard
          title="Error Rate"
          value={`${demoMetrics.errorRate}/hr`}
          subtitle="Last 24 hours"
          icon={AlertCircle}
          variant={demoMetrics.errorRate > 10 ? "danger" : "default"}
          trend={{ value: 15, label: "vs yesterday", direction: "down" }}
        />
        <MetricCard
          title="Avg Latency"
          value={`${demoMetrics.avgLatency}ms`}
          subtitle="P95: 245ms"
          icon={Clock}
          trend={{ value: 5, label: "vs yesterday", direction: "down" }}
        />
        <MetricCard
          title="Total Requests"
          value={demoMetrics.totalRequests.toLocaleString()}
          subtitle="Last 24 hours"
          icon={Activity}
          trend={{ value: 12, label: "vs yesterday", direction: "up" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Uptime Timeline
            </h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[95, 100]}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Uptime"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#uptimeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Errors Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Errors Timeline
            </h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [value, "Errors"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="errors"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: "#EF4444", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Errors */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Errors
              </h3>
              <p className="text-sm text-gray-500">Last 10 errors</p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {demoErrors.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No errors recorded</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {demoErrors.map((error) => (
                  <ErrorRow key={error.id} error={error} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Key Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">API Key</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Key
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-600 overflow-hidden text-ellipsis">
                    {maskApiKey(project.apiKey)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(project.apiKey)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Quick Integration
                </h4>
                <pre className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                  <code className="text-xs text-gray-300">
                    {`curl -X POST \\
  ${project.url}/api/v1/metrics \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"gauge","name":"cpu_usage","value":42.5}'`}
                  </code>
                </pre>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Last used: {formatRelativeTime(project.lastHeartbeat)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}