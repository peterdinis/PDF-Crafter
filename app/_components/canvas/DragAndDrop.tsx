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
				if (elementData.type === "text") {
					let fontSize = 16;
					let fontWeight = "normal";
					let fontStyle = "normal";
					let content = elementData.content || "Dropped text";

					if (elementData.tool === "text_h1") {
						fontSize = 32;
						fontWeight = "bold";
						content = "Heading 1";
					} else if (elementData.tool === "text_h2") {
						fontSize = 24;
						fontWeight = "bold";
						content = "Heading 2";
					} else if (elementData.tool === "text_h3") {
						fontSize = 20;
						fontWeight = "bold";
						content = "Heading 3";
					} else if (elementData.tool === "text_bold") {
						fontWeight = "bold";
						content = "Bold text";
					} else if (elementData.tool === "text_italic") {
						fontStyle = "italic";
						content = "Italic text";
					} else if (elementData.tool === "text_paragraph") {
						content =
							"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
					}

					onAddElement({
						id,
						type: "text",
						content,
						x,
						y,
						fontSize,
						fontFamily: "Arial",
						fontWeight,
						fontStyle,
						color: "#000000",
						width: 200,
						height: fontSize * 1.5,
						style: "normal",
					} as TextElement);
				} else if (elementData.type === "shape") {
					onAddElement({
						id,
						type: "shape",
						shapeType: elementData.shapeType || "rectangle",
						x,
						y,
						width: 100,
						height: 80,
						fillColor: "#e5e7eb",
						strokeColor: "#9ca3af",
						strokeWidth: 1,
					} as ShapeElement);
				} else if (elementData.type === "table") {
					const isEmpty = elementData.tool === "table_empty";
					onAddElement({
						id,
						type: "table",
						tableStyle: isEmpty ? "simple" : elementData.tableStyle || "simple",
						style: isEmpty ? "simple" : elementData.tableStyle || "simple",
						x,
						y,
						width: 300,
						height: isEmpty ? 100 : 200,
						columns: 2,
						rows: 2,
						headerType: isEmpty ? "none" : "simple",
						data: isEmpty
							? {
								headers: ["", ""],
								rows: [["", ""]],
							}
							: {
								headers: ["Header 1", "Header 2"],
								rows: [["Data 1", "Data 2"]],
							},
					} as TableElement);
				} else if (elementData.type === "chart") {
					onAddElement({
						id,
						type: "chart",
						chartType: elementData.chartType || "bar",
						x,
						y,
						width: 400,
						height: 300,
						data: {
							labels: ["Jan", "Feb", "Mar", "Apr", "May"],
							datasets: [
								{
									label: "Sales",
									data: [45, 52, 38, 65, 48],
									backgroundColor: "#3b82f6",
								},
							],
						},
						title: "Sample Chart",
						showGrid: true,
						showLegend: true,
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
				} else if (elementData.type === "image") {
					// Placeholder for image - in real app would trigger upload or use placeholder
					onAddElement({
						id,
						type: "image",
						src: "/placeholder-image.png", // Ensure this exists or use base64 placeholder
						alt: "Placeholder Image",
						x,
						y,
						width: 200,
						height: 200,
					} as any);
				} else if (elementData.type === "form") {
					onAddElement({
						id,
						type: "form",
						formType: elementData.formType || "text",
						label: "Form Label",
						placeholder: "Placeholder...",
						x,
						y,
						width: 200,
						height: 60,
						required: false,
					} as any);
				} else if (elementData.type === "code") {
					onAddElement({
						id,
						type: "code",
						codeType: elementData.codeType || "block",
						content: '// Your code here\nconsole.log("Hello World");',
						language: "javascript",
						x,
						y,
						width: 300,
						height: 150,
					} as any);
				} else if (elementData.type === "qrcode") {
					onAddElement({
						id,
						type: "qrcode",
						content: "https://example.com",
						color: "#000000",
						backgroundColor: "#ffffff",
						x,
						y,
						width: 100,
						height: 100,
					} as any);
				} else if (elementData.type === "barcode") {
					onAddElement({
						id,
						type: "barcode",
						value: "1234567890",
						format: "CODE128",
						color: "#000000",
						backgroundColor: "#ffffff",
						x,
						y,
						width: 200,
						height: 80,
					} as any);
				} else if (elementData.type === "signature") {
					onAddElement({
						id,
						type: "signature",
						penColor: "#000000",
						penWidth: 2,
						x,
						y,
						width: 200,
						height: 100,
					} as any);
				} else if (elementData.type === "divider") {
					onAddElement({
						id,
						type: "divider",
						style: "solid",
						color: "#000000",
						thickness: 2,
						x,
						y,
						width: 300,
						height: 20,
					} as any);
				}
				toast.success("Element dropped");
			} catch (error) {
				console.error("Error parsing dropped data:", error);
				toast.error("Failed to drop element");
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
