"use client"

import { useState, FC, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { TableElement } from '@/types';
import { ColorPicker } from '../shared/ColorPicker';

interface TableToolProps {
  element: TableElement;
  isSelected: boolean;
  onMouseDown: (e: MouseEvent) => void;
  onUpdate: (element: TableElement) => void;
}

export const TableTool: FC<TableToolProps> = ({
  element,
  isSelected,
  onMouseDown,
  onUpdate,
}) => {
  const { tableStyle, headerType, data, columns, rows } = element;
  const [showColorPickers, setShowColorPickers] = useState(false);

  // Fill default data if empty
  const tableData = data && data.length > 0 ? data : Array(rows).fill(Array(columns).fill(""));

  // Apply different styling based on table style
  const getTableClassName = () => {
    switch (tableStyle) {
      case 'striped':
        return 'border [&_tr:nth-child(even)]:bg-gray-100';
      case 'bordered':
        return 'border [&_td]:border [&_th]:border';
      case 'simple':
      default:
        return 'border';
    }
  };

  const handleBorderColorChange = (color: string) => {
    onUpdate({
      ...element,
      borderColor: color || '#000000',
    });
  };

  const handleHeaderColorChange = (color: string) => {
    onUpdate({
      ...element,
      headerColor: color || '#ffffff',
    });
  };

  const handleCellColorChange = (color: string) => {
    onUpdate({
      ...element,
      cellColor: color || '#ffffff',
    });
  };

  const handleTextColorChange = (color: string) => {
    onUpdate({
      ...element,
      textColor: color || '#000000',
    });
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowColorPickers(true);
  };

  const handleBlur = () => {
    setShowColorPickers(false);
  };

  // Apply custom colors to the table
  const tableBorderStyle = {
    ...(element.borderColor && { borderColor: element.borderColor }),
  };
  
  const headerStyle = {
    ...(element.headerColor && { backgroundColor: element.headerColor }),
    ...(element.textColor && { color: element.textColor }),
  };
  
  const cellStyle = {
    ...(element.cellColor && { backgroundColor: element.cellColor }),
    ...(element.textColor && { color: element.textColor }),
    ...(element.borderColor && { borderColor: element.borderColor }),
  };

  return (
    <div
      className={cn(
        "absolute cursor-move overflow-hidden",
        isSelected && "ring-2 ring-editor-primary ring-offset-2"
      )}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <div className="w-full h-full overflow-auto bg-white">
        <Table className={getTableClassName()} style={tableBorderStyle}>
          {headerType !== 'none' && (
            <TableHeader 
              className={headerType === 'divided' ? 'border-b-2' : ''} 
              style={element.borderColor ? { borderColor: element.borderColor } : {}}
            >
              <TableRow>
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index} className="h-8 px-2 text-xs" style={headerStyle}>
                    {tableData[0]?.[index] || `Header ${index + 1}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: headerType === 'none' ? rows : rows - 1 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="h-8 px-2 text-xs" style={cellStyle}>
                    {tableData[headerType === 'none' ? rowIndex : rowIndex + 1]?.[colIndex] || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {isSelected && showColorPickers && (
        <div className="absolute top-full left-0 mt-2 bg-white p-3 border border-gray-200 rounded shadow-md z-50 min-w-[240px]">
          <div className="space-y-4">
            <ColorPicker 
              label="Border Color" 
              color={element.borderColor || '#000000'} 
              onChange={handleBorderColorChange} 
            />
            <ColorPicker 
              label="Header Background" 
              color={element.headerColor || '#ffffff'} 
              onChange={handleHeaderColorChange} 
            />
            <ColorPicker 
              label="Cell Background" 
              color={element.cellColor || '#ffffff'} 
              onChange={handleCellColorChange} 
            />
            <ColorPicker 
              label="Text Color" 
              color={element.textColor || '#000000'} 
              onChange={handleTextColorChange} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
