"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/global";
import { 
  Search, 
  MousePointer2, 
  Type, 
  Shapes, 
  Grid3X3, 
  BarChart3, 
  Image as ImageIcon, 
  CheckSquare, 
  Code,
  Minus,
  Triangle,
  Circle,
  Square,
  Hash,
  List,
  ListOrdered,
  Table,
  TableProperties,
  PieChart,
  LineChart,
  BarChart,
  Pencil,
  ChevronDown,
  Calendar,
  Layers,
  Columns,
  GripHorizontal,
  Upload,
  Laptop
} from "lucide-react";
import { useState, useMemo } from "react";

interface ElementExplorerProps {
  onToolSelect: (tool: Tool) => void;
  activeTool: Tool;
  className?: string;
  isCompact?: boolean;
}

export const ElementExplorer = ({ 
  onToolSelect, 
  activeTool, 
  className,
  isCompact = false 
}: ElementExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const toolGroups = useMemo(() => [
    {
      name: "Basic",
      items: [
        { name: "Selection", value: "select" as Tool, icon: MousePointer2, description: "Select and move elements" },
        { name: "Text", value: "text" as Tool, icon: Type, description: "Add editable text" },
        { name: "Heading 1", value: "text_h1" as Tool, icon: Type, description: "Large bold title" },
        { name: "Divider", value: "divider" as Tool, icon: Minus, description: "Horizontal separator line" },
      ]
    },
    {
      name: "Shapes",
      items: [
        { name: "Rectangle", value: "shape_rectangle" as Tool, icon: Square, description: "Geometric box" },
        { name: "Circle", value: "shape_circle" as Tool, icon: Circle, description: "Perfect oval" },
        { name: "Triangle", value: "shape_triangle" as Tool, icon: Triangle, description: "Three-sided shape" },
        { name: "Line", value: "shape_line" as Tool, icon: Minus, description: "Simple separator" },
      ]
    },
    {
      name: "Data & Tables",
      items: [
        { name: "Simple Table", value: "table_simple" as Tool, icon: Table, description: "Clean data grid" },
        { name: "Grid", value: "table_empty" as Tool, icon: Grid3X3, description: "Empty layout grid" },
        { name: "Bar Chart", value: "chart_bar" as Tool, icon: BarChart, description: "Comparison chart" },
        { name: "Pie Chart", value: "chart_pie" as Tool, icon: PieChart, description: "Distribution view" },
      ]
    },
    {
      name: "Media & Interactive",
      items: [
        { name: "Image", value: "image" as Tool, icon: ImageIcon, description: "Upload or paste image" },
        { name: "Signature", value: "signature" as Tool, icon: Pencil, description: "Digital signature area" },
        { name: "QR Code", value: "qrcode" as Tool, icon: Hash, description: "Generate QR code" },
      ]
    },
    {
      name: "Forms",
      items: [
        { name: "Text Input", value: "form_text" as Tool, icon: Type, description: "Single line input" },
        { name: "Checkbox", value: "form_checkbox" as Tool, icon: CheckSquare, description: "Multiple choice box" },
        { name: "Date Picker", value: "form_date" as Tool, icon: Calendar, description: "Date selection field" },
      ]
    }
  ], []);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return toolGroups;
    
    return toolGroups.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.items.length > 0);
  }, [searchQuery, toolGroups]);

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-950", className)}>
      {!isCompact && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search elements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-900 border-none ring-0 focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            {!isCompact && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.name}
              </h3>
            )}
            <div className="grid grid-cols-1 gap-1">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onToolSelect(item.value)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 group text-left",
                    activeTool === item.value 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-md transition-colors",
                    activeTool === item.value 
                      ? "bg-primary/20" 
                      : "bg-muted group-hover:bg-accent-foreground/5"
                  )}>
                    <item.icon size={16} />
                  </div>
                  {!isCompact && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[10px] opacity-60 truncate">{item.description}</p>
                    </div>
                  )}

                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
