import { PDFDocument, TextElement, ImageElement, ShapeElement } from '@/types';
import { jsPDF } from 'jspdf';

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

export const generatePDF = async (document: PDFDocument) => {
  // Initialize jsPDF with the right page size and orientation
  let format = 'a4';
  if (document.pageSize === 'letter') format = 'letter';
  if (document.pageSize === 'legal') format = 'legal';
  if (document.pageSize === 'tabloid') format = 'tabloid';
  if (document.pageSize === 'executive') format = 'executive';
  if (document.pageSize === 'b5') format = 'b5';
  
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
  
  // Add elements to PDF
  for (const element of document.elements) {
    if (element.type === 'text') {
      const textElement = element as TextElement;
      pdf.setFont(textElement.fontFamily || 'Helvetica');
      pdf.setFontSize(textElement.fontSize);
      pdf.setTextColor(textElement.color);
      
      const style = '';
      if (textElement.fontWeight === 'bold') pdf.setFont(textElement.fontFamily, 'bold');
      if (textElement.fontStyle === 'italic') pdf.setFont(textElement.fontFamily, 'italic');
      
      // Split text into lines to handle wrapping
      const lines = pdf.splitTextToSize(textElement.content, textElement.width);
      pdf.text(lines, textElement.x, textElement.y + textElement.fontSize); // Add fontSize to y to align properly
      
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
    }
  }
  
  // Save PDF with document title as filename
  pdf.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
};
