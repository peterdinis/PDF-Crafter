"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/global";
import type { PDFElement } from "@/types/global";
import {
	BarChart,
	BarChart3,
	Calendar,
	CheckSquare,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Circle,
	Code,
	Columns,
	Eye,
	EyeOff,
	Grid3X3,
	GripHorizontal,
	Hash,
	Image,
	Laptop,
	Layers,
	LineChart,
	List,
	ListOrdered,
	Minus,
	MousePointer2,
	Pencil,
	PieChart,
	Plus,
	PointerIcon,
	QrCode,
	Quote,
	Settings,
	Shapes,
	Square,
	Table,
	TableProperties,
	Trash2,
	Type,
	Underline,
	Upload,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ToolbarProps {
	activeTool: Tool;
	onToolSelect: (tool: any) => void;
	onSettingsToggle: () => void;
	pageElements: PDFElement[];
	selectedElement: string | null;
	onSelectElement: (id: string | null) => void;
	onMoveElement: (id: string, direction: "up" | "down") => void;
	onDeleteElement: (id: string) => void;
	onCustomGraphUpload?: (data: any) => void;
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
	onCustomGraphUpload,
}) => {
	const [activeCategory, setActiveCategory] = useState<string>("basic");
	const [showCustomGraphModal, setShowCustomGraphModal] = useState(false);
	const [customGraphData, setCustomGraphData] = useState("");
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const categories = [
		{ id: "basic", name: "Basic", icon: PointerIcon },
		{ id: "shapes", name: "Shapes", icon: Shapes },
		{ id: "tables", name: "Tables", icon: Grid3X3 },
		{ id: "charts", name: "Charts", icon: BarChart3 },
		{ id: "media", name: "Media", icon: Image },
		{ id: "forms", name: "Forms", icon: CheckSquare },
		{ id: "code", name: "Code", icon: Code },
		{ id: "layers", name: "Layers", icon: Layers },
	];

	const toolGroups = {
		basic: [
			{
				name: "Selection",
				value: "select" as Tool,
				icon: MousePointer2, // Opravené z PointerIcon
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
				name: "Paragraph",
				value: "text_paragraph" as Tool,
				icon: Type,
				description: "Regular text paragraph",
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
				name: "Underline Text",
				value: "text_underline" as Tool,
				icon: Underline,
				description: "Underlined text",
			},
			{
				name: "Quote",
				value: "text_quote" as Tool,
				icon: Quote,
				description: "Block quotation",
			},
			{
				name: "Bullet List",
				value: "text_list" as Tool,
				icon: List,
				description: "Unordered bullet points",
			},
			{
				name: "Numbered List",
				value: "text_numbered" as Tool,
				icon: ListOrdered,
				description: "Ordered numbered list",
			},
			{
				name: "Divider",
				value: "divider" as Tool,
				icon: Minus,
				description: "Horizontal separator line",
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
			{
				name: "Triangle",
				value: "shape_triangle" as Tool,
				icon: Hash,
				description: "Three-sided shape",
			},
			{
				name: "Diamond",
				value: "shape_diamond" as Tool,
				icon: Hash,
				description: "Rhombus shape",
			},
			{
				name: "Star",
				value: "shape_star" as Tool,
				icon: Hash,
				description: "Five-pointed star",
			},
			{
				name: "Arrow",
				value: "shape_arrow" as Tool,
				icon: Minus,
				description: "Directional arrow",
			},
			{
				name: "Heart",
				value: "shape_heart" as Tool,
				icon: Hash,
				description: "Heart shape",
			},
			{
				name: "Hexagon",
				value: "shape_hexagon" as Tool,
				icon: Hash,
				description: "Six-sided shape",
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
			{
				name: "Wide Table",
				value: "table_wide" as Tool,
				icon: Columns,
				description: "5x3 wide table",
			},
			{
				name: "Calendar",
				value: "table_calendar" as Tool,
				icon: Calendar,
				description: "Monthly calendar grid",
			},
			{
				name: "Invoice Table",
				value: "table_invoice" as Tool,
				icon: Table,
				description: "Invoice style table",
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
			{
				name: "Area Chart",
				value: "chart_area" as Tool,
				icon: LineChart,
				description: "Filled trend chart",
			},
			{
				name: "Scatter Plot",
				value: "chart_scatter" as Tool,
				icon: BarChart,
				description: "Correlation points",
			},
			{
				name: "Radar Chart",
				value: "chart_radar" as Tool,
				icon: BarChart,
				description: "Multi-variable chart",
			},
			{
				name: "Gauge Chart",
				value: "chart_gauge" as Tool,
				icon: Circle,
				description: "Progress indicator",
			},
			{
				name: "Custom Graph",
				value: "chart_custom" as Tool,
				icon: Upload,
				description: "Upload your own graph",
				custom: true,
			},
		],
		media: [
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
			{
				name: "Signature",
				value: "signature" as Tool,
				icon: Pencil,
				description: "Digital signature area",
			},
			{
				name: "QR Code",
				value: "qrcode" as Tool,
				icon: QrCode,
				description: "Generate QR code",
			},
			{
				name: "Barcode",
				value: "barcode" as Tool,
				icon: Hash,
				description: "Product barcode",
			},
		],
		forms: [
			{
				name: "Text Field",
				value: "form_text" as Tool,
				icon: Type,
				description: "Single line input",
			},
			{
				name: "Text Area",
				value: "form_textarea" as Tool,
				icon: Type,
				description: "Multi-line input",
			},
			{
				name: "Checkbox",
				value: "form_checkbox" as Tool,
				icon: CheckSquare,
				description: "Multiple choice box",
			},
			{
				name: "Radio Button",
				value: "form_radio" as Tool,
				icon: Circle,
				description: "Single choice option",
			},
			{
				name: "Dropdown",
				value: "form_dropdown" as Tool,
				icon: ChevronDown,
				description: "Select menu",
			},
			{
				name: "Button",
				value: "form_button" as Tool,
				icon: Square,
				description: "Clickable button",
			},
			{
				name: "Date Picker",
				value: "form_date" as Tool,
				icon: Calendar,
				description: "Date selection field",
			},
			{
				name: "Range Slider",
				value: "form_range" as Tool,
				icon: Minus,
				description: "Value range selector",
			},
		],
		code: [
			{
				name: "Code Block",
				value: "code_block" as Tool,
				icon: Code,
				description: "Syntax highlighted code",
			},
			{
				name: "JSON Viewer",
				value: "code_json" as Tool,
				icon: Code,
				description: "Formatted JSON display",
			},
			{
				name: "HTML Embed",
				value: "code_html" as Tool,
				icon: Laptop,
				description: "Embed HTML content",
			},
			{
				name: "Math Formula",
				value: "code_math" as Tool,
				icon: Hash,
				description: "Mathematical equations",
			},
			{
				name: "SQL Query",
				value: "code_sql" as Tool,
				icon: Code,
				description: "Database query",
			},
		],
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
		}
	};

	const handleCustomGraphUpload = () => {
		try {
			if (!customGraphData.trim()) {
				toast.error("Please enter graph data");
				return;
			}

			const parsedData = JSON.parse(customGraphData);

			if (onCustomGraphUpload) {
				onCustomGraphUpload(parsedData);
				toast.success("Custom graph uploaded successfully");
				setShowCustomGraphModal(false);
				setCustomGraphData("");
			} else {
				// Fallback - create a custom chart element
				onToolSelect("chart_custom");
				toast.success(
					"Custom graph tool selected. Click on canvas to place it.",
				);
			}
		} catch (error) {
			toast.error("Invalid JSON data. Please check your format.");
			console.error("Error parsing custom graph data:", error);
		}
	};

	const renderShapePreview = (type: string) => {
		const strokeColor = "rgb(59, 130, 246)"; // editor-primary color

		return (
			<div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
				<svg
					width="60"
					height="30"
					viewBox="0 0 100 50"
					className="overflow-visible"
				>
					{type === "shape_rectangle" && (
						<rect
							x="10"
							y="10"
							width="80"
							height="30"
							fill={strokeColor}
							rx="3"
						/>
					)}
					{type === "shape_circle" && (
						<circle cx="50" cy="25" r="15" fill={strokeColor} />
					)}
					{type === "shape_triangle" && (
						<polygon points="50,10 80,40 20,40" fill={strokeColor} />
					)}
					{type === "shape_diamond" && (
						<polygon points="50,10 80,25 50,40 20,25" fill={strokeColor} />
					)}
					{type === "shape_star" && (
						<path
							d="M50,10 L55,30 L75,30 L60,40 L65,60 L50,45 L35,60 L40,40 L25,30 L45,30 Z"
							fill={strokeColor}
						/>
					)}
					{type === "shape_arrow" && (
						<>
							<line
								x1="20"
								y1="25"
								x2="70"
								y2="25"
								stroke={strokeColor}
								strokeWidth="3"
							/>
							<polygon points="70,20 80,25 70,30" fill={strokeColor} />
						</>
					)}
					{type === "shape_heart" && (
						<path
							d="M50,35 C55,30 65,25 65,20 C65,15 60,10 55,10 C50,10 45,15 45,20 C45,25 50,30 50,35 C50,30 55,25 55,20 C55,15 60,10 55,10 C50,10 45,15 45,20 C45,25 50,30 50,35"
							fill={strokeColor}
						/>
					)}
					{type === "shape_hexagon" && (
						<polygon
							points="50,10 75,20 75,40 50,50 25,40 25,20"
							fill={strokeColor}
						/>
					)}
				</svg>
			</div>
		);
	};

	const renderChartPreview = (type: string) => {
		const colors = [
			"#3b82f6",
			"#10b981",
			"#f59e0b",
			"#8b5cf6",
			"#ec4899",
			"#ef4444",
		];

		return (
			<div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2 overflow-hidden">
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 100 40"
					className="overflow-visible"
				>
					{type === "chart_bar" && (
						<>
							{colors.slice(0, 6).map((color, i) => (
								<rect
									key={i}
									x={5 + i * 15}
									y={25 - i * 3}
									width="10"
									height={8 + i * 3}
									fill={color}
									rx="2"
								/>
							))}
						</>
					)}
					{type === "chart_line" && (
						<path
							d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5"
							fill="none"
							stroke={colors[0]}
							strokeWidth="3"
							strokeLinecap="round"
						/>
					)}
					{type === "chart_pie" && (
						<>
							<path d="M50,20 L50,5 A15,15 0 0,1 65,20 Z" fill={colors[0]} />
							<path d="M50,20 L65,20 A15,15 0 0,1 55,35 Z" fill={colors[1]} />
							<path d="M50,20 L55,35 A15,15 0 1,1 50,5 Z" fill={colors[2]} />
						</>
					)}
					{type === "chart_area" && (
						<path
							d="M10,30 L25,15 L40,25 L55,10 L70,20 L85,5 L85,40 L10,40 Z"
							fill={colors[0]}
							fillOpacity="0.3"
							stroke={colors[0]}
							strokeWidth="2"
						/>
					)}
					{type === "chart_scatter" && (
						<>
							{[10, 20, 30, 40, 50, 60, 70, 80].map((x, i) => (
								<circle
									key={i}
									cx={x}
									cy={10 + Math.random() * 25}
									r="2.5"
									fill={colors[i % colors.length]}
								/>
							))}
						</>
					)}
					{type === "chart_radar" && (
						<polygon
							points="50,5 70,15 80,35 60,45 40,45 20,35 30,15"
							fill={colors[0]}
							fillOpacity="0.3"
							stroke={colors[0]}
							strokeWidth="2"
						/>
					)}
					{type === "chart_gauge" && (
						<>
							<circle
								cx="50"
								cy="25"
								r="15"
								fill="none"
								stroke={colors[0]}
								strokeWidth="3"
								strokeDasharray="70 100"
							/>
							<circle cx="50" cy="25" r="12" fill={colors[0]} />
						</>
					)}
					{type === "chart_custom" && (
						<>
							<rect
								x="20"
								y="15"
								width="60"
								height="20"
								fill={colors[2]}
								fillOpacity="0.3"
								rx="3"
							/>
							<text
								x="50"
								y="28"
								textAnchor="middle"
								fill={colors[2]}
								fontSize="8"
								fontWeight="bold"
							>
								CUSTOM
							</text>
						</>
					)}
				</svg>
			</div>
		);
	};

	const renderFormPreview = (type: string) => {
		const borderColor = "rgb(209, 213, 219)"; // gray-300
		const darkBorderColor = "rgb(55, 65, 81)"; // gray-700
		const textColor = "rgb(17, 24, 39)"; // gray-900
		const darkTextColor = "rgb(243, 244, 246)"; // gray-100

		return (
			<div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-1 mt-2">
				<div className="w-full px-2">
					{type === "form_text" && (
						<div className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100">
							Text field
						</div>
					)}
					{type === "form_textarea" && (
						<div className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 h-8 text-xs text-gray-900 dark:text-gray-100">
							Multi-line text
						</div>
					)}
					{type === "form_checkbox" && (
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800"></div>
							<span className="text-xs text-gray-700 dark:text-gray-300">
								Checkbox
							</span>
						</div>
					)}
					{type === "form_radio" && (
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 border border-gray-400 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800"></div>
							<span className="text-xs text-gray-700 dark:text-gray-300">
								Radio
							</span>
						</div>
					)}
					{type === "form_button" && (
						<button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
							Button
						</button>
					)}
					{type === "form_range" && (
						<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
							<div className="bg-blue-500 h-1.5 rounded-full w-1/3"></div>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm">
				<div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-editor-primary/5 to-transparent">
					<h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 flex items-center gap-2">
						<div className="w-8 h-8 bg-editor-primary rounded-lg flex items-center justify-center text-zinc-800 dark:text-sky-100 shadow-lg">
							P
						</div>
						PDF Crafter
					</h2>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Professional PDF Architecture
					</p>
				</div>

				{/* Category Tabs with Scroll Arrows */}
				<div className="relative border-b border-gray-100 dark:border-gray-800">
					<button
						onClick={scrollLeft}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800"
						aria-label="Scroll left"
					>
						<ChevronLeft
							size={16}
							className="text-gray-500 dark:text-gray-400"
						/>
					</button>

					<div
						ref={scrollContainerRef}
						className="flex px-8 overflow-x-auto scrollbar-hide"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{categories.map((cat) => {
							const Icon = cat.icon;
							return (
								<button
									key={cat.id}
									onClick={() => setActiveCategory(cat.id)}
									className={cn(
										"px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap flex-shrink-0",
										activeCategory === cat.id
											? "border-editor-primary text-editor-primary bg-editor-primary/5"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
									)}
								>
									<Icon size={14} />
									{cat.name}
								</button>
							);
						})}
					</div>

					<button
						onClick={scrollRight}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l border-gray-100 dark:border-gray-800"
						aria-label="Scroll right"
					>
						<ChevronRight
							size={16}
							className="text-gray-500 dark:text-gray-400"
						/>
					</button>
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
											<Layers
												size={24}
												className="mx-auto text-gray-300 dark:text-gray-700 mb-2"
											/>
											<p className="text-xs text-gray-400 dark:text-gray-500">
												No elements on this page
											</p>
										</div>
									) : (
										[...pageElements].reverse().map((el, idx) => {
											const actualIndex = pageElements.length - idx - 1;
											return (
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
																: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
														)}
													>
														{actualIndex + 1}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-semibold truncate text-gray-700 dark:text-gray-300">
															{el.type
																.replace("_", " ")
																.charAt(0)
																.toUpperCase() +
																el.type.replace("_", " ").slice(1)}
														</p>
														<p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
															ID: {el.id.slice(0, 8)}
														</p>
													</div>
													<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
														<button
															onClick={(e) => {
																e.stopPropagation();
																onMoveElement(el.id, "up");
															}}
															className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
															title="Bring Forward"
														>
															<ChevronUp size={14} />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																onMoveElement(el.id, "down");
															}}
															className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
											);
										})
									)}
								</div>
							) : (
								(
									toolGroups[activeCategory as keyof typeof toolGroups] || []
								).map((tool: any) => {
									const Icon = tool.icon;
									return (
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
													formType: tool.value.startsWith("form_")
														? tool.value.split("_")[1]
														: undefined,
													codeType: tool.value.startsWith("code_")
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
												"group relative flex items-start gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all border",
												activeTool === tool.value
													? "bg-editor-primary/10 border-editor-primary/30 ring-1 ring-editor-primary/10"
													: "border-transparent hover:border-editor-primary/20 hover:bg-gray-50 dark:hover:bg-gray-800",
											)}
											onClick={() => {
												if (tool.value === "chart_custom") {
													setShowCustomGraphModal(true);
												} else {
													onToolSelect(tool.value);
												}
											}}
											onDoubleClick={() => {
												if (tool.value === "chart_custom") {
													setShowCustomGraphModal(true);
												} else {
													onToolSelect(tool.value);
													toast.info(
														`Double-click shortcut: Click on canvas to place ${tool.name}`,
													);
												}
											}}
										>
											<div
												className={cn(
													"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
													activeTool === tool.value
														? "bg-editor-primary text-white"
														: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-editor-primary/10 group-hover:text-editor-primary",
												)}
											>
												<Icon size={20} />
											</div>
											<div className="flex-1 min-w-0">
												<p
													className={cn(
														"text-sm font-semibold mb-0.5 truncate",
														activeTool === tool.value
															? "text-editor-primary"
															: "text-gray-700 dark:text-gray-300",
													)}
												>
													{tool.name}
												</p>
												<p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">
													{tool.description}
												</p>

												{/* Special previews for different categories */}
												{activeCategory === "shapes" &&
													renderShapePreview(tool.value)}
												{activeCategory === "charts" &&
													renderChartPreview(tool.value)}
												{activeCategory === "forms" &&
													renderFormPreview(tool.value)}
											</div>
											<div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
												<Plus size={14} className="text-editor-primary" />
											</div>
										</div>
									);
								})
							)}
						</div>
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

			{/* Custom Graph Modal */}
			{showCustomGraphModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-bold text-gray-900 dark:text-white">
								Upload Custom Graph
							</h3>
							<button
								onClick={() => setShowCustomGraphModal(false)}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							>
								✕
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Graph Data (JSON Format)
								</label>
								<textarea
									value={customGraphData}
									onChange={(e) => setCustomGraphData(e.target.value)}
									className="w-full h-48 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
									placeholder={`Example:
{
  "type": "custom",
  "title": "My Custom Chart",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "datasets": [
      {
        "label": "Sales",
        "data": [100, 200, 150, 300],
        "backgroundColor": "#3b82f6"
      }
    ]
  }
}`}
								/>
							</div>

							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<div className="w-2 h-2 rounded-full bg-blue-500"></div>
								<span>
									Supports: Bar, Line, Pie, Area, Scatter, Radar charts
								</span>
							</div>

							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => setShowCustomGraphModal(false)}
								>
									Cancel
								</Button>
								<Button
									className="flex-1 bg-editor-primary hover:bg-editor-primary/90"
									onClick={handleCustomGraphUpload}
								>
									<Upload size={16} className="mr-2" />
									Upload Graph
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
