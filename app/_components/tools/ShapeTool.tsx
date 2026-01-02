"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ShapeElement } from "@/types/global";
import { Label } from "@radix-ui/react-label";
import { type ChangeEvent, type FC, type MouseEvent, useState, useEffect } from "react";
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
					className="w-full h-full"
					style={{
						backgroundColor: stroke,
						minHeight: "1px",
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
		if (typeof window === 'undefined') return;

		const handleClickOutside = (e: globalThis.MouseEvent) => {
			if (showControls) {
				const target = e.target as HTMLElement;
				if (!target.closest('.shape-controls') && !target.closest('.color-picker')) {
					setShowControls(false);
				}
			}
		};

		if (showControls) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
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
				<div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 min-w-[240px] shape-controls">
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
