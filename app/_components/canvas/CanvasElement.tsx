"use client";

import type {
	PDFElement,
	PencilDrawingElement,
	ShapeElement,
	TableElement,
	TextElement,
	ChartElement,
	Tool,
} from "@/types/global";
import Image from "next/image";
import type { FC, MouseEvent } from "react";
import { TextEditor } from "../editor/TextEditor";
import { PencilTool } from "../tools/PencilTool";
import { ShapeTool } from "../tools/ShapeTool";
import { TableTool } from "../tools/TableTool";
import { ChartTool } from "../tools/ChartTool";

interface CanvasElementProps {
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: PDFElement) => void;
	onDelete?: (id: string) => void;
	onContextMenu?: (e: MouseEvent, elementId: string) => void;
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
	onDelete,
	onContextMenu,
	activeTool,
	onAddElement,
	isEditing,
	setIsEditing,
}) => {
	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(element.id);
		}
	};

	const handleContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onContextMenu) {
			onContextMenu(e, element.id);
		}
	};

	const commonProps = {
		isSelected,
		onMouseDown,
		onContextMenu: handleContextMenu,
		onDeleteClick: handleDelete,
	};

	return (
		<div
			className="w-full h-full"
			onClick={(e) => e.stopPropagation()}
		>
			{element.type === "text" && (
				<TextEditor
					element={element as TextElement}
					{...commonProps}
					onUpdate={onUpdate}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					onDelete={(id) => onDelete && onDelete(id)}
				/>
			)}
			{element.type === "image" && (
				<ImageElement
					element={element}
					{...commonProps}
				/>
			)}
			{element.type === "shape" && (
				<ShapeTool
					element={element as ShapeElement}
					{...commonProps}
					onUpdate={onUpdate}
				/>
			)}
			{element.type === "table" && (
				<TableTool
					element={element as TableElement}
					{...commonProps}
					onUpdate={onUpdate}
				/>
			)}
			{element.type === "pencil" && (
				<PencilTool
					element={element as PencilDrawingElement}
					{...commonProps}
				/>
			)}
			{element.type === "chart" && (
				<ChartTool
					element={element as ChartElement}
					{...commonProps}
				/>
			)}
		</div>
	);
}

const ImageElement: FC<{
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu, onDeleteClick }) => {
	if (element.type !== "image") return null;

	return (
		<div
			className={`cursor-move ${isSelected ? "ring-2 ring-editor-primary ring-offset-2" : ""}`}
			style={{
				width: `${element.width}px`,
				height: `${element.height}px`,
			}}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<Image
				src={element.src}
				alt="PDF element"
				className="w-full h-full object-contain"
				width={element.width || 200}
				height={element.height || 200}
			/>
		</div>
	);
};