"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {FC, MouseEvent,ChangeEvent} from "react"

interface ColorPickerProps {
	label: string;
	color: string;
	onChange: (color: string) => void;
	className?: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({
	label,
	color,
	onChange,
	className = "",
}) => {
	// Prevent event propagation to avoid closing modals
	const handleMouseDown = (e: MouseEvent) => {
		e.stopPropagation();
	};

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		onChange(e.target.value);
	};

	return (
		<div
			className={`space-y-2 color-picker ${className}`}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
		>
			<Label>{label}</Label>
			<div className="flex items-center gap-2">
				<Input
					type="color"
					value={color}
					onChange={handleChange}
					className="w-12 h-10 p-1 cursor-pointer"
					onClick={handleClick}
				/>
				<Input
					type="text"
					value={color}
					onChange={handleChange}
					className="flex-1"
					maxLength={7}
					onClick={handleClick}
				/>
			</div>
		</div>
	);
};
