"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Database,
  Briefcase,
  Workflow,
  Code,
  AppWindow,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "keboola-sidebar-collapsed";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Storage", href: "/storage", icon: Database },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Flows", href: "/flows", icon: Workflow },
  { label: "Transformations", href: "/transformations", icon: Code },
  { label: "Data Apps", href: "/data-apps", icon: AppWindow },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }

    // Auto-collapse on mobile
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, String(newState));
    }
  };

  return { isCollapsed, toggleCollapsed, isMounted };
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-r border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out z-50",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo/Header Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-sm text-white">
                K
              </div>
              <span className="font-semibold text-sm">Keboola</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-sm text-white mx-auto">
              K
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  {/* Hover gradient effect for non-active items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300" />
                  )}

                  <Icon
                    className={cn(
                      "relative z-10 flex-shrink-0 transition-transform duration-200",
                      isActive
                        ? "w-5 h-5"
                        : "w-5 h-5 group-hover:scale-110"
                    )}
                  />

                  {!isCollapsed && (
                    <span className="relative z-10 text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </Link>
              );

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-700/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "w-full h-10 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2 w-full">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </div>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

// Layout wrapper component that handles the sidebar state
interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed, toggleCollapsed, isMounted } = useSidebarState();

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen">
        <div className="w-60" />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          isCollapsed ? "ml-16" : "ml-60"
        )}
      >
        {children}
      </main>
    </div>
  );
}
