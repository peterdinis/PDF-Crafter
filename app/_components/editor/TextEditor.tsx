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
import type { TextElement } from "@/types";
import {
	FC,
	MouseEvent,
	ChangeEvent,
	useEffect,
	useRef,
	useState,
	FocusEvent,
	KeyboardEvent,
} from "react";
import { ColorPicker } from "../shared/ColorPicker";

interface TextEditorProps {
	element: TextElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
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

	const handleCustomFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCustomFontSize(e.target.value);
	};

	const handleCustomFontSizeBlur = (e: FocusEvent<HTMLInputElement>) => {
		const size = Number.parseInt(customFontSize, 10);
		if (!isNaN(size) && size > 0) {
			onUpdate({ ...element, fontSize: size });
		} else {
			setCustomFontSize(element.fontSize.toString());
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
