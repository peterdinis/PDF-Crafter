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
import { Label } from "@/components/ui/label";
import { generatePDF } from "@/lib/pdfUtils";
import type {
  BarcodeElement,
  ChartElement,
  CodeElement,
  DividerElement,
  DrawingElement,
  FormElement,
  ImageElement,
  PDFDocument,
  PDFElement,
  PDFPage,
  QRCodeElement,
  ShapeElement,
  SignatureElement,
  TableElement,
  TextElement,
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
    pages: [{ id: crypto.randomUUID(), elements: [] }],
    currentPage: 0,
  });

  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearPageDialog, setShowClearPageDialog] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [enableCompression, setEnableCompression] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
        e.preventDefault();
        deleteElement(selectedElement);
        toast.success("Element deleted");
      }
      if (e.key === "Escape") {
        setSelectedElement(null);
        setShowPropertiesPanel(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedElement) {
        e.preventDefault();
        duplicateElement(selectedElement);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e" && selectedElement) {
        e.preventDefault();
        setShowPropertiesPanel(true);
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "t": e.preventDefault(); setActiveTool("text"); break;
          case "i": e.preventDefault(); setActiveTool("image"); break;
          case "s": e.preventDefault(); setActiveTool("shape_rectangle"); break;
          case "l": e.preventDefault(); setActiveTool("chart_line"); break;
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
      await generatePDF(document, { compress: enableCompression });
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.dismiss();
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const addPage = () => {
    const newPage: PDFPage = { id: crypto.randomUUID(), elements: [] };
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
      setDocument((prev) => ({ ...prev, currentPage: pageIndex }));
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
      const newCurrentPage = prev.currentPage >= newPages.length ? newPages.length - 1 : prev.currentPage;
      return { ...prev, pages: newPages, currentPage: newCurrentPage };
    });
    setSelectedElement(null);
    setShowPropertiesPanel(false);
    toast.success("Page deleted");
  };

  const clearCurrentPage = () => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = { ...updatedPages[prev.currentPage], elements: [] };
      return { ...prev, pages: updatedPages };
    });
    setSelectedElement(null);
    setShowPropertiesPanel(false);
    toast.success("All elements deleted from current page");
    setShowClearPageDialog(false);
  };

  const getDefaultTextContent = (style: string): string => {
    const contents: Record<string, string> = {
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bold: "Bold Text",
      italic: "Italic Text",
      underline: "Underlined Text",
      quote: "This is an important quote that needs to stand out from the rest of the text.",
      list: "• Item 1\n• Item 2\n• Item 3\n• Item 4",
      numbered: "1. First item\n2. Second item\n3. Third item\n4. Fourth item",
    };
    return contents[style] || "Edit this text...";
  };

  const generateTableData = (style: string) => {
    const tables: Record<string, any> = {
      wide: {
        headers: ["Month", "Sales", "Expenses", "Profit", "Growth", "Target"],
        rows: [
          ["January", "15,000", "8,000", "7,000", "12%", "✓"],
          ["February", "18,000", "9,500", "8,500", "15%", "✓"],
          ["March", "22,000", "11,000", "11,000", "22%", "✓"],
        ],
      },
      calendar: {
        headers: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        rows: [
          ["", "1", "2", "3", "4", "5", "6"],
          ["7", "8", "9", "10", "11", "12", "13"],
          ["14", "15", "16", "17", "18", "19", "20"],
          ["21", "22", "23", "24", "25", "26", "27"],
          ["28", "29", "30", "", "", "", ""],
        ],
      },
      invoice: {
        headers: ["Item", "Quantity", "Unit Price", "Total"],
        rows: [
          ["Product A", "2", "$50.00", "$100.00"],
          ["Product B", "1", "$75.00", "$75.00"],
          ["Product C", "3", "$25.00", "$75.00"],
        ],
      },
      empty: {
        headers: ["Column 1", "Column 2"],
        rows: [["", ""], ["", ""]],
      },
    };
    return tables[style] || {
      headers: ["Header 1", "Header 2", "Header 3"],
      rows: [
        ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
        ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
      ],
    };
  };

  const generateChartData = (type: string) => {
    const labels = ["January", "February", "March", "April", "May", "June"];
    const charts: Record<string, any> = {
      bar: {
        labels,
        datasets: [
          { label: "Sales", data: [65, 59, 80, 81, 56, 55], backgroundColor: "#3b82f6" },
          { label: "Expenses", data: [28, 48, 40, 19, 86, 27], backgroundColor: "#10b981" },
        ],
      },
      line: {
        labels,
        datasets: [{ label: "Revenue", data: [30, 45, 60, 75, 90, 85], backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6" }],
      },
      pie: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
        datasets: [{ label: "Market Share", data: [12, 19, 3, 5, 2], backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"] }],
      },
    };
    return charts[type] || charts.bar;
  };

  const getDefaultCodeContent = (type: string): string => {
    const codes: Record<string, string> = {
      json: JSON.stringify({ name: "Example", version: "1.0.0", data: { items: ["item1", "item2"], count: 2 } }, null, 2),
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
      math: "E = mc^2\n\n\\int_{a}^{b} f(x) dx",
      sql: "SELECT * FROM customers WHERE status = 'active';",
      css: ".container {\n  max-width: 1200px;\n  margin: 0 auto;\n}",
    };
    return codes[type] || "// JavaScript code\nfunction hello() {\n  return 'World';\n}";
  };

  const createCompleteElement = (baseData: any): PDFElement => {
    const id = crypto.randomUUID();
    const x = baseData.x || 100;
    const y = baseData.y || 100;
    const toolValue = baseData.tool || activeTool;
    const elementType = baseData.type || toolValue.split("_")[0];

    if (elementType === "text" || toolValue.startsWith("text")) {
      const style = baseData.style || toolValue.replace("text_", "") || "normal";
      return {
        id, type: "text", x, y,
        width: baseData.width || 300,
        height: baseData.height || (style.includes("list") || style.includes("numbered") ? 120 : 80),
        content: baseData.content || getDefaultTextContent(style),
        style, fontSize: style.includes("h") ? (style === "h1" ? 32 : style === "h2" ? 24 : 18) : (style === "paragraph" ? 14 : 16),
        fontFamily: baseData.fontFamily || document.defaultFontFamily,
        fontWeight: style === "bold" || style.startsWith("h") ? "bold" : "normal",
        fontStyle: style === "italic" ? "italic" : "normal",
        color: baseData.color || document.defaultTextColor,
        align: baseData.align || "left",
      } as TextElement;
    }

    if (elementType === "shape" || toolValue.startsWith("shape")) {
      const shapeType = baseData.shapeType || toolValue.replace("shape_", "");
      return {
        id, type: "shape", x, y,
        width: baseData.width || (shapeType === "line" || shapeType === "arrow" ? 150 : 120),
        height: baseData.height || (shapeType === "line" ? 2 : shapeType === "arrow" ? 40 : 120),
        shapeType,
        fillColor: baseData.fillColor || (shapeType === "line" || shapeType === "arrow" ? "transparent" : "#3b82f6"),
        strokeColor: baseData.strokeColor || "#1d4ed8",
        strokeWidth: baseData.strokeWidth || (shapeType === "line" || shapeType === "arrow" ? 3 : 2),
        borderRadius: baseData.borderRadius || (shapeType === "rectangle" ? 8 : 0),
      } as ShapeElement;
    }

    if (elementType === "table" || toolValue.startsWith("table")) {
      const tableStyle = baseData.tableStyle || baseData.style || toolValue.replace("table_", "") || "simple";
      const data = baseData.data || generateTableData(tableStyle);
      return {
        id, type: "table", x, y,
        width: baseData.width || (tableStyle === "wide" || tableStyle === "calendar" ? 400 : 300),
        height: baseData.height || (tableStyle === "calendar" ? 200 : 150),
        rows: data.rows.length, columns: data.headers.length, style: tableStyle, data,
        headerColor: baseData.headerColor || "#3b82f6",
        rowColors: baseData.rowColors || ["#ffffff", "#f9fafb"],
        borderColor: baseData.borderColor || "#e5e7eb",
        borderWidth: baseData.borderWidth || 1,
      } as TableElement;
    }

    if (elementType === "chart" || toolValue.startsWith("chart")) {
      const chartType = baseData.chartType || toolValue.replace("chart_", "");
      return {
        id, type: "chart", x, y, width: baseData.width || 350, height: baseData.height || 250,
        chartType, data: baseData.data || generateChartData(chartType),
        title: baseData.title || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        showLegend: baseData.showLegend !== undefined ? baseData.showLegend : true,
        showGrid: baseData.showGrid !== undefined ? baseData.showGrid : true,
      } as ChartElement;
    }

    if (elementType === "form" || toolValue.startsWith("form")) {
      const formType = baseData.formType || toolValue.replace("form_", "");
      return {
        id, type: "form", x, y, width: baseData.width || 200,
        height: baseData.height || (formType === "textarea" ? 80 : formType === "button" ? 36 : 40),
        formType, label: baseData.label || `${formType.charAt(0).toUpperCase() + formType.slice(1)}`,
        placeholder: baseData.placeholder || `Enter ${formType}`, required: baseData.required || false,
        options: baseData.options || (formType === "dropdown" || formType === "radio" ? ["Option 1", "Option 2", "Option 3"] : undefined),
      } as FormElement;
    }

    if (elementType === "code" || toolValue.startsWith("code")) {
      const codeType = baseData.codeType || toolValue.replace("code_", "") || "block";
      return {
        id, type: "code", x, y, width: baseData.width || 400, height: baseData.height || 200,
        codeType, content: baseData.content || getDefaultCodeContent(codeType),
        language: codeType === "json" ? "json" : codeType === "html" ? "html" : codeType === "css" ? "css" : codeType === "math" ? "latex" : codeType === "sql" ? "sql" : "javascript",
        theme: baseData.theme || "light", showLineNumbers: baseData.showLineNumbers !== undefined ? baseData.showLineNumbers : true,
        fontSize: baseData.fontSize || 14,
      } as CodeElement;
    }

    if (elementType === "divider" || toolValue === "divider") {
      return {
        id, type: "divider", x, y, width: baseData.width || 400, height: baseData.height || 2,
        color: baseData.color || "#d1d5db", style: baseData.style || "solid", thickness: baseData.thickness || 2,
      } as DividerElement;
    }

    if (elementType === "image" || toolValue === "image") {
      return {
        id, type: "image", x, y, width: baseData.width || 200, height: baseData.height || 150,
        src: baseData.src || "", alt: baseData.alt || "New Image", fit: baseData.fit || "contain"
      } as ImageElement;
    }

    if (elementType === "drawing" || toolValue === "pencil") {
      return {
        id, type: "drawing", x, y, width: baseData.width || 300, height: baseData.height || 200,
        paths: baseData.paths || [], strokeColor: baseData.strokeColor || "#000000",
        strokeWidth: baseData.strokeWidth || 2, background: baseData.background || "transparent"
      } as DrawingElement;
    }

    if (elementType === "qrcode" || toolValue === "qrcode") {
      return {
        id, type: "qrcode", x, y, width: baseData.width || 120, height: baseData.height || 120,
        content: baseData.content || "https://example.com", color: baseData.color || "#000000",
        backgroundColor: baseData.backgroundColor || "transparent", errorCorrection: baseData.errorCorrection || "M"
      } as QRCodeElement;
    }

    if (elementType === "barcode" || toolValue === "barcode") {
      return {
        id, type: "barcode", x, y, width: baseData.width || 200, height: baseData.height || 80,
        value: baseData.value || "123456789012", format: baseData.format || "CODE128",
        color: baseData.color || "#000000", backgroundColor: baseData.backgroundColor || "transparent"
      } as BarcodeElement;
    }

    if (elementType === "signature" || toolValue === "signature") {
      return {
        id, type: "signature", x, y, width: baseData.width || 200, height: baseData.height || 100,
        signatureData: baseData.signatureData || "", penColor: baseData.penColor || "#000000",
        penWidth: baseData.penWidth || 2, placeholder: baseData.placeholder || "Sign here"
      } as SignatureElement;
    }

    return {
      id, type: "text", x, y, width: 300, height: 80, content: "New Element",
      fontSize: 16, fontFamily: document.defaultFontFamily, color: document.defaultTextColor, align: "left"
    } as TextElement;
  };

  const addElement = (elementData: any) => {
    const newElement = createCompleteElement(elementData);
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: [...updatedPages[prev.currentPage].elements, newElement],
      };
      return { ...prev, pages: updatedPages };
    });
    setSelectedElement(newElement.id);
    setShowPropertiesPanel(true);
    if (newElement.type !== "drawing") setActiveTool("select");
    toast.success(`${newElement.type.charAt(0).toUpperCase() + newElement.type.slice(1)} added`);
  };

  const updateElement = (element: PDFElement) => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: updatedPages[prev.currentPage].elements.map((el) => el.id === element.id ? element : el),
      };
      return { ...prev, pages: updatedPages };
    });
  };

  const deleteElement = (id: string) => {
    setDocument((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = {
        ...updatedPages[prev.currentPage],
        elements: updatedPages[prev.currentPage].elements.filter((el) => el.id !== id),
      };
      return { ...prev, pages: updatedPages };
    });
    if (selectedElement === id) {
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  };

  const duplicateElement = (id: string) => {
    setDocument((prev) => {
      const currentPage = prev.pages[prev.currentPage];
      const elementToDuplicate = currentPage.elements.find((el) => el.id === id);
      if (!elementToDuplicate) return prev;
      const duplicatedElement = { ...elementToDuplicate, id: crypto.randomUUID(), x: (elementToDuplicate.x || 0) + 20, y: (elementToDuplicate.y || 0) + 20 };
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = { ...updatedPages[prev.currentPage], elements: [...updatedPages[prev.currentPage].elements, duplicatedElement] };
      return { ...prev, pages: updatedPages };
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
      [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
      const updatedPages = [...prev.pages];
      updatedPages[prev.currentPage] = { ...updatedPages[prev.currentPage], elements: newElements };
      return { ...prev, pages: updatedPages };
    });
  };

  const selectedElementObj = selectedElement ? document.pages[document.currentPage]?.elements.find((el) => el.id === selectedElement) || null : null;

  useEffect(() => {
    if (selectedElement && selectedElementObj) {
      setShowPropertiesPanel(true);
      // Ensure we switch to select mode so tool properties don't conflict
      if (activeTool !== "select") {
        setActiveTool("select");
      }
    } else {
      setShowPropertiesPanel(false);
    }
  }, [selectedElement, selectedElementObj, activeTool]);

  const updateDocumentSettings = (settings: Partial<PDFDocument>) => {
    setDocument({ ...document, ...settings });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-editor-background dark:bg-gray-950">
      <Toolbar activeTool={activeTool} onToolSelect={handleToolSelect} onSettingsToggle={() => setShowSettings(!showSettings)}
        pageElements={document.pages[document.currentPage]?.elements || []} selectedElement={selectedElement}
        onSelectElement={setSelectedElement} onMoveElement={moveElementInList} onDeleteElement={deleteElement} />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-editor-border dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">{document.title}</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowClearPageDialog(true)} variant="outline"
              className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400">
              <Trash2 size={16} />Clear Page
            </Button>
            <div className="flex items-center gap-2 mr-2">
              <input type="checkbox" id="compression" checked={enableCompression} onChange={(e) => {
                setEnableCompression(e.target.checked);
                toast[e.target.checked ? "success" : "info"](e.target.checked ? "Compression activated" : "Compression deactivated");
              }} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700" />
              <Label htmlFor="compression" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Compress</Label>
            </div>
            <Button onClick={handleDownload} variant="default" className="flex items-center gap-2 bg-amber-400 hover:bg-editor-primary/90">
              <Download size={16} />Download PDF
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center justify-center p-4 dark:bg-gray-900 bg-white border-b border-editor-border dark:border-gray-800">
            <div className="flex items-center space-x-2">
              {document.pages.map((page, index) => (
                <Button key={page.id} variant={document.currentPage === index ? "default" : "outline"} size="sm"
                  onClick={() => changePage(index)} className={`min-w-10 h-8 ${document.currentPage === index ? "bg-editor-primary hover:bg-editor-primary/90" : "border-gray-300 dark:border-gray-700"}`}>
                  {index + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={addPage} className="h-8 border-gray-300 dark:border-gray-700">
                <Plus size={16} />
              </Button>
              {document.pages.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => deletePage(document.currentPage)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 border-gray-300 dark:border-gray-700">
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Canvas document={document} activeTool={activeTool} selectedElement={selectedElement}
            onSelectElement={setSelectedElement} onAddElement={addElement} onUpdateElement={updateElement} onDeleteElement={deleteElement} />
        </div>
      </div>

      {showSettings && <PdfSettings document={document} onUpdate={updateDocumentSettings} onClose={() => setShowSettings(false)} />}

      {showPropertiesPanel && selectedElementObj && (
        <PropertiesPanel element={selectedElementObj} onUpdate={updateElement} onDelete={deleteElement}
          onDuplicate={duplicateElement} onClose={() => { setShowPropertiesPanel(false); setSelectedElement(null); }} />
      )}

      <AlertDialog open={showClearPageDialog} onOpenChange={setShowClearPageDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Clear Page</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete all elements from the current page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearCurrentPage} className="bg-red-500 text-white hover:bg-red-600">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollToTop />
    </div>
  );
};

export default PDFEditor;