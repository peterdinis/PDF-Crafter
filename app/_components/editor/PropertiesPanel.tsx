"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	ImageElement,
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
} from "@/types/global";
import { Trash2, Copy, Move } from "lucide-react";
import { type FC, type MouseEvent } from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";

interface PropertiesPanelProps {
	element: PDFElement | null;
	onUpdate: (element: PDFElement) => void;
	onDelete: (id: string) => void;
	onDuplicate?: (id: string) => void;
	onClose: () => void;
}

export const PropertiesPanel: FC<PropertiesPanelProps> = ({
	element,
	onUpdate,
	onDelete,
	onDuplicate,
	onClose,
}) => {
	if (!element) return null;

	const handleDelete = () => {
		onDelete(element.id);
		onClose();
	};

	const handleDuplicate = () => {
		if (onDuplicate) {
			onDuplicate(element.id);
		}
	};

	const renderTextProperties = (el: TextElement) => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Content</Label>
				<textarea
					value={el.content}
					onChange={(e) =>
						onUpdate({ ...el, content: e.target.value })
					}
					className="w-full min-h-[80px] p-2 border rounded"
					placeholder="Enter text..."
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Font Family</Label>
					<Select
						value={el.fontFamily}
						onValueChange={(value) =>
							onUpdate({ ...el, fontFamily: value })
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Arial">Arial</SelectItem>
							<SelectItem value="Times-Roman">Times New Roman</SelectItem>
							<SelectItem value="Courier">Courier</SelectItem>
							<SelectItem value="Helvetica">Helvetica</SelectItem>
							<SelectItem value="Georgia">Georgia</SelectItem>
							<SelectItem value="Verdana">Verdana</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Font Size</Label>
					<Input
						type="number"
						min="8"
						max="200"
						value={el.fontSize}
						onChange={(e) =>
							onUpdate({
								...el,
								fontSize: Number.parseInt(e.target.value) || 16,
							})
						}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Font Weight</Label>
					<Select
						value={el.fontWeight}
						onValueChange={(value) =>
							onUpdate({ ...el, fontWeight: value })
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="normal">Normal</SelectItem>
							<SelectItem value="bold">Bold</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Font Style</Label>
					<Select
						value={el.fontStyle}
						onValueChange={(value) =>
							onUpdate({ ...el, fontStyle: value })
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="normal">Normal</SelectItem>
							<SelectItem value="italic">Italic</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<ColorPicker
				label="Text Color"
				color={el.color}
				onChange={(color) => onUpdate({ ...el, color })}
			/>
		</div>
	);

	const renderShapeProperties = (el: ShapeElement) => (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Width</Label>
					<Input
						type="number"
						min="1"
						value={el.width}
						onChange={(e) =>
							onUpdate({
								...el,
								width: Number.parseInt(e.target.value) || 100,
							})
						}
					/>
				</div>

				{el.shapeType !== "line" && (
					<div className="space-y-2">
						<Label>Height</Label>
						<Input
							type="number"
							min="1"
							value={el.height}
							onChange={(e) =>
								onUpdate({
									...el,
									height: Number.parseInt(e.target.value) || 100,
								})
							}
						/>
					</div>
				)}
			</div>

			<div className="space-y-2">
				<Label>Rotation (degrees)</Label>
				<Input
					type="number"
					min="0"
					max="360"
					value={el.rotation || 0}
					onChange={(e) =>
						onUpdate({
							...el,
							rotation: Number.parseInt(e.target.value) || 0,
						})
					}
				/>
			</div>

			<div className="space-y-2">
				<Label>Border Width</Label>
				<Input
					type="number"
					min="1"
					max="20"
					value={el.strokeWidth}
					onChange={(e) =>
						onUpdate({
							...el,
							strokeWidth: Number.parseInt(e.target.value) || 1,
						})
					}
				/>
			</div>

			{el.shapeType !== "line" && (
				<ColorPicker
					label="Fill Color"
					color={el.fill}
					onChange={(color) => onUpdate({ ...el, fill: color })}
				/>
			)}

			<ColorPicker
				label="Border Color"
				color={el.stroke}
				onChange={(color) => onUpdate({ ...el, stroke: color })}
			/>
		</div>
	);

	const renderImageProperties = (el: ImageElement) => (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Width</Label>
					<Input
						type="number"
						min="1"
						value={el.width}
						onChange={(e) =>
							onUpdate({
								...el,
								width: Number.parseInt(e.target.value) || 200,
							})
						}
					/>
				</div>

				<div className="space-y-2">
					<Label>Height</Label>
					<Input
						type="number"
						min="1"
						value={el.height}
						onChange={(e) =>
							onUpdate({
								...el,
								height: Number.parseInt(e.target.value) || 200,
							})
						}
					/>
				</div>
			</div>
		</div>
	);

	const renderTableProperties = (el: TableElement) => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Header Type</Label>
				<Select
					value={el.headerType}
					onValueChange={(value) =>
						onUpdate({
							...el,
							headerType: value as "none" | "simple" | "divided",
						})
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No Header</SelectItem>
						<SelectItem value="simple">Simple Header</SelectItem>
						<SelectItem value="divided">Divided Header</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Rows</Label>
					<Input
						type="number"
						min="1"
						value={el.rows}
						onChange={(e) => {
							const newRows = Number.parseInt(e.target.value) || 1;
							const newData = [...el.data];
							while (newData.length < newRows) {
								newData.push(Array(el.columns).fill(""));
							}
							onUpdate({
								...el,
								rows: newRows,
								data: newData.slice(0, newRows),
							});
						}}
					/>
				</div>

				<div className="space-y-2">
					<Label>Columns</Label>
					<Input
						type="number"
						min="1"
						value={el.columns}
						onChange={(e) => {
							const newColumns = Number.parseInt(e.target.value) || 1;
							const newData = el.data.map((row) => {
								const newRow = [...row];
								while (newRow.length < newColumns) {
									newRow.push("");
								}
								return newRow.slice(0, newColumns);
							});
							onUpdate({
								...el,
								columns: newColumns,
								data: newData,
							});
						}}
					/>
				</div>
			</div>

			<ColorPicker
				label="Border Color"
				color={el.borderColor || "#000000"}
				onChange={(color) => onUpdate({ ...el, borderColor: color })}
			/>

			<ColorPicker
				label="Header Background"
				color={el.headerColor || "#ffffff"}
				onChange={(color) => onUpdate({ ...el, headerColor: color })}
			/>

			<ColorPicker
				label="Cell Background"
				color={el.cellColor || "#ffffff"}
				onChange={(color) => onUpdate({ ...el, cellColor: color })}
			/>

			<ColorPicker
				label="Text Color"
				color={el.textColor || "#000000"}
				onChange={(color) => onUpdate({ ...el, textColor: color })}
			/>
		</div>
	);

	const renderPositionProperties = () => (
		<div className="space-y-4 border-t pt-4">
			<h3 className="font-semibold text-sm">Position</h3>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>X Position</Label>
					<Input
						type="number"
						value={element.x || 0}
						onChange={(e) =>
							onUpdate({
								...element,
								x: Number.parseInt(e.target.value) || 0,
							})
						}
					/>
				</div>

				<div className="space-y-2">
					<Label>Y Position</Label>
					<Input
						type="number"
						value={element.y || 0}
						onChange={(e) =>
							onUpdate({
								...element,
								y: Number.parseInt(e.target.value) || 0,
							})
						}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Properties</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={onClose}
					className="h-8 w-8 p-0"
				>
					×
				</Button>
			</div>

			<div className="p-4 space-y-6">
				{/* Action Buttons */}
				<div className="flex gap-2">
					{onDuplicate && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleDuplicate}
							className="flex-1"
						>
							<Copy size={16} className="mr-2" />
							Duplicate
						</Button>
					)}
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						className="flex-1"
					>
						<Trash2 size={16} className="mr-2" />
						Delete
					</Button>
				</div>

				{/* Element Type Specific Properties */}
				<div className="space-y-4">
					<h3 className="font-semibold text-sm">
						{element.type.charAt(0).toUpperCase() + element.type.slice(1)}{" "}
						Properties
					</h3>
					{element.type === "text" && renderTextProperties(element as TextElement)}
					{element.type === "shape" &&
						renderShapeProperties(element as ShapeElement)}
					{element.type === "image" &&
						renderImageProperties(element as ImageElement)}
					{element.type === "table" &&
						renderTableProperties(element as TableElement)}
					{element.type === "pencil" && (
						<div className="space-y-2">
							<div className="text-sm text-gray-500 dark:text-gray-400">
								Pencil drawings can be moved and deleted.
							</div>
							<div className="space-y-2">
								<Label>Stroke Width</Label>
								<Input
									type="number"
									min="1"
									max="20"
									value={(element as any).strokeWidth || 2}
									onChange={(e) =>
										onUpdate({
											...element,
											strokeWidth: Number.parseInt(e.target.value) || 2,
										} as any)
									}
								/>
							</div>
							<ColorPicker
								label="Stroke Color"
								color={(element as any).color || "#000000"}
								onChange={(color) =>
									onUpdate({ ...element, color } as any)
								}
							/>
						</div>
					)}
				</div>

				{/* Position Properties */}
				{(element.x !== undefined && element.y !== undefined) &&
					renderPositionProperties()}
			</div>
		</div>
	);
};

