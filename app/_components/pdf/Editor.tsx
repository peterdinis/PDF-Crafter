"use client";

import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdfUtils";
import type { PDFDocument, PDFElement, TextElement, Tool } from "@/types";
import { Download } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { Canvas } from "../canvas/Canvas";
import { DocumentSettings } from "../documents/DocumentSettings";
import { Toolbar } from "../editor/Toolbar";

const Editor: FC = () => {
	const [document, setDocument] = useState<PDFDocument>({
		title: "Untitled Document",
		pageSize: "a4",
		orientation: "portrait",
		defaultTextColor: "#000000",
		defaultFontFamily: "Arial",
		defaultFontSize: 16,
		elements: [],
	});
	const [activeTool, setActiveTool] = useState<Tool>("select");
	const [selectedElement, setSelectedElement] = useState<string | null>(null);
	const [showSettings, setShowSettings] = useState(false);

	const handleToolSelect = (tool: Tool) => {
		setActiveTool(tool);
	};

	const handleDownload = async () => {
		try {
			await generatePDF(document);
			toast.success("PDF downloaded successfully!");
		} catch (error) {
			console.error("Failed to download PDF:", error);
			toast.error("Failed to download PDF. Please try again.");
		}
	};

	const addElement = (element: PDFElement) => {
		if (element.type === "text") {
			(element as TextElement).color = document.defaultTextColor;
			(element as TextElement).fontFamily = document.defaultFontFamily;
			(element as TextElement).fontSize = document.defaultFontSize;
		}

		setDocument({
			...document,
			elements: [...document.elements, element],
		});
		setSelectedElement(element.id);
	};

	const updateElement = (element: PDFElement) => {
		setDocument({
			...document,
			elements: document.elements.map((el) =>
				el.id === element.id ? element : el,
			),
		});
	};

	const deleteElement = (id: string) => {
		setDocument({
			...document,
			elements: document.elements.filter((el) => el.id !== id),
		});
		setSelectedElement(null);
	};

	const updateDocumentSettings = (settings: Partial<PDFDocument>) => {
		setDocument({
			...document,
			...settings,
		});
	};

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
					<Button
						onClick={handleDownload}
						variant="default"
						className="flex items-center gap-2"
					>
						<Download size={16} />
						Download PDF
					</Button>
				</div>

				<div className="flex-1 overflow-auto">
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
				<DocumentSettings
					document={document}
					onUpdate={updateDocumentSettings}
					onClose={() => setShowSettings(false)}
				/>
			)}
		</div>
	);
};

export default Editor;
