"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { CommandPalette } from "./command-palette";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group float"
        aria-label="Open AI Assistant"
      >
        {/* Glow effect with AI gradient */}
        <div className="absolute inset-0 rounded-full glow-ai-hover opacity-75 group-hover:opacity-100 blur-lg transition-opacity" />

        {/* Button with AI gradient */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-ai text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Tooltip with glassmorphism */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 glass-dark text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Assistant
          <kbd className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">⌘K</kbd>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/80" />
        </div>

        {/* Pulse ring animation with AI colors */}
        <div className="absolute inset-0 rounded-full border-2 border-[#a855f7] animate-ping opacity-75" />
      </button>

      {/* Command Palette */}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
