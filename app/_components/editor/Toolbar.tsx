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
  ChevronLeft,
  ChevronRight,
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
  Settings,
  Shapes,
  Square,
  Table,
  TableProperties,
  Trash2,
  Type,
  Underline,
  Upload,
  Check,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ToolbarProps {
  activeTool: Tool;
  onToolSelect: (tool: any) => void;
  onSettingsToggle: () => void;
  pageElements: PDFElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onDeleteElement: (id: string) => void;
  onCustomGraphUpload?: (data: any) => void;
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
  onCustomGraphUpload,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("basic");
  const [activeFormConfig, setActiveFormConfig] = useState<{
    type: string;
    label: string;
    placeholder: string;
    options?: string[];
    required: boolean;
  }>({
    type: "text",
    label: "Text Field",
    placeholder: "Enter text...",
    required: false,
  });
  const [showCustomGraphModal, setShowCustomGraphModal] = useState(false);
  const [showFormConfigModal, setShowFormConfigModal] = useState(false);
  const [customGraphData, setCustomGraphData] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "basic", name: "Basic", icon: MousePointer2 },
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
        icon: MousePointer2,
        description: "Select and move elements",
        preview: null
      },
      {
        name: "Text Block",
        value: "text" as Tool,
        icon: Type,
        description: "Add editable text",
        preview: "normal"
      },
      {
        name: "Heading 1",
        value: "text_h1" as Tool,
        icon: Type,
        description: "Large bold title",
        preview: "h1"
      },
      {
        name: "Heading 2",
        value: "text_h2" as Tool,
        icon: Type,
        description: "Medium bold title",
        preview: "h2"
      },
      {
        name: "Heading 3",
        value: "text_h3" as Tool,
        icon: Type,
        description: "Small bold title",
        preview: "h3"
      },
      {
        name: "Paragraph",
        value: "text_paragraph" as Tool,
        icon: Type,
        description: "Regular text paragraph",
        preview: "paragraph"
      },
      {
        name: "Bold Text",
        value: "text_bold" as Tool,
        icon: Type,
        description: "Emphasized bold text",
        preview: "bold"
      },
      {
        name: "Italic Text",
        value: "text_italic" as Tool,
        icon: Type,
        description: "Slanted italic text",
        preview: "italic"
      },
      {
        name: "Quote",
        value: "text_quote" as Tool,
        icon: Type,
        description: "Block quotation",
        preview: "quote"
      },
      {
        name: "Bullet List",
        value: "text_list" as Tool,
        icon: List,
        description: "Unordered bullet points",
        preview: "list"
      },
      {
        name: "Numbered List",
        value: "text_numbered" as Tool,
        icon: ListOrdered,
        description: "Ordered numbered list",
        preview: "numbered"
      },
      {
        name: "Divider",
        value: "divider" as Tool,
        icon: Minus,
        description: "Horizontal separator line",
        preview: null
      },
    ],
    shapes: [
      {
        name: "Rectangle",
        value: "shape_rectangle" as Tool,
        icon: Square,
        description: "Geometric box",
        preview: "rectangle"
      },
      {
        name: "Circle",
        value: "shape_circle" as Tool,
        icon: Circle,
        description: "Perfect oval",
        preview: "circle"
      },
      {
        name: "Line",
        value: "shape_line" as Tool,
        icon: Minus,
        description: "Simple separator",
        preview: "line"
      },
      {
        name: "Triangle",
        value: "shape_triangle" as Tool,
        icon: Hash,
        description: "Three-sided shape",
        preview: "triangle"
      },
      {
        name: "Diamond",
        value: "shape_diamond" as Tool,
        icon: Hash,
        description: "Rhombus shape",
        preview: "diamond"
      },
      {
        name: "Star",
        value: "shape_star" as Tool,
        icon: Hash,
        description: "Five-pointed star",
        preview: "star"
      },
      {
        name: "Arrow",
        value: "shape_arrow" as Tool,
        icon: Minus,
        description: "Directional arrow",
        preview: "arrow"
      },
      {
        name: "Heart",
        value: "shape_heart" as Tool,
        icon: Hash,
        description: "Heart shape",
        preview: "heart"
      },
      {
        name: "Hexagon",
        value: "shape_hexagon" as Tool,
        icon: Hash,
        description: "Six-sided shape",
        preview: "hexagon"
      },
      {
        name: "Cloud",
        value: "shape_cloud" as Tool,
        icon: Hash,
        description: "Cloud shape",
        preview: "cloud"
      },
      {
        name: "Speech Bubble",
        value: "shape_speech_bubble" as Tool,
        icon: Hash,
        description: "Speech bubble shape",
        preview: "speech_bubble"
      },
    ],
    tables: [
      {
        name: "Simple Table",
        value: "table_simple" as Tool,
        icon: Table,
        description: "Clean data grid",
        preview: "simple"
      },
      {
        name: "Striped Table",
        value: "table_striped" as Tool,
        icon: TableProperties,
        description: "Zebra striped rows",
        preview: "striped"
      },
      {
        name: "Bordered Table",
        value: "table_bordered" as Tool,
        icon: GripHorizontal,
        description: "Fully outlined grid",
        preview: "bordered"
      },
      {
        name: "Empty Table",
        value: "table_empty" as Tool,
        icon: Grid3X3,
        description: "2x2 skeleton table",
        preview: "empty"
      },
      {
        name: "Wide Table",
        value: "table_wide" as Tool,
        icon: Columns,
        description: "5x3 wide table",
        preview: "wide"
      },
      {
        name: "Calendar",
        value: "table_calendar" as Tool,
        icon: Calendar,
        description: "Monthly calendar grid",
        preview: "calendar"
      },
      {
        name: "Invoice Table",
        value: "table_invoice" as Tool,
        icon: Table,
        description: "Invoice style table",
        preview: "invoice"
      },
    ],
    charts: [
      {
        name: "Bar Chart",
        value: "chart_bar" as Tool,
        icon: BarChart,
        description: "Comparison chart",
        preview: "bar"
      },
      {
        name: "Line Graph",
        value: "chart_line" as Tool,
        icon: LineChart,
        description: "Trend analysis",
        preview: "line"
      },
      {
        name: "Pie Chart",
        value: "chart_pie" as Tool,
        icon: PieChart,
        description: "Distribution view",
        preview: "pie"
      },
      {
        name: "Doughnut Chart",
        value: "chart_doughnut" as Tool,
        icon: PieChart,
        description: "Ring chart",
        preview: "doughnut"
      },
      {
        name: "Area Chart",
        value: "chart_area" as Tool,
        icon: LineChart,
        description: "Filled trend chart",
        preview: "area"
      },
      {
        name: "Scatter Plot",
        value: "chart_scatter" as Tool,
        icon: BarChart,
        description: "Correlation points",
        preview: "scatter"
      },
      {
        name: "Radar Chart",
        value: "chart_radar" as Tool,
        icon: BarChart,
        description: "Multi-variable chart",
        preview: "radar"
      },
      {
        name: "Gauge Chart",
        value: "chart_gauge" as Tool,
        icon: Circle,
        description: "Progress indicator",
        preview: "gauge"
      },
      {
        name: "Custom Graph",
        value: "chart_custom" as Tool,
        icon: Upload,
        description: "Upload your own graph",
        custom: true,
        preview: "custom"
      },
    ],
    media: [
      {
        name: "Image",
        value: "image" as Tool,
        icon: Image,
        description: "Upload or paste image",
        preview: "image"
      },
      {
        name: "Free Draw",
        value: "pencil" as Tool,
        icon: Pencil,
        description: "Sketch with pencil",
        preview: "pencil"
      },
      {
        name: "Signature",
        value: "signature" as Tool,
        icon: Pencil,
        description: "Digital signature area",
        preview: "signature"
      },
      {
        name: "QR Code",
        value: "qrcode" as Tool,
        icon: Hash,
        description: "Generate QR code",
        preview: "qrcode"
      },
      {
        name: "Barcode",
        value: "barcode" as Tool,
        icon: Hash,
        description: "Product barcode",
        preview: "barcode"
      },
    ],
    forms: [
      {
        name: "Text Field",
        value: "form_text" as Tool,
        icon: Type,
        description: "Single line input",
        preview: "text"
      },
      {
        name: "Text Area",
        value: "form_textarea" as Tool,
        icon: Type,
        description: "Multi-line input",
        preview: "textarea"
      },
      {
        name: "Checkbox",
        value: "form_checkbox" as Tool,
        icon: CheckSquare,
        description: "Multiple choice box",
        preview: "checkbox"
      },
      {
        name: "Switch",
        value: "form_switch" as Tool,
        icon: CheckSquare,
        description: "Toggle switch",
        preview: "switch"
      },
      {
        name: "Radio Button",
        value: "form_radio" as Tool,
        icon: Circle,
        description: "Single choice option",
        preview: "radio"
      },
      {
        name: "Dropdown",
        value: "form_dropdown" as Tool,
        icon: ChevronDown,
        description: "Select menu",
        preview: "dropdown"
      },
      {
        name: "Button",
        value: "form_button" as Tool,
        icon: Square,
        description: "Clickable button",
        preview: "button"
      },
      {
        name: "Date Picker",
        value: "form_date" as Tool,
        icon: Calendar,
        description: "Date selection field",
        preview: "date"
      },
      {
        name: "Range Slider",
        value: "form_range" as Tool,
        icon: Minus,
        description: "Value range selector",
        preview: "range"
      },
    ],
    code: [
      {
        name: "Code Block",
        value: "code_block" as Tool,
        icon: Code,
        description: "Syntax highlighted code",
        preview: "block"
      },
      {
        name: "JSON Viewer",
        value: "code_json" as Tool,
        icon: Code,
        description: "Formatted JSON display",
        preview: "json"
      },
      {
        name: "HTML Embed",
        value: "code_html" as Tool,
        icon: Laptop,
        description: "Embed HTML content",
        preview: "html"
      },
      {
        name: "CSS",
        value: "code_css" as Tool,
        icon: Code,
        description: "Style sheet code",
        preview: "css"
      },
      {
        name: "Math Formula",
        value: "code_math" as Tool,
        icon: Hash,
        description: "Mathematical equations",
        preview: "math"
      },
      {
        name: "SQL Query",
        value: "code_sql" as Tool,
        icon: Code,
        description: "Database query",
        preview: "sql"
      },
    ],
  };

  // Form presets
  const formPresets = {
    contact: {
      label: "Contact Form",
      fields: [
        { type: "text", label: "Full Name", required: true },
        { type: "text", label: "Email", required: true },
        { type: "textarea", label: "Message", required: false },
        { type: "button", label: "Submit" }
      ]
    },
    survey: {
      label: "Survey",
      fields: [
        { type: "text", label: "Question 1" },
        { type: "radio", label: "Options", options: ["Option A", "Option B", "Option C"] },
        { type: "checkbox", label: "Select all that apply", options: ["Choice 1", "Choice 2"] },
        { type: "range", label: "Rating" }
      ]
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleCustomGraphUpload = () => {
    try {
      if (!customGraphData.trim()) {
        toast.error("Please enter graph data");
        return;
      }

      const parsedData = JSON.parse(customGraphData);

      if (onCustomGraphUpload) {
        onCustomGraphUpload(parsedData);
        toast.success("Custom graph uploaded successfully");
        setShowCustomGraphModal(false);
        setCustomGraphData("");
      } else {
        onToolSelect("chart_custom");
        toast.success(
          "Custom graph tool selected. Click on canvas to place it.",
        );
      }
    } catch (error) {
      toast.error("Invalid JSON data. Please check your format.");
      console.error("Error parsing custom graph data:", error);
    }
  };

  // Helper functions for form configuration
  const getFormPlaceholder = (type: string): string => {
    const placeholders: Record<string, string> = {
      text: "Enter text...",
      textarea: "Enter multiline text...",
      date: "Select date...",
      dropdown: "Choose option...",
      range: "Slide to adjust...",
    };
    return placeholders[type] || "Enter value...";
  };

  const handleQuickFormConfig = (formType: string) => {
    const defaultConfig = {
      type: formType,
      label: `${formType.charAt(0).toUpperCase() + formType.slice(1).replace(/_/g, " ")}`,
      placeholder: getFormPlaceholder(formType),
      required: false,
      options: formType === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
    };

    setActiveFormConfig(defaultConfig);
    setShowFormConfigModal(true);
    onToolSelect(`form_${formType}`);
  };

  // Render functions
  const renderShapePreview = (previewType: string) => {
    const isSelected = activeTool.startsWith("shape_") && activeTool === `shape_${previewType}`;
    const strokeColor = isSelected ? "#3b82f6" : "#6b7280";
    const fillColor = isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(107, 114, 128, 0.05)";

    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
        <svg width="60" height="30" viewBox="0 0 100 50" className="overflow-visible">
          {/* Rectangle */}
          {previewType === "rectangle" && (
            <rect x="15" y="10" width="70" height="30" fill={fillColor} stroke={strokeColor} strokeWidth="2" rx="3" />
          )}

          {/* Circle */}
          {previewType === "circle" && (
            <circle cx="50" cy="25" r="15" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Line */}
          {previewType === "line" && (
            <line x1="20" y1="25" x2="80" y2="25" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Triangle */}
          {previewType === "triangle" && (
            <polygon points="50,10 80,40 20,40" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Diamond */}
          {previewType === "diamond" && (
            <polygon points="50,10 80,25 50,40 20,25" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Star */}
          {previewType === "star" && (
            <path d="M50,10 L55,30 L75,30 L60,40 L65,60 L50,45 L35,60 L40,40 L25,30 L45,30 Z"
              fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Arrow */}
          {previewType === "arrow" && (
            <>
              <line x1="20" y1="25" x2="70" y2="25" stroke={strokeColor} strokeWidth="3" />
              <polygon points="70,20 80,25 70,30" fill={strokeColor} />
            </>
          )}

          {/* Heart */}
          {previewType === "heart" && (
            <path d="M50,35 C55,30 65,25 65,20 C65,15 60,10 55,10 C50,10 45,15 45,20 C45,25 50,30 50,35 C50,30 55,25 55,20 C55,15 60,10 55,10 C50,10 45,15 45,20 C45,25 50,30 50,35"
              fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Hexagon */}
          {previewType === "hexagon" && (
            <polygon points="50,10 75,20 75,40 50,50 25,40 25,20" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Cloud */}
          {previewType === "cloud" && (
            <path d="M35,25 C30,20 22,20 18,25 C15,25 10,28 10,33 C10,38 15,41 20,41 H75 C80,41 85,38 85,33 C85,28 80,25 75,25 C72,20 65,18 60,20 C57,15 50,13 45,15 C40,18 37,22 35,25 Z"
              fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          )}

          {/* Speech Bubble */}
          {previewType === "speech_bubble" && (
            <>
              <rect x="15" y="10" width="70" height="25" fill={fillColor} stroke={strokeColor} strokeWidth="2" rx="5" />
              <polygon points="40,35 50,35 45,45" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderChartPreview = (previewType: string) => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#ef4444",
    ];

    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
          {previewType === "bar" && (
            <>
              {colors.slice(0, 6).map((color, i) => (
                <rect key={i} x={5 + i * 15} y={25 - i * 3} width="10" height={8 + i * 3} fill={color} rx="2" />
              ))}
            </>
          )}
          {previewType === "line" && (
            <path d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5" fill="none" stroke={colors[0]} strokeWidth="3" strokeLinecap="round" />
          )}
          {previewType === "pie" && (
            <>
              <path d="M50,20 L50,5 A15,15 0 0,1 65,20 Z" fill={colors[0]} />
              <path d="M50,20 L65,20 A15,15 0 0,1 55,35 Z" fill={colors[1]} />
              <path d="M50,20 L55,35 A15,15 0 1,1 50,5 Z" fill={colors[2]} />
            </>
          )}
          {previewType === "doughnut" && (
            <>
              <circle cx="50" cy="20" r="15" fill="white" stroke={colors[0]} strokeWidth="8" strokeDasharray="70 100" />
              <circle cx="50" cy="20" r="15" fill="none" stroke={colors[1]} strokeWidth="8" strokeDasharray="30 100" transform="rotate(90 50 20)" />
            </>
          )}
          {previewType === "area" && (
            <path d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5 L85,40 L10,40 Z" fill={colors[0]} fillOpacity="0.3" stroke={colors[0]} strokeWidth="2" />
          )}
          {previewType === "scatter" && (
            <>
              {[10, 20, 30, 40, 50, 60, 70, 80].map((x, i) => (
                <circle key={i} cx={x} cy={10 + Math.random() * 25} r="2.5" fill={colors[i % colors.length]} />
              ))}
            </>
          )}
          {previewType === "radar" && (
            <polygon points="50,5 70,15 80,35 60,45 40,45 20,35 30,15" fill={colors[0]} fillOpacity="0.3" stroke={colors[0]} strokeWidth="2" />
          )}
          {previewType === "gauge" && (
            <>
              <circle cx="50" cy="25" r="15" fill="none" stroke={colors[0]} strokeWidth="3" strokeDasharray="70 100" />
              <circle cx="50" cy="25" r="12" fill={colors[0]} />
            </>
          )}
          {previewType === "custom" && (
            <>
              <rect x="20" y="15" width="60" height="20" fill={colors[2]} fillOpacity="0.3" rx="3" />
              <text x="50" y="28" textAnchor="middle" fill={colors[2]} fontSize="8" fontWeight="bold">CUSTOM</text>
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderTablePreview = (previewType: string) => {
    const borderColor = "#e5e7eb";
    const headerBg = "#3b82f6";

    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
        <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
          {/* Simple table */}
          {previewType === "simple" && (
            <>
              <rect x="5" y="5" width="25" height="8" fill={headerBg} rx="2" />
              <rect x="35" y="5" width="25" height="8" fill={headerBg} rx="2" />
              <rect x="65" y="5" width="25" height="8" fill={headerBg} rx="2" />
              <rect x="5" y="15" width="85" height="2" fill="#f3f4f6" />
              <rect x="5" y="20" width="85" height="2" fill="#ffffff" />
              <rect x="5" y="25" width="85" height="2" fill="#f3f4f6" />
            </>
          )}

          {/* Striped table */}
          {previewType === "striped" && (
            <>
              <rect x="5" y="5" width="85" height="8" fill={headerBg} rx="2" />
              <rect x="5" y="15" width="85" height="6" fill="#ffffff" />
              <rect x="5" y="23" width="85" height="6" fill="#f3f4f6" />
              <rect x="5" y="31" width="85" height="6" fill="#ffffff" />
            </>
          )}

          {/* Bordered table */}
          {previewType === "bordered" && (
            <>
              <rect x="5" y="5" width="85" height="25" fill="white" stroke={borderColor} strokeWidth="0.5" />
              <line x1="30" y1="5" x2="30" y2="30" stroke={borderColor} strokeWidth="0.5" />
              <line x1="55" y1="5" x2="55" y2="30" stroke={borderColor} strokeWidth="0.5" />
              <line x1="5" y1="13" x2="90" y2="13" stroke={borderColor} strokeWidth="0.5" />
              <line x1="5" y1="21" x2="90" y2="21" stroke={borderColor} strokeWidth="0.5" />
            </>
          )}

          {/* Calendar */}
          {previewType === "calendar" && (
            <>
              {[...Array(7)].map((_, i) => (
                <rect key={i} x={5 + i * 12} y="5" width="10" height="8" fill={headerBg} rx="1" />
              ))}
              {[...Array(5)].map((_, row) => (
                [...Array(7)].map((_, col) => (
                  <rect key={`${row}-${col}`} x={5 + col * 12} y={15 + row * 5} width="10" height="4"
                    fill={row % 2 === 0 ? "#ffffff" : "#f3f4f6"} stroke={borderColor} strokeWidth="0.2" />
                ))
              ))}
            </>
          )}

          {/* Wide table */}
          {previewType === "wide" && (
            <>
              {[...Array(5)].map((_, i) => (
                <rect key={i} x={5 + i * 18} y="5" width="16" height="8" fill={headerBg} rx="2" />
              ))}
              {[...Array(3)].map((_, row) => (
                <rect key={row} x="5" y={15 + row * 8} width="85" height="6" fill={row % 2 === 0 ? "#ffffff" : "#f3f4f6"} />
              ))}
            </>
          )}

          {/* Empty table */}
          {previewType === "empty" && (
            <>
              <rect x="25" y="5" width="50" height="8" fill={headerBg} rx="2" />
              <rect x="25" y="20" width="50" height="8" fill={headerBg} rx="2" />
            </>
          )}

          {/* Invoice table */}
          {previewType === "invoice" && (
            <>
              <rect x="5" y="5" width="90" height="8" fill={headerBg} rx="2" />
              {[...Array(3)].map((_, i) => (
                <rect key={i} x="5" y={15 + i * 8} width="90" height="6" fill={i % 2 === 0 ? "#ffffff" : "#f3f4f6"} />
              ))}
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderInteractivePreview = (formType: string, config: any) => {
    switch (formType) {
      case "text":
        return (
          <div className="relative">
            <label className="absolute -top-2 left-2 px-1 text-[8px] font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {config?.label || "Text Field"}
              {config?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input type="text" className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={config?.placeholder || "Enter text..."} disabled />
          </div>
        );

      case "textarea":
        return (
          <div className="relative">
            <label className="absolute -top-2 left-2 px-1 text-[8px] font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {config?.label || "Text Area"}
              {config?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <textarea className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder={config?.placeholder || "Enter multiline text..."} rows={2} disabled />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input type="checkbox" className="w-3.5 h-3.5 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800 checked:bg-blue-500 checked:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
              {config?.required && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
            </div>
            <label className="text-xs text-gray-700 dark:text-gray-300">{config?.label || "Checkbox"}</label>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input type="radio" name="preview-radio" className="w-3.5 h-3.5 border border-gray-400 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 checked:bg-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                {config?.required && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
              </div>
              <label className="text-xs text-gray-700 dark:text-gray-300">{config?.label || "Radio Option 1"}</label>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div className="relative">
            <label className="absolute -top-2 left-2 px-1 text-[8px] font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {config?.label || "Dropdown"}
              {config?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none" disabled>
              <option value="">{config?.placeholder || "Choose option..."}</option>
              {config?.options?.map((opt: string, idx: number) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        );

      case "button":
        return (
          <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" disabled>
            {config?.label || "Submit"}
          </button>
        );

      case "range":
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[8px] font-medium text-gray-600 dark:text-gray-400">
                {config?.label || "Range Slider"}
                {config?.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <span className="text-[8px] text-gray-500">50%</span>
            </div>
            <input type="range" className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" defaultValue="50" disabled />
          </div>
        );

      case "date":
        return (
          <div className="relative">
            <label className="absolute -top-2 left-2 px-1 text-[8px] font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {config?.label || "Date"}
              {config?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800">
              <span className="text-xs text-gray-400">{config?.placeholder || "MM/DD/YYYY"}</span>
              <Calendar size={12} className="text-gray-400" />
            </div>
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-700 dark:text-gray-300">
              {config?.label || "Toggle Switch"}
              {config?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative inline-block w-8 h-4">
              <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-xs text-gray-400">
            {formType.replace(/_/g, " ")}
          </div>
        );
    }
  };

  const renderCodePreview = (previewType: string) => {
    const colors = { background: "#1e293b", text: "#cbd5e1", keyword: "#3b82f6", string: "#10b981", number: "#f59e0b" };

    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
          <rect x="5" y="5" width="90" height="30" fill={colors.background} rx="4" />

          {previewType === "json" && (
            <>
              <text x="15" y="20" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill={colors.keyword}>"name"</tspan>
                <tspan fill={colors.text}>: </tspan>
                <tspan fill={colors.string}>"Example"</tspan>
              </text>
              <text x="15" y="28" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill={colors.keyword}>"count"</tspan>
                <tspan fill={colors.text}>: </tspan>
                <tspan fill={colors.number}>42</tspan>
              </text>
            </>
          )}

          {previewType === "html" && (
            <>
              <text x="15" y="18" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill="#ef4444">&lt;</tspan>
                <tspan fill="#3b82f6">div</tspan>
                <tspan fill="#ef4444">&gt;</tspan>
              </text>
              <text x="15" y="26" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill="#ef4444">&lt;/</tspan>
                <tspan fill="#3b82f6">div</tspan>
                <tspan fill="#ef4444">&gt;</tspan>
              </text>
            </>
          )}

          {previewType === "math" && <text x="30" y="22" fill={colors.text} fontSize="8" fontFamily="serif">E = mc²</text>}

          {previewType === "sql" && (
            <text x="15" y="20" fill={colors.text} fontSize="6" fontFamily="monospace">
              <tspan fill={colors.keyword}>SELECT</tspan>
              <tspan fill={colors.text}> * </tspan>
              <tspan fill={colors.keyword}>FROM</tspan>
              <tspan fill={colors.text}> users</tspan>
            </text>
          )}

          {previewType === "block" && (
            <>
              <text x="15" y="20" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill={colors.keyword}>function</tspan>
                <tspan fill={colors.text}> hello() {"{"}</tspan>
              </text>
              <text x="15" y="28" fill={colors.text} fontSize="6" fontFamily="monospace">
                <tspan fill={colors.text}>  </tspan>
                <tspan fill={colors.keyword}>return</tspan>
                <tspan fill={colors.text}> "World"</tspan>
              </text>
            </>
          )}

          {previewType === "css" && (
            <text x="15" y="22" fill={colors.text} fontSize="6" fontFamily="monospace">
              <tspan fill={colors.keyword}>.container</tspan>
              <tspan fill={colors.text}> {"{"}</tspan>
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderMediaPreview = (previewType: string) => {
    return (
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
          {previewType === "image" && (
            <>
              <rect x="10" y="10" width="80" height="20" fill="#3b82f6" rx="4" />
              <rect x="25" y="15" width="50" height="10" fill="#1d4ed8" rx="2" />
              <circle cx="40" cy="20" r="3" fill="#ffffff" />
              <circle cx="60" cy="20" r="3" fill="#ffffff" />
            </>
          )}

          {previewType === "pencil" && (
            <>
              <path d="M20,25 Q30,15 40,20 Q50,25 60,15 Q70,5 80,10" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <path d="M80,10 L85,5 L90,10 L85,15 Z" fill="#3b82f6" />
            </>
          )}

          {previewType === "signature" && (
            <>
              <path d="M20,25 Q25,15 35,20 Q45,30 55,18 Q65,10 75,20 Q80,25 85,15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="35" x2="85" y2="35" stroke="#d1d5db" strokeWidth="1" strokeDasharray="2" />
            </>
          )}

          {previewType === "qrcode" && (
            <>
              <rect x="20" y="10" width="60" height="20" fill="white" stroke="#3b82f6" strokeWidth="1" />
              <rect x="25" y="15" width="10" height="10" fill="black" />
              <rect x="45" y="15" width="5" height="5" fill="black" />
              <rect x="65" y="15" width="10" height="10" fill="black" />
              <rect x="35" y="25" width="5" height="5" fill="black" />
              <rect x="55" y="25" width="5" height="5" fill="black" />
            </>
          )}

          {previewType === "barcode" && (
            <>
              <rect x="10" y="15" width="80" height="10" fill="white" stroke="#3b82f6" strokeWidth="0.5" />
              {[...Array(12)].map((_, i) => (
                <rect key={i} x={12 + i * 6} y="16" width={Math.random() > 0.5 ? 2 : 4} height="8" fill="black" />
              ))}
              <text x="50" y="32" textAnchor="middle" fill="#3b82f6" fontSize="4">123456789012</text>
            </>
          )}
        </svg>
      </div>
    );
  };

  const renderTextPreview = (previewType: string) => {
    const isSelected = activeTool === `text_${previewType}`;
    const bgColor = isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(107, 114, 128, 0.05)";
    const borderColor = isSelected ? "#3b82f6" : "#d1d5db";

    return (
      <div className="w-full h-12 rounded border flex items-center justify-center p-1 mt-2" style={{ backgroundColor: bgColor, borderColor }}>
        <div className="w-full px-2 text-left">
          {previewType === "list" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Item 1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Item 2</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Item 3</span>
              </div>
            </div>
          )}

          {previewType === "numbered" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 min-w-[12px]">1.</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">First item</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 min-w-[12px]">2.</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">Second item</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 min-w-[12px]">3.</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">Third item</span>
              </div>
            </div>
          )}

          {previewType === "h1" && (
            <div className="text-base font-bold text-gray-800 dark:text-gray-100">Heading 1</div>
          )}

          {previewType === "h2" && (
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Heading 2</div>
          )}

          {previewType === "h3" && (
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Heading 3</div>
          )}

          {previewType === "paragraph" && (
            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          )}

          {previewType === "bold" && (
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Bold Text</div>
          )}

          {previewType === "italic" && (
            <div className="text-xs italic text-gray-800 dark:text-gray-200">Italic Text</div>
          )}

          {previewType === "underline" && (
            <div className="text-xs underline text-gray-800 dark:text-gray-200">Underlined Text</div>
          )}

          {previewType === "quote" && (
            <div className="text-xs italic text-gray-600 dark:text-gray-400 border-l-2 border-gray-400 dark:border-gray-500 pl-1">This is an important quote...</div>
          )}

          {previewType === "normal" && (
            <div className="text-xs text-gray-700 dark:text-gray-300">Edit this text...</div>
          )}
        </div>
      </div>
    );
  };

  const renderFormPreview = (tool: any) => {
    const isSelected = activeTool === tool.value;
    const formType = tool.preview;
    const config = activeFormConfig.type === formType ? activeFormConfig : null;

    return (
      <div className="w-full">
        <div className={cn("w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border flex items-center justify-center p-1 mt-2 transition-all", isSelected ? "border-editor-primary ring-2 ring-editor-primary/20" : "border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600")}>
          <div className="w-full px-2">{renderInteractivePreview(formType, config)}</div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); handleQuickFormConfig(formType); }} className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1" title="Customize">
            <Settings size={10} /> Customize
          </button>

          {config && (
            <div className="flex items-center gap-1">
              {config.required && <span className="text-[8px] px-1 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">Required</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-br from-editor-primary/5 to-transparent">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-editor-primary rounded-lg flex items-center justify-center text-zinc-800 dark:text-sky-100 shadow-lg">P</div>
            PDF Crafter
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Professional PDF Architecture</p>
        </div>

        {/* Category Tabs with Scroll Arrows */}
        <div className="relative border-b border-gray-100 dark:border-gray-800">
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800" aria-label="Scroll left">
            <ChevronLeft size={16} className="text-gray-500 dark:text-gray-400" />
          </button>

          <div ref={scrollContainerRef} className="flex px-8 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap shrink-0", activeCategory === cat.id ? "border-editor-primary text-editor-primary bg-editor-primary/5" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800")}>
                  <Icon size={14} /> {cat.name}
                </button>
              );
            })}
          </div>

          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l border-gray-100 dark:border-gray-800" aria-label="Scroll right">
            <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div>
            <h3 className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-3 tracking-widest px-2">
              {activeCategory.toUpperCase()} {activeCategory === "layers" ? "NAVIGATOR" : "ELEMENTS"}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {activeCategory === "layers" ? (
                <div className="space-y-1">
                  {pageElements.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                      <Layers size={24} className="mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                      <p className="text-xs text-gray-400 dark:text-gray-500">No elements on this page</p>
                    </div>
                  ) : (
                    [...pageElements].reverse().map((el, idx) => {
                      const actualIndex = pageElements.length - idx - 1;
                      return (
                        <div key={el.id} onClick={() => onSelectElement(el.id)} className={cn("group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer", selectedElement === el.id ? "bg-editor-primary/10 border-editor-primary/30" : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700")}>
                          <div className={cn("w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold", selectedElement === el.id ? "bg-editor-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")}>{actualIndex + 1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-gray-700 dark:text-gray-300">{el.type.replace("_", " ").charAt(0).toUpperCase() + el.type.replace("_", " ").slice(1)}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">ID: {el.id.slice(0, 8)}</p>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "up"); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Bring Forward"><ChevronUp size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "down"); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Send Backward"><ChevronDown size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                (toolGroups[activeCategory as keyof typeof toolGroups] || []).map((tool: any) => {
                  const Icon = tool.icon;
                  return (
                    <div key={tool.value} draggable="true" onDragStart={(e) => {
                      const data = {
                        type: tool.value.split("_")[0],
                        tool: tool.value,
                        content: tool.name,
                        shapeType: tool.value.startsWith("shape_") ? tool.value.split("_")[1] : undefined,
                        tableStyle: tool.value.startsWith("table_") ? tool.value.split("_")[1] : undefined,
                        chartType: tool.value.startsWith("chart_") ? tool.value.split("_")[1] : undefined,
                        formType: tool.value.startsWith("form_") ? tool.value.split("_")[1] : undefined,
                        codeType: tool.value.startsWith("code_") ? tool.value.split("_")[1] : undefined,
                        style: tool.value.startsWith("text_") ? tool.value.split("_").slice(1).join("_") : undefined
                      };
                      e.dataTransfer.setData("application/json", JSON.stringify(data));
                      const dragPreview = document.createElement("div");
                      dragPreview.className = "p-3 bg-editor-primary text-white rounded shadow-xl text-xs font-bold";
                      dragPreview.innerText = `Adding ${tool.name}`;
                      dragPreview.style.position = "absolute";
                      dragPreview.style.top = "-1000px";
                      document.body.appendChild(dragPreview);
                      e.dataTransfer.setDragImage(dragPreview, 0, 0);
                      setTimeout(() => dragPreview.remove(), 0);
                    }} className={cn("group relative flex items-start gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border", activeTool === tool.value ? "bg-editor-primary/10 border-editor-primary/30 ring-1 ring-editor-primary/10" : "border-transparent hover:border-editor-primary/20 hover:bg-gray-50 dark:hover:bg-gray-800")} onClick={() => {
                      if (tool.value.startsWith("form_")) {
                        const formType = tool.value.replace("form_", "");
                        handleQuickFormConfig(formType);
                      } else if (tool.value === "chart_custom") {
                        setShowCustomGraphModal(true);
                      } else {
                        onToolSelect(tool.value);
                      }
                    }} onDoubleClick={() => {
                      if (tool.value === "chart_custom") {
                        setShowCustomGraphModal(true);
                      } else {
                        onToolSelect(tool.value);
                        toast.info(`Double-click shortcut: Click on canvas to place ${tool.name}`);
                      }
                    }}>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors", activeTool === tool.value ? "bg-editor-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-editor-primary/10 group-hover:text-editor-primary")}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold mb-0.5 truncate", activeTool === tool.value ? "text-editor-primary" : "text-gray-700 dark:text-gray-300")}>{tool.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">{tool.description}</p>

                        {/* Special previews for different categories */}
                        {activeCategory === "basic" && tool.preview && renderTextPreview(tool.preview)}
                        {activeCategory === "shapes" && tool.preview && renderShapePreview(tool.preview)}
                        {activeCategory === "tables" && tool.preview && renderTablePreview(tool.preview)}
                        {activeCategory === "charts" && tool.preview && renderChartPreview(tool.preview)}
                        {activeCategory === "forms" && tool.preview && renderFormPreview(tool)}
                        {activeCategory === "code" && tool.preview && renderCodePreview(tool.preview)}
                        {activeCategory === "media" && tool.preview && renderMediaPreview(tool.preview)}
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={14} className="text-editor-primary" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Form Presets Section */}
            {activeCategory === "forms" && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">QUICK PRESETS</h4>
                <div className="space-y-2">
                  {Object.entries(formPresets).map(([key, preset]) => (
                    <button key={key} onClick={() => { toast.success(`Form preset "${preset.label}" selected`); onToolSelect("form_text"); }} className="w-full text-left p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{preset.label}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{preset.fields.length} fields</p>
                        </div>
                        <Plus size={14} className="text-blue-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <Button variant="ghost" className="w-full flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400 hover:text-editor-primary hover:bg-editor-primary/5 rounded-xl h-11" onClick={onSettingsToggle}>
            <Settings size={18} /> Document Settings
          </Button>
        </div>
      </div>

      {/* Custom Graph Modal */}
      {showCustomGraphModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Custom Graph</h3>
              <button onClick={() => setShowCustomGraphModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Graph Data (JSON Format)</label>
                <textarea value={customGraphData} onChange={(e) => setCustomGraphData(e.target.value)} className="w-full h-48 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" placeholder={`Example:
{
  "type": "custom",
  "title": "My Custom Chart",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "datasets": [
      {
        "label": "Sales",
        "data": [100, 200, 150, 300],
        "backgroundColor": "#3b82f6"
      }
    ]
  }
}`} />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Supports: Bar, Line, Pie, Area, Scatter, Radar charts</span>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCustomGraphModal(false)}>Cancel</Button>
                <Button className="flex-1 bg-editor-primary hover:bg-editor-primary/90" onClick={handleCustomGraphUpload}><Upload size={16} className="mr-2" />Upload Graph</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Configuration Modal */}
      {showFormConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configure {activeFormConfig.type.replace(/_/g, " ")}</h3>
              <button onClick={() => setShowFormConfigModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
                <input type="text" value={activeFormConfig.label} onChange={(e) => setActiveFormConfig(prev => ({ ...prev, label: e.target.value }))} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Enter field label..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Placeholder / Hint Text</label>
                <input type="text" value={activeFormConfig.placeholder} onChange={(e) => setActiveFormConfig(prev => ({ ...prev, placeholder: e.target.value }))} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Enter placeholder text..." />
              </div>
              {activeFormConfig.type === "dropdown" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options (one per line)</label>
                  <textarea value={activeFormConfig.options?.join("\n") || ""} onChange={(e) => setActiveFormConfig(prev => ({ ...prev, options: e.target.value.split("\n").filter(opt => opt.trim()) }))} className="w-full h-24 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Option 1\nOption 2\nOption 3" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="required-field" checked={activeFormConfig.required} onChange={(e) => setActiveFormConfig(prev => ({ ...prev, required: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700" />
                <label htmlFor="required-field" className="text-sm text-gray-700 dark:text-gray-300">Required field (will show asterisk)</label>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Live Preview</h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{renderInteractivePreview(activeFormConfig.type, activeFormConfig)}</div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowFormConfigModal(false)}>Cancel</Button>
                <Button className="flex-1 bg-editor-primary hover:bg-editor-primary/90" onClick={() => { toast.success(`${activeFormConfig.label} configured`); setShowFormConfigModal(false); }}><Check size={16} className="mr-2" />Apply & Add to Canvas</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};