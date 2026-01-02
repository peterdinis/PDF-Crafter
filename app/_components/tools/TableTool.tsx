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
import type { TableElement } from "@/types/global";
import { Minus, Plus, Trash2 } from "lucide-react";
import { type FC, type MouseEvent, useState, useEffect, useRef } from "react";
import { ColorPicker } from "../shared/pickers/ColorPicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
	const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
	const [cellValue, setCellValue] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const tableData =
		data && data.length > 0 ? data : Array(rows).fill(Array(columns).fill(""));

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

	const getRowClassName = (rowIndex: number, isHeader: boolean = false) => {
		if (isHeader) {
			return "bg-gray-100 dark:bg-gray-800 font-semibold";
		}

		switch (tableStyle) {
			case "striped":
				// Pre striped: párne riadky majú pozadie (počítame od 0, takže párne = even)
				const actualRowIndex = headerType === "none" ? rowIndex : rowIndex + 1;
				return actualRowIndex % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/30" : "";
			case "bordered":
				return "border-b border-gray-300 dark:border-gray-600";
			case "simple":
			default:
				return "border-b border-gray-200 dark:border-gray-700";
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

	const handleCellClick = (rowIndex: number, colIndex: number, e: MouseEvent) => {
		e.stopPropagation();
		// Pre header row je rowIndex -1, inak je to normálny rowIndex
		const actualRowIndex = rowIndex === -1 ? 0 : (headerType === "none" ? rowIndex : rowIndex + 1);
		const currentValue = tableData[actualRowIndex]?.[colIndex] || "";
		setEditingCell({ row: actualRowIndex, col: colIndex });
		setCellValue(currentValue);
	};

	const handleCellChange = (value: string) => {
		setCellValue(value);
	};

	const handleCellBlur = () => {
		if (editingCell) {
			const newData = [...tableData];
			if (!newData[editingCell.row]) {
				newData[editingCell.row] = Array(columns).fill("");
			}
			newData[editingCell.row][editingCell.col] = cellValue;

			onUpdate({
				...element,
				data: newData,
			});
		}
		setEditingCell(null);
	};

	const handleCellKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleCellBlur();
			// Navigácia na ďalšiu bunku
			moveToNextCell();
		} else if (e.key === "Escape") {
			setEditingCell(null);
			setCellValue("");
		} else if (e.key === "Tab") {
			e.preventDefault();
			handleCellBlur();
			// Navigácia na ďalšiu bunku pomocou Tab
			moveToNextCell(e.shiftKey);
		} else if (e.key === "ArrowRight" && !e.shiftKey) {
			const target = e.target as HTMLTextAreaElement;
			if (target.selectionStart === target.value.length && target.value.length > 0) {
				e.preventDefault();
				handleCellBlur();
				moveToNextCell();
			}
		} else if (e.key === "ArrowLeft" && !e.shiftKey) {
			const target = e.target as HTMLTextAreaElement;
			if (target.selectionStart === 0 && target.value.length > 0) {
				e.preventDefault();
				handleCellBlur();
				moveToNextCell(true);
			}
		} else if (e.key === "ArrowDown" && !e.shiftKey) {
			e.preventDefault();
			handleCellBlur();
			moveToCell(editingCell!.row + 1, editingCell!.col);
		} else if (e.key === "ArrowUp" && !e.shiftKey) {
			e.preventDefault();
			handleCellBlur();
			if (editingCell!.row > 0) {
				moveToCell(editingCell!.row - 1, editingCell!.col);
			}
		}
	};

	const moveToNextCell = (backward: boolean = false) => {
		if (!editingCell) return;

		let newRow = editingCell.row;
		let newCol = backward ? editingCell.col - 1 : editingCell.col + 1;

		if (newCol < 0) {
			newCol = columns - 1;
			newRow = Math.max(0, newRow - 1);
		} else if (newCol >= columns) {
			newCol = 0;
			newRow = Math.min(rows - 1, newRow + 1);
		}

		moveToCell(newRow, newCol);
	};

	const moveToCell = (row: number, col: number) => {
		if (row < 0 || row >= rows || col < 0 || col >= columns) return;

		const currentValue = tableData[row]?.[col] || "";
		setEditingCell({ row, col });
		setCellValue(currentValue);
	};

	useEffect(() => {
		if (editingCell && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editingCell]);

	const tableBorderStyle = {
		...(element.borderColor && { borderColor: element.borderColor }),
	};

	const headerStyle = {
		...(element.headerColor && { backgroundColor: element.headerColor }),
		...(element.textColor && { color: element.textColor }),
	};

	const getCellStyle = (rowIndex: number, isHeader: boolean = false) => {
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

		// Pre striped tabuľky, ak je bunka v párnom riadku, použijeme špeciálnu farbu
		if (tableStyle === "striped") {
			const actualRowIndex = headerType === "none" ? rowIndex : rowIndex + 1;
			if (actualRowIndex % 2 === 0) {
				return baseStyle; // Párny riadok má už pozadie z CSS
			}
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
				<Table className={cn(getTableClassName(), "w-full")} style={tableBorderStyle}>
					{headerType !== "none" && (
						<TableHeader
							className={headerType === "divided" ? "border-b-2" : ""}
							style={
								element.borderColor ? { borderColor: element.borderColor } : {}
							}
						>
							<TableRow className={cn(getRowClassName(-1, true))}>
								{Array.from({ length: columns }).map((_, index) => {
									const isEditing = editingCell?.row === 0 && editingCell?.col === index;

									return (
										<TableHead
											key={index}
											className={cn(
												"h-8 px-2 text-xs relative transition-colors",
												isEditing && "ring-2 ring-blue-500 ring-offset-1",
												!isEditing && "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-text"
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
													{tableData[0]?.[index] || `Header ${index + 1}`}
												</span>
											)}
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
					)}
					<TableBody>
						{Array.from({
							length: headerType === "none" ? rows : rows - 1,
						}).map((_, rowIndex) => {
							const actualRowIndex = headerType === "none" ? rowIndex : rowIndex + 1;

							return (
								<TableRow key={rowIndex} className={cn(getRowClassName(rowIndex))}>
									{Array.from({ length: columns }).map((_, colIndex) => {
										const isEditing = editingCell?.row === actualRowIndex && editingCell?.col === colIndex;

										return (
											<TableCell
												key={colIndex}
												className={cn(
													"h-8 px-2 text-xs relative transition-colors",
													isEditing && "ring-2 ring-blue-500 ring-offset-1",
													!isEditing && "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-text"
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
														{tableData[actualRowIndex]?.[colIndex] || ""}
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
