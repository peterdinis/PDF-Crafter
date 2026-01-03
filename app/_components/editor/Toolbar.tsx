"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/global";
import type { PDFElement } from "@/types/global";
import {
	BarChart,
	BarChart3,
	ChevronDown,
	ChevronUp,
	Circle,
	Eye,
	EyeOff,
	Grid3X3,
	GripHorizontal,
	Image,
	Layers,
	LineChart,
	Minus,
	MousePointer2,
	Pencil,
	PieChart,
	Plus,
	PointerIcon,
	Settings,
	Shapes,
	Square,
	Table,
	TableProperties,
	Trash2,
	Type,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ToolbarProps {
	activeTool: Tool;
	onToolSelect: (tool: Tool) => void;
	onSettingsToggle: () => void;
	pageElements: PDFElement[];
	selectedElement: string | null;
	onSelectElement: (id: string | null) => void;
	onMoveElement: (id: string, direction: "up" | "down") => void;
	onDeleteElement: (id: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
	activeTool,
	onToolSelect,
	onSettingsToggle,
	pageElements,
	selectedElement,
	onSelectElement,
	onMoveElement,
	onDeleteElement,
}) => {
	const [activeCategory, setActiveCategory] = useState<string>("basic");

	const categories = [
		{ id: "basic", name: "Basic", icon: PointerIcon },
		{ id: "shapes", name: "Shapes", icon: Shapes },
		{ id: "tables", name: "Tables", icon: Grid3X3 },
		{ id: "charts", name: "Charts", icon: BarChart3 },
		{ id: "layers", name: "Layers", icon: Layers },
	];

	const toolGroups = {
		basic: [
			{
				name: "Selection",
				value: "select" as Tool,
				icon: PointerIcon,
				description: "Select and move elements",
			},
			{
				name: "Text Block",
				value: "text" as Tool,
				icon: Type,
				description: "Add editable text",
			},
			{
				name: "Heading 1",
				value: "text_h1" as Tool,
				icon: Type,
				description: "Large bold title",
			},
			{
				name: "Heading 2",
				value: "text_h2" as Tool,
				icon: Type,
				description: "Medium bold title",
			},
			{
				name: "Heading 3",
				value: "text_h3" as Tool,
				icon: Type,
				description: "Small bold title",
			},
			{
				name: "Bold Text",
				value: "text_bold" as Tool,
				icon: Type,
				description: "Emphasized bold text",
			},
			{
				name: "Italic Text",
				value: "text_italic" as Tool,
				icon: Type,
				description: "Slanted italic text",
			},
			{
				name: "Image",
				value: "image" as Tool,
				icon: Image,
				description: "Upload or paste image",
			},
			{
				name: "Free Draw",
				value: "pencil" as Tool,
				icon: Pencil,
				description: "Sketch with pencil",
			},
		],
		shapes: [
			{
				name: "Rectangle",
				value: "shape_rectangle" as Tool,
				icon: Square,
				description: "Geometric box",
			},
			{
				name: "Circle",
				value: "shape_circle" as Tool,
				icon: Circle,
				description: "Perfect oval",
			},
			{
				name: "Line",
				value: "shape_line" as Tool,
				icon: Minus,
				description: "Simple separator",
			},
		],
		tables: [
			{
				name: "Simple Table",
				value: "table_simple" as Tool,
				icon: Table,
				description: "Clean data grid",
			},
			{
				name: "Striped Table",
				value: "table_striped" as Tool,
				icon: TableProperties,
				description: "Zebra striped rows",
			},
			{
				name: "Bordered Table",
				value: "table_bordered" as Tool,
				icon: GripHorizontal,
				description: "Fully outlined grid",
			},
			{
				name: "Empty Table",
				value: "table_empty" as Tool,
				icon: Grid3X3,
				description: "2x2 skeleton table",
			},
		],
		charts: [
			{
				name: "Bar Chart",
				value: "chart_bar" as Tool,
				icon: BarChart,
				description: "Comparison chart",
			},
			{
				name: "Line Graph",
				value: "chart_line" as Tool,
				icon: LineChart,
				description: "Trend analysis",
			},
			{
				name: "Pie Chart",
				value: "chart_pie" as Tool,
				icon: PieChart,
				description: "Distribution view",
			},
		],
	};

	const renderChartPreview = (type: string) => {
		const colors = ["#3b82f6", "#10b981", "#f59e0b"];
		return (
			<div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
				<svg width="100%" height="100%" viewBox="0 0 100 40">
					{type === "chart_bar" && (
						<>
							<rect
								x="10"
								y="20"
								width="15"
								height="15"
								fill={colors[0]}
								rx="2"
							/>
							<rect
								x="30"
								y="10"
								width="15"
								height="25"
								fill={colors[1]}
								rx="2"
							/>
							<rect
								x="50"
								y="15"
								width="15"
								height="20"
								fill={colors[2]}
								rx="2"
							/>
						</>
					)}
					{type === "chart_line" && (
						<path
							d="M10,30 L30,10 L50,25 L80,5"
							fill="none"
							stroke={colors[0]}
							strokeWidth="3"
							strokeLinecap="round"
						/>
					)}
					{type === "chart_pie" && (
						<>
							<path d="M50,20 L50,5 A15,15 0 0,1 65,20 Z" fill={colors[0]} />
							<path d="M50,20 L65,20 A15,15 0 0,1 50,35 Z" fill={colors[1]} />
							<path d="M50,20 L50,35 A15,15 0 1,1 50,5 Z" fill={colors[2]} />
						</>
					)}
				</svg>
			</div>
		);
	};

	return (
		<div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm">
			<div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-editor-primary/5 to-transparent">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<div className="w-8 h-8 bg-editor-primary rounded-lg flex items-center justify-center text-dark dark:text-sky-100 shadow-lg">
						P
					</div>
					PDF Crafter
				</h2>
				<p className="text-xs text-gray-500 mt-1">
					Professional PDF Architecture
				</p>
			</div>

			{/* Category Tabs */}
			<div className="flex border-b border-gray-100 dark:border-gray-800 px-2 overflow-x-auto no-scrollbar">
				{categories.map((cat) => (
					<button
						key={cat.id}
						onClick={() => setActiveCategory(cat.id)}
						className={cn(
							"px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-all border-b-2",
							activeCategory === cat.id
								? "border-editor-primary text-editor-primary bg-editor-primary/5"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
						)}
					>
						<cat.icon size={14} />
						{cat.name}
					</button>
				))}
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
				<div>
					<h3 className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-3 tracking-widest px-2">
						{activeCategory.toUpperCase()}{" "}
						{activeCategory === "layers" ? "NAVIGATOR" : "ELEMENTS"}
					</h3>
					<div className="grid grid-cols-1 gap-2">
						{activeCategory === "layers" ? (
							<div className="space-y-1">
								{pageElements.length === 0 ? (
									<div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
										<Layers size={24} className="mx-auto text-gray-300 mb-2" />
										<p className="text-xs text-gray-400">
											No elements on this page
										</p>
									</div>
								) : (
									[...pageElements].reverse().map((el, idx) => (
										<div
											key={el.id}
											onClick={() => onSelectElement(el.id)}
											className={cn(
												"group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer",
												selectedElement === el.id
													? "bg-editor-primary/10 border-editor-primary/30"
													: "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700",
											)}
										>
											<div
												className={cn(
													"w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold",
													selectedElement === el.id
														? "bg-editor-primary text-white"
														: "bg-gray-100 dark:bg-gray-800 text-gray-400",
												)}
											>
												{pageElements.length - idx}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-semibold truncate text-gray-700 dark:text-gray-300">
													{el.type.charAt(0).toUpperCase() + el.type.slice(1)}
												</p>
												<p className="text-[10px] text-gray-400 truncate">
													{el.id.slice(0, 8)}...
												</p>
											</div>
											<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													onClick={(e) => {
														e.stopPropagation();
														onMoveElement(el.id, "up");
													}}
													className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600"
													title="Bring Forward"
												>
													<ChevronUp size={14} />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														onMoveElement(el.id, "down");
													}}
													className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600"
													title="Send Backward"
												>
													<ChevronDown size={14} />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														onDeleteElement(el.id);
													}}
													className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500"
													title="Delete"
												>
													<Trash2 size={14} />
												</button>
											</div>
										</div>
									))
								)}
							</div>
						) : (
							toolGroups[activeCategory as keyof typeof toolGroups].map(
								(tool) => (
									<div
										key={tool.value}
										draggable="true"
										onDragStart={(e) => {
											const data = {
												type: tool.value.split("_")[0],
												tool: tool.value,
												content: tool.name,
												shapeType: tool.value.startsWith("shape_")
													? tool.value.split("_")[1]
													: undefined,
												tableStyle: tool.value.startsWith("table_")
													? tool.value.split("_")[1]
													: undefined,
												chartType: tool.value.startsWith("chart_")
													? tool.value.split("_")[1]
													: undefined,
											};
											e.dataTransfer.setData(
												"application/json",
												JSON.stringify(data),
											);

											// Visual feedback for dragging
											const dragPreview = document.createElement("div");
											dragPreview.className =
												"p-3 bg-editor-primary text-white rounded shadow-xl text-xs font-bold";
											dragPreview.innerText = `Adding ${tool.name}`;
											dragPreview.style.position = "absolute";
											dragPreview.style.top = "-1000px";
											document.body.appendChild(dragPreview);
											e.dataTransfer.setDragImage(dragPreview, 0, 0);
											setTimeout(() => dragPreview.remove(), 0);
										}}
										className={cn(
											"group relative flex items-start gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-editor-primary/20",
											activeTool === tool.value
												? "bg-editor-primary/10 border-editor-primary/30 ring-1 ring-editor-primary/10"
												: "hover:bg-gray-50 dark:hover:bg-gray-800",
										)}
										onClick={() => onToolSelect(tool.value)}
										onDoubleClick={() => {
											onToolSelect(tool.value);
											// Small visual feedback
											toast.info(
												`Double-click shortcut: Click on canvas to place ${tool.name}`,
											);
										}}
									>
										<div
											className={cn(
												"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
												activeTool === tool.value
													? "bg-editor-primary text-white"
													: "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-editor-primary/10 group-hover:text-editor-primary",
											)}
										>
											<tool.icon size={20} />
										</div>
										<div className="flex-1">
											<p
												className={cn(
													"text-sm font-semibold mb-0.5",
													activeTool === tool.value
														? "text-editor-primary"
														: "text-gray-700 dark:text-gray-300",
												)}
											>
												{tool.name}
											</p>
											<p className="text-[10px] text-gray-500 leading-tight">
												{tool.description}
											</p>
											{activeCategory === "charts" &&
												renderChartPreview(tool.value)}
										</div>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Plus size={14} className="text-editor-primary" />
										</div>
									</div>
								),
							)
						)}
					</div>
				</div>

				{/* Quick Tips */}
				<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
					<p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
						Editor Pro Tip
					</p>
					<p className="text-xs text-blue-700/80 dark:text-blue-300/60 leading-relaxed">
						Drag elements directly onto the canvas or click to place them at
						current cursor position.
					</p>
				</div>
			</div>

			<div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
				<Button
					variant="ghost"
					className="w-full flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400 hover:text-editor-primary hover:bg-editor-primary/5 rounded-xl h-11"
					onClick={onSettingsToggle}
				>
					<Settings size={18} />
					Document Settings
				</Button>
			</div>
		</div>
	);
};
