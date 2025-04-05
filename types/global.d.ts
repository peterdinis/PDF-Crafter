export type PDFDocument = {
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
	customWidth?: number;
	customHeight?: number;
	orientation: "portrait" | "landscape";
	defaultTextColor: string;
	defaultFontFamily: string;
	defaultFontSize: number;
	pages: PDFPage[];
	currentPage: number;
};

export type PDFPage = {
	id: string;
	elements: PDFElement[];
};

export type PDFElement =
	| TextElement
	| ImageElement
	| ShapeElement
	| TableElement
	| PencilDrawingElement;

export type TextElement = {
	id: string;
	type: "text";
	content: string;
	x: number;
	y: number;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	fontStyle: string;
	color: string;
	width: number;
	height: number;
};

export type ImageElement = {
	id: string;
	type: "image";
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type ShapeElement = {
	id: string;
	type: "shape";
	shapeType: "rectangle" | "circle" | "line";
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	stroke: string;
	strokeWidth: number;
	rotation?: number;
};

export type TableElement = {
	id: string;
	type: "table";
	tableStyle: "simple" | "striped" | "bordered";
	x: number;
	y: number;
	width: number;
	height: number;
	columns: number;
	rows: number;
	headerType: "none" | "simple" | "divided";
	data: string[][];
	borderColor?: string;
	headerColor?: string;
	cellColor?: string;
	textColor?: string;
};

export type PencilDrawingElement = {
	id: string;
	type: "pencil";
	points: Array<{ x: number; y: number }>;
	color: string;
	strokeWidth: number;
	x?: number;
	y?: number;
};

export type Tool =
	| "select"
	| "text"
	| "image"
	| "shape_rectangle"
	| "shape_circle"
	| "shape_line"
	| "table_simple"
	| "table_striped"
	| "table_bordered"
	| "pencil";

export type PDFElement =
	| TextElement
	| ImageElement
	| ShapeElement
	| TableElement
	| PencilDrawingElement;
