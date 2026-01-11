import { CSSProperties } from "react";

export type Tool =
	| "select"
	// Text tools
	| "text"
	| "text_h1"
	| "text_h2"
	| "text_h3"
	| "text_paragraph"
	| "text_bold"
	| "text_italic"
	| "text_underline"
	| "text_quote"
	| "text_list"
	| "text_numbered"
	// Shape tools
	| "shape_rectangle"
	| "shape_circle"
	| "shape_line"
	| "shape_triangle"
	| "shape_diamond"
	| "shape_star"
	| "shape_arrow"
	| "shape_heart"
	| "shape_hexagon"
	| "shape_cloud"
	| "shape_speech_bubble"
	// Table tools
	| "table_simple"
	| "table_striped"
	| "table_bordered"
	| "table_empty"
	| "table_wide"
	| "table_calendar"
	| "table_invoice"
	// Chart tools
	| "chart_bar"
	| "chart_line"
	| "chart_pie"
	| "chart_doughnut"
	| "chart_area"
	| "chart_scatter"
	| "chart_radar"
	| "chart_gauge"
	// Media tools
	| "image"
	| "pencil"
	| "signature"
	| "qrcode"
	| "barcode"
	// Form tools
	| "form_text"
	| "form_textarea"
	| "form_checkbox"
	| "form_switch"
	| "form_radio"
	| "form_dropdown"
	| "form_button"
	| "form_date"
	| "form_range"
	// Code tools
	| "code_block"
	| "code_json"
	| "code_html"
	| "code_css"
	| "code_math"
	| "code_sql"
	// Misc
	| "divider";

export type TextStyle =
	| "normal"
	| "h1"
	| "h2"
	| "h3"
	| "paragraph"
	| "bold"
	| "italic"
	| "underline"
	| "quote"
	| "list"
	| "numbered";

export type ShapeType =
	| "rectangle"
	| "circle"
	| "line"
	| "triangle"
	| "diamond"
	| "star"
	| "arrow"
	| "heart"
	| "hexagon"
	| "cloud"
	| "speech_bubble";

export type TableStyle =
	| "simple"
	| "striped"
	| "bordered"
	| "empty"
	| "wide"
	| "calendar"
	| "invoice";

export type ChartType =
	| "bar"
	| "line"
	| "pie"
	| "doughnut"
	| "area"
	| "scatter"
	| "radar"
	| "gauge";

export type FormType =
	| "text"
	| "textarea"
	| "checkbox"
	| "switch"
	| "radio"
	| "dropdown"
	| "button"
	| "date"
	| "range";

export type CodeType = "block" | "json" | "html" | "css" | "math" | "sql";

export type DividerStyle = "solid" | "dashed" | "dotted";

export interface PDFElementBase {
	id: string;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation?: number;
	opacity?: number;
	locked?: boolean;
	visible?: boolean;
}

export interface TextElement extends PDFElementBase {
	type: "text";
	content: string;
	style: TextStyle;
	fontSize: number;
	fontFamily: string;
	color: string;
	fontWeight: string;
	fontStyle: string;
	align?: "left" | "center" | "right" | "justify";
	lineHeight?: number;
	backgroundColor?: string;
	padding?: number;
}

export interface ShapeElement extends PDFElementBase {
	type: "shape";
	shapeType: ShapeType;
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	borderRadius?: number;
	gradient?: {
		startColor: string;
		endColor: string;
		angle: number;
	};
	// Compatibility/Legacy properties
	fill?: string;
	stroke?: string;
}

export interface TableElement extends PDFElementBase {
	type: "table";
	rows: number;
	columns: number;
	style: TableStyle;
	// Specific properties used in code
	tableStyle?: TableStyle;
	headerType?: "simple" | "none" | "firstRow" | "divided";
	data: {
		headers: string[];
		rows: string[][];
	};
	headerColor?: string;
	rowColors?: string[];
	borderColor?: string;
	borderWidth?: number;
	textColor?: string;
	cellColor?: string;
}

export interface ChartElement extends PDFElementBase {
	type: "chart";
	chartType: ChartType;
	data: {
		labels: string[];
		datasets: Array<{
			label: string;
			data: number[];
			backgroundColor: string;
			borderColor?: string;
		}>;
	};
	title?: string;
	showLegend?: boolean;
	showGrid?: boolean;
	seriesColors?: string[];
	backgroundColor?: string;
	gridColor?: string;
	showAxes?: boolean;
	axesColor?: string;
}

export interface ImageElement extends PDFElementBase {
	type: "image";
	src: string;
	alt: string;
	fit?: "contain" | "cover" | "fill";
	borderRadius?: number;
	filter?: string;
}

export interface DrawingElement extends PDFElementBase {
	type: "drawing";
	paths: Array<{
		points: Array<{ x: number; y: number }>;
		color: string;
		width: number;
	}>;
	strokeColor: string;
	strokeWidth: number;
	background?: string;
}

export interface FormElement extends PDFElementBase {
	type: "form";
	formType: FormType;
	label: string;
	placeholder?: string;
	required: boolean;
	options?: string[];
	value?: string;
	min?: number;
	max?: number;
	step?: number;
	validation?: {
		pattern?: string;
		minLength?: number;
		maxLength?: number;
	};
}

export interface CodeElement extends PDFElementBase {
	type: "code";
	codeType: CodeType;
	content: string;
	language: string;
	theme?: "light" | "dark";
	showLineNumbers?: boolean;
	fontSize?: number;
}

export interface DividerElement extends PDFElementBase {
	type: "divider";
	color: string;
	style: DividerStyle;
	thickness: number;
	margin?: number;
}

export interface QRCodeElement extends PDFElementBase {
	type: "qrcode";
	content: string;
	color: string;
	backgroundColor: string;
	errorCorrection?: "L" | "M" | "Q" | "H";
}

export interface SignatureElement extends PDFElementBase {
	type: "signature";
	signatureData?: string;
	penColor: string;
	penWidth: number;
	placeholder?: string;
}

export interface BarcodeElement extends PDFElementBase {
	type: "barcode";
	value: string;
	format: string;
	color: string;
	backgroundColor: string;
}

// Pencil Element
export interface PencilElement extends PDFElementBase {
	type: "pencil";
	points: Array<{ x: number; y: number }>;
	color: string;
	strokeWidth: number;
}

export type PDFElement =
	| TextElement
	| ShapeElement
	| TableElement
	| ChartElement
	| ImageElement
	| DrawingElement
	| FormElement
	| CodeElement
	| DividerElement
	| QRCodeElement
	| SignatureElement
	| BarcodeElement
	| PencilElement;

export interface PDFPage {
	id: string;
	elements: PDFElement[];
	backgroundColor?: string;
	margin?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
}

export interface PDFDocument {
	title: string;
	pageSize:
	| "a3"
	| "a4"
	| "a5"
	| "letter"
	| "legal"
	| "tabloid"
	| "executive"
	| "b5"
	| "b4"
	| "jisb4"
	| "jisb5"
	| "custom";
	orientation: "portrait" | "landscape";
	defaultTextColor: string;
	defaultFontFamily: string;
	defaultFontSize: number;
	pages: PDFPage[];
	currentPage: number;
	// Custom page size properties
	customWidth?: number;
	customHeight?: number;
	metadata?: {
		author?: string;
		subject?: string;
		keywords?: string[];
		createdAt?: string;
		modifiedAt?: string;
	};
}
