"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ChartElement,
  CodeElement,
  FormElement,
  ImageElement,
  PDFElement,
  QRCodeElement,
  BarcodeElement,
  SignatureElement,
  ShapeElement,
  TableElement,
  TextElement,
  DividerElement,
  PencilElement,
} from "@/types/global";
import { Copy, Minus, Plus, Trash2, Upload, Settings2, Move, X, PenTool, Layout, Type, Palette, Table as TableIcon, BarChart3, Binary, QrCode as QrIcon, Hash, Pen } from "lucide-react";
import { type FC, useState } from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";
import { ChartImportDialog } from "../tools/ChartImportDialog";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  element: PDFElement | null;
  onUpdate: (element: PDFElement) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onClose: () => void;
}

const PropertySection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="space-y-4 pt-4 first:pt-0 border-t first:border-t-0 border-border/50">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
        <Icon size={14} />
      </div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

export const PropertiesPanel: FC<PropertiesPanelProps> = ({
  element,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
}) => {
  // HOOKS (must be at the top level)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  if (!element) return null;

  const handleDelete = () => {
    onDelete(element.id);
    onClose();
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(element.id);
    }
  };

  const renderTextProperties = (el: TextElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Content</Label>
        <textarea
          value={el.content}
          onChange={(e) => onUpdate({ ...el, content: e.target.value })}
          className="w-full min-h-24 p-3 border border-border rounded-xl bg-muted/20 text-xs focus:ring-2 focus:ring-primary/30 outline-none transition-all"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Font Family</Label>
          <Select
            value={el.fontFamily}
            onValueChange={(value) => onUpdate({ ...el, fontFamily: value })}
          >
            <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times-Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Size</Label>
          <Input
            type="number"
            min="8"
            max="200"
            value={el.fontSize}
            onChange={(e) =>
              onUpdate({
                ...el,
                fontSize: Number.parseInt(e.target.value) || 16,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Weight</Label>
          <Select
            value={el.fontWeight}
            onValueChange={(value) => onUpdate({ ...el, fontWeight: value })}
          >
            <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Style</Label>
          <Select
            value={el.fontStyle}
            onValueChange={(value) => onUpdate({ ...el, fontStyle: value })}
          >
            <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="italic">Italic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <ColorPicker
          label="Text Color"
          color={el.color || "#000000"}
          onChange={(color) => onUpdate({ ...el, color })}
        />

        <ColorPicker
          label="Background"
          color={el.backgroundColor || "transparent"}
          onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
        />
      </div>
    </div>
  );

  const renderShapeProperties = (el: ShapeElement) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Width</Label>
          <Input
            type="number"
            min="1"
            value={el.width}
            onChange={(e) =>
              onUpdate({
                ...el,
                width: Number.parseInt(e.target.value) || 100,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Height</Label>
          <Input
            type="number"
            min="1"
            value={el.height}
            onChange={(e) =>
              onUpdate({
                ...el,
                height: Number.parseInt(e.target.value) || 100,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Rotation (deg)</Label>
        <Input
          type="number"
          min="0"
          max="360"
          value={el.rotation || 0}
          onChange={(e) =>
            onUpdate({
              ...el,
              rotation: Number.parseInt(e.target.value) || 0,
            })
          }
          className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Border Width</Label>
        <Input
          type="number"
          min="1"
          max="20"
          value={el.strokeWidth}
          onChange={(e) =>
            onUpdate({
              ...el,
              strokeWidth: Number.parseInt(e.target.value) || 1,
            })
          }
          className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
        />
      </div>

      <div className="space-y-4 pt-2">
        {el.shapeType !== "line" && (
          <ColorPicker
            label="Fill Color"
            color={el.fillColor || el.fill || "transparent"}
            onChange={(color) => onUpdate({ ...el, fillColor: color, fill: color } as any)}
          />
        )}

        <ColorPicker
          label="Border Color"
          color={el.strokeColor || el.stroke || "#000000"}
          onChange={(color) => onUpdate({ ...el, strokeColor: color, stroke: color } as any)}
        />
      </div>
    </div>
  );

  const renderImageProperties = (el: ImageElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">URL</Label>
        <Input
          value={el.src}
          onChange={(e) => onUpdate({ ...el, src: e.target.value })}
          placeholder="https://..."
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Alt Text</Label>
        <Input
          value={el.alt}
          onChange={(e) => onUpdate({ ...el, alt: e.target.value })}
          placeholder="Image description"
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Width</Label>
          <Input
            type="number"
            min="1"
            value={el.width}
            onChange={(e) =>
              onUpdate({
                ...el,
                width: Number.parseInt(e.target.value) || 200,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Height</Label>
          <Input
            type="number"
            min="1"
            value={el.height}
            onChange={(e) =>
              onUpdate({
                ...el,
                height: Number.parseInt(e.target.value) || 200,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Fit Mode</Label>
        <Select
          value={el.fit || "cover"}
          onValueChange={(value) => onUpdate({ ...el, fit: value as any })}
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Background"
        color={el.backgroundColor || "transparent"}
        onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
      />
    </div>
  );

  const renderCodeProperties = (el: CodeElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Source Code</Label>
        <textarea
          value={el.content}
          onChange={(e) => onUpdate({ ...el, content: e.target.value })}
          className="w-full min-h-36 p-3 border border-border rounded-xl font-mono text-[10px] bg-zinc-950 text-zinc-300 outline-none"
          placeholder="Enter code here..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Language</Label>
        <Select
          value={el.language}
          onValueChange={(value) => onUpdate({ ...el, language: value })}
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs text-foreground uppercase tracking-wider font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Font Size</Label>
          <Input
            type="number"
            min="8"
            max="72"
            value={el.fontSize || 14}
            onChange={(e) =>
              onUpdate({
                ...el,
                fontSize: Number.parseInt(e.target.value) || 14,
              })
            }
            className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Theme</Label>
          <Select
            value={el.theme || "light"}
            onValueChange={(value) => onUpdate({ ...el, theme: value as any })}
          >
            <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderFormProperties = (el: FormElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Field Label</Label>
        <Input
          value={el.label}
          onChange={(e) => onUpdate({ ...el, label: e.target.value })}
          placeholder="e.g., Full Name"
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      {["text", "textarea"].includes(el.formType) && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Placeholder</Label>
          <Input
            value={el.placeholder || ""}
            onChange={(e) => onUpdate({ ...el, placeholder: e.target.value })}
            placeholder="Helpful hint..."
            className="rounded-xl bg-muted/20 border-border/50 text-xs"
          />
        </div>
      )}

      {["checkbox", "radio", "dropdown"].includes(el.formType) && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Options</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] font-bold uppercase tracking-tight rounded-lg border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => {
                const currentOptions = el.options || [];
                onUpdate({
                  ...el,
                  options: [
                    ...currentOptions,
                    `Option ${currentOptions.length + 1}`,
                  ],
                });
              }}
            >
              <Plus size={12} className="mr-1" /> Add Option
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {(el.options || []).map((option, index) => (
              <div key={index} className="flex gap-2 animate-in slide-in-from-right-2 duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(el.options || [])];
                    newOptions[index] = e.target.value;
                    onUpdate({ ...el, options: newOptions });
                  }}
                  className="h-8 text-xs rounded-lg bg-muted/20 border-border/50"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg"
                  onClick={() => {
                    const newOptions = (el.options || []).filter(
                      (_, i) => i !== index,
                    );
                    onUpdate({ ...el, options: newOptions });
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
        <input
          type="checkbox"
          id="required"
          checked={el.required}
          onChange={(e) => onUpdate({ ...el, required: e.target.checked })}
          className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
        />
        <Label htmlFor="required" className="text-xs font-semibold cursor-pointer select-none">Mark as Required</Label>
      </div>

      <ColorPicker
        label="Background"
        color={el.backgroundColor || "transparent"}
        onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
      />
    </div>
  );

  const renderTableProperties = (el: TableElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Header Type</Label>
        <Select
          value={el.headerType || "simple"}
          onValueChange={(value) =>
            onUpdate({
              ...el,
              headerType: value as any,
            })
          }
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="none">No Header</SelectItem>
            <SelectItem value="simple">Simple Header</SelectItem>
            <SelectItem value="divided">Divided Header</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80 text-center block">Rows: {el.rows}</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg h-8"
              onClick={() => {
                if (el.rows <= 1) return;
                const newRows = el.rows - 1;
                const currentRows = el.data?.rows || [];
                onUpdate({
                  ...el,
                  rows: newRows,
                  data: {
                    ...el.data,
                    rows: currentRows.slice(0, newRows),
                  },
                });
              }}
              disabled={el.rows <= 1}
            >
              <Minus size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg h-8"
              onClick={() => {
                const newRows = el.rows + 1;
                const currentRows = el.data?.rows || [];
                const newData = [...currentRows];
                newData.push(Array(el.columns).fill(""));
                onUpdate({
                  ...el,
                  rows: newRows,
                  data: {
                    ...el.data,
                    rows: newData,
                  },
                });
              }}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80 text-center block">Cols: {el.columns}</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg h-8"
              onClick={() => {
                if (el.columns <= 1) return;
                const newColumns = el.columns - 1;
                const currentRows = el.data?.rows || [];
                const currentHeaders = el.data?.headers || [];

                const newRowsData = currentRows.map((row) =>
                  row.slice(0, newColumns),
                );
                const newHeaders = currentHeaders.slice(0, newColumns);

                onUpdate({
                  ...el,
                  columns: newColumns,
                  data: {
                    headers: newHeaders,
                    rows: newRowsData,
                  },
                });
              }}
              disabled={el.columns <= 1}
            >
              <Minus size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg h-8"
              onClick={() => {
                const newColumns = el.columns + 1;
                const currentRows = el.data?.rows || [];
                const currentHeaders = el.data?.headers || [];

                const newRowsData = currentRows.map((row) => [...row, ""]);
                const newHeaders = [...currentHeaders, ""];

                onUpdate({
                  ...el,
                  columns: newColumns,
                  data: {
                    headers: newHeaders,
                    rows: newRowsData,
                  },
                });
              }}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <ColorPicker
          label="Border Color"
          color={el.borderColor || "#000000"}
          onChange={(color) => onUpdate({ ...el, borderColor: color })}
        />

        <ColorPicker
          label="Header Bg"
          color={el.headerColor || "#ffffff"}
          onChange={(color) => onUpdate({ ...el, headerColor: color })}
        />

        <ColorPicker
          label="Cell Bg"
          color={el.cellColor || "#ffffff"}
          onChange={(color) => onUpdate({ ...el, cellColor: color })}
        />

        <ColorPicker
          label="Text Color"
          color={el.textColor || "#000000"}
          onChange={(color) => onUpdate({ ...el, textColor: color })}
        />
      </div>
    </div>
  );

  const renderChartProperties = (el: ChartElement) => {
    // Labels and Datasets
    const labels = el.data?.labels || [];
    const dataset = el.data?.datasets?.[0] || { data: [], backgroundColor: "" };
    const values = dataset.data || [];

    const dataPoints = labels.map((label, i) => ({
      label,
      value: values[i] || 0,
    }));

    const updateData = (newPoints: { label: string; value: number }[]) => {
      const newLabels = newPoints.map((p) => p.label);
      const newValues = newPoints.map((p) => p.value);

      onUpdate({
        ...el,
        data: {
          labels: newLabels,
          datasets: [
            {
              ...dataset,
              label: dataset.label || "Dataset 1",
              data: newValues,
              backgroundColor: dataset.backgroundColor || "#3b82f6",
            },
          ],
        },
      });
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground/80">Chart Type</Label>
          <Select
            value={el.chartType}
            onValueChange={(value) =>
              onUpdate({ ...el, chartType: value as any })
            }
          >
            <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="doughnut">Doughnut</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Points</Label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
                className="h-7 text-[10px] rounded-lg border-primary/20 text-primary"
              >
                <Upload size={12} className="mr-1" /> Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newData = [
                    ...dataPoints,
                    { label: `Point ${dataPoints.length + 1}`, value: 0 },
                  ];
                  updateData(newData);
                }}
                className="h-7 text-[10px] rounded-lg border-primary/20 text-primary"
              >
                <Plus size={12} className="mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {dataPoints.map((point, index) => (
              <div
                key={index}
                className="flex gap-2 items-end p-2 bg-muted/20 rounded-xl border border-border/50 animate-in slide-in-from-right-2 duration-200"
              >
                <div className="flex-1 space-y-1">
                  <Input
                    value={point.label}
                    onChange={(e) => {
                      const newData = [...dataPoints];
                      newData[index] = { ...point, label: e.target.value };
                      updateData(newData);
                    }}
                    className="h-8 text-xs bg-white dark:bg-zinc-900 border-border/50 rounded-lg"
                    placeholder="Label"
                  />
                </div>
                <div className="w-16 space-y-1">
                  <Input
                    type="number"
                    value={point.value}
                    onChange={(e) => {
                      const newData = [...dataPoints];
                      newData[index] = {
                        ...point,
                        value: Number.parseFloat(e.target.value) || 0,
                      };
                      updateData(newData);
                    }}
                    className="h-8 text-xs bg-white dark:bg-zinc-900 border-border/50 rounded-lg"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg p-0"
                  onClick={() => {
                    const newData = dataPoints.filter((_, i) => i !== index);
                    updateData(newData);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showGrid"
              className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
              checked={el.showGrid}
              onChange={(e) =>
                onUpdate({ ...el, showGrid: e.target.checked })
              }
            />
            <Label htmlFor="showGrid" className="text-[10px] font-semibold cursor-pointer">Grid</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showAxes"
              className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
              checked={el.showAxes}
              onChange={(e) =>
                onUpdate({ ...el, showAxes: e.target.checked })
              }
            />
            <Label htmlFor="showAxes" className="text-[10px] font-semibold cursor-pointer">Axes</Label>
          </div>
        </div>

        <ColorPicker
          label="Background"
          color={el.backgroundColor || "transparent"}
          onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
        />

        <ChartImportDialog
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onImport={(newData) => updateData(newData)}
        />
      </div>
    );
  };

  const renderQRCodeProperties = (el: QRCodeElement) => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">QR Content</Label>
        <Input
          value={el.content || ""}
          onChange={(e) => onUpdate({ ...el, content: e.target.value })}
          placeholder="https://example.com"
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Precision Level</Label>
        <Select
          value={el.errorCorrection || "M"}
          onValueChange={(value) => onUpdate({ ...el, errorCorrection: value as any })}
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="L">Low (7%)</SelectItem>
            <SelectItem value="M">Medium (15%)</SelectItem>
            <SelectItem value="Q">Quartile (25%)</SelectItem>
            <SelectItem value="H">High (30%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-2">
        <ColorPicker
          label="QR Color"
          color={el.color || "#000000"}
          onChange={(color) => onUpdate({ ...el, color })}
        />

        <ColorPicker
          label="Background"
          color={el.backgroundColor || "#ffffff"}
          onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
        />
      </div>
    </div>
  );

  const renderDividerProperties = (el: DividerElement) => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Style</Label>
        <Select
          value={el.style || "solid"}
          onValueChange={(value) => onUpdate({ ...el, style: value as any })}
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="solid">Solid Line</SelectItem>
            <SelectItem value="dashed">Dashed Line</SelectItem>
            <SelectItem value="dotted">Dotted Line</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Thickness ({el.thickness || 2}px)</Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={el.thickness || 2}
          onChange={(e) => onUpdate({ ...el, thickness: Number(e.target.value) })}
          className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
        />
      </div>

      <ColorPicker
        label="Line Color"
        color={el.color || "#d1d5db"}
        onChange={(color) => onUpdate({ ...el, color })}
      />
    </div>
  );

  const renderBarcodeProperties = (el: BarcodeElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Barcode Value</Label>
        <Input
          value={el.value || ""}
          onChange={(e) => onUpdate({ ...el, value: e.target.value })}
          placeholder="1234567890"
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Encoding Format</Label>
        <Select
          value={el.format || "CODE128"}
          onValueChange={(value) => onUpdate({ ...el, format: value as any })}
        >
          <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 text-xs font-bold uppercase tracking-wider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="CODE128">CODE128</SelectItem>
            <SelectItem value="CODE39">CODE39</SelectItem>
            <SelectItem value="EAN13">EAN13</SelectItem>
            <SelectItem value="UPC">UPC</SelectItem>
            <SelectItem value="ITF14">ITF14</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-2">
        <ColorPicker
          label="Line Color"
          color={el.color || "#000000"}
          onChange={(color) => onUpdate({ ...el, color })}
        />

        <ColorPicker
          label="Background"
          color={el.backgroundColor || "#ffffff"}
          onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
        />
      </div>
    </div>
  );

  const renderSignatureProperties = (el: SignatureElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Placeholder Text</Label>
        <Input
          value={el.placeholder || ""}
          onChange={(e) => onUpdate({ ...el, placeholder: e.target.value })}
          placeholder="Sign here..."
          className="rounded-xl bg-muted/20 border-border/50 text-xs"
        />
      </div>

      <ColorPicker
        label="Box Background"
        color={el.backgroundColor || "transparent"}
        onChange={(color) => onUpdate({ ...el, backgroundColor: color })}
      />

      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 animate-pulse">
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest text-center">
          Double-click on canvas to sign
        </p>
      </div>
    </div>
  );

  const renderPencilProperties = (el: PencilElement) => (
    <div className="space-y-4">
      <ColorPicker
        label="Stroke Color"
        color={el.color || "#000000"}
        onChange={(color) => onUpdate({ ...el, color })}
      />
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground/80">Stroke Width</Label>
        <Input
          type="number"
          min="1"
          max="20"
          value={el.strokeWidth || 2}
          onChange={(e) => onUpdate({ ...el, strokeWidth: Number(e.target.value) })}
          className="rounded-xl bg-muted/20 border-border/50 text-xs h-9"
        />
      </div>
    </div>
  );

  // Helper to get consistent icon based on type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return Type;
      case "shape": return Layout;
      case "image": return Palette;
      case "table": return TableIcon;
      case "chart": return BarChart3;
      case "code": return Binary;
      case "qrcode": return QrIcon;
      case "barcode": return Hash;
      case "signature": return PenTool;
      case "divider": return Minus;
      case "pencil": return Pen;
      default: return Settings2;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-border z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm">
            <Settings2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Properties</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Adjust {element.type}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-32">
        <div className="space-y-8">
          {/* Action Header */}
          <div className="flex gap-2 p-1 bg-muted/40 rounded-xl border border-border/50 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="flex-1 h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white dark:hover:bg-zinc-800 shadow-sm transition-all"
            >
              <Copy size={14} className="mr-2 text-primary" /> Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="flex-1 h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-destructive/10 text-destructive shadow-sm transition-all"
            >
              <Trash2 size={14} className="mr-2" /> Delete
            </Button>
          </div>

          {/* Categorized Properties */}
          <PropertySection title="Appearance" icon={getTypeIcon(element.type)}>
            {element.type === "text" && renderTextProperties(element as TextElement)}
            {element.type === "shape" && renderShapeProperties(element as ShapeElement)}
            {element.type === "image" && renderImageProperties(element as ImageElement)}
            {element.type === "table" && renderTableProperties(element as TableElement)}
            {element.type === "chart" && renderChartProperties(element as ChartElement)}
            {element.type === "code" && renderCodeProperties(element as CodeElement)}
            {element.type === "form" && renderFormProperties(element as FormElement)}
            {element.type === "qrcode" && renderQRCodeProperties(element as QRCodeElement)}
            {element.type === "divider" && renderDividerProperties(element as DividerElement)}
            {element.type === "barcode" && renderBarcodeProperties(element as BarcodeElement)}
            {element.type === "signature" && renderSignatureProperties(element as SignatureElement)}
            {element.type === "pencil" && renderPencilProperties(element as PencilElement)}
          </PropertySection>

          {/* Transform / Position */}
          <PropertySection title="Geometry" icon={Move}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground/80">X Pos</Label>
                <Input
                  type="number"
                  value={element.x || 0}
                  onChange={(e) => onUpdate({ ...element, x: Number.parseInt(e.target.value) || 0 })}
                  className="rounded-xl bg-muted/20 border-border/50 text-xs h-9 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground/80">Y Pos</Label>
                <Input
                  type="number"
                  value={element.y || 0}
                  onChange={(e) => onUpdate({ ...element, y: Number.parseInt(e.target.value) || 0 })}
                  className="rounded-xl bg-muted/20 border-border/50 text-xs h-9 font-mono"
                />
              </div>
            </div>
            
            {(element as any).width !== undefined && (element as any).height !== undefined && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground/80">Width</Label>
                  <Input
                    type="number"
                    value={(element as any).width || 0}
                    onChange={(e) => onUpdate({ ...element, width: Number.parseInt(e.target.value) || 0 } as any)}
                    className="rounded-xl bg-muted/20 border-border/50 text-xs h-9 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground/80">Height</Label>
                  <Input
                    type="number"
                    value={(element as any).height || 0}
                    onChange={(e) => onUpdate({ ...element, height: Number.parseInt(e.target.value) || 0 } as any)}
                    className="rounded-xl bg-muted/20 border-border/50 text-xs h-9 font-mono"
                  />
                </div>
              </div>
            )}
          </PropertySection>
        </div>
      </div>

      <div className="p-5 border-t border-border bg-muted/10">
        <Button 
          variant="secondary" 
          className="w-full rounded-xl font-bold py-6 shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
          onClick={onClose}
        >
          Finished Editing
        </Button>
      </div>
    </div>
  );
};
