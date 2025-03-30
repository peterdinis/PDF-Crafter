import { TextElement, ImageElement, ShapeElement, TableElement, PencilDrawingElement, PDFDocument } from "@/types";
import { jsPDF } from "jspdf"


// Define the PDFElement type by combining all possible element types
type PDFElement = TextElement | ImageElement | ShapeElement | TableElement | PencilDrawingElement;

// Function to convert base64 data URI to array buffer
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

// Get the proper font style string for jsPDF
const getFontStyle = (fontWeight: string, fontStyle: string) => {
  if (fontWeight === 'bold' && fontStyle === 'italic') return 'bolditalic';
  if (fontWeight === 'bold') return 'bold';
  if (fontStyle === 'italic') return 'italic';
  return 'normal';
};

// Add elements of a single page to the PDF
const addPageElementsToPDF = (pdf: jsPDF, elements: PDFElement[]) => {
  for (const element of elements) {
    if (element.type === 'text') {
      const textElement = element as TextElement;
      
      // Set font family and style
      const fontStyle = getFontStyle(textElement.fontWeight, textElement.fontStyle);
      pdf.setFont(textElement.fontFamily || 'Helvetica', fontStyle);
      
      // Set font size (explicitly convert to number if needed)
      const fontSize = typeof textElement.fontSize === 'string' 
        ? parseInt(textElement.fontSize, 10) 
        : textElement.fontSize;
      pdf.setFontSize(fontSize);
      
      // Set text color
      pdf.setTextColor(textElement.color);
      
      // Split text into lines to handle wrapping
      const lines = pdf.splitTextToSize(textElement.content, textElement.width);
      pdf.text(lines, textElement.x, textElement.y + fontSize); // Add fontSize to y to align properly
      
    } else if (element.type === 'image') {
      const imageElement = element as ImageElement;
      try {
        // Add image to PDF - convert data URI if needed
        pdf.addImage(
          imageElement.src,
          'AUTO',
          imageElement.x,
          imageElement.y,
          imageElement.width,
          imageElement.height
        );
      } catch (error) {
        console.error('Failed to add image to PDF:', error);
      }
      
    } else if (element.type === 'shape') {
      const shapeElement = element as ShapeElement;
      
      if (shapeElement.fill && shapeElement.fill !== 'transparent') {
        pdf.setFillColor(shapeElement.fill);
      }
      
      if (shapeElement.stroke && shapeElement.stroke !== 'transparent') {
        pdf.setDrawColor(shapeElement.stroke);
        pdf.setLineWidth(shapeElement.strokeWidth);
      }
      
      if (shapeElement.shapeType === 'rectangle') {
        if (shapeElement.fill && shapeElement.fill !== 'transparent') {
          pdf.rect(
            shapeElement.x,
            shapeElement.y,
            shapeElement.width,
            shapeElement.height,
            'F'
          );
        }
        
        if (shapeElement.stroke && shapeElement.stroke !== 'transparent') {
          pdf.rect(
            shapeElement.x,
            shapeElement.y,
            shapeElement.width,
            shapeElement.height,
            'D'
          );
        }
        
      } else if (shapeElement.shapeType === 'circle') {
        const radius = shapeElement.width / 2;
        const centerX = shapeElement.x + radius;
        const centerY = shapeElement.y + radius;
        
        if (shapeElement.fill && shapeElement.fill !== 'transparent') {
          pdf.circle(centerX, centerY, radius, 'F');
        }
        
        if (shapeElement.stroke && shapeElement.stroke !== 'transparent') {
          pdf.circle(centerX, centerY, radius, 'D');
        }
        
      } else if (shapeElement.shapeType === 'line') {
        pdf.line(
          shapeElement.x,
          shapeElement.y,
          shapeElement.x + shapeElement.width,
          shapeElement.y
        );
      }
    } else if (element.type === 'table') {
      const tableElement = element as TableElement;
      
      // Set border color if specified
      if (tableElement.borderColor) {
        pdf.setDrawColor(tableElement.borderColor);
      } else {
        pdf.setDrawColor(0, 0, 0); // Default black
      }
      
      // Draw table border
      pdf.rect(
        tableElement.x,
        tableElement.y,
        tableElement.width,
        tableElement.height,
        'D'
      );
      
      // jsPDF has limited table capabilities
      // For a full implementation, you'd need to draw cells individually
      // or use a plugin like jspdf-autotable
    } else if (element.type === 'pencil') {
      const pencilElement = element as PencilDrawingElement;
      
      if (pencilElement.points.length > 1) {
        pdf.setDrawColor(pencilElement.color);
        pdf.setLineWidth(pencilElement.strokeWidth);
        
        // Draw the pencil path
        for (let i = 1; i < pencilElement.points.length; i++) {
          const prevPoint = pencilElement.points[i - 1];
          const currentPoint = pencilElement.points[i];
          
          pdf.line(
            prevPoint.x,
            prevPoint.y,
            currentPoint.x,
            currentPoint.y
          );
        }
      }
    }
  }
};

export const generatePDF = async (document: PDFDocument) => {
  // Initialize jsPDF with the right page size and orientation
  let format: string | [number, number] = 'a4';
  
  // Set standard paper formats
  if (['a3', 'a4', 'a5', 'letter', 'legal', 'tabloid', 'executive', 'b5', 'b4'].includes(document.pageSize)) {
    format = document.pageSize;
  }
  
  // Handle custom and non-standard sizes
  if (document.pageSize === 'custom' && document.customWidth && document.customHeight) {
    // Convert mm to points for jsPDF (1mm = 2.83465 points)
    const width = document.customWidth * 2.83465;
    const height = document.customHeight * 2.83465;
    format = [width, height];
  } else if (['jisb4', 'jisb5'].includes(document.pageSize)) {
    // Handle JIS B sizes which aren't standard in jsPDF
    if (document.pageSize === 'jisb4') {
      format = [729, 1032]; // JIS B4 in points
    } else if (document.pageSize === 'jisb5') {
      format = [516, 729]; // JIS B5 in points
    }
  }
  
  const orientation = document.orientation === 'portrait' ? 'p' : 'l';
  
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format,
  });
  
  // Set metadata
  pdf.setProperties({
    title: document.title,
    creator: 'PDF Crafter Ninja',
  });
  
  // Process all pages
  document.pages.forEach((page, index) => {
    // Add new page for all pages after the first one
    if (index > 0) {
      pdf.addPage(format, orientation);
    }
    
    // Add all elements from the current page
    addPageElementsToPDF(pdf, page.elements);
  });
  
  // Save PDF with document title as filename
  pdf.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
};
