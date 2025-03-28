"use client";

import { cn } from "@/lib/utils";
import type { TextElement } from "@/types";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { ColorPicker } from "../shared/ColorPicker";

interface TextEditorProps {
	element: TextElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: TextElement) => void;
	isEditing?: boolean;
	setIsEditing?: (isEditing: boolean) => void;
}

export const TextEditor: FC<TextEditorProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
	isEditing: parentIsEditing,
	setIsEditing: parentSetIsEditing,
}) => {
	const [internalEditing, setInternalEditing] = useState(false);
	const [showFormatting, setShowFormatting] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Use the parent editing state if provided, otherwise use internal state
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

	const handleDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
		setEditing(true);
	};

	const handleBlur = () => {
		setEditing(false);
		setShowFormatting(false);
	};

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onUpdate({
			...element,
			content: e.target.value,
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
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
		>
			{editing ? (
				<div className="flex flex-col gap-2">
					<textarea
						ref={textareaRef}
						value={element.content}
						onChange={handleChange}
						onBlur={handleBlur}
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

					<div className="bg-white p-2 border border-gray-200 rounded shadow-md z-10">
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
