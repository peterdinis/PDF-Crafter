"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TableElement } from "@/types/global";
import { Minus, Plus, Trash2 } from "lucide-react";
import { type FC, type MouseEvent, useEffect, useRef, useState } from "react";
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
	const [editingCell, setEditingCell] = useState<{
		row: number; // -1 for header
		col: number;
	} | null>(null);
	const [cellValue, setCellValue] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const headers = data?.headers || Array(columns).fill("");
	const bodyRows = data?.rows || Array(rows).fill(Array(columns).fill(""));

	const getTableClassName = () => {
		switch (tableStyle) {
			case "striped":
				return "border [&_tr:nth-child(even)]:bg-gray-100 dark:[&_tr:nth-child(even)]:bg-gray-800";
			case "bordered":
				return "border [&_td]:border [&_th]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600 [&_th]:border-gray-300 dark:[&_th]:border-gray-600";
			case "simple":
			default:
				return "border border-gray-200 dark:border-gray-700";
		}
	};

	const getRowClassName = (rowIndex: number, isHeader = false) => {
		if (isHeader) {
			return "bg-gray-100 dark:bg-gray-800 font-semibold";
		}

		switch (tableStyle) {
			case "striped":
				// Stripped styling handled by CSS select in getTableClassName
				return "";
			case "bordered":
				return "border-b border-gray-300 dark:border-gray-600";
			case "simple":
			default:
				return "border-b border-gray-200 dark:border-gray-700";
		}
	};

	const handleCellClick = (
		rowIndex: number, // -1 for header
		colIndex: number,
		e: MouseEvent,
	) => {
		e.stopPropagation();
		let currentValue = "";
		if (rowIndex === -1) {
			currentValue = headers[colIndex] || "";
		} else {
			currentValue = bodyRows[rowIndex]?.[colIndex] || "";
		}

		setEditingCell({ row: rowIndex, col: colIndex });
		setCellValue(currentValue);
	};

	const handleCellChange = (value: string) => {
		setCellValue(value);
	};

	const handleCellBlur = () => {
		if (editingCell) {
			if (editingCell.row === -1) {
				// Header update
				const newHeaders = [...headers];
				newHeaders[editingCell.col] = cellValue;
				onUpdate({
					...element,
					data: {
						...data,
						headers: newHeaders,
					},
				});
			} else {
				// Body update
				const newRows = [...bodyRows];
				const rowIndex = editingCell.row;
				// Ensure row exists
				if (!newRows[rowIndex]) newRows[rowIndex] = Array(columns).fill("");

				const newRow = [...newRows[rowIndex]];
				newRow[editingCell.col] = cellValue;
				newRows[rowIndex] = newRow;

				onUpdate({
					...element,
					data: {
						...data,
						rows: newRows,
					},
				});
			}
		}
		setEditingCell(null);
	};

	const handleCellKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Navigation logic similar to before, but handling -1 for header
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleCellBlur();
			// Move down
			moveToCell(editingCell!.row + 1, editingCell!.col);
		} else if (e.key === "Escape") {
			setEditingCell(null);
			setCellValue("");
		} else if (e.key === "Tab") {
			e.preventDefault();
			handleCellBlur();
			moveToNextCell(e.shiftKey);
		}
		// ... other arrow keys navigation could be implemented here
	};

	const moveToNextCell = (backward = false) => {
		if (!editingCell) return;
		// Simplified next cell logic
		let newRow = editingCell.row;
		let newCol = backward ? editingCell.col - 1 : editingCell.col + 1;

		if (newCol >= columns) {
			newCol = 0;
			newRow++;
		} else if (newCol < 0) {
			newCol = columns - 1;
			newRow--;
		}

		// Bound checking
		if (newRow < -1) newRow = -1; // Cap at header
		if (newRow >= bodyRows.length) newRow = bodyRows.length - 1; // Cap at end

		moveToCell(newRow, newCol);
	};


	const moveToCell = (row: number, col: number) => {
		// Bounds check
		// Allow row = -1 (header) if headerType != none
		const minRow = headerType === "none" ? 0 : -1;

		if (row < minRow || row >= rows || col < 0 || col >= columns) return;

		let currentValue = "";
		if (row === -1) {
			currentValue = headers[col] || "";
		} else {
			currentValue = bodyRows[row]?.[col] || "";
		}

		setEditingCell({ row, col });
		setCellValue(currentValue);
	};

	// Effects and Styles...
	useEffect(() => {
		if (editingCell && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editingCell]);

	const tableBorderStyle = {
		...(element.borderColor && { borderColor: element.borderColor }),
	};

	const getCellStyle = (rowIndex: number, isHeader = false) => {
		const baseStyle: React.CSSProperties = {
			...(element.textColor && { color: element.textColor }),
			...(element.borderColor && { borderColor: element.borderColor }),
		};

		if (isHeader) {
			return {
				...baseStyle,
				...(element.headerColor && { backgroundColor: element.headerColor }),
			};
		}

		if (tableStyle === "striped") {
			// Even rows in body have specific color - depends on implementation
			// If striped class is used, we might not want to override bg unless specific cellColor is set
		}

		return {
			...baseStyle,
			...(element.cellColor && { backgroundColor: element.cellColor }),
		};
	};

	return (
		<div
			className={cn(
				"w-full h-full overflow-hidden",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			onMouseDown={onMouseDown}
		>
			<div className="w-full h-full overflow-auto bg-white dark:bg-gray-900">
				<Table
					className={cn(getTableClassName(), "w-full")}
					style={tableBorderStyle}
				>
					{headerType !== "none" && (
						<TableHeader
							className={headerType === "divided" ? "border-b-2" : ""}
							style={
								element.borderColor ? { borderColor: element.borderColor } : {}
							}
						>
							<TableRow className={cn(getRowClassName(-1, true))}>
								{Array.from({ length: columns }).map((_, index) => {
									const isEditing =
										editingCell?.row === -1 && editingCell?.col === index;

									return (
										<TableHead
											key={index}
											className={cn(
												"h-8 px-2 text-xs relative transition-colors",
												isEditing && "ring-2 ring-blue-500 ring-offset-1",
												!isEditing &&
												"hover:bg-gray-100 dark:hover:bg-gray-700 cursor-text",
											)}
											style={getCellStyle(-1, true)}
											onClick={(e) => handleCellClick(-1, index, e)}
										>
											{isEditing ? (
												<Textarea
													ref={inputRef}
													value={cellValue}
													onChange={(e) => handleCellChange(e.target.value)}
													onBlur={handleCellBlur}
													onKeyDown={handleCellKeyDown}
													className="min-h-[24px] text-xs p-1 resize-none border-blue-500 focus:ring-2 focus:ring-blue-500 w-full"
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
													rows={1}
												/>
											) : (
												<span className="block truncate">
													{headers[index] || `Header ${index + 1}`}
												</span>
											)}
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
					)}
					<TableBody>
						{bodyRows.map((row, rowIndex) => {
							return (
								<TableRow
									key={rowIndex}
									className={cn(getRowClassName(rowIndex))}
								>
									{Array.from({ length: columns }).map((_, colIndex) => {
										const isEditing =
											editingCell?.row === rowIndex &&
											editingCell?.col === colIndex;

										return (
											<TableCell
												key={colIndex}
												className={cn(
													"h-8 px-2 text-xs relative transition-colors",
													isEditing && "ring-2 ring-blue-500 ring-offset-1",
													!isEditing &&
													"hover:bg-gray-100 dark:hover:bg-gray-700 cursor-text",
												)}
												style={getCellStyle(rowIndex)}
												onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
											>
												{isEditing ? (
													<Textarea
														ref={inputRef}
														value={cellValue}
														onChange={(e) => handleCellChange(e.target.value)}
														onBlur={handleCellBlur}
														onKeyDown={handleCellKeyDown}
														className="min-h-[24px] text-xs p-1 resize-none border-blue-500 focus:ring-2 focus:ring-blue-500 w-full"
														onClick={(e) => e.stopPropagation()}
														onMouseDown={(e) => e.stopPropagation()}
														rows={1}
													/>
												) : (
													<span className="block truncate">
														{row[colIndex] || ""}
													</span>
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
