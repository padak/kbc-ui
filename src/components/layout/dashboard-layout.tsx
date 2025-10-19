"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";
import { getAuth, clearAuth } from "@/lib/api/auth";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Boxes,
  Users,
  Settings,
  FileCode,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  aiPowered?: boolean;
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    aiPowered: true,
  },
  {
    label: "Storage",
    icon: Database,
    href: "/storage",
  },
  {
    label: "Flows",
    icon: GitBranch,
    href: "/flows",
  },
  {
    label: "Transformations",
    icon: FileCode,
    href: "/transformations",
  },
  {
    label: "Components",
    icon: Boxes,
    href: "/components",
  },
  {
    label: "Jobs",
    icon: BarChart3,
    href: "/jobs",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function DashboardLayout({
  children,
  title,
  breadcrumbs,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ stackUrl: string; token: string } | null>(
    null
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const credentials = getAuth();
    if (!credentials) {
      router.push("/login");
    } else {
      setAuth(credentials);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-lg border-r border-gray-200/50 transition-all duration-300 z-40",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-ai-purple)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-gray-900">Keboola</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-ai-purple)] flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">K</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-[var(--color-primary-500)]/10 to-[var(--color-ai-purple)]/10 text-[var(--color-primary-600)] font-medium"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
                    sidebarCollapsed && "justify-center"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[var(--color-primary-500)] to-[var(--color-ai-purple)] rounded-r-full" />
                  )}

                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive && "text-[var(--color-primary-600)]",
                      item.aiPowered && "text-[var(--color-ai-purple)]"
                    )}
                  />

                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">
                        {item.label}
                      </span>
                      {item.aiPowered && (
                        <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai-purple)] opacity-60" />
                      )}
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-primary-500)] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-gray-200/50 p-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200",
              sidebarCollapsed && "justify-center"
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="flex-1 text-left text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Left Section: Title & Breadcrumbs */}
            <div className="flex-1">
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <nav className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && (
                        <span className="mx-2 text-gray-400">/</span>
                      )}
                      {crumb.href ? (
                        <button
                          onClick={() => router.push(crumb.href!)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
              ) : title ? (
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h1>
                  <AIBadge variant="subtle" className="text-xs">
                    AI-Powered
                  </AIBadge>
                </div>
              ) : null}
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Stack Info */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-600">
                  {auth.stackUrl.replace("https://", "").split(".")[0]}
                </span>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 hover-lift"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="p-6">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Keboola Connection</span>
              <span className="text-gray-400">•</span>
              <AIBadge variant="subtle" className="text-xs">
                AI-Powered
              </AIBadge>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://help.keboola.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://status.keboola.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Status
              </a>
              <a
                href="mailto:support@keboola.com"
                className="hover:text-gray-900 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
