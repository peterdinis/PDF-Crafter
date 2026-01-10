"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/global";
import type { PDFElement } from "@/types/global";
import {
  BarChart,
  BarChart3,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Circle,
  Code,
  Columns,
  Eye,
  EyeOff,
  Grid3X3,
  GripHorizontal,
  Hash,
  Image,
  Laptop,
  Layers,
  LineChart,
  List,
  ListOrdered,
  Minus,
  MousePointer2,
  Pencil,
  PieChart,
  Plus,
  PointerIcon,
  QrCode,
  Quote,
  Settings,
  Shapes,
  Square,
  Table,
  TableProperties,
  Trash2,
  Type,
  Underline,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ToolbarProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
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
  const [activeCategory, setActiveCategory] = useState<string>("basic");

  const categories = [
    { id: "basic", name: "Basic", icon: PointerIcon },
    { id: "shapes", name: "Shapes", icon: Shapes },
    { id: "tables", name: "Tables", icon: Grid3X3 },
    { id: "charts", name: "Charts", icon: BarChart3 },
    { id: "media", name: "Media", icon: Image },
    { id: "forms", name: "Forms", icon: CheckSquare },
    { id: "code", name: "Code", icon: Code },
    { id: "layers", name: "Layers", icon: Layers },
  ];

  const toolGroups = {
    basic: [
      {
        name: "Selection",
        value: "select" as Tool,
        icon: PointerIcon,
        description: "Select and move elements",
      },
      {
        name: "Text Block",
        value: "text" as Tool,
        icon: Type,
        description: "Add editable text",
      },
      {
        name: "Heading 1",
        value: "text_h1" as Tool,
        icon: Type,
        description: "Large bold title",
      },
      {
        name: "Heading 2",
        value: "text_h2" as Tool,
        icon: Type,
        description: "Medium bold title",
      },
      {
        name: "Heading 3",
        value: "text_h3" as Tool,
        icon: Type,
        description: "Small bold title",
      },
      {
        name: "Paragraph",
        value: "text_paragraph" as Tool,
        icon: Type,
        description: "Regular text paragraph",
      },
      {
        name: "Bold Text",
        value: "text_bold" as Tool,
        icon: Type,
        description: "Emphasized bold text",
      },
      {
        name: "Italic Text",
        value: "text_italic" as Tool,
        icon: Type,
        description: "Slanted italic text",
      },
      {
        name: "Underline Text",
        value: "text_underline" as Tool,
        icon: Underline,
        description: "Underlined text",
      },
      {
        name: "Quote",
        value: "text_quote" as Tool,
        icon: Quote,
        description: "Block quotation",
      },
      {
        name: "Bullet List",
        value: "text_list" as Tool,
        icon: List,
        description: "Unordered bullet points",
      },
      {
        name: "Numbered List",
        value: "text_numbered" as Tool,
        icon: ListOrdered,
        description: "Ordered numbered list",
      },
      {
        name: "Divider",
        value: "divider" as Tool,
        icon: Minus,
        description: "Horizontal separator line",
      },
    ],
    shapes: [
      {
        name: "Rectangle",
        value: "shape_rectangle" as Tool,
        icon: Square,
        description: "Geometric box",
      },
      {
        name: "Circle",
        value: "shape_circle" as Tool,
        icon: Circle,
        description: "Perfect oval",
      },
      {
        name: "Line",
        value: "shape_line" as Tool,
        icon: Minus,
        description: "Simple separator",
      },
      {
        name: "Triangle",
        value: "shape_triangle" as Tool,
        icon: Hash,
        description: "Three-sided shape",
      },
      {
        name: "Diamond",
        value: "shape_diamond" as Tool,
        icon: Hash,
        description: "Rhombus shape",
      },
      {
        name: "Star",
        value: "shape_star" as Tool,
        icon: Hash,
        description: "Five-pointed star",
      },
      {
        name: "Arrow",
        value: "shape_arrow" as Tool,
        icon: Minus,
        description: "Directional arrow",
      },
    ],
    tables: [
      {
        name: "Simple Table",
        value: "table_simple" as Tool,
        icon: Table,
        description: "Clean data grid",
      },
      {
        name: "Striped Table",
        value: "table_striped" as Tool,
        icon: TableProperties,
        description: "Zebra striped rows",
      },
      {
        name: "Bordered Table",
        value: "table_bordered" as Tool,
        icon: GripHorizontal,
        description: "Fully outlined grid",
      },
      {
        name: "Empty Table",
        value: "table_empty" as Tool,
        icon: Grid3X3,
        description: "2x2 skeleton table",
      },
      {
        name: "Wide Table",
        value: "table_wide" as Tool,
        icon: Columns,
        description: "5x3 wide table",
      },
      {
        name: "Calendar",
        value: "table_calendar" as Tool,
        icon: Calendar,
        description: "Monthly calendar grid",
      },
    ],
    charts: [
      {
        name: "Bar Chart",
        value: "chart_bar" as Tool,
        icon: BarChart,
        description: "Comparison chart",
      },
      {
        name: "Line Graph",
        value: "chart_line" as Tool,
        icon: LineChart,
        description: "Trend analysis",
      },
      {
        name: "Pie Chart",
        value: "chart_pie" as Tool,
        icon: PieChart,
        description: "Distribution view",
      },
      {
        name: "Area Chart",
        value: "chart_area" as Tool,
        icon: LineChart,
        description: "Filled trend chart",
      },
      {
        name: "Scatter Plot",
        value: "chart_scatter" as Tool,
        icon: BarChart,
        description: "Correlation points",
      },
    ],
    media: [
      {
        name: "Image",
        value: "image" as Tool,
        icon: Image,
        description: "Upload or paste image",
      },
      {
        name: "Free Draw",
        value: "pencil" as Tool,
        icon: Pencil,
        description: "Sketch with pencil",
      },
      {
        name: "Signature",
        value: "signature" as Tool,
        icon: Pencil,
        description: "Digital signature area",
      },
      {
        name: "QR Code",
        value: "qrcode" as Tool,
        icon: QrCode,
        description: "Generate QR code",
      },
      {
        name: "Barcode",
        value: "barcode" as Tool,
        icon: Hash,
        description: "Product barcode",
      },
    ],
    forms: [
      {
        name: "Text Field",
        value: "form_text" as Tool,
        icon: Type,
        description: "Single line input",
      },
      {
        name: "Text Area",
        value: "form_textarea" as Tool,
        icon: Type,
        description: "Multi-line input",
      },
      {
        name: "Checkbox",
        value: "form_checkbox" as Tool,
        icon: CheckSquare,
        description: "Multiple choice box",
      },
      {
        name: "Radio Button",
        value: "form_radio" as Tool,
        icon: Circle,
        description: "Single choice option",
      },
      {
        name: "Dropdown",
        value: "form_dropdown" as Tool,
        icon: ChevronDown,
        description: "Select menu",
      },
      {
        name: "Button",
        value: "form_button" as Tool,
        icon: Square,
        description: "Clickable button",
      },
      {
        name: "Date Picker",
        value: "form_date" as Tool,
        icon: Calendar,
        description: "Date selection field",
      },
    ],
    code: [
      {
        name: "Code Block",
        value: "code_block" as Tool,
        icon: Code,
        description: "Syntax highlighted code",
      },
      {
        name: "JSON Viewer",
        value: "code_json" as Tool,
        icon: Code,
        description: "Formatted JSON display",
      },
      {
        name: "HTML Embed",
        value: "code_html" as Tool,
        icon: Laptop,
        description: "Embed HTML content",
      },
      {
        name: "Math Formula",
        value: "code_math" as Tool,
        icon: Hash,
        description: "Mathematical equations",
      },
    ],
  };

  const renderShapePreview = (type: string) => {
    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
        <svg width="60" height="30" viewBox="0 0 100 50">
          {type === "shape_rectangle" && (
            <rect x="10" y="10" width="80" height="30" fill="#3b82f6" rx="3" />
          )}
          {type === "shape_circle" && (
            <circle cx="50" cy="25" r="15" fill="#10b981" />
          )}
          {type === "shape_triangle" && (
            <polygon points="50,10 80,40 20,40" fill="#f59e0b" />
          )}
          {type === "shape_diamond" && (
            <polygon points="50,10 80,25 50,40 20,25" fill="#8b5cf6" />
          )}
          {type === "shape_star" && (
            <path
              d="M50,10 L55,30 L75,30 L60,40 L65,60 L50,45 L35,60 L40,40 L25,30 L45,30 Z"
              fill="#ec4899"
            />
          )}
          {type === "shape_arrow" && (
            <>
              <line x1="20" y1="25" x2="70" y2="25" stroke="#3b82f6" strokeWidth="3" />
              <polygon points="70,20 80,25 70,30" fill="#3b82f6" />
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderChartPreview = (type: string) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 40">
          {type === "chart_bar" && (
            <>
              {colors.slice(0, 5).map((color, i) => (
                <rect
                  key={i}
                  x={10 + i * 18}
                  y={25 - i * 4}
                  width="12"
                  height={10 + i * 4}
                  fill={color}
                  rx="2"
                />
              ))}
            </>
          )}
          {type === "chart_line" && (
            <path
              d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5"
              fill="none"
              stroke={colors[0]}
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {type === "chart_pie" && (
            <>
              <path d="M50,20 L50,5 A15,15 0 0,1 65,20 Z" fill={colors[0]} />
              <path d="M50,20 L65,20 A15,15 0 0,1 55,35 Z" fill={colors[1]} />
              <path d="M50,20 L55,35 A15,15 0 1,1 50,5 Z" fill={colors[2]} />
            </>
          )}
          {type === "chart_area" && (
            <path
              d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5 L85,40 L10,40 Z"
              fill={colors[0]}
              fillOpacity="0.3"
              stroke={colors[0]}
              strokeWidth="2"
            />
          )}
          {type === "chart_scatter" && (
            <>
              {[10, 25, 40, 55, 70, 85].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={10 + Math.random() * 25}
                  r="3"
                  fill={colors[i % colors.length]}
                />
              ))}
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderFormPreview = (type: string) => {
    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
        <div className="w-full px-2">
          {type === "form_text" && (
            <div className="border border-gray-300 rounded px-2 py-1 bg-white text-xs">
              Text field
            </div>
          )}
          {type === "form_textarea" && (
            <div className="border border-gray-300 rounded px-2 py-1 bg-white h-8 text-xs">
              Multi-line text
            </div>
          )}
          {type === "form_checkbox" && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-gray-400 rounded"></div>
              <span className="text-xs">Checkbox</span>
            </div>
          )}
          {type === "form_radio" && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
              <span className="text-xs">Radio</span>
            </div>
          )}
          {type === "form_button" && (
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
              Button
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-br from-editor-primary/5 to-transparent">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-editor-primary rounded-lg flex items-center justify-center text-dark dark:text-sky-100 shadow-lg">
            P
          </div>
          PDF Crafter
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Professional PDF Architecture
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 px-2 overflow-x-auto no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
              activeCategory === cat.id
                ? "border-editor-primary text-editor-primary bg-editor-primary/5"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
            )}
          >
            <cat.icon size={14} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div>
          <h3 className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-3 tracking-widest px-2">
            {activeCategory.toUpperCase()}{" "}
            {activeCategory === "layers" ? "NAVIGATOR" : "ELEMENTS"}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {activeCategory === "layers" ? (
              <div className="space-y-1">
                {pageElements.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                    <Layers size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">
                      No elements on this page
                    </p>
                  </div>
                ) : (
                  [...pageElements].reverse().map((el, idx) => (
                    <div
                      key={el.id}
                      onClick={() => onSelectElement(el.id)}
                      className={cn(
                        "group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer",
                        selectedElement === el.id
                          ? "bg-editor-primary/10 border-editor-primary/30"
                          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold",
                          selectedElement === el.id
                            ? "bg-editor-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400",
                        )}
                      >
                        {pageElements.length - idx}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-gray-700 dark:text-gray-300">
                          {el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {el.id.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveElement(el.id, "up");
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600"
                          title="Bring Forward"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveElement(el.id, "down");
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600"
                          title="Send Backward"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteElement(el.id);
                          }}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              (toolGroups[activeCategory as keyof typeof toolGroups] || []).map(
                (tool) => (
                  <div
                    key={tool.value}
                    draggable="true"
                    onDragStart={(e) => {
                      const data = {
                        type: tool.value.split("_")[0],
                        tool: tool.value,
                        content: tool.name,
                        shapeType: tool.value.startsWith("shape_")
                          ? tool.value.split("_")[1]
                          : undefined,
                        tableStyle: tool.value.startsWith("table_")
                          ? tool.value.split("_")[1]
                          : undefined,
                        chartType: tool.value.startsWith("chart_")
                          ? tool.value.split("_")[1]
                          : undefined,
                        formType: tool.value.startsWith("form_")
                          ? tool.value.split("_")[1]
                          : undefined,
                        codeType: tool.value.startsWith("code_")
                          ? tool.value.split("_")[1]
                          : undefined,
                      };
                      e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify(data),
                      );

                      // Visual feedback for dragging
                      const dragPreview = document.createElement("div");
                      dragPreview.className =
                        "p-3 bg-editor-primary text-white rounded shadow-xl text-xs font-bold";
                      dragPreview.innerText = `Adding ${tool.name}`;
                      dragPreview.style.position = "absolute";
                      dragPreview.style.top = "-1000px";
                      document.body.appendChild(dragPreview);
                      e.dataTransfer.setDragImage(dragPreview, 0, 0);
                      setTimeout(() => dragPreview.remove(), 0);
                    }}
                    className={cn(
                      "group relative flex items-start gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-editor-primary/20",
                      activeTool === tool.value
                        ? "bg-editor-primary/10 border-editor-primary/30 ring-1 ring-editor-primary/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800",
                    )}
                    onClick={() => onToolSelect(tool.value)}
                    onDoubleClick={() => {
                      onToolSelect(tool.value);
                      toast.info(
                        `Double-click shortcut: Click on canvas to place ${tool.name}`,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        activeTool === tool.value
                          ? "bg-editor-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-editor-primary/10 group-hover:text-editor-primary",
                      )}
                    >
                      <tool.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold mb-0.5 truncate",
                          activeTool === tool.value
                            ? "text-editor-primary"
                            : "text-gray-700 dark:text-gray-300",
                        )}
                      >
                        {tool.name}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">
                        {tool.description}
                      </p>
                      
                      {/* Special previews for different categories */}
                      {activeCategory === "shapes" &&
                        renderShapePreview(tool.value)}
                      {activeCategory === "charts" &&
                        renderChartPreview(tool.value)}
                      {activeCategory === "forms" &&
                        renderFormPreview(tool.value)}
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={14} className="text-editor-primary" />
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400 hover:text-editor-primary hover:bg-editor-primary/5 rounded-xl h-11"
          onClick={onSettingsToggle}
        >
          <Settings size={18} />
          Document Settings
        </Button>
      </div>
    </div>
  );
};