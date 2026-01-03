"use client";

import { cn } from "@/lib/utils";
import type {
	ChartElement,
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types/global";
import { Trash2 } from "lucide-react";
import {
	type DragEvent,
	type FC,
	type MouseEvent,
	type ReactNode,
	type RefObject,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface DragDropAreaProps {
	canvasRef: RefObject<HTMLDivElement>;
	canvasDimensions: { width: number; height: number };
	onCanvasClick: (e: MouseEvent) => void;
	onMouseDown?: (e: MouseEvent) => void;
	activeTool: Tool;
	onAddElement: (element: PDFElement) => void;
	onDeleteElement?: (id: string) => void; // Pridané
	selectedElement?: string | null; // Pridané
	children: ReactNode;
	isEditing: boolean;
}

export const DragDropArea: FC<DragDropAreaProps> = ({
	canvasRef,
	canvasDimensions,
	onCanvasClick,
	onMouseDown,
	activeTool,
	onAddElement,
	onDeleteElement, // Pridané
	selectedElement, // Pridané
	children,
	isEditing,
}) => {
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setIsDraggingOver(true);
	};

	const handleDragLeave = () => {
		setIsDraggingOver(false);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDraggingOver(false);

		if (!canvasRef.current || isEditing) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const data = e.dataTransfer.getData("application/json");
		if (data) {
			try {
				const elementData = JSON.parse(data);
				const id = uuidv4();
				switch (elementData.type) {
					case "text":
						onAddElement({
							id,
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
						} as TextElement);
						break;
					case "shape":
						onAddElement({
							id,
							type: "shape",
							shapeType: elementData.shapeType || "rectangle",
							x,
							y,
							width: 100,
							height: 80,
							fill: "#e5e7eb",
							stroke: "#9ca3af",
							strokeWidth: 1,
						} as ShapeElement);
						break;
					case "table":
						onAddElement({
							id,
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
						} as TableElement);
						break;
					case "chart":
						onAddElement({
							id,
							type: "chart",
							chartType: elementData.chartType || "bar",
							x,
							y,
							width: 400,
							height: 300,
							data: [
								{ label: "Jan", value: 45 },
								{ label: "Feb", value: 52 },
								{ label: "Mar", value: 38 },
								{ label: "Apr", value: 65 },
								{ label: "May", value: 48 },
							],
							title: "Sample Chart",
							showGrid: true,
							showAxes: true,
							axesColor: "#9ca3af",
							gridColor: "#e5e7eb",
							seriesColors: [
								"#3b82f6",
								"#10b981",
								"#f59e0b",
								"#ef4444",
								"#8b5cf6",
							],
						} as ChartElement);
						break;
				}
				toast.success("Element dropped");
			} catch (error) {
				console.error("Error parsing dropped data:", error);
			}
		}
	};

	const handleClick = (e: MouseEvent) => {
		if (activeTool !== "pencil") {
			onCanvasClick(e);
		}
	};

	return (
		<div
			ref={canvasRef}
			className={cn(
				"pdf-page relative transition-colors duration-200",
				isDraggingOver &&
					!isEditing &&
					"bg-editor-primary/5 ring-4 ring-inset ring-editor-primary/20",
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
