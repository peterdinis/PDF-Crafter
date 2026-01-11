"use client";

import { useCanvasKeyboardHandler } from "@/app/_hooks/useCanvasKeyboardHandler";
import type {
	DrawingElement,
	PDFDocument,
	PDFElement,
	ShapeElement,
	Tool,
} from "@/types/global";
import { type FC, useState } from "react";
import { PencilColorPicker } from "../shared/pickers/PencilColorPicker";
import { ImageUploader } from "../uploader/ImageUploader";
import { CanvasContainer } from "./CanvasContainer";

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
	const [shapeColor, setShapeColor] = useState("#000000");
	const [shapeFillColor] = useState("#ffffff");
	const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);
	const [tableColor, setTableColor] = useState("#000000");
	const [currentDrawingId, setCurrentDrawingId] = useState<string | null>(null);
	useCanvasKeyboardHandler({
		selectedElement,
		onDeleteElement,
		isEditing,
	});

	const currentPageElements =
		document.pages[document.currentPage]?.elements || [];

	const isShapeTool =
		activeTool === "shape_rectangle" ||
		activeTool === "shape_circle" ||
		activeTool === "shape_line";
	const isChartTool = activeTool.startsWith("chart_");
	const isTableTool =
		activeTool === "table_simple" ||
		activeTool === "table_striped" ||
		activeTool === "table_bordered";

	const getToolTitle = () => {
		if (activeTool === "pencil") return "Pencil Style";
		if (activeTool === "shape_rectangle") return "Rectangle Style";
		if (activeTool === "shape_circle") return "Circle Style";
		if (activeTool === "shape_line") return "Line Style";
		if (activeTool.startsWith("table_")) return "Table Style";
		if (activeTool.startsWith("chart_")) return "Chart Style";
		return "Drawing Style";
	};

	return (
		<div className="flex-1 overflow-auto p-8">
			<CanvasContainer
				document={document}
				activeTool={activeTool}
				selectedElement={selectedElement}
				onSelectElement={(id) => {
					if (!isEditing || id === null) {
						onSelectElement(id);
						setCurrentDrawingId(null);
					}
				}}
				onAddElement={(element) => {
					if (
						element.type === "drawing" ||
						(element as any).type === "pencil"
					) {
						const drawingEl = element as any;
						drawingEl.color = pencilColor;
						drawingEl.strokeColor = pencilColor;
						drawingEl.strokeWidth = pencilStrokeWidth;
					} else if (element.type === "shape") {
						const shapeEl = element as ShapeElement;
						shapeEl.strokeColor = shapeColor;
						shapeEl.strokeWidth = shapeStrokeWidth;
						if (shapeEl.shapeType !== "line") {
							shapeEl.fillColor = shapeFillColor;
						}
					} else if (element.type === "table") {
						element.borderColor = tableColor;
					}
					onAddElement(element);
				}}
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
						const centerX = 595 / 2 - 100;
						const centerY = 842 / 2 - 100;

						onAddElement({
							id: crypto.randomUUID(),
							type: "image",
							src,
							alt: "Uploaded image",
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
					title={getToolTitle()}
					color={pencilColor}
					strokeWidth={pencilStrokeWidth}
					onColorChange={setPencilColor}
					onStrokeWidthChange={setPencilStrokeWidth}
				/>
			)}

			{isShapeTool && !isEditing && (
				<PencilColorPicker
					title={getToolTitle()}
					color={shapeColor}
					strokeWidth={shapeStrokeWidth}
					onColorChange={setShapeColor}
					onStrokeWidthChange={setShapeStrokeWidth}
				/>
			)}

			{isTableTool && !isEditing && (
				<PencilColorPicker
					title={getToolTitle()}
					color={tableColor}
					strokeWidth={1}
					onColorChange={setTableColor}
					onStrokeWidthChange={() => {}}
				/>
			)}
		</div>
	);
};
