"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool, PDFElement } from "@/types/global";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Settings,
  Trash2,
  Box,
  LayoutGrid,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { ElementExplorer } from "./ElementExplorer";

interface ToolbarProps {
  activeTool: Tool;
  onToolSelect: (tool: any) => void;
  onSettingsToggle: () => void;
  pageElements: PDFElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onDeleteElement: (id: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolSelect,
  onSettingsToggle,
  pageElements,
  selectedElement,
  onSelectElement,
  onMoveElement,
  onDeleteElement,
}) => {
  const [viewMode, setViewMode] = useState<"elements" | "layers">("elements");

  return (
    <div id="tour-toolbar" className="w-72 bg-white dark:bg-zinc-950 border-r border-border flex flex-col h-full shadow-sm z-20">
      <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            P
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight">
            PDF Crafter
          </span>
        </h2>
      </div>

      <div className="flex p-1 bg-muted/50 m-2 rounded-xl border border-border/50">
        <button
          onClick={() => setViewMode("elements")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
            viewMode === "elements"
              ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Box size={14} /> Elements
        </button>
        <button
          onClick={() => setViewMode("layers")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
            viewMode === "layers"
              ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid size={14} /> Layers
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "elements" ? (
          <ElementExplorer 
            activeTool={activeTool} 
            onToolSelect={onToolSelect} 
            className="h-full"
          />
        ) : (
          <div className="h-full flex flex-col p-2 space-y-2 overflow-y-auto custom-scrollbar">
            {pageElements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Layers size={40} className="mb-2 text-primary" />
                <p className="text-xs font-medium">No layers yet</p>
                <p className="text-[10px]">Add elements to see them here</p>
              </div>
            ) : (
              [...pageElements].reverse().map((el, idx) => (
                <div
                  key={el.id}
                  onClick={() => onSelectElement(el.id)}
                  className={cn(
                    "group flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer animate-in",
                    selectedElement === el.id
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "bg-transparent border-transparent hover:border-border hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm",
                    selectedElement === el.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {pageElements.length - idx}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-foreground">
                      {el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter">
                      {el.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "up"); }}
                      className="p-1 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "down"); }}
                      className="p-1 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }}
                      className="p-1 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/20">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center border-border hover:bg-background rounded-xl transition-all shadow-sm"
          onClick={onSettingsToggle}
        >
          <Settings size={16} className="text-muted-foreground" />
          <span className="text-xs font-semibold">Document Settings</span>
        </Button>
      </div>
    </div>
  );
};
