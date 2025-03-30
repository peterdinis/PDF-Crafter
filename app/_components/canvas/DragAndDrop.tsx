"use client";

import { logger } from "@/lib/pino";
import { cn } from "@/lib/utils";
import type {
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types";
import type React from "react";
import { type RefObject, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface DragDropAreaProps {
	canvasRef: RefObject<HTMLDivElement>;
	canvasDimensions: { width: number; height: number };
	onCanvasClick: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
	activeTool: Tool;
	onAddElement: (element: PDFElement) => void;
	children: React.ReactNode;
	isEditing: boolean;
}

export const DragDropArea: React.FC<DragDropAreaProps> = ({
	canvasRef,
	canvasDimensions,
	onCanvasClick,
	onMouseDown,
	activeTool,
	onAddElement,
	children,
	isEditing,
}) => {
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDraggingOver(true);
	};

	const handleDragLeave = () => {
		setIsDraggingOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDraggingOver(false);

		if (!canvasRef.current || isEditing) return;

		// Get drop position relative to canvas
		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Handle element data from drag operation
		const data = e.dataTransfer.getData("application/json");
		if (data) {
			try {
				const elementData = JSON.parse(data);
				switch (elementData.type) {
					case "text":
						const newText: TextElement = {
							id: uuidv4(),
							type: "text",
							content: elementData.content || "Dropped text",
							x,
							y,
							fontSize: 16,
							fontFamily: "Arial",
							fontWeight: "normal",
							fontStyle: "normal",
							color: "#000000",
							width: 200,
							height: 30,
						};
						onAddElement(newText);
						break;
					case "shape":
						const newShape: ShapeElement = {
							id: uuidv4(),
							type: "shape",
							shapeType: elementData.shapeType || "rectangle",
							x,
							y,
							width: 100,
							height: 80,
							fill: "#e5e7eb",
							stroke: "#9ca3af",
							strokeWidth: 1,
						};
						onAddElement(newShape);
						break;
					case "table":
						const newTable: TableElement = {
							id: uuidv4(),
							type: "table",
							tableStyle: elementData.tableStyle || "simple",
							x,
							y,
							width: 300,
							height: 200,
							columns: elementData.columns || 3,
							rows: elementData.rows || 4,
							headerType: elementData.headerType || "simple",
							data: elementData.data || [
								["Header 1", "Header 2", "Header 3"],
								["Data 1", "Data 2", "Data 3"],
								["Data 4", "Data 5", "Data 6"],
								["Data 7", "Data 8", "Data 9"],
							],
						};
						onAddElement(newTable);
						break;
				}
				toast.success("Element dropped");
			} catch (error) {
				logger.fatal("Error parsing dropped data:", error)
			}
		}
	};

	const handleClick = (e: React.MouseEvent) => {
		if (activeTool !== "pencil") {
			onCanvasClick(e);
		}
	};

	return (
		<div
			ref={canvasRef}
			className={cn(
				"pdf-page relative",
				isDraggingOver &&
					!isEditing &&
					"bg-editor-primary/10 border-2 border-dashed border-editor-primary",
				activeTool === "pencil" && !isEditing && "cursor-crosshair",
			)}
			style={{
				width: `${canvasDimensions.width}px`,
				height: `${canvasDimensions.height}px`,
			}}
			onClick={handleClick}
			onMouseDown={onMouseDown}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{children}
		</div>
	);
};
