
import React, { FC, useState } from 'react';
import { CanvasContainer } from './canvas/CanvasContainer';
import { ImageUploader } from '../shared/ImageUploader';
import { PDFDocument, Tool, PDFElement } from '@/types';
import { useCanvasKeyboardHandler } from './CanvasKeyboardHandler';

interface CanvasProps {
  document: PDFDocument;
  activeTool: Tool;
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: PDFElement) => void;
  onUpdateElement: (element: PDFElement) => void;
  onDeleteElement: (id: string) => void;
}

export const Canvas: FC<CanvasProps> = ({
  document,
  activeTool,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  useCanvasKeyboardHandler({
    selectedElement,
    onDeleteElement,
    isEditing,
  });

  return (
    <div className="flex-1 overflow-auto p-8">
      <CanvasContainer
        document={document}
        activeTool={activeTool}
        selectedElement={selectedElement}
        onSelectElement={onSelectElement}
        onAddElement={onAddElement}
        onUpdateElement={onUpdateElement}
        onDeleteElement={onDeleteElement}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      
      {activeTool === 'image' && !isEditing && (
        <ImageUploader
          onUpload={(src) => {
            // Calculate center position for new image based on a default canvas size
            // This is an approximation since we don't have direct access to canvas dimensions here
            const centerX = 595 / 2 - 100; // Using A4 default width
            const centerY = 842 / 2 - 100; // Using A4 default height
            
            onAddElement({
              id: crypto.randomUUID(),
              type: 'image',
              src,
              x: centerX,
              y: centerY,
              width: 200,
              height: 200,
            });
          }}
        />
      )}
    </div>
  );
};
