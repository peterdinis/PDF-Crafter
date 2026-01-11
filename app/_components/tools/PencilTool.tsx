"use client";

import type { DrawingElement, PDFElement } from "@/types/global";
import { cn } from "@/lib/utils";
import type { FC, MouseEvent } from "react";

interface PencilToolProps {
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
}

export const PencilTool: FC<PencilToolProps> = ({
	element,
	isSelected,
	onMouseDown,
}) => {
	// Handle both "pencil" type (with points) and "drawing" type (with paths)
	const pencilElement = element as any;
	const points = pencilElement.points || [];
	const paths = (element as DrawingElement).paths || [];
	
	// If we have paths, convert to points for rendering
	let allPoints: Array<{ x: number; y: number }> = [];
	if (points.length > 0) {
		allPoints = points;
	} else if (paths.length > 0) {
		// Flatten all paths into points
		paths.forEach((path: any) => {
			if (path.points) {
				allPoints = [...allPoints, ...path.points];
			}
		});
	}

	const pathData = allPoints.reduce((acc, point, index) => {
		if (index === 0) {
			return `M ${point.x} ${point.y}`;
		}
		return `${acc} L ${point.x} ${point.y}`;
	}, "");

	const color = pencilElement.color || (element as DrawingElement).strokeColor || "#000000";
	const strokeWidth = pencilElement.strokeWidth || (element as DrawingElement).strokeWidth || 2;

	const handleMouseDownSvg = (e: MouseEvent) => {
		e.stopPropagation();
		onMouseDown(e);
	};

	return (
		<div
			className={cn(
				"w-full h-full",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				pointerEvents: "none",
				backgroundColor: (element as DrawingElement).background || "transparent",
			}}
		>
			<svg
				width="100%"
				height="100%"
				style={{ pointerEvents: "auto" }}
				onMouseDown={handleMouseDownSvg}
			>
				{pathData && (
					<path
						d={pathData}
						stroke={color}
						strokeWidth={strokeWidth}
						fill="none"
						strokeLinejoin="round"
						strokeLinecap="round"
					/>
				)}
			</svg>
		</div>
	);
};
