"use client";

import { cn } from "@/lib/utils";
import type { TextElement } from "@/types";
import {
	FC,
	MouseEvent,
	ChangeEvent,
	useEffect,
	useRef,
	useState,
	KeyboardEvent,
} from "react";

interface TextEditorProps {
	element: TextElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
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
	const [customFontSize, setCustomFontSize] = useState<string>(
		element.fontSize.toString(),
	);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);

	const editing = parentIsEditing ?? internalEditing;
	const setEditing = (value: boolean) => {
		parentSetIsEditing ? parentSetIsEditing(value) : setInternalEditing(value);
	};

	useEffect(() => {
		if (editing && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [editing]);

	const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setEditing(true);
	};

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onUpdate({ ...element, content: e.target.value });
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			setEditing(false);
		}
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
				/>
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
