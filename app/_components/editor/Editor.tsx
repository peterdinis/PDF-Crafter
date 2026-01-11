"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdfUtils";
import type {
  PDFDocument,
  PDFElement,
  PDFPage,
  TextElement,
  ShapeElement,
  TableElement,
  ChartElement,
  ImageElement,
  DrawingElement,
  FormElement,
  CodeElement,
  DividerElement,
  QRCodeElement,
  SignatureElement,
  BarcodeElement,
  Tool,
} from "@/types/global";
import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Canvas } from "../canvas/Canvas";
import { PdfSettings } from "../pdf/PdfSettings";
import { ScrollToTop } from "../shared/ScrollToTop";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toolbar } from "./Toolbar";

const PDFEditor = () => {
  const [document, setDocument] = useState<PDFDocument>({
    title: "Untitled Document",
    pageSize: "a4",
    orientation: "portrait",
    defaultTextColor: "#000000",
    defaultFontFamily: "Arial",
    defaultFontSize: 16,
    pages: [
      {
        id: crypto.randomUUID(),
        elements: [],
      },
    ],
    currentPage: 0,
  });

  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearPageDialog, setShowClearPageDialog] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
        e.preventDefault();
        deleteElement(selectedElement);
        toast.success("Element deleted");
      }

      // Escape key to deselect
      if (e.key === "Escape") {
        setSelectedElement(null);
        setShowPropertiesPanel(false);
      }

      // Duplicate element with Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedElement) {
        e.preventDefault();
        duplicateElement(selectedElement);
      }

      // Open properties panel with Ctrl/Cmd + E
      if ((e.ctrlKey || e.metaKey) && e.key === "e" && selectedElement) {
        e.preventDefault();
        setShowPropertiesPanel(true);
      }

      // Quick tool shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "t":
            e.preventDefault();
            setActiveTool("text");
            break;
          case "i":
            e.preventDefault();
            setActiveTool("image");
            break;
          case "s":
            e.preventDefault();
            if (e.shiftKey) setActiveTool("shape_rectangle");
            break;
          case "l":
            e.preventDefault();
            setActiveTool("chart_line");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement]);

  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);
    if (tool !== "select") {
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading("Generating PDF...");
      await generatePDF(document);
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.dismiss();
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const addPage = () => {
    const newPage: PDFPage = {
      id: crypto.randomUUID(),
      elements: [],
    };

    setDocument((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
      currentPage: prev.pages.length,
    }));

    setSelectedElement(null);
    setShowPropertiesPanel(false);
    toast.success("New page added");
  };

  const changePage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < document.pages.length) {
      setDocument((prev) => ({
        ...prev,
        currentPage: pageIndex,
      }));
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  };

  const deletePage = (pageIndex: number) => {
    if (document.pages.length <= 1) {
      toast.error("Cannot delete the only page");
      return;
    }

    setDocument((prev) => {
      const newPages = prev.pages.filter((_, index) => index !== pageIndex);
      const newCurrentPage =
        prev.currentPage >= newPages.length
          ? newPages.length - 1
          : prev.currentPage;

      return {
        ...prev,
        pages: newPages,
        currentPage: newCurrentPage,
      };
    });

    setSelectedElement(null);
    setShowPropertiesPanel(false);
    toast.success("Page deleted");
  };

  const clearCurrentPage = () => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: [],
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });

    setSelectedElement(null);
    setShowPropertiesPanel(false);
    toast.success("All elements deleted from current page");
    setShowClearPageDialog(false);
  };

  // Helper function to get default text content
  const getDefaultTextContent = (style: string): string => {
    switch (style) {
      case "h1": return "Heading 1";
      case "h2": return "Heading 2";
      case "h3": return "Heading 3";
      case "paragraph": return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
      case "bold": return "Bold Text";
      case "italic": return "Italic Text";
      case "underline": return "Underlined Text";
      case "quote": return "This is an important quote that needs to stand out from the rest of the text.";
      case "list": return "• Item 1\n• Item 2\n• Item 3\n• Item 4";
      case "numbered": return "1. First item\n2. Second item\n3. Third item\n4. Fourth item";
      default: return "Edit this text...";
    }
  };

  // Helper function to generate table data
  const generateTableData = (style: string) => {
    const baseHeaders = ["Product", "Q1", "Q2", "Q3", "Total"];
    const baseData = [
      ["Widget A", "120", "150", "180", "450"],
      ["Widget B", "90", "110", "130", "330"],
      ["Widget C", "200", "220", "240", "660"],
      ["Widget D", "80", "95", "105", "280"],
    ];

    if (style === "wide") {
      return {
        headers: ["Month", "Sales", "Expenses", "Profit", "Growth", "Target"],
        rows: [
          ["January", "15,000", "8,000", "7,000", "12%", "✓"],
          ["February", "18,000", "9,500", "8,500", "15%", "✓"],
          ["March", "22,000", "11,000", "11,000", "22%", "✓"],
        ]
      };
    }

    if (style === "calendar") {
      return {
        headers: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        rows: [
          ["", "1", "2", "3", "4", "5", "6"],
          ["7", "8", "9", "10", "11", "12", "13"],
          ["14", "15", "16", "17", "18", "19", "20"],
          ["21", "22", "23", "24", "25", "26", "27"],
          ["28", "29", "30", "", "", "", ""],
        ]
      };
    }

    if (style === "invoice") {
      return {
        headers: ["Item", "Quantity", "Unit Price", "Total"],
        rows: [
          ["Product A", "2", "$50.00", "$100.00"],
          ["Product B", "1", "$75.00", "$75.00"],
          ["Product C", "3", "$25.00", "$75.00"],
        ]
      };
    }

    return {
      headers: style === "empty" ? ["", ""] : baseHeaders.slice(0, 3),
      rows: style === "empty" ? [["", ""], ["", ""]] : baseData.slice(0, 2)
    };
  };

  // Helper function to generate chart data
  const generateChartData = (type: string) => {
    const labels = ["January", "February", "March", "April", "May", "June"];
    
    switch (type) {
      case "bar":
        return {
          labels,
          datasets: [
            {
              label: "Sales",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: "#3b82f6",
            },
            {
              label: "Expenses",
              data: [28, 48, 40, 19, 86, 27],
              backgroundColor: "#10b981",
            }
          ]
        };
      case "line":
        return {
          labels,
          datasets: [
            {
              label: "Revenue",
              data: [30, 45, 60, 75, 90, 85],
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "#3b82f6",
            }
          ]
        };
      case "pie":
        return {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
          datasets: [
            {
              label: "Market Share",
              data: [12, 19, 3, 5, 2],
              backgroundColor: [
                "#ef4444",
                "#3b82f6",
                "#f59e0b",
                "#10b981",
                "#8b5cf6"
              ],
            }
          ]
        };
      case "area":
        return {
          labels,
          datasets: [
            {
              label: "Users",
              data: [100, 200, 300, 400, 500, 600],
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "#3b82f6",
            }
          ]
        };
      case "scatter":
        return {
          labels: ["A", "B", "C", "D", "E", "F"],
          datasets: [
            {
              label: "Dataset 1",
              data: [
                { x: 10, y: 20 },
                { x: 15, y: 10 },
                { x: 20, y: 30 },
                { x: 25, y: 15 },
                { x: 30, y: 40 },
                { x: 35, y: 25 },
              ],
              backgroundColor: "#3b82f6",
            }
          ]
        };
      case "radar":
        return {
          labels: ["Speed", "Reliability", "Design", "Price", "Features"],
          datasets: [
            {
              label: "Product A",
              data: [80, 70, 90, 60, 85],
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "#3b82f6",
            },
            {
              label: "Product B",
              data: [70, 85, 75, 80, 70],
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "#10b981",
            }
          ]
        };
      default:
        return {
          labels,
          datasets: [
            {
              label: "Default",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: "#3b82f6",
            }
          ]
        };
    }
  };

  // Helper function to get default code content
  const getDefaultCodeContent = (type: string): string => {
    switch (type) {
      case "json":
        return JSON.stringify({
          name: "Example Object",
          version: "1.0.0",
          data: {
            items: ["item1", "item2", "item3"],
            count: 3,
            active: true
          }
        }, null, 2);
      case "html":
        return `<!DOCTYPE html>
<html>
<head>
    <title>Example Page</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>This is an example HTML content.</p>
    </div>
</body>
</html>`;
      case "math":
        return "E = mc^2\n\n\\int_{a}^{b} f(x) dx = F(b) - F(a)\n\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}";
      case "sql":
        return `SELECT 
    customers.name,
    orders.order_date,
    orders.total_amount,
    products.product_name
FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON order_items.product_id = products.id
WHERE orders.status = 'completed'
ORDER BY orders.order_date DESC;`;
      default:
        return `// JavaScript code example
function calculateTotal(items) {
    return items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

const items = [
    { name: "Item 1", price: 10, quantity: 2 },
    { name: "Item 2", price: 20, quantity: 1 },
    { name: "Item 3", price: 5, quantity: 3 }
];

const total = calculateTotal(items);
console.log("Total:", total);`;
    }
  };

  const addElement = (element: PDFElement) => {
    // Apply document defaults for text elements
    if (element.type === "text") {
      const textElement = element as TextElement;
      textElement.color = document.defaultTextColor;
      textElement.fontFamily = document.defaultFontFamily;
      textElement.fontSize = document.defaultFontSize;
    }

    // Generate specific element based on active tool
    if (activeTool !== "select") {
      const id = crypto.randomUUID();
      const x = (element as any).x || 100;
      const y = (element as any).y || 100;

      let newElement: PDFElement;

      switch (activeTool) {
        // Text elements
        case "text":
        case "text_h1":
        case "text_h2":
        case "text_h3":
        case "text_paragraph":
        case "text_bold":
        case "text_italic":
        case "text_underline":
        case "text_quote":
        case "text_list":
        case "text_numbered":
          const textStyle = activeTool.replace("text_", "") || "normal";
          newElement = {
            id,
            type: "text",
            x,
            y,
            width: 300,
            height: textStyle.includes("list") || textStyle.includes("numbered") ? 120 : 80,
            content: getDefaultTextContent(textStyle),
            style: textStyle as any,
            fontSize: textStyle.includes("h") ? 
              textStyle === "h1" ? 32 : 
              textStyle === "h2" ? 24 : 18 : 
              textStyle === "paragraph" ? 14 : 16,
            fontFamily: document.defaultFontFamily,
            color: document.defaultTextColor,
            align: "left",
          } as TextElement;
          break;

        // Shape elements
        case "shape_rectangle":
        case "shape_circle":
        case "shape_triangle":
        case "shape_diamond":
        case "shape_star":
        case "shape_arrow":
        case "shape_line":
        case "shape_heart":
        case "shape_hexagon":
          const shapeType = activeTool.replace("shape_", "");
          newElement = {
            id,
            type: "shape",
            x,
            y,
            width: shapeType === "line" || shapeType === "arrow" ? 150 : 120,
            height: shapeType === "line" || shapeType === "arrow" ? 2 : 120,
            shapeType: shapeType as any,
            fillColor: shapeType === "line" || shapeType === "arrow" ? "transparent" : "#3b82f6",
            strokeColor: "#1d4ed8",
            strokeWidth: shapeType === "line" || shapeType === "arrow" ? 3 : 2,
            borderRadius: shapeType === "rectangle" ? 8 : 0,
          } as ShapeElement;
          break;

        // Table elements
        case "table_simple":
        case "table_striped":
        case "table_bordered":
        case "table_empty":
        case "table_wide":
        case "table_calendar":
        case "table_invoice":
          const tableStyle = activeTool.replace("table_", "");
          const data = generateTableData(tableStyle);
          newElement = {
            id,
            type: "table",
            x,
            y,
            width: tableStyle === "wide" || tableStyle === "calendar" ? 400 : 300,
            height: tableStyle === "calendar" ? 200 : 150,
            rows: data.rows.length,
            columns: data.headers.length,
            style: tableStyle as any,
            data,
            headerColor: "#3b82f6",
            rowColors: ["#ffffff", "#f9fafb"],
            borderColor: "#e5e7eb",
            borderWidth: 1,
          } as TableElement;
          break;

        // Chart elements
        case "chart_bar":
        case "chart_line":
        case "chart_pie":
        case "chart_area":
        case "chart_scatter":
        case "chart_radar":
        case "chart_gauge":
          const chartType = activeTool.replace("chart_", "");
          newElement = {
            id,
            type: "chart",
            x,
            y,
            width: 350,
            height: 250,
            chartType: chartType as any,
            data: generateChartData(chartType),
            title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
            showLegend: true,
            showGrid: true,
          } as ChartElement;
          break;

        // Form elements
        case "form_text":
        case "form_textarea":
        case "form_checkbox":
        case "form_radio":
        case "form_dropdown":
        case "form_button":
        case "form_date":
        case "form_range":
          const formType = activeTool.replace("form_", "");
          newElement = {
            id,
            type: "form",
            x,
            y,
            width: 200,
            height: formType === "textarea" ? 80 : formType === "button" ? 36 : 40,
            formType: formType as any,
            label: `${formType.charAt(0).toUpperCase() + formType.slice(1).replace(/_/g, ' ')}`,
            placeholder: `Enter ${formType}`,
            required: false,
            options: formType === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
          } as FormElement;
          break;

        // Code elements
        case "code_block":
        case "code_json":
        case "code_html":
        case "code_math":
        case "code_sql":
          const codeType = activeTool.replace("code_", "");
          newElement = {
            id,
            type: "code",
            x,
            y,
            width: 400,
            height: 200,
            codeType: codeType as any,
            content: getDefaultCodeContent(codeType),
            language: codeType === "json" ? "json" : 
                     codeType === "html" ? "html" : 
                     codeType === "math" ? "latex" : 
                     codeType === "sql" ? "sql" : "javascript",
            theme: "light",
            showLineNumbers: true,
            fontSize: 14,
          } as CodeElement;
          break;

        // Divider
        case "divider":
          newElement = {
            id,
            type: "divider",
            x,
            y,
            width: 400,
            height: 2,
            color: "#d1d5db",
            style: "solid",
            thickness: 2,
          } as DividerElement;
          break;

        // Media elements
        case "image":
          newElement = {
            id,
            type: "image",
            x,
            y,
            width: 200,
            height: 150,
            src: "",
            alt: "New Image",
            fit: "contain",
          } as ImageElement;
          break;

        case "pencil":
          newElement = {
            id,
            type: "drawing",
            x,
            y,
            width: 300,
            height: 200,
            paths: [],
            strokeColor: "#000000",
            strokeWidth: 2,
            background: "#ffffff",
          } as DrawingElement;
          break;

        case "qrcode":
          newElement = {
            id,
            type: "qrcode",
            x,
            y,
            width: 120,
            height: 120,
            content: "https://example.com",
            color: "#000000",
            backgroundColor: "#ffffff",
            errorCorrection: "M",
          } as QRCodeElement;
          break;

        case "barcode":
          newElement = {
            id,
            type: "barcode",
            x,
            y,
            width: 200,
            height: 80,
            value: "123456789012",
            format: "CODE128",
            color: "#000000",
            backgroundColor: "#ffffff",
          } as BarcodeElement;
          break;

        case "signature":
          newElement = {
            id,
            type: "signature",
            x,
            y,
            width: 200,
            height: 100,
            signatureData: "",
            penColor: "#000000",
            penWidth: 2,
            placeholder: "Sign here",
          } as SignatureElement;
          break;

        default:
          console.warn("Unrecognized tool:", activeTool);
          return; // Don't add if tool not recognized
      }

      setDocument((prev) => {
        const updatedPages = [...prev.pages];
        updatedPages[prev.currentPage] = {
          ...updatedPages[prev.currentPage],
          elements: [...updatedPages[prev.currentPage].elements, newElement],
        };

        return {
          ...prev,
          pages: updatedPages,
        };
      });

      setSelectedElement(newElement.id);
      setShowPropertiesPanel(true);
      toast.success(`${newElement.type.charAt(0).toUpperCase() + newElement.type.slice(1)} added`);
      return;
    }

    // If adding via drag-and-drop (existing element passed)
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: [...updatedPages[prev.currentPage].elements, element],
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });

    setSelectedElement(element.id);
    setShowPropertiesPanel(true);
  };

  const updateElement = (element: PDFElement) => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: updatedPages[prev.currentPage].elements.map((el) =>
          el.id === element.id ? element : el,
        ),
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });
  };

  const deleteElement = (id: string) => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: updatedPages[prev.currentPage].elements.filter(
          (el) => el.id !== id,
        ),
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });

    if (selectedElement === id) {
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  };

  const duplicateElement = (id: string) => {
    setDocument((prev) => {
      const currentPage = prev.pages[prev.currentPage];
      const elementToDuplicate = currentPage.elements.find(
        (el) => el.id === id,
      );

      if (!elementToDuplicate) return prev;

      const duplicatedElement = {
        ...elementToDuplicate,
        id: crypto.randomUUID(),
        x: (elementToDuplicate.x || 0) + 20,
        y: (elementToDuplicate.y || 0) + 20,
      };

      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: [
          ...updatedPages[prev.currentPage].elements,
          duplicatedElement,
        ],
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });

    toast.success("Element duplicated");
  };

  const moveElementInList = (id: string, direction: "up" | "down") => {
    setDocument((prev) => {
      const currentPage = prev.pages[prev.currentPage];
      const index = currentPage.elements.findIndex((el) => el.id === id);
      if (index === -1) return prev;

      const newElements = [...currentPage.elements];
      const targetIndex = direction === "up" ? index + 1 : index - 1;

      if (targetIndex < 0 || targetIndex >= newElements.length) return prev;

      // Swap elements
      [newElements[index], newElements[targetIndex]] = [
        newElements[targetIndex],
        newElements[index],
      ];

      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: newElements,
      };

      return {
        ...prev,
        pages: updatedPages,
      };
    });
  };

  // Get selected element object
  const selectedElementObj = selectedElement
    ? document.pages[document.currentPage]?.elements.find(
        (el) => el.id === selectedElement,
      ) || null
    : null;

  // Show properties panel when element is selected
  useEffect(() => {
    if (selectedElement && selectedElementObj) {
      setShowPropertiesPanel(true);
    } else {
      setShowPropertiesPanel(false);
    }
  }, [selectedElement, selectedElementObj]);

  const updateDocumentSettings = (settings: Partial<PDFDocument>) => {
    setDocument({
      ...document,
      ...settings,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-editor-background dark:bg-gray-950">
      <Toolbar
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        pageElements={document.pages[document.currentPage]?.elements || []}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        onMoveElement={moveElementInList}
        onDeleteElement={deleteElement}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-editor-border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            {document.title}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowClearPageDialog(true)}
              variant="outline"
              className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
              <Trash2 size={16} />
              Clear Page
            </Button>
            <Button
              onClick={handleDownload}
              variant="default"
              className="flex items-center gap-2 bg-editor-primary hover:bg-editor-primary/90"
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center justify-center p-4 dark:bg-gray-900 bg-white border-b border-editor-border dark:border-gray-800">
            <div className="flex items-center space-x-2">
              {document.pages.map((page, index) => (
                <Button
                  key={page.id}
                  variant={
                    document.currentPage === index ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => changePage(index)}
                  className={`min-w-10 h-8 ${
                    document.currentPage === index
                      ? "bg-editor-primary hover:bg-editor-primary/90"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addPage}
                className="h-8 border-gray-300 dark:border-gray-700"
              >
                <Plus size={16} />
              </Button>
              {document.pages.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePage(document.currentPage)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 border-gray-300 dark:border-gray-700"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Canvas
            document={document}
            activeTool={activeTool}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
          />
        </div>
      </div>

      {showSettings && (
        <PdfSettings
          document={document}
          onUpdate={updateDocumentSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPropertiesPanel && selectedElementObj && (
        <PropertiesPanel
          element={selectedElementObj}
          onUpdate={updateElement}
          onDelete={deleteElement}
          onDuplicate={duplicateElement}
          onClose={() => {
            setShowPropertiesPanel(false);
            setSelectedElement(null);
          }}
        />
      )}

      <AlertDialog
        open={showClearPageDialog}
        onOpenChange={setShowClearPageDialog}
      >
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Clear Page
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete all elements from the current
              page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCurrentPage}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollToTop />
    </div>
  );
};

export default PDFEditor;