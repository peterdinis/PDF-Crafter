"use client";

import type { PDFDocument, PDFElement, Tool } from "@/types";
import { type FC, useState } from "react";
import { ImageUploader } from "../shared/ImageUploader";
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

			{activeTool === "image" && !isEditing && (
				<ImageUploader
					onUpload={(src) => {
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
		</div>
	);
};
