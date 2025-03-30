"use client";

import { cn } from "@/lib/utils";
import type { ShapeElement } from "@/types";
import { type FC, type MouseEvent, useState } from "react";
import { ColorPicker } from "../shared/ColorPicker";

interface ShapeToolProps {
	element: ShapeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: ShapeElement) => void;
}

export const ShapeTool: FC<ShapeToolProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
}) => {
	const [showColorPickers, setShowColorPickers] = useState(false);

	const renderShape = () => {
		const { shapeType, fill, stroke, strokeWidth } = element;

		if (shapeType === "rectangle") {
			return (
				<div
					className="w-full h-full"
					style={{
						backgroundColor: fill,
						border: `${strokeWidth}px solid ${stroke}`,
					}}
				/>
			);
		} else if (shapeType === "circle") {
			return (
				<div
					className="w-full h-full rounded-full"
					style={{
						backgroundColor: fill,
						border: `${strokeWidth}px solid ${stroke}`,
					}}
				/>
			);
		} else if (shapeType === "line") {
			return (
				<div
					className="w-full"
					style={{
						height: `${strokeWidth}px`,
						backgroundColor: stroke,
						marginTop: "50%",
					}}
				/>
			);
		}

		return null;
	};

	const handleFillColorChange = (color: string) => {
		onUpdate({
			...element,
			fill: color,
		});
	};

	const handleStrokeColorChange = (color: string) => {
		onUpdate({
			...element,
			stroke: color,
		});
	};

	const handleDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
		setShowColorPickers(true);
	};

	const handleBlur = () => {
		setShowColorPickers(false);
	};

	return (
		<div
			className={cn(
				"absolute cursor-move",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				left: `${element.x}px`,
				top: `${element.y}px`,
				width: `${element.width}px`,
				height: element.shapeType === "line" ? "1px" : `${element.height}px`,
			}}
			onMouseDown={onMouseDown}
			onDoubleClick={handleDoubleClick}
			onBlur={handleBlur}
		>
			{renderShape()}

			{isSelected && showColorPickers && (
				<div className="absolute top-full left-0 mt-2 bg-white p-3 border border-gray-200 rounded shadow-md z-50 min-w-[240px]">
					<div className="space-y-4">
						{element.shapeType !== "line" && (
							<ColorPicker
								label="Fill Color"
								color={element.fill}
								onChange={handleFillColorChange}
							/>
						)}
						<ColorPicker
							label="Border Color"
							color={element.stroke}
							onChange={handleStrokeColorChange}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
