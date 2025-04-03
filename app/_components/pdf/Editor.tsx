"use client";

import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdfUtils";
import type {
	PDFDocument,
	PDFElement,
	PDFPage,
	TextElement,
	Tool,
} from "@/types";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Canvas } from "../canvas/Canvas";
import { Toolbar } from "../editor/Toolbar";
import { PdfSettings } from "./PdfSettings";

const PDFEditor = () => {
	const [document, setDocument] = useState<PDFDocument>({
	  title: 'Untitled Document',
	  pageSize: 'a4',
	  orientation: 'portrait',
	  defaultTextColor: '#000000',
	  defaultFontFamily: 'Arial',
	  defaultFontSize: 16,
	  pages: [
		{
		  id: crypto.randomUUID(),
		  elements: []
		}
	  ],
	  currentPage: 0
	});
  
	const [activeTool, setActiveTool] = useState<Tool>('select');
	const [selectedElement, setSelectedElement] = useState<string | null>(null);
	const [showSettings, setShowSettings] = useState(false);
  
	const handleToolSelect = (tool: Tool) => {
	  setActiveTool(tool);
	};
  
	const handleDownload = async () => {
	  try {
		await generatePDF(document);
		toast.success('PDF downloaded successfully!');
	  } catch (error) {
		console.error('Failed to download PDF:', error);
		toast.error('Failed to download PDF. Please try again.');
	  }
	};
  
	const addPage = () => {
	  const newPage: PDFPage = {
		id: crypto.randomUUID(),
		elements: []
	  };
	  
	  setDocument(prev => ({
		...prev,
		pages: [...prev.pages, newPage],
		currentPage: prev.pages.length // Set current page to the new page (0-based index)
	  }));
	  
	  setSelectedElement(null);
	  toast.success('New page added');
	};
  
	const changePage = (pageIndex: number) => {
	  if (pageIndex >= 0 && pageIndex < document.pages.length) {
		setDocument(prev => ({
		  ...prev,
		  currentPage: pageIndex
		}));
		setSelectedElement(null);
	  }
	};
  
	const deletePage = (pageIndex: number) => {
	  if (document.pages.length <= 1) {
		toast.error('Cannot delete the only page');
		return;
	  }
	  
	  setDocument(prev => {
		const newPages = prev.pages.filter((_, index) => index !== pageIndex);
		const newCurrentPage = prev.currentPage >= newPages.length 
		  ? newPages.length - 1 
		  : prev.currentPage;
		
		return {
		  ...prev,
		  pages: newPages,
		  currentPage: newCurrentPage
		};
	  });
	  
	  setSelectedElement(null);
	  toast.success('Page deleted');
	};
  
	const addElement = (element: PDFElement) => {
	  if (element.type === 'text') {
		(element as TextElement).color = document.defaultTextColor;
		(element as TextElement).fontFamily = document.defaultFontFamily;
		(element as TextElement).fontSize = document.defaultFontSize;
	  }
	  
	  setDocument(prev => {
		const updatedPages = [...prev.pages];
		updatedPages[prev.currentPage] = {
		  ...updatedPages[prev.currentPage],
		  elements: [...updatedPages[prev.currentPage].elements, element]
		};
		
		return {
		  ...prev,
		  pages: updatedPages
		};
	  });
	  
	  setSelectedElement(element.id);
	};
  
	const updateElement = (element: PDFElement) => {
	  setDocument(prev => {
		const updatedPages = [...prev.pages];
		updatedPages[prev.currentPage] = {
		  ...updatedPages[prev.currentPage],
		  elements: updatedPages[prev.currentPage].elements.map(el => 
			el.id === element.id ? element : el
		  )
		};
		
		return {
		  ...prev,
		  pages: updatedPages
		};
	  });
	};
  
	const deleteElement = (id: string) => {
	  setDocument(prev => {
		const updatedPages = [...prev.pages];
		updatedPages[prev.currentPage] = {
		  ...updatedPages[prev.currentPage],
		  elements: updatedPages[prev.currentPage].elements.filter(el => el.id !== id)
		};
		
		return {
		  ...prev,
		  pages: updatedPages
		};
	  });
	  
	  setSelectedElement(null);
	};
  
	const updateDocumentSettings = (settings: Partial<PDFDocument>) => {
	  setDocument({
		...document,
		...settings,
	  });
	};
  
	const currentPageElements = document.pages[document.currentPage].elements;
  
	return (
	  <div className="flex h-screen overflow-hidden bg-editor-background">
		<Toolbar 
		  activeTool={activeTool} 
		  onToolSelect={handleToolSelect} 
		  onSettingsToggle={() => setShowSettings(!showSettings)}
		/>
		
		<div className="flex-1 overflow-hidden flex flex-col">
		  <div className="p-4 border-b border-editor-border flex items-center justify-between">
			<h1 className="text-lg font-medium">{document.title}</h1>
			<Button onClick={handleDownload} variant="default" className="flex items-center gap-2">
			  <Download size={16} />
			  Download PDF
			</Button>
		  </div>
		  
		  <div className="flex-1 overflow-auto relative">
			<div className="flex items-center justify-center p-4 bg-gray-100 border-b border-editor-border">
			  <div className="flex items-center space-x-2">
				{document.pages.map((page, index) => (
				  <Button
					key={page.id}
					variant={document.currentPage === index ? "default" : "outline"}
					size="sm"
					onClick={() => changePage(index)}
					className="min-w-10 h-8"
				  >
					{index + 1}
				  </Button>
				))}
				<Button
				  variant="outline"
				  size="sm"
				  onClick={addPage}
				  className="h-8"
				>
				  <Plus size={16} />
				</Button>
				{document.pages.length > 1 && (
				  <Button
					variant="outline"
					size="sm"
					onClick={() => deletePage(document.currentPage)}
					className="text-red-500 hover:text-red-700 h-8"
				  >
					Delete
				  </Button>
				)}
			  </div>
			</div>
			
			<Canvas 
			  document={document}
			  activeTool={activeTool}
			  selectedElement={selectedElement}
			  onSelectElement={setSelectedElement}
			  onAddElement={addElement}
			  onUpdateElement={updateElement}
			  onDeleteElement={deleteElement}
			/>
		  </div>
		</div>
		
		{showSettings && (
		  <PdfSettings
			document={document}
			onUpdate={updateDocumentSettings}
			onClose={() => setShowSettings(false)}
		  />
		)}
	  </div>
	);
  };

export default PDFEditor;
