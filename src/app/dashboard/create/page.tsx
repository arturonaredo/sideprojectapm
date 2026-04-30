"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock API key
    const key = `sk_live_${Math.random().toString(36).substring(2, 34)}`;
    setApiKey(key);
    setStep("success");
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "success") {
    return (
      <PageLayout>
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Project Created!</h2>
            <p className="text-gray-500 mt-2">
              Your API key is shown below. Copy it now - it won't be shown again.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
                {apiKey}
              </code>
              <Button variant="secondary" onClick={handleCopy}>
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Integration
            </label>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// Send a metric
fetch('https://apm.example.com/api/v1/metrics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '${apiKey}'
  },
  body: JSON.stringify({
    type: 'counter',
    name: 'page_views',
    value: 1,
    tags: { page: '/dashboard' }
  })
});`}</code>
            </pre>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="confirm" className="text-sm text-gray-600">
              I've copied my API key and stored it securely
            </label>
          </div>

          <Button
            className="w-full"
            disabled={!confirmed}
            onClick={() => router.push("/dashboard/1")}
          >
            Go to Dashboard
          </Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <a
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </a>

        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create New Project
          </h1>
          <p className="text-gray-500 mb-8">
            Add a new project to start monitoring
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Project Name"
              placeholder="My Awesome Side Project"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={errors.name}
              required
            />

            <Input
              label="Website URL"
              placeholder="https://myproject.com"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              error={errors.url}
              helpText="Used for uptime monitoring"
              required
            />

            <Input
              label="Description"
              placeholder="A brief description of your project"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <Button type="submit" className="w-full" loading={loading}>
              Create Project
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}