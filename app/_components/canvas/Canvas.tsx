"use client";

import type { PDFDocument, PDFElement, Tool } from "@/types";
import { FC, useState } from "react";
import { ImageUploader } from "../shared/ImageUploader";
import { PencilColorPicker } from "../shared/PencilColorPicker";
import { CanvasContainer } from "./CanvasContainer";
import { useCanvasKeyboardHandler } from "./CanvasKeyboardHandler";

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
	const [pencilColor, setPencilColor] = useState("#000000");
	const [pencilStrokeWidth, setPencilStrokeWidth] = useState(2);
	const [currentDrawingId, setCurrentDrawingId] = useState<string | null>(null);

	// Set up keyboard handlers (Delete key for removing elements)
	useCanvasKeyboardHandler({
		selectedElement,
		onDeleteElement,
		isEditing,
	});

	// Get the current page elements
	const currentPageElements =
		document.pages[document.currentPage]?.elements || [];

	return (
		<div className="flex-1 overflow-auto p-8">
			<CanvasContainer
				document={document}
				activeTool={activeTool}
				selectedElement={selectedElement}
				onSelectElement={(id) => {
					// Only change selection if we're not currently editing
					if (!isEditing || id === null) {
						onSelectElement(id);
						setCurrentDrawingId(null);
					}
				}}
				onAddElement={onAddElement}
				onUpdateElement={onUpdateElement}
				onDeleteElement={onDeleteElement}
				isEditing={isEditing}
				setIsEditing={setIsEditing}
				pageElements={currentPageElements}
				pencilColor={pencilColor}
				pencilStrokeWidth={pencilStrokeWidth}
				currentDrawingId={currentDrawingId}
				setCurrentDrawingId={setCurrentDrawingId}
			/>

			{activeTool === "image" && !isEditing && (
				<ImageUploader
					onUpload={(src) => {
						// Calculate center position for new image based on a default canvas size
						// This is an approximation since we don't have direct access to canvas dimensions here
						const centerX = 595 / 2 - 100; // Using A4 default width
						const centerY = 842 / 2 - 100; // Using A4 default height

						onAddElement({
							id: crypto.randomUUID(),
							type: "image",
							src,
							x: centerX,
							y: centerY,
							width: 200,
							height: 200,
						});
					}}
				/>
			)}

			{activeTool === "pencil" && !isEditing && (
				<PencilColorPicker
					color={pencilColor}
					strokeWidth={pencilStrokeWidth}
					onColorChange={setPencilColor}
					onStrokeWidthChange={setPencilStrokeWidth}
				/>
			)}
		</div>
	);
};
