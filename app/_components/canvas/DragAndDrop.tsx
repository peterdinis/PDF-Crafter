"use client";

import { cn } from "@/lib/utils";
import type {
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
	ChartElement,
	Tool,
} from "@/types/global";
import {
	type DragEvent,
	type FC,
	type MouseEvent,
	type ReactNode,
	type RefObject,
	useState,
	useEffect,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Trash2 } from "lucide-react";

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
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		elementId: string | null;
	} | null>(null);

	// Pridať event listener pre kontextové menu
	const handleContextMenu = (e: MouseEvent, elementId?: string) => {
		e.preventDefault();

		if (elementId && onDeleteElement) {
			setContextMenu({
				x: e.clientX,
				y: e.clientY,
				elementId,
			});
		}
	};

	// Zatvoriť kontextové menu po kliknutí inde
	useEffect(() => {
		const handleClickOutside = () => {
			setContextMenu(null);
		};

		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	}, []);

	// Klávesové skratky
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && onDeleteElement) {
				e.preventDefault();
				onDeleteElement(selectedElement);
				toast.success("Element deleted");
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedElement, onDeleteElement]);

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
					case "chart":
						const newChart: ChartElement = {
							id: uuidv4(),
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
							seriesColors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
						};
						onAddElement(newChart);
						break;
				}
				toast.success("Element dropped");
			} catch (error) {
				console.error("Error parsing dropped data:", error);
			}
		}
	};

	const handleClick = (e: MouseEvent) => {
		// Zatvoriť kontextové menu
		if (contextMenu) {
			setContextMenu(null);
		}

		if (activeTool !== "pencil") {
			onCanvasClick(e);
		}
	};

	// Funkcia pre mazanie elementu
	const handleDeleteElement = (elementId: string) => {
		if (onDeleteElement) {
			onDeleteElement(elementId);
			setContextMenu(null);
			toast.success("Element deleted");
		}
	};

	return (
		<>
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
				{/* Tu budú deti (elementy) renderované */}
				{children}

				{/* Pridať tlačidlo na mazanie k vybranému elementu */}
				{selectedElement && onDeleteElement && (
					<div className="absolute z-50">
						{/* Môžete tu pridať vizuálne tlačidlo pre mazanie */}
					</div>
				)}
			</div>

			{/* Kontextové menu */}
			{contextMenu && (
				<div
					className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 min-w-[160px]"
					style={{
						left: contextMenu.x,
						top: contextMenu.y,
					}}
				>
					<button
						onClick={() => contextMenu.elementId && handleDeleteElement(contextMenu.elementId)}
						className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400 flex items-center gap-2"
					>
						<Trash2 size={16} />
						Delete Element
					</button>
					<div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
					<div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
						Or press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Delete</kbd>
					</div>
				</div>
			)}
		</>
	);
};