"use client";

import type {
	PDFDocument,
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types/global";
import {
	type FC,
	type MouseEvent,
	type RefObject,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { CanvasElement } from "./CanvasElement";
import { DragDropArea } from "./DragAndDrop";
import { Trash2 } from "lucide-react";

interface CanvasContainerProps {
	document: any;
	activeTool: Tool;
	selectedElement: string | null;
	onSelectElement: (id: string | null) => void;
	onAddElement: (element: PDFElement) => void;
	onUpdateElement: (element: PDFElement) => void;
	onDeleteElement: (id: string) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	pageElements: PDFElement[];
	pencilColor?: string;
	pencilStrokeWidth?: number;
	currentDrawingId: string | null;
	setCurrentDrawingId: (id: string | null) => void;
}

const paperSizesPoints: Record<string, { width: number; height: number }> = {
	a3: { width: 842, height: 1191 },
	a4: { width: 595, height: 842 },
	a5: { width: 420, height: 595 },
	letter: { width: 612, height: 792 },
	legal: { width: 612, height: 1008 },
	tabloid: { width: 792, height: 1224 },
	executive: { width: 522, height: 756 },
	b5: { width: 499, height: 709 },
	b4: { width: 709, height: 1002 },
	jisb4: { width: 729, height: 1032 },
	jisb5: { width: 516, height: 729 },
};

export const CanvasContainer: FC<CanvasContainerProps> = ({
	document: pdfDocument, // Renamed to avoid conflict with global document
	activeTool,
	selectedElement,
	onSelectElement,
	onAddElement,
	onUpdateElement,
	onDeleteElement,
	isEditing,
	setIsEditing,
	pageElements,
	pencilColor = "#000000",
	pencilStrokeWidth = 2,
	currentDrawingId,
	setCurrentDrawingId,
}) => {
	const canvasRef = useRef<HTMLDivElement>(null);
	const [canvasDimensions, setCanvasDimensions] = useState({
		width: 595,
		height: 842,
	});
	const [draggedElement, setDraggedElement] = useState<{
		id: string;
		startX: number;
		startY: number;
		offsetX: number;
		offsetY: number;
	} | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		elementId: string;
	} | null>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let width: number;
		let height: number;

		if (
			pdfDocument.pageSize === "custom" &&
			pdfDocument.customWidth &&
			pdfDocument.customHeight
		) {
			width = Math.round(pdfDocument.customWidth * 2.83465);
			height = Math.round(pdfDocument.customHeight * 2.83465);
		} else {
			const sizeKey = pdfDocument.pageSize;
			const defaultSize = { width: 595, height: 842 };
			const size = paperSizesPoints[sizeKey] || defaultSize;

			width = size.width;
			height = size.height;
		}

		if (pdfDocument.orientation === "landscape") {
			[width, height] = [height, width];
		}

		setCanvasDimensions({ width, height });
	}, [
		pdfDocument.pageSize,
		pdfDocument.orientation,
		pdfDocument.customWidth,
		pdfDocument.customHeight,
	]);

	// Klávesové skratky pre mazanie
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Delete alebo Backspace pre mazanie vybraného elementu
			if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !isEditing) {
				e.preventDefault();
				handleDeleteElement(selectedElement);
			}

			// Escape pre zatvorenie kontextového menu alebo zrušenie výberu
			if (e.key === 'Escape') {
				if (contextMenu) {
					setContextMenu(null);
				} else {
					onSelectElement(null);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedElement, isEditing, contextMenu, onSelectElement]);

	// Zatvoriť kontextové menu po kliknutí inde
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleClickOutside = (event: globalThis.MouseEvent) => {
			if (contextMenu && contextMenuRef.current &&
				!contextMenuRef.current.contains(event.target as Node)) {
				setContextMenu(null);
			}
		};

		// Use global document object explicitly
		globalThis.document.addEventListener('mousedown', handleClickOutside);
		return () => globalThis.document.removeEventListener('mousedown', handleClickOutside);
	}, [contextMenu]);

	const handleDeleteElement = useCallback((elementId: string) => {
		onDeleteElement(elementId);
		if (selectedElement === elementId) {
			onSelectElement(null);
		}
		setContextMenu(null);
		toast.success("Element deleted");
	}, [onDeleteElement, onSelectElement, selectedElement]);

	const handleCanvasClick = (e: MouseEvent) => {
		// Zatvoriť kontextové menu pri kliknutí na canvas
		if (contextMenu) {
			setContextMenu(null);
			return;
		}

		if (!canvasRef.current || isEditing) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (activeTool === "text") {
			const newText: TextElement = {
				id: uuidv4(),
				type: "text",
				content: "Click to edit text",
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
		} else if (activeTool === "shape_rectangle") {
			const newShape: ShapeElement = {
				id: uuidv4(),
				type: "shape",
				shapeType: "rectangle",
				x,
				y,
				width: 100,
				height: 80,
				fill: "#e5e7eb",
				stroke: "#9ca3af",
				strokeWidth: 1,
				rotation: 0,
			};
			onAddElement(newShape);
		} else if (activeTool === "shape_circle") {
			const newShape: ShapeElement = {
				id: uuidv4(),
				type: "shape",
				shapeType: "circle",
				x,
				y,
				width: 80,
				height: 80,
				fill: "#e5e7eb",
				stroke: "#9ca3af",
				strokeWidth: 1,
				rotation: 0,
			};
			onAddElement(newShape);
		} else if (activeTool === "shape_line") {
			const newShape: ShapeElement = {
				id: uuidv4(),
				type: "shape",
				shapeType: "line",
				x,
				y,
				width: 100,
				height: 0,
				fill: "transparent",
				stroke: "#9ca3af",
				strokeWidth: 2,
				rotation: 0,
			};
			onAddElement(newShape);
		} else if (activeTool.startsWith("table_")) {
			const tableStyle = activeTool.replace("table_", "") as
				| "simple"
				| "striped"
				| "bordered";
			const newTable: TableElement = {
				id: uuidv4(),
				type: "table",
				tableStyle,
				x,
				y,
				width: 300,
				height: 200,
				columns: 3,
				rows: 4,
				headerType: "simple",
				data: [
					["Header 1", "Header 2", "Header 3"],
					["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
					["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
					["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
				],
			};
			onAddElement(newTable);
		} else if (activeTool.startsWith("chart_")) {
			const chartType = activeTool.replace("chart_", "") as
				| "bar"
				| "line"
				| "pie";
			const newChart: any = {
				id: uuidv4(),
				type: "chart",
				chartType,
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
		} else if (activeTool === "select") {
			onSelectElement(null);
			setIsEditing(false);
		}
	};

	const handleElementMouseDown = (e: MouseEvent, element: PDFElement) => {
		e.stopPropagation();

		// Vyberieme element bez ohľadu na aktívny nástroj, ak sme klikli priamo naň
		onSelectElement(element.id);

		// Umožníme dragging aj keď nie sme v "select" móde, 
		// ale len ak nie sme v móde kreslenia (pencil) alebo editovania textu
		if (!isEditing && activeTool !== "pencil") {
			const rect = canvasRef.current?.getBoundingClientRect();
			if (rect) {
				let offsetX = 0;
				let offsetY = 0;

				if (element.type !== "pencil") {
					offsetX = e.clientX - rect.left - element.x;
					offsetY = e.clientY - rect.top - element.y;
				}

				setDraggedElement({
					id: element.id,
					startX: e.clientX,
					startY: e.clientY,
					offsetX,
					offsetY,
				});
			}
		}
	};

	// Pravý klik na element - kontextové menu
	const handleElementContextMenu = (e: MouseEvent, element: PDFElement) => {
		e.preventDefault();
		e.stopPropagation();

		onSelectElement(element.id);
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			elementId: element.id,
		});
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (activeTool !== "pencil" || !canvasRef.current || isEditing) return;

		e.preventDefault();
		setIsDrawing(true);

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const newDrawingId = uuidv4();
		const newDrawing: any = {
			id: newDrawingId,
			type: "pencil",
			points: [{ x, y }],
			color: pencilColor,
			strokeWidth: pencilStrokeWidth,
			x: 0,
			y: 0,
		};

		onAddElement(newDrawing);
		setCurrentDrawingId(newDrawingId);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!canvasRef.current || isEditing) return;

		if (draggedElement) {
			const rect = canvasRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left - draggedElement.offsetX;
			const y = e.clientY - rect.top - draggedElement.offsetY;

			const element = pageElements.find((el) => el.id === draggedElement.id);
			if (element) {
				if (element.type === "pencil") {
					return;
				}

				onUpdateElement({
					...element,
					x,
					y,
				});
			}
		} else if (isDrawing && currentDrawingId && activeTool === "pencil") {
			const rect = canvasRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const drawing = pageElements.find((el) => el.id === currentDrawingId) as
				| any
				| undefined;
			if (drawing && drawing.type === "pencil") {
				onUpdateElement({
					...drawing,
					points: [...drawing.points, { x, y }],
				});
			}
		}
	};

	const handleMouseUp = () => {
		if (isDrawing && activeTool === "pencil") {
			setIsDrawing(false);
			toast.success("Drawing added");
		} else if (draggedElement && !isEditing) {
			toast.success("Element moved");
			setDraggedElement(null);
		}
	};

	return (
		<>
			<div
				className="flex justify-center overflow-auto bg-gray-200 dark:bg-gray-800 h-full relative"
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<DragDropArea
					canvasRef={canvasRef as unknown as RefObject<HTMLDivElement>}
					canvasDimensions={canvasDimensions}
					onCanvasClick={handleCanvasClick}
					onMouseDown={handleMouseDown}
					activeTool={activeTool}
					onAddElement={onAddElement}
					onDeleteElement={onDeleteElement}
					selectedElement={selectedElement}
					isEditing={isEditing}
				>
					{pageElements.map((element) => (
						<div
							key={element.id}
							className={`relative ${element.id === selectedElement ? 'z-10' : 'z-0'
								}`}
							style={{
								position: 'absolute',
								left: `${element.x}px`,
								top: `${element.y}px`,
								width: element.type === "pencil" ? "100%" : (element.width ? `${element.width}px` : "auto"),
								height: element.type === "pencil" ? "100%" : (element.height ? `${element.height}px` : "auto"),
								pointerEvents: activeTool === "pencil" ? "none" : "auto",
							}}
						>
							<CanvasElement
								element={element}
								isSelected={element.id === selectedElement}
								onMouseDown={(e) => {
									// If we're using pencil, we want to draw, not drag
									if (activeTool !== "pencil") {
										handleElementMouseDown(e, element);
									}
								}}
								onContextMenu={(e) => handleElementContextMenu(e, element)}
								onUpdate={onUpdateElement}
								onDelete={onDeleteElement}
								activeTool={activeTool}
								onAddElement={onAddElement}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
							/>
						</div>
					))}
				</DragDropArea>

				{/* KONTEXTOVÉ MENU - VYLEPŠENÉ */}
				{contextMenu && (
					<div
						ref={contextMenuRef}
						className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-[9999] py-1 min-w-[200px] overflow-hidden"
						style={{
							left: `${contextMenu.x}px`,
							top: `${contextMenu.y}px`,
						}}
					>
						<div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
							<p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Element Actions</p>
						</div>
						<button
							onClick={() => handleDeleteElement(contextMenu.elementId)}
							className="w-full px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors font-medium"
						>
							<Trash2 size={16} />
							<span>Delete Element</span>
						</button>
						<div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-2 px-3 pb-2 bg-gray-50 dark:bg-gray-900">
							<div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
								<span>Keyboard shortcut:</span>
								<kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Delete</kbd>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};