"use client";

import { cn } from "@/lib/utils";
import type { ShapeElement } from "@/types";
import type { FC, MouseEvent } from "react";

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
		>
			{renderShape()}
		</div>
	);
};
