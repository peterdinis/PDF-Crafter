"use client";

import type { PencilDrawingElement } from "@/types";
import type { FC, MouseEvent } from "react";

interface PencilToolProps {
	element: PencilDrawingElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
}

export const PencilTool: FC<PencilToolProps> = ({
	element,
	isSelected,
	onMouseDown,
}) => {
	const pathData = element.points.reduce((acc, point, index) => {
		if (index === 0) {
			return `M ${point.x} ${point.y}`;
		}
		return `${acc} L ${point.x} ${point.y}`;
	}, "");

	const handleMouseDownSvg = (e: MouseEvent) => {
		e.stopPropagation();
		onMouseDown(e);
	};

	return (
		<div
			className={`absolute ${isSelected ? "ring-2 ring-editor-primary ring-offset-2" : ""}`}
			style={{
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
			}}
		>
			<svg
				width="100%"
				height="100%"
				style={{ pointerEvents: "auto" }}
				onMouseDown={handleMouseDownSvg}
			>
				<path
					d={pathData}
					stroke={element.color}
					strokeWidth={element.strokeWidth}
					fill="none"
					strokeLinejoin="round"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	);
};
