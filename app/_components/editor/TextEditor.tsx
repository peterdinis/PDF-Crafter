"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TextElement } from "@/types/types";
import { FC, useEffect, useRef, useState } from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";

interface TextEditorProps {
	element: TextElement;
	isSelected: boolean;
	onMouseDown: (e: React.MouseEvent) => void;
	onUpdate: (element: TextElement) => void;
	isEditing?: boolean;
	setIsEditing?: (isEditing: boolean) => void;
}

const fontOptions = [
	{ value: "Arial", label: "Arial" },
	{ value: "Times-Roman", label: "Times New Roman" },
	{ value: "Courier", label: "Courier" },
	{ value: "Helvetica", label: "Helvetica" },
	{ value: "Georgia", label: "Georgia" },
	{ value: "Verdana", label: "Verdana" },
];

export const TextEditor: FC<TextEditorProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
	isEditing: parentIsEditing,
	setIsEditing: parentSetIsEditing,
}) => {
	const [internalEditing, setInternalEditing] = useState(false);
	const [_, setShowFormatting] = useState(false);
	const [customFontSize, setCustomFontSize] = useState(
		element.fontSize.toString(),
	);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);

	const editing =
		parentIsEditing !== undefined ? parentIsEditing : internalEditing;
	const setEditing = (value: boolean) => {
		if (parentSetIsEditing) {
			parentSetIsEditing(value);
		} else {
			setInternalEditing(value);
		}
	};

	useEffect(() => {
		if (editing && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [editing]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				target.closest(".color-picker") ||
				target.closest('[role="combobox"]') ||
				target.closest('[role="listbox"]') ||
				target.tagName === "INPUT" ||
				target.closest(".select-content")
			) {
				return;
			}

			if (
				editorRef.current &&
				!editorRef.current.contains(event.target as Node)
			) {
				setEditing(false);
				setShowFormatting(false);
			}
		};

		if (editing) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editing, setEditing]);

	const handleDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setEditing(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onUpdate({
			...element,
			content: e.target.value,
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && e.shiftKey === false) {
			e.preventDefault();
			setEditing(false);
			setShowFormatting(false);
		}
	};

	const handleColorChange = (color: string) => {
		onUpdate({
			...element,
			color,
		});
	};

	const handleFontChange = (font: string) => {
		onUpdate({
			...element,
			fontFamily: font,
		});
	};

	const handleFontSizeChange = (size: number) => {
		onUpdate({
			...element,
			fontSize: size,
		});
		setCustomFontSize(size.toString());
	};

	const handleCustomFontSizeChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		e.stopPropagation();
		setCustomFontSize(e.target.value);
	};

	const handleCustomFontSizeBlur = (e: React.FocusEvent) => {
		e.stopPropagation();
		const size = Number.parseInt(customFontSize, 10);
		if (!isNaN(size) && size > 0) {
			onUpdate({
				...element,
				fontSize: size,
			});
		} else {
			setCustomFontSize(element.fontSize.toString());
		}
	};

	const handleFontWeightChange = (weight: string) => {
		onUpdate({
			...element,
			fontWeight: weight,
		});
	};

	const handleFontStyleChange = (style: string) => {
		onUpdate({
			...element,
			fontStyle: style,
		});
	};
	
	const handleFormClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className={cn(
				"absolute cursor-move",
				isSelected && !editing && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				left: `${element.x}px`,
				top: `${element.y}px`,
				width: `${element.width}px`,
				minHeight: `${element.height}px`,
			}}
			onMouseDown={editing ? undefined : onMouseDown}
			onDoubleClick={handleDoubleClick}
			ref={editorRef}
		>
			{editing ? (
				<div className="flex flex-col gap-2">
					<textarea
						ref={textareaRef}
						value={element.content}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						style={{
							fontSize: `${element.fontSize}px`,
							fontFamily: element.fontFamily,
							fontWeight: element.fontWeight,
							fontStyle: element.fontStyle,
							color: element.color,
							width: "100%",
							minHeight: `${element.height}px`,
							resize: "both",
						}}
						className="p-0 border-0 focus:outline-none focus:ring-2 focus:ring-editor-primary bg-transparent"
						onClick={(e) => e.stopPropagation()}
					/>

					<div
						className="bg-white p-4 border border-gray-200 rounded shadow-md z-10 space-y-4 color-picker"
						onClick={handleFormClick}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className="space-y-2">
							<label className="text-sm font-medium">Font</label>
							<Select
								value={element.fontFamily}
								onValueChange={handleFontChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Font" />
								</SelectTrigger>
								<SelectContent className="select-content">
									{fontOptions.map((font) => (
										<SelectItem key={font.value} value={font.value}>
											{font.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium">Font Size</Label>
							<div className="flex items-center gap-2">
								<Select
									value={element.fontSize.toString()}
									onValueChange={(value) => handleFontSizeChange(Number(value))}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Size" />
									</SelectTrigger>
									<SelectContent className="select-content">
										{[
											8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72,
										].map((size) => (
											<SelectItem key={size} value={size.toString()}>
												{size}px
											</SelectItem>
										))}
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>

								<div className="w-24">
									<Input
										type="number"
										min="1"
										value={customFontSize}
										onChange={handleCustomFontSizeChange}
										onBlur={handleCustomFontSizeBlur}
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
										className="h-9"
									/>
								</div>
								<span className="text-sm">px</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">Style</label>
								<Select
									value={element.fontStyle}
									onValueChange={handleFontStyleChange}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Style" />
									</SelectTrigger>
									<SelectContent className="select-content">
										<SelectItem value="normal">Normal</SelectItem>
										<SelectItem value="italic">Italic</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Weight</label>
								<Select
									value={element.fontWeight}
									onValueChange={handleFontWeightChange}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Weight" />
									</SelectTrigger>
									<SelectContent className="select-content">
										<SelectItem value="normal">Normal</SelectItem>
										<SelectItem value="bold">Bold</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<ColorPicker
							label="Text Color"
							color={element.color}
							onChange={handleColorChange}
						/>
					</div>
				</div>
			) : (
				<div
					style={{
						fontSize: `${element.fontSize}px`,
						fontFamily: element.fontFamily,
						fontWeight: element.fontWeight,
						fontStyle: element.fontStyle,
						color: element.color,
					}}
					className="whitespace-pre-wrap break-words"
				>
					{element.content}
				</div>
			)}
		</div>
	);
};
