export type PDFDocument = {
    title: string;
    pageSize: 'a4' | 'letter' | 'legal' | 'tabloid' | 'executive' | 'b5';
    orientation: 'portrait' | 'landscape';
    defaultTextColor: string;
    elements: PDFElement[];
  };
  
  export type PDFElement = TextElement | ImageElement | ShapeElement | TableElement;
  
  export type TextElement = {
    id: string;
    type: 'text';
    content: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    width: number;
    height: number;
  };
  
  export type ImageElement = {
    id: string;
    type: 'image';
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  export type ShapeElement = {
    id: string;
    type: 'shape';
    shapeType: 'rectangle' | 'circle' | 'line';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  
  export type TableElement = {
    id: string;
    type: 'table';
    tableStyle: 'simple' | 'striped' | 'bordered';
    x: number;
    y: number;
    width: number;
    height: number;
    columns: number;
    rows: number;
    headerType: 'none' | 'simple' | 'divided';
    data: string[][];
  };
  
  export type Tool = 
    | 'select' 
    | 'text' 
    | 'image' 
    | 'shape_rectangle' 
    | 'shape_circle' 
    | 'shape_line' 
    | 'table_simple' 
    | 'table_striped' 
    | 'table_bordered';