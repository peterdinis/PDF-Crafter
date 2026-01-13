"use client";

import { cn } from "@/lib/utils";
import type {
	BarcodeElement,
	ChartElement,
	CodeElement,
	DividerElement,
	DrawingElement,
	FormElement,
	PDFElement,
	QRCodeElement,
	ShapeElement,
	SignatureElement,
	TableElement,
	TextElement,
	Tool,
} from "@/types/global";
import Image from "next/image";
import type { FC, MouseEvent } from "react";
import { TextEditor } from "../editor/TextEditor";
import { ChartTool } from "../tools/ChartTool";
import { PencilTool } from "../tools/PencilTool";
import { ShapeTool } from "../tools/ShapeTool";
import { TableTool } from "../tools/TableTool";

interface CanvasElementProps {
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: PDFElement) => void;
	onDelete?: (id: string) => void;
	onContextMenu?: (e: MouseEvent, elementId: string) => void;
	activeTool: Tool;
	onAddElement: (element: PDFElement) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export const CanvasElement: FC<CanvasElementProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
	onDelete,
	onContextMenu,
	activeTool,
	onAddElement,
	isEditing,
	setIsEditing,
}) => {
	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(element.id);
		}
	};

	const handleContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onContextMenu) {
			onContextMenu(e, element.id);
		}
	};

	const commonProps = {
		isSelected,
		onMouseDown,
		onContextMenu: handleContextMenu,
		onDeleteClick: handleDelete,
	};

	return (
		<div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
			{element.type === "text" && (
				<TextEditor
					element={element as TextElement}
					{...commonProps}
					onUpdate={onUpdate}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					onDelete={(id) => onDelete && onDelete(id)}
				/>
			)}
			{element.type === "image" && (
				<ImageElement element={element} {...commonProps} />
			)}
			{element.type === "shape" && (
				<ShapeTool
					element={element as ShapeElement}
					{...commonProps}
					onUpdate={onUpdate}
				/>
			)}
			{element.type === "table" && (
				<TableTool
					element={element as TableElement}
					{...commonProps}
					onUpdate={onUpdate}
				/>
			)}
			{(element.type === "pencil" || element.type === "drawing") && (
				<PencilTool element={element} {...commonProps} />
			)}
			{element.type === "chart" && (
				<ChartTool element={element as ChartElement} {...commonProps} />
			)}
			{element.type === "form" && (
				<FormElement element={element as FormElement} {...commonProps} />
			)}
			{element.type === "code" && (
				<CodeElement element={element as CodeElement} {...commonProps} />
			)}
			{element.type === "divider" && (
				<DividerElement element={element as DividerElement} {...commonProps} />
			)}
			{element.type === "qrcode" && (
				<QRCodeElement element={element as QRCodeElement} {...commonProps} />
			)}
			{element.type === "barcode" && (
				<BarcodeElement element={element as BarcodeElement} {...commonProps} />
			)}
			{element.type === "signature" && (
				<SignatureElement
					element={element as SignatureElement}
					{...commonProps}
				/>
			)}
		</div>
	);
};

const ImageElement: FC<{
	element: PDFElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu, onDeleteClick }) => {
	if (element.type !== "image") return null;

	return (
		<div
			className={cn(
				"cursor-move",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				width: `${element.width}px`,
				height: `${element.height}px`,
			}}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<Image
				src={element.src}
				alt="PDF element"
				className="w-full h-full object-contain"
				width={element.width || 200}
				height={element.height || 200}
			/>
		</div>
	);
};

const FormElement: FC<{
	element: FormElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full min-h-10 border-2 border-gray-400 dark:border-gray-500 rounded p-2 bg-gray-50 dark:bg-gray-800",
				isSelected &&
					"ring-2 ring-editor-primary ring-offset-2 border-blue-500",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
				{element.label}
			</label>
			{element.formType === "text" && (
				<input
					type="text"
					placeholder={element.placeholder}
					value={element.value || ""}
					className="w-full px-2 py-1 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					readOnly
				/>
			)}
			{element.formType === "textarea" && (
				<textarea
					placeholder={element.placeholder}
					value={element.value || ""}
					className="w-full px-2 py-1 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-15"
					readOnly
				/>
			)}
			{element.formType === "button" && (
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
					disabled
				>
					{element.label}
				</button>
			)}
			{element.formType === "checkbox" && (
				<div className="flex items-center gap-2">
					<input type="checkbox" className="w-4 h-4" disabled />
					<span className="text-gray-700 dark:text-gray-300">
						{element.placeholder || "Checkbox option"}
					</span>
				</div>
			)}
			{element.formType === "radio" && (
				<div className="flex items-center gap-2">
					<input type="radio" className="w-4 h-4" disabled />
					<span className="text-gray-700 dark:text-gray-300">
						{element.placeholder || "Radio option"}
					</span>
				</div>
			)}
			{element.formType === "dropdown" && (
				<select
					className="w-full px-2 py-1 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					disabled
				>
					{element.options?.map((opt, idx) => (
						<option key={idx} value={opt}>
							{opt}
						</option>
					))}
				</select>
			)}
			{element.formType === "date" && (
				<input
					type="date"
					className="w-full px-2 py-1 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					readOnly
				/>
			)}
			{element.formType === "range" && (
				<input type="range" min="0" max="100" className="w-full" disabled />
			)}
		</div>
	);
};

const CodeElement: FC<{
	element: CodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full min-h-25 border-2 border-gray-400 dark:border-gray-500 rounded p-2 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto",
				isSelected &&
					"ring-2 ring-editor-primary ring-offset-2 border-blue-500",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<pre className="whitespace-pre-wrap text-gray-100">
				{element.content || "// Code block"}
			</pre>
		</div>
	);
};

const DividerElement: FC<{
	element: DividerElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	const borderStyle =
		element.style === "dashed"
			? "dashed"
			: element.style === "dotted"
				? "dotted"
				: "solid";

	return (
		<div
			className={cn(
				"w-full h-full flex items-center",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: `${element.thickness}px ${borderStyle} ${element.color}`,
					margin: 0,
				}}
			/>
		</div>
	);
};

const QRCodeElement: FC<{
	element: QRCodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full min-h-30 flex items-center justify-center border-2 border-gray-400 dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-800",
				isSelected &&
					"ring-2 ring-editor-primary ring-offset-2 border-blue-500",
			)}
			style={{
				backgroundColor:
					element.backgroundColor && element.backgroundColor !== "transparent"
						? element.backgroundColor
						: undefined,
			}}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="text-xs text-gray-700 dark:text-gray-300 p-2 text-center font-medium">
				QR Code: {element.content || "No content"}
			</div>
		</div>
	);
};

const BarcodeElement: FC<{
	element: BarcodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full min-h-20 flex items-center justify-center border-2 border-gray-400 dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-800",
				isSelected &&
					"ring-2 ring-editor-primary ring-offset-2 border-blue-500",
			)}
			style={{
				backgroundColor:
					element.backgroundColor && element.backgroundColor !== "transparent"
						? element.backgroundColor
						: undefined,
			}}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="text-xs text-gray-700 dark:text-gray-300 p-2 text-center font-medium">
				Barcode: {element.value || "No value"}
			</div>
		</div>
	);
};

const SignatureElement: FC<{
	element: SignatureElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full min-h-25 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800",
				isSelected &&
					"ring-2 ring-editor-primary ring-offset-2 border-blue-500",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
				{element.placeholder || "Sign here"}
			</div>
		</div>
	);
};
