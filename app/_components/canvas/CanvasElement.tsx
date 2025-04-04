"use client";

import type {
	PDFElement,
	PencilDrawingElement,
	ShapeElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types/types";
import type { FC, MouseEvent } from "react";
import { TextEditor } from "../editor/TextEditor";
import { PencilTool } from "../tools/PencilTool";
import { ShapeTool } from "../tools/ShapeTool";
import { TableTool } from "../tools/TableTool";
import Image from "next/image";

interface CanvasElementProps {
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: PDFElement) => void;
	activeTool: Tool;
	onAddElement: (element: PDFElement) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export const CanvasElement: FC<CanvasElementProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
	isEditing,
	setIsEditing,
}) => {
	switch (element.type) {
		case "text":
			return (
				<TextEditor
					element={element as TextElement}
					isSelected={isSelected}
					onMouseDown={onMouseDown}
					onUpdate={onUpdate}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
				/>
			);
		case "image":
			return (
				<ImageElement
					element={element}
					isSelected={isSelected}
					onMouseDown={onMouseDown}
				/>
			);
		case "shape":
			return (
				<ShapeTool
					element={element as ShapeElement}
					isSelected={isSelected}
					onMouseDown={onMouseDown}
					onUpdate={onUpdate}
				/>
			);
		case "table":
			return (
				<TableTool
					element={element as TableElement}
					isSelected={isSelected}
					onMouseDown={onMouseDown}
					onUpdate={onUpdate}
				/>
			);
		case "pencil":
			return (
				<PencilTool
					element={element as PencilDrawingElement}
					isSelected={isSelected}
					onMouseDown={onMouseDown}
				/>
			);
		default:
			return null;
	}
};

const ImageElement: FC<{
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown }) => {
	if (element.type !== "image") return null;

	return (
		<div
			className={`absolute cursor-move ${isSelected ? "ring-2 ring-editor-primary ring-offset-2" : ""}`}
			style={{
				left: `${element.x}px`,
				top: `${element.y}px`,
				width: `${element.width}px`,
				height: `${element.height}px`,
			}}
			onMouseDown={onMouseDown}
		>
			<Image
				src={element.src}
				alt="PDF element"
				className="w-full h-full object-contain"
			/>
		</div>
	);
};
