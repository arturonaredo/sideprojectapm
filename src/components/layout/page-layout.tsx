import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-xl font-bold text-indigo-600">
                SideProjectAPM
              </a>
              <nav className="hidden md:flex items-center gap-4">
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/create"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  New Project
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || actions) && (
          <div className="flex items-center justify-between mb-8">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">{title}</h1>
              )}
              {description && (
                <p className="text-gray-500 mt-1">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-4">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}