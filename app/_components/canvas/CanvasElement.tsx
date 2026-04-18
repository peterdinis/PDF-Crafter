"use client";

import { cn } from "@/lib/utils";
import type {
	BarcodeElement,
	ChartElement,
	CodeElement,
	DividerElement,
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
import { QRCodeSVG } from "qrcode.react";
import type { FC, MouseEvent } from "react";
import Barcode from "react-barcode";
import { TextEditor } from "../editor/TextEditor";
import { ChartTool } from "../tools/ChartTool";
import { PencilTool } from "../tools/PencilTool";
import { ShapeTool } from "../tools/ShapeTool";
import { TableTool } from "../tools/TableTool";
import { SignatureDialog } from "../tools/SignatureDialog";
import { useState } from "react";

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
				<FormElementComponent element={element as FormElement} {...commonProps} />
			)}
			{element.type === "code" && (
				<CodeElementComponent element={element as CodeElement} {...commonProps} />
			)}
			{element.type === "divider" && (
				<DividerElementComponent element={element as DividerElement} {...commonProps} />
			)}
			{element.type === "qrcode" && (
				<QRCodeElementComponent element={element as QRCodeElement} {...commonProps} />
			)}
			{element.type === "barcode" && (
				<BarcodeElementComponent element={element as BarcodeElement} {...commonProps} />
			)}
			{element.type === "signature" && (
				<SignatureElementComponent
					element={element as SignatureElement}
					{...commonProps}
					onUpdate={onUpdate}
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
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	if (element.type !== "image") return null;

	return (
		<div
			className={cn(
				"cursor-move border border-transparent transition-all",
				isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 rounded-sm shadow-lg",
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

const FormElementComponent: FC<{
	element: FormElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-border rounded-xl shadow-sm cursor-move",
				isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-lg",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted-foreground">
				{element.label}
				{element.required && <span className="text-destructive ml-1">*</span>}
			</label>

			{element.formType === "text" && (
				<input
					type="text"
					placeholder={element.placeholder}
					className="w-full px-3 py-2 border border-border rounded-lg bg-muted/30 text-xs text-foreground focus:ring-2 focus:ring-primary/30 outline-none"
					readOnly
				/>
			)}

			{element.formType === "textarea" && (
				<textarea
					placeholder={element.placeholder}
					className="w-full px-3 py-2 border border-border rounded-lg bg-muted/30 text-xs text-foreground focus:ring-2 focus:ring-primary/30 outline-none resize-none"
					rows={3}
					readOnly
				/>
			)}

			{element.formType === "button" && (
				<button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg shadow-sm transition-all shadow-primary/20">
					{element.label}
				</button>
			)}

			{element.formType === "checkbox" && (
				<div className="flex items-center gap-3">
					<div className="w-5 h-5 border-2 border-border rounded-md bg-white dark:bg-zinc-800"></div>
					<span className="text-xs font-medium text-muted-foreground">{element.placeholder || "Checkbox option"}</span>
				</div>
			)}

			{element.formType === "radio" && (
				<div className="space-y-2">
					{element.options?.map((opt, idx) => (
						<div key={idx} className="flex items-center gap-3">
							<div className="w-5 h-5 border-2 border-border rounded-full bg-white dark:bg-zinc-800"></div>
							<span className="text-xs font-medium text-muted-foreground">{opt}</span>
						</div>
					))}
				</div>
			)}

			{element.formType === "dropdown" && (
				<div className="relative">
					<select className="w-full px-3 py-2 pr-8 border border-border rounded-lg bg-muted/30 text-xs text-foreground appearance-none cursor-pointer outline-none">
						<option>{element.placeholder || "Select an option"}</option>
						{element.options?.map((opt, idx) => (
							<option key={idx} value={opt}>{opt}</option>
						))}
					</select>
					<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
			)}

			{element.formType === "date" && (
				<input
					type="date"
					className="w-full px-3 py-2 border border-border rounded-lg bg-muted/30 text-xs text-foreground focus:ring-2 focus:ring-primary/30 outline-none"
					readOnly
				/>
			)}

			{element.formType === "range" && (
				<div className="space-y-2">
					<input
						type="range"
						min="0"
						max="100"
						defaultValue="50"
						className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
					/>
					<div className="flex justify-between text-[10px] text-muted-foreground font-medium">
						<span>Min</span>
						<span>Max</span>
					</div>
				</div>
			)}

			{element.formType === "switch" && (
				<div className="flex items-center gap-3">
					<div className="relative inline-block w-10 h-5 bg-muted border border-border rounded-full">
						<div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white dark:bg-zinc-400 rounded-full shadow-sm transition-transform"></div>
					</div>
					<span className="text-xs text-muted-foreground font-medium">{element.placeholder || "Toggle option"}</span>
				</div>
			)}
		</div>
	);
};

const CodeElementComponent: FC<{
	element: CodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full rounded-xl overflow-hidden cursor-move shadow-lg border border-border transition-all",
				isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-xl",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
				<div className="flex items-center gap-2">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
					</div>
					<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-3">{element.language || "code"}</span>
				</div>
			</div>
			<div className="bg-zinc-950 p-5 overflow-auto custom-scrollbar" style={{ height: 'calc(100% - 40px)' }}>
				<pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
					<code>{element.content || "// Your code here"}</code>
				</pre>
			</div>
		</div>
	);
};

const DividerElementComponent: FC<{
	element: DividerElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	const borderStyle = element.style === "dashed" ? "dashed" : element.style === "dotted" ? "dotted" : "solid";

	return (
		<div
			className={cn(
				"w-full h-full flex items-center cursor-move p-1 transition-all",
				isSelected && "ring-2 ring-primary ring-offset-2 rounded-lg border-primary/30",
			)}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: `${element.thickness || 2}px ${borderStyle} ${element.color || "#d1d5db"}`,
					margin: 0,
				}}
			/>
		</div>
	);
};

const QRCodeElementComponent: FC<{
	element: QRCodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full flex flex-col items-center justify-center rounded-2xl cursor-move shadow-md overflow-hidden bg-white dark:bg-zinc-900 border border-border transition-all",
				isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-xl",
			)}
			style={{ backgroundColor: element.backgroundColor !== "transparent" ? element.backgroundColor : undefined }}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="p-2 bg-white rounded flex items-center justify-center w-full h-full">
				<QRCodeSVG
					value={element.content || "https://example.com"}
					size={Math.min(element.width || 120, element.height || 120) - 20}
					fgColor={element.color || "#000000"}
					bgColor={element.backgroundColor || "#ffffff"}
					level={element.errorCorrection || "M"}
				/>
			</div>
		</div>
	);
};

const BarcodeElementComponent: FC<{
	element: BarcodeElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu }) => {
	return (
		<div
			className={cn(
				"w-full h-full flex flex-col items-center justify-center rounded-2xl p-2 cursor-move shadow-md overflow-hidden bg-white dark:bg-zinc-900 border border-border transition-all",
				isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-xl",
			)}
			style={{ backgroundColor: element.backgroundColor !== "transparent" ? element.backgroundColor : undefined }}
			onMouseDown={onMouseDown}
			onContextMenu={onContextMenu}
		>
			<div className="w-full h-full flex items-center justify-center">
				<Barcode
					value={element.value || "1234567890"}
					format={(element.format || "CODE128") as any}
					width={2}
					height={(element.height || 80) - 40}
					displayValue={true}
					lineColor={element.color || "#000000"}
					background={element.backgroundColor || "#ffffff"}
				/>
			</div>
		</div>
	);
};

const SignatureElementComponent: FC<{
	element: SignatureElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onContextMenu?: (e: MouseEvent) => void;
	onDeleteClick?: (e: MouseEvent) => void;
	onUpdate?: (element: PDFElement) => void;
}> = ({ element, isSelected, onMouseDown, onContextMenu, onUpdate }) => {
	const [showDialog, setShowDialog] = useState(false);

	const handleSave = (signatureData: string) => {
		if (onUpdate) {
			onUpdate({ ...element, signatureData });
		}
	};

	return (
		<>
			<div
				className={cn(
					"w-full h-full border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center bg-muted/20 cursor-move p-4 transition-all hover:bg-muted/30",
					isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 bg-primary/5",
				)}
				onMouseDown={onMouseDown}
				onContextMenu={onContextMenu}
				onDoubleClick={(e) => {
					e.stopPropagation();
					if (onUpdate) setShowDialog(true);
				}}
				style={{ backgroundColor: element.backgroundColor || undefined }}
			>
				{element.signatureData ? (
					<div className="w-full h-full flex items-center justify-center">
						<img src={element.signatureData} alt="Signature" className="max-w-full max-h-full object-contain" />
					</div>
				) : (
					<>
						<svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium text-center pointer-events-none">
							{element.placeholder || "Sign here"}
						</div>
						<div className="mt-4 w-4/5 border-t-2 border-gray-300 dark:border-gray-600"></div>
					</>
				)}
			</div>
			{onUpdate && (
				<SignatureDialog
					isOpen={showDialog}
					onClose={() => setShowDialog(false)}
					onSave={handleSave}
					initialData={element.signatureData}
				/>
			)}
		</>
	);
};