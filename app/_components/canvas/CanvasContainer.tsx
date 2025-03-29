"use client"

import { useRef, useState, useEffect, FC, MouseEvent, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { CanvasElement } from './CanvasElement';
import { PDFDocument, Tool, PDFElement, TextElement, ShapeElement, TableElement } from '@/types';
import { DragDropArea } from './DragAndDrop';

interface CanvasContainerProps {
  document: PDFDocument;
  activeTool: Tool;
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: PDFElement) => void;
  onUpdateElement: (element: PDFElement) => void;
  onDeleteElement: (id: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

// Paper size dimensions in points (72 points per inch)
const paperSizesPoints: Record<string, { width: number; height: number }> = {
  a3: { width: 842, height: 1191 },
  a4: { width: 595, height: 842 },
  a5: { width: 420, height: 595 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 },
  tabloid: { width: 792, height: 1224 },
  executive: { width: 522, height: 756 },
  b5: { width: 499, height: 709 },
  b4: { width: 709, height: 1002 },
  jisb4: { width: 729, height: 1032 },
  jisb5: { width: 516, height: 729 },
};

export const CanvasContainer: FC<CanvasContainerProps> = ({
  document,
  activeTool,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  isEditing,
  setIsEditing,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 595, height: 842 }); // Default A4
  const [draggedElement, setDraggedElement] = useState<{ id: string; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    // Set canvas dimensions based on page size and orientation
    let width: number;
    let height: number;
    
    if (document.pageSize === 'custom' && document.customWidth && document.customHeight) {
      // Convert mm to points (1mm = 2.83465 points)
      width = Math.round(document.customWidth * 2.83465);
      height = Math.round(document.customHeight * 2.83465);
    } else {
      const sizeKey = document.pageSize;
      const defaultSize = { width: 595, height: 842 }; // Default A4 as fallback
      const size = paperSizesPoints[sizeKey] || defaultSize;
      
      width = size.width;
      height = size.height;
    }
    
    if (document.orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    setCanvasDimensions({ width, height });
  }, [document.pageSize, document.orientation, document.customWidth, document.customHeight]);

  const handleCanvasClick = (e: MouseEvent) => {
    if (!canvasRef.current || isEditing) return;
    
    // Get click position relative to canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle adding new elements based on active tool
    if (activeTool === 'text') {
      const newText: TextElement = {
        id: uuidv4(),
        type: 'text',
        content: 'Click to edit text',
        x,
        y,
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        width: 200,
        height: 30,
      };
      onAddElement(newText);
    } else if (activeTool === 'shape_rectangle') {
      const newShape: ShapeElement = {
        id: uuidv4(),
        type: 'shape',
        shapeType: 'rectangle',
        x,
        y,
        width: 100,
        height: 80,
        fill: '#e5e7eb',
        stroke: '#9ca3af',
        strokeWidth: 1,
      };
      onAddElement(newShape);
    } else if (activeTool === 'shape_circle') {
      const newShape: ShapeElement = {
        id: uuidv4(),
        type: 'shape',
        shapeType: 'circle',
        x,
        y,
        width: 80, // diameter
        height: 80,
        fill: '#e5e7eb',
        stroke: '#9ca3af',
        strokeWidth: 1,
      };
      onAddElement(newShape);
    } else if (activeTool === 'shape_line') {
      const newShape: ShapeElement = {
        id: uuidv4(),
        type: 'shape',
        shapeType: 'line',
        x,
        y,
        width: 100,
        height: 0,
        fill: 'transparent',
        stroke: '#9ca3af',
        strokeWidth: 2,
      };
      onAddElement(newShape);
    } else if (activeTool.startsWith('table_')) {
      const tableStyle = activeTool.replace('table_', '') as 'simple' | 'striped' | 'bordered';
      const newTable: TableElement = {
        id: uuidv4(),
        type: 'table',
        tableStyle,
        x,
        y,
        width: 300,
        height: 200,
        columns: 3,
        rows: 4,
        headerType: 'simple',
        data: [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
          ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3'],
          ['Row 3, Cell 1', 'Row 3, Cell 2', 'Row 3, Cell 3'],
        ],
      };
      onAddElement(newTable);
    } else if (activeTool === 'select') {
      // Deselect if clicking on empty canvas area
      onSelectElement(null);
      setIsEditing(false);
    }
  };

  const handleElementMouseDown = (e: MouseEvent, element: PDFElement) => {
    e.stopPropagation();
    
    if (activeTool === 'select') {
      onSelectElement(element.id);
      
      // Start dragging only if not editing
      if (!isEditing) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setDraggedElement({
            id: element.id,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: e.clientX - rect.left - element.x,
            offsetY: e.clientY - rect.top - element.y,
          });
        }
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedElement || !canvasRef.current || isEditing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - draggedElement.offsetX;
    const y = e.clientY - rect.top - draggedElement.offsetY;
    
    const element = document.elements.find(el => el.id === draggedElement.id);
    if (element) {
      onUpdateElement({
        ...element,
        x,
        y,
      });
    }
  };

  const handleMouseUp = () => {
    if (draggedElement && !isEditing) {
      toast.success('Element moved');
    }
    setDraggedElement(null);
  };

  return (
    <div 
      className="flex justify-center overflow-auto h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <DragDropArea
        canvasRef={canvasRef as unknown as RefObject<HTMLDivElement>}
        canvasDimensions={canvasDimensions}
        onCanvasClick={handleCanvasClick}
        activeTool={activeTool}
        onAddElement={onAddElement}
        isEditing={isEditing}
      >
        {document.elements.map(element => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElement}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onUpdate={onUpdateElement}
            activeTool={activeTool}
            onAddElement={onAddElement}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ))}
      </DragDropArea>
    </div>
  );
};
