"use client";

import type {
	PDFElement,
	PencilDrawingElement,
	ShapeElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types/global";
import Image from "next/image";
import type { FC, MouseEvent } from "react";
import { TextEditor } from "../editor/TextEditor";
import { PencilTool } from "../tools/PencilTool";
import { ShapeTool } from "../tools/ShapeTool";
import { TableTool } from "../tools/TableTool";

interface CanvasElementProps {
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: PDFElement) => void;
	onDelete?: (id: string) => void; // Nový prop pre mazanie
	onContextMenu?: (e: MouseEvent, elementId: string) => void; // Nový prop pre kontextové menu
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
	// Spoločná funkcia pre mazanie elementu
	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(element.id);
		}
	};

	// Spoločná funkcia pre kontextové menu
	const handleContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onContextMenu) {
			onContextMenu(e, element.id);
		}
	};

	// Trash ikonky sú teraz len v PropertiesPanel, nie na canvas

	// Spoločné props pre všetky elementy
	const commonProps = {
		isSelected,
		onMouseDown,
		onContextMenu: handleContextMenu,
		onDeleteClick: handleDelete, // Zmenené meno na onDeleteClick, aby sa neplietlo s onDelete
	};

	switch (element.type) {
		case "text":
			return (
				<div className="relative" style={{
					position: 'absolute',
					left: `${element.x}px`,
					top: `${element.y}px`,
				}}>
					<TextEditor
						element={element as TextElement}
						{...commonProps}
						onUpdate={onUpdate}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
						onDelete={(id) => onDelete && onDelete(id)} // TextEditor očakáva onDelete(id: string)
					/>
				</div>
			);
		case "image":
			return (
				<div className="relative" style={{
					position: 'absolute',
					left: `${element.x}px`,
					top: `${element.y}px`,
				}}>
					<ImageElement
						element={element}
						{...commonProps}
					/>
				</div>
			);
		case "shape":
			return (
				<div className="relative" style={{
					position: 'absolute',
					left: `${element.x}px`,
					top: `${element.y}px`,
				}}>
					<ShapeTool
						element={element as ShapeElement}
						{...commonProps}
						onUpdate={onUpdate}
					/>
				</div>
			);
		case "table":
			return (
				<div className="relative" style={{
					position: 'absolute',
					left: `${element.x}px`,
					top: `${element.y}px`,
				}}>
					<TableTool
						element={element as TableElement}
						{...commonProps}
						onUpdate={onUpdate}
					/>
				</div>
			);
		case "pencil":
			return (
				<div className="relative" style={{
					position: 'absolute',
					left: `${element.x}px`,
					top: `${element.y}px`,
				}}>
					<PencilTool
						element={element as PencilDrawingElement}
						{...commonProps}
					/>
				</div>
			);
		default:
			return null;
	}
};

const ImageElement: FC<{
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void; // Zmenené meno na onDeleteClick
}> = ({ element, isSelected, onMouseDown, onContextMenu, onDeleteClick }) => {
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
			onContextMenu={onContextMenu}
		>
			<Image
				src={element.src}
				alt="PDF element"
				className="w-full h-full object-contain"
				width={element.width}
				height={element.height}
			/>
		</div>
	);
};