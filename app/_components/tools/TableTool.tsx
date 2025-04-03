"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TableElement } from "@/types/types";
import { Minus, Plus } from "lucide-react";
import { useState, FC, MouseEvent } from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";

interface TableToolProps {
	element: TableElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
	onUpdate: (element: TableElement) => void;
}

export const TableTool: FC<TableToolProps> = ({
	element,
	isSelected,
	onMouseDown,
	onUpdate,
}) => {
	const { tableStyle, headerType, data, columns, rows } = element;
	const [showColorPickers, setShowColorPickers] = useState(false);
	const [showSizeControls, setShowSizeControls] = useState(false);

	// Fill default data if empty
	const tableData =
		data && data.length > 0 ? data : Array(rows).fill(Array(columns).fill(""));

	// Apply different styling based on table style
	const getTableClassName = () => {
		switch (tableStyle) {
			case "striped":
				return "border [&_tr:nth-child(even)]:bg-gray-100";
			case "bordered":
				return "border [&_td]:border [&_th]:border";
			case "simple":
			default:
				return "border";
		}
	};

	const handleBorderColorChange = (color: string) => {
		onUpdate({
			...element,
			borderColor: color || "#000000",
		});
	};

	const handleHeaderColorChange = (color: string) => {
		onUpdate({
			...element,
			headerColor: color || "#ffffff",
		});
	};

	const handleCellColorChange = (color: string) => {
		onUpdate({
			...element,
			cellColor: color || "#ffffff",
		});
	};

	const handleTextColorChange = (color: string) => {
		onUpdate({
			...element,
			textColor: color || "#000000",
		});
	};

	const handleDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
		setShowColorPickers(true);
	};

	const handleTableClick = (e: MouseEvent) => {
		e.stopPropagation();
		setShowSizeControls(true);
	};

	const handleBlur = () => {
		setShowColorPickers(false);
		setShowSizeControls(false);
	};

	const handleRowsAdd = () => {
		const newRows = rows + 1;
		const newData = [...tableData];

		// Add a new row with empty cells
		newData.push(Array(columns).fill(""));

		onUpdate({
			...element,
			rows: newRows,
			data: newData,
		});
	};

	const handleRowsRemove = () => {
		if (rows <= 1) return;

		const newRows = rows - 1;
		const newData = tableData.slice(0, newRows);

		onUpdate({
			...element,
			rows: newRows,
			data: newData,
		});
	};

	const handleColumnsAdd = () => {
		const newColumns = columns + 1;

		// Add a new column to each row
		const newData = tableData.map((row) => [...row, ""]);

		onUpdate({
			...element,
			columns: newColumns,
			data: newData,
		});
	};

	const handleColumnsRemove = () => {
		if (columns <= 1) return;

		const newColumns = columns - 1;

		// Remove the last column from each row
		const newData = tableData.map((row) => row.slice(0, newColumns));

		onUpdate({
			...element,
			columns: newColumns,
			data: newData,
		});
	};

	const handleHeaderTypeChange = (value: string) => {
		onUpdate({
			...element,
			headerType: value as "none" | "simple" | "divided",
		});
	};

	// Apply custom colors to the table
	const tableBorderStyle = {
		...(element.borderColor && { borderColor: element.borderColor }),
	};

	const headerStyle = {
		...(element.headerColor && { backgroundColor: element.headerColor }),
		...(element.textColor && { color: element.textColor }),
	};

	const cellStyle = {
		...(element.cellColor && { backgroundColor: element.cellColor }),
		...(element.textColor && { color: element.textColor }),
		...(element.borderColor && { borderColor: element.borderColor }),
	};

	return (
		<div
			className={cn(
				"absolute cursor-move overflow-hidden",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			style={{
				left: `${element.x}px`,
				top: `${element.y}px`,
				width: `${element.width}px`,
				height: `${element.height}px`,
			}}
			onMouseDown={onMouseDown}
			onDoubleClick={handleDoubleClick}
			onClick={handleTableClick}
			onBlur={handleBlur}
		>
			<div className="w-full h-full overflow-auto bg-white">
				<Table className={getTableClassName()} style={tableBorderStyle}>
					{headerType !== "none" && (
						<TableHeader
							className={headerType === "divided" ? "border-b-2" : ""}
							style={
								element.borderColor ? { borderColor: element.borderColor } : {}
							}
						>
							<TableRow>
								{Array.from({ length: columns }).map((_, index) => (
									<TableHead
										key={index}
										className="h-8 px-2 text-xs"
										style={headerStyle}
									>
										{tableData[0]?.[index] || `Header ${index + 1}`}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
					)}
					<TableBody>
						{Array.from({
							length: headerType === "none" ? rows : rows - 1,
						}).map((_, rowIndex) => (
							<TableRow key={rowIndex}>
								{Array.from({ length: columns }).map((_, colIndex) => (
									<TableCell
										key={colIndex}
										className="h-8 px-2 text-xs"
										style={cellStyle}
									>
										{tableData[
											headerType === "none" ? rowIndex : rowIndex + 1
										]?.[colIndex] || ""}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{isSelected && showColorPickers && (
				<div className="absolute top-full left-0 mt-2 bg-white p-3 border border-gray-200 rounded shadow-md z-50 min-w-[240px]">
					<div className="space-y-4">
						<ColorPicker
							label="Border Color"
							color={element.borderColor || "#000000"}
							onChange={handleBorderColorChange}
						/>
						<ColorPicker
							label="Header Background"
							color={element.headerColor || "#ffffff"}
							onChange={handleHeaderColorChange}
						/>
						<ColorPicker
							label="Cell Background"
							color={element.cellColor || "#ffffff"}
							onChange={handleCellColorChange}
						/>
						<ColorPicker
							label="Text Color"
							color={element.textColor || "#000000"}
							onChange={handleTextColorChange}
						/>
					</div>
				</div>
			)}

			{isSelected && showSizeControls && (
				<div className="absolute top-0 right-0 mt-2 bg-white p-3 border border-gray-200 rounded shadow-md z-50">
					<div className="space-y-4">
						<div className="flex flex-col space-y-2">
							<label className="text-sm font-medium">Header Type</label>
							<Select
								defaultValue={headerType}
								onValueChange={handleHeaderTypeChange}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Header Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No Header</SelectItem>
									<SelectItem value="simple">Simple Header</SelectItem>
									<SelectItem value="divided">Divided Header</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col space-y-2">
							<label className="text-sm font-medium">Rows: {rows}</label>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleRowsRemove}
									disabled={rows <= 1}
								>
									<Minus size={16} />
								</Button>
								<Button variant="outline" size="sm" onClick={handleRowsAdd}>
									<Plus size={16} />
								</Button>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<label className="text-sm font-medium">Columns: {columns}</label>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleColumnsRemove}
									disabled={columns <= 1}
								>
									<Minus size={16} />
								</Button>
								<Button variant="outline" size="sm" onClick={handleColumnsAdd}>
									<Plus size={16} />
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
