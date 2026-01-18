"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ShapeElement } from "@/types/global";
import { Label } from "@radix-ui/react-label";
import {
	type ChangeEvent,
	type FC,
	type MouseEvent,
	useEffect,
	useState,
} from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";

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
	const [showControls, setShowControls] = useState(false);

	const renderShape = () => {
		const { shapeType, fillColor, strokeColor, strokeWidth } = element;
		const fill = (element as any).fill || fillColor;
		const stroke = (element as any).stroke || strokeColor;

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
					className="w-full h-full"
					style={{
						backgroundColor: stroke,
						minHeight: "1px",
					}}
				/>
			);
		} else if (shapeType === "triangle") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="50,5 95,95 5,95"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "diamond") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="50,5 95,50 50,95 5,50"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "star") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<path
						d="M50,5 L63,35 L95,35 L70,55 L80,85 L50,65 L20,85 L30,55 L5,35 L37,35 Z"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "arrow") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
					<path
						d="M5,20 L65,20 L65,5 L95,30 L65,55 L65,40 L5,40 Z"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "heart") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<path
						d="M50,85 C50,85 10,60 10,35 C10,15 25,5 40,5 C50,5 50,15 50,15 C50,15 50,5 60,5 C75,5 90,15 90,35 C90,60 50,85 50,85"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "hexagon") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="50,5 95,27 95,73 50,95 5,73 5,27"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "cloud") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
					<path
						d="M25,50 C15,50 5,42 5,32 C5,22 12,15 20,15 C22,8 30,5 40,5 C55,5 65,15 65,15 C70,10 80,10 85,18 C92,20 95,25 95,35 C95,45 85,50 75,50 Z"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "right_triangle") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="5,5 5,95 95,95"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "pentagon") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="50,5 95,38 79,90 21,90 5,38"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "octagon") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "parallelogram") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="25,5 95,5 75,95 5,95"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "trapezoid") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="20,5 80,5 95,95 5,95"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		} else if (shapeType === "cross") {
			return (
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polygon
						points="35,5 65,5 65,35 95,35 95,65 65,65 65,95 35,95 35,65 5,65 5,35 35,35"
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			);
		}

		return null;
	};

	const handleFillColorChange = (color: string) => {
		onUpdate({
			...element,
			fillColor: color,
		} as ShapeElement);
	};

	const handleStrokeColorChange = (color: string) => {
		onUpdate({
			...element,
			strokeColor: color,
		} as ShapeElement);
	};

	const handleStrokeWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			onUpdate({
				...element,
				strokeWidth: value,
			});
		}
	};

	const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			onUpdate({
				...element,
				width: value,
			});
		}
	};

	const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			onUpdate({
				...element,
				height: value,
			});
		}
	};

	const handleRotationChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value)) {
			onUpdate({
				...element,
				rotation: value,
			});
		}
	};

	const handleDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
		setShowControls(true);
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleClickOutside = (e: globalThis.MouseEvent) => {
			if (showControls) {
				const target = e.target as HTMLElement;
				if (
					!target.closest(".shape-controls") &&
					!target.closest(".color-picker")
				) {
					setShowControls(false);
				}
			}
		};

		if (showControls) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [showControls]);

	const handleBlur = () => {
		// Don't close on blur, use click outside instead
	};

	return (
		<div
			className={cn(
				"w-full h-full",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				transform: element.rotation
					? `rotate(${element.rotation}deg)`
					: undefined,
				transformOrigin: "center center",
			}}
			onMouseDown={onMouseDown}
			onDoubleClick={handleDoubleClick}
			onBlur={handleBlur}
		>
			{renderShape()}

			{isSelected && showControls && (
				<div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 min-w-60 shape-controls">
					<div className="space-y-4">
						<div className="flex gap-4">
							<div className="w-1/2">
								<Label htmlFor="width">Width</Label>
								<Input
									id="width"
									type="number"
									min="1"
									value={element.width}
									onChange={handleWidthChange}
								/>
							</div>

							<div className="w-1/2">
								<Label htmlFor="height">Height</Label>
								<Input
									id="height"
									type="number"
									min="1"
									value={element.height}
									onChange={handleHeightChange}
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="rotation">Rotation (degrees)</Label>
							<Input
								id="rotation"
								type="number"
								min="0"
								max="360"
								value={element.rotation || 0}
								onChange={handleRotationChange}
							/>
						</div>

						<div>
							<Label htmlFor="strokeWidth">Border Width</Label>
							<Input
								id="strokeWidth"
								type="number"
								min="1"
								max="20"
								value={element.strokeWidth}
								onChange={handleStrokeWidthChange}
							/>
						</div>

						{element.shapeType !== "line" && (
							<ColorPicker
								label="Fill Color"
								color={(element as any).fill || element.fillColor}
								onChange={handleFillColorChange}
							/>
						)}

						<ColorPicker
							label="Border Color"
							color={(element as any).stroke || element.strokeColor}
							onChange={handleStrokeColorChange}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
