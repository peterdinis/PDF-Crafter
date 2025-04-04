"use client";

import type { FC, MouseEvent } from "react";
import { ColorPicker } from "./ColorPicker";

interface DrawingToolColorPickerProps {
	color: string;
	strokeWidth: number;
	onColorChange: (color: string) => void;
	onStrokeWidthChange: (width: number) => void;
	title?: string;
}

export const PencilColorPicker: FC<DrawingToolColorPickerProps> = ({
	color,
	strokeWidth,
	onColorChange,
	onStrokeWidthChange,
	title = "Pencil Color",
}) => {
	const predefinedColors = [
		"#000000", // Black
		"#ea384c", // Red
		"#33C3F0", // Blue
		"#2ECC40", // Green
		"#FF851B", // Orange
		"#9b87f5", // Purple
		"#FFDC00", // Yellow
		"#7FDBFF", // Light Blue
	];

	const strokeWidths = [1, 2, 3, 5, 8];

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 flex flex-col items-center space-y-4 z-50"
			onClick={handleClick}
			onMouseDown={(e) => e.stopPropagation()}
		>
			<div className="text-sm font-medium">{title}</div>
			<div className="flex space-x-2">
				{predefinedColors.map((presetColor) => (
					<button
						key={presetColor}
						className={`w-8 h-8 rounded-full border ${
							color === presetColor
								? "ring-2 ring-offset-2 ring-editor-primary"
								: "border-gray-300"
						}`}
						style={{ backgroundColor: presetColor }}
						onClick={(e) => {
							e.stopPropagation();
							onColorChange(presetColor);
						}}
					/>
				))}
			</div>
			<div className="text-sm font-medium">Stroke Width</div>
			<div className="flex space-x-2">
				{strokeWidths.map((width) => (
					<button
						key={width}
						className={`w-8 h-8 rounded-full border flex items-center justify-center ${
							strokeWidth === width
								? "ring-2 ring-offset-2 ring-editor-primary"
								: "border-gray-300"
						}`}
						onClick={(e) => {
							e.stopPropagation();
							onStrokeWidthChange(width);
						}}
					>
						<div
							className="bg-black rounded-full"
							style={{
								width: `${width * 2}px`,
								height: `${width * 2}px`,
							}}
						/>
					</button>
				))}
			</div>
			<ColorPicker
				label="Custom Color"
				color={color}
				onChange={onColorChange}
				className="color-picker"
			/>
		</div>
	);
};
