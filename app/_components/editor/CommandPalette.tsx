"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ElementExplorer } from "./ElementExplorer";
import type { Tool } from "@/types/global";
import { useEffect, useState } from "react";
import { Command } from "lucide-react";

interface CommandPaletteProps {
  onToolSelect: (tool: Tool) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ onToolSelect, open, onOpenChange }: CommandPaletteProps) => {
  const handleSelect = (tool: Tool) => {
    onToolSelect(tool);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl glass">
        <DialogHeader className="p-4 border-b border-border/50 flex flex-row items-center gap-3">
          <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
            <Command size={18} />
          </div>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Quick Add Element
          </DialogTitle>
        </DialogHeader>

        
        <div className="max-h-[60vh] overflow-hidden">
          <ElementExplorer 
            onToolSelect={handleSelect} 
            activeTool="select" 
            className="bg-transparent"
          />
        </div>
        
        <div className="p-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400">
          <div className="flex gap-2">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">↑↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">Enter</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">Esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
