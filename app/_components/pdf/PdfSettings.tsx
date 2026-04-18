"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PDFDocument } from "@/types/global";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Settings, 
  FileText, 
  Maximize2, 
  RotateCw, 
  Type, 
  Palette, 
  Layout, 
  CornerRightDown,
  Monitor
} from "lucide-react";
import type React from "react";
import { ModeToggle } from "../shared/ModeToggle";
import { cn } from "@/lib/utils";

interface PdfSettingsProps {
  document: PDFDocument;
  onUpdate: (settings: Partial<PDFDocument>) => void;
  onClose: () => void;
}

const fontOptions = [
  { value: "Arial", label: "Arial" },
  { value: "Times-Roman", label: "Times New Roman" },
  { value: "Courier", label: "Courier" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
];

const paperSizes = [
  { value: "a3", label: "A3" },
  { value: "a4", label: "A4" },
  { value: "a5", label: "A5" },
  { value: "letter", label: "Letter" },
  { value: "legal", label: "Legal" },
  { value: "tabloid", label: "Tabloid" },
  { value: "custom", label: "Custom Size" },
];

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
      <Icon size={14} />
    </div>
    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</h3>
  </div>
);

export const PdfSettings: React.FC<PdfSettingsProps> = ({
  document,
  onUpdate,
  onClose,
}) => {
  return (
    <motion.div
      id="tour-settings-panel"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-l border-border z-50 flex flex-col shadow-2xl"
    >
      <div className="p-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Document Settings</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Configure your PDF</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {/* Document Info */}
        <div className="animate-in delay-100">
          <SectionHeader icon={FileText} title="Document Info" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold ml-1">Title</Label>
              <Input
                id="title"
                value={document.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="bg-muted/30 border-border/50 focus-visible:ring-primary rounded-xl"
                placeholder="Enter document title..."
              />
            </div>
          </div>
        </div>

        {/* Page Layout */}
        <div className="animate-in delay-200">
          <SectionHeader icon={Layout} title="Page Layout" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold ml-1">Page Size</Label>
              <Select
                value={document.pageSize}
                onValueChange={(value) => onUpdate({ pageSize: value as any })}
              >
                <SelectTrigger className="w-full bg-muted/30 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  {paperSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-xs">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {document.pageSize === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 pt-2"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] ml-1">Width (mm)</Label>
                    <Input
                      type="number"
                      value={document.customWidth || 210}
                      onChange={(e) => onUpdate({ customWidth: Number(e.target.value) })}
                      className="bg-muted/30 border-border/50 rounded-xl h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] ml-1">Height (mm)</Label>
                    <Input
                      type="number"
                      value={document.customHeight || 297}
                      onChange={(e) => onUpdate({ customHeight: Number(e.target.value) })}
                      className="bg-muted/30 border-border/50 rounded-xl h-9 text-xs"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-xs font-semibold ml-1">Orientation</Label>
              <RadioGroup
                value={document.orientation}
                onValueChange={(value) => onUpdate({ orientation: value as any })}
                className="grid grid-cols-2 gap-2"
              >
                <Label
                  htmlFor="portrait"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                    document.orientation === "portrait" && "border-primary bg-primary/5"
                  )}
                >
                  <RadioGroupItem value="portrait" id="portrait" className="sr-only" />
                  <Maximize2 className="mb-2 h-6 w-6 rotate-90" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Portrait</span>
                </Label>
                <Label
                  htmlFor="landscape"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                    document.orientation === "landscape" && "border-primary bg-primary/5"
                  )}
                >
                  <RadioGroupItem value="landscape" id="landscape" className="sr-only" />
                  <Maximize2 className="mb-2 h-6 w-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Landscape</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Typography & Design */}
        <div className="animate-in delay-300">
          <SectionHeader icon={Palette} title="Typography & Theme" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold ml-1">Primary Font</Label>
              <Select
                value={document.defaultFontFamily}
                onValueChange={(value) => onUpdate({ defaultFontFamily: value })}
              >
                <SelectTrigger className="w-full bg-muted/30 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-xs">
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold ml-1">Accent Color</Label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl border border-border overflow-hidden shadow-sm group">
                  <Input
                    type="color"
                    value={document.defaultTextColor || "#000000"}
                    onChange={(e) => onUpdate({ defaultTextColor: e.target.value })}
                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer scale-150"
                  />
                </div>
                <Input
                  type="text"
                  value={document.defaultTextColor || "#000000"}
                  onChange={(e) => onUpdate({ defaultTextColor: e.target.value })}
                  className="flex-1 bg-muted/30 border-border/50 rounded-xl h-10 text-xs font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-muted-foreground" />
                <span className="text-xs font-semibold">Dark Interface</span>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-border bg-muted/10">
        <Button 
          variant="secondary" 
          className="w-full rounded-xl font-bold py-6 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          onClick={onClose}
        >
          Save & Apply
        </Button>
      </div>
    </motion.div>
  );
};
