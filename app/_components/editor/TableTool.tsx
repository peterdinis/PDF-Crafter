"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TableElement } from "@/types";
import type { FC, MouseEvent } from "react";

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
		>
			<div className="w-full h-full overflow-auto bg-white">
				<Table className={getTableClassName()}>
					{headerType !== "none" && (
						<TableHeader
							className={headerType === "divided" ? "border-b-2" : ""}
						>
							<TableRow>
								{Array.from({ length: columns }).map((_, index) => (
									<TableHead key={index} className="h-8 px-2 text-xs">
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
									<TableCell key={colIndex} className="h-8 px-2 text-xs">
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
		</div>
	);
};
