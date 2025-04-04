"use client";

import { PDFElement, Tool, TextElement, ShapeElement, TableElement, PencilDrawingElement } from '@/types/types';
import {FC, MouseEvent} from "react"
import { TextEditor } from '../editor/TextEditor';
import { PencilTool } from '../tools/PencilTool';
import { ShapeTool } from '../tools/ShapeTool';
import { TableTool } from '../tools/TableTool';

interface CanvasElementProps {
  element: PDFElement;
  isSelected: boolean;
  onMouseDown: (e: MouseEvent) => void;
  onUpdate: (element: PDFElement) => void;
  activeTool: Tool;
  onAddElement: (element: PDFElement) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const CanvasElement: FC<CanvasElementProps> = ({
  element,
  isSelected,
  onMouseDown,
  onUpdate,
  activeTool,
  onAddElement,
  isEditing,
  setIsEditing
}) => {
  // Determine which component to render based on element type
  switch (element.type) {
    case 'text':
      return (
        <TextEditor 
          element={element as TextElement}
          isSelected={isSelected}
          onMouseDown={onMouseDown}
          onUpdate={onUpdate}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      );
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} onMouseDown={onMouseDown} />;
    case 'shape':
      return (
        <ShapeTool
          element={element as ShapeElement}
          isSelected={isSelected}
          onMouseDown={onMouseDown}
          onUpdate={onUpdate}
        />
      );
    case 'table':
      return (
        <TableTool
          element={element as TableElement}
          isSelected={isSelected}
          onMouseDown={onMouseDown}
          onUpdate={onUpdate}
        />
      );
    case 'pencil':
      return (
        <PencilTool
          element={element as PencilDrawingElement}
          isSelected={isSelected}
          onMouseDown={onMouseDown}
        />
      );
    default:
      return null;
  }
};

// A separate component for image elements
const ImageElement: FC<{
  element: PDFElement;
  isSelected: boolean;
  onMouseDown: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown }) => {
  if (element.type !== 'image') return null;
  
  // Check if the image is an SVG (either by extension or by data URI type)
  const isSvg = element.src.toLowerCase().endsWith('.svg') || 
                element.src.toLowerCase().includes('image/svg+xml');
  
  return (
    <div
      className={`absolute cursor-move ${isSelected ? "ring-2 ring-editor-primary ring-offset-2" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
      onMouseDown={onMouseDown}
    >
      <img 
        src={element.src} 
        alt="PDF element" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
