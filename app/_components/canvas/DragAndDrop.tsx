"use client";

import { useState, RefObject, MouseEvent, FC, ReactNode, DragEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tool, PDFElement, TextElement, ShapeElement, TableElement } from "@/types";
import { motion } from "framer-motion";

interface DragDropAreaProps {
  canvasRef: RefObject<HTMLDivElement>;
  canvasDimensions: { width: number; height: number };
  onCanvasClick: (e: MouseEvent) => void;
  activeTool: Tool;
  onAddElement: (element: PDFElement) => void;
  children: ReactNode;
  isEditing: boolean;
}

export const DragDropArea: FC<DragDropAreaProps> = ({
  canvasRef,
  canvasDimensions,
  onCanvasClick,
  activeTool,
  onAddElement,
  children,
  isEditing,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (!canvasRef.current || isEditing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const elementData = JSON.parse(data);
        let newElement: PDFElement | null = null;

        switch (elementData.type) {
          case "text":
            newElement = {
              id: uuidv4(),
              type: "text",
              content: elementData.content || "Dropped text",
              x,
              y,
              fontSize: 16,
              fontFamily: "Arial",
              fontWeight: "normal",
              fontStyle: "normal",
              color: "#000000",
              width: 200,
              height: 30,
            } as TextElement;
            break;
          case "shape":
            newElement = {
              id: uuidv4(),
              type: "shape",
              shapeType: elementData.shapeType || "rectangle",
              x,
              y,
              width: 100,
              height: 80,
              fill: "#e5e7eb",
              stroke: "#9ca3af",
              strokeWidth: 1,
            } as ShapeElement;
            break;
          case "table":
            newElement = {
              id: uuidv4(),
              type: "table",
              tableStyle: elementData.tableStyle || "simple",
              x,
              y,
              width: 300,
              height: 200,
              columns: elementData.columns || 3,
              rows: elementData.rows || 4,
              headerType: elementData.headerType || "simple",
              data:
                elementData.data ||
                [
                  ["Header 1", "Header 2", "Header 3"],
                  ["Data 1", "Data 2", "Data 3"],
                  ["Data 4", "Data 5", "Data 6"],
                  ["Data 7", "Data 8", "Data 9"],
                ],
            } as TableElement;
            break;
        }

        if (newElement) {
          onAddElement(newElement);
          toast.success("Element dropped");
        }
      } catch (error) {
        console.error("Error parsing dropped data:", error);
      }
    }
  };

  return (
    <motion.div
      ref={canvasRef}
      className={cn(
        "pdf-page relative",
        isDraggingOver && !isEditing && "bg-editor-primary/10 border-2 border-dashed border-editor-primary"
      )}
      style={{
        width: `${canvasDimensions.width}px`,
        height: `${canvasDimensions.height}px`,
      }}
      onClick={onCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      {isDraggingOver && !isEditing && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-editor-primary/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-editor-primary font-semibold">Drop here!</p>
        </motion.div>
      )}
    </motion.div>
  );
};
