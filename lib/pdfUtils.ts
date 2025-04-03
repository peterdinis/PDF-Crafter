import type {
	ImageElement,
	PDFDocument,
	PencilDrawingElement,
	ShapeElement,
	TableElement,
	TextElement,
} from "@/types/types";
import { jsPDF } from "jspdf";

// Define the PDFElement type by combining all possible element types
type PDFElement =
	| TextElement
	| ImageElement
	| ShapeElement
	| TableElement
	| PencilDrawingElement;

// Function to convert base64 data URI to array buffer
const dataURItoBlob = (dataURI: string) => {
	const byteString = atob(dataURI.split(",")[1]);
	const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mimeString });
};

// Get the proper font style string for jsPDF
const getFontStyle = (fontWeight: string, fontStyle: string) => {
	if (fontWeight === "bold" && fontStyle === "italic") return "bolditalic";
	if (fontWeight === "bold") return "bold";
	if (fontStyle === "italic") return "italic";
	return "normal";
};

// Add elements of a single page to the PDF
const addPageElementsToPDF = (pdf: jsPDF, elements: PDFElement[]) => {
	for (const element of elements) {
		if (element.type === "text") {
			const textElement = element as TextElement;

			// Set font family and style
			const fontStyle = getFontStyle(
				textElement.fontWeight,
				textElement.fontStyle,
			);
			pdf.setFont(textElement.fontFamily || "Helvetica", fontStyle);

			// Set font size (explicitly convert to number if needed)
			const fontSize =
				typeof textElement.fontSize === "string"
					? Number.parseInt(textElement.fontSize, 10)
					: textElement.fontSize;
			pdf.setFontSize(fontSize);

			// Set text color
			pdf.setTextColor(textElement.color);

			// Split text into lines to handle wrapping
			const lines = pdf.splitTextToSize(textElement.content, textElement.width);
			pdf.text(lines, textElement.x, textElement.y + fontSize); // Add fontSize to y to align properly
		} else if (element.type === "image") {
			const imageElement = element as ImageElement;
			try {
				// Check if this is an SVG image
				const isSvg =
					imageElement.src.toLowerCase().endsWith(".svg") ||
					imageElement.src.toLowerCase().includes("image/svg+xml");

				// Add image to PDF - convert data URI if needed
				pdf.addImage(
					imageElement.src,
					isSvg ? "SVG" : "AUTO",
					imageElement.x,
					imageElement.y,
					imageElement.width,
					imageElement.height,
				);
			} catch (error) {
				console.error("Failed to add image to PDF:", error);
			}
		} else if (element.type === "shape") {
			const shapeElement = element as ShapeElement;

			// Save current transformation state
			pdf.saveGraphicsState();

			if (shapeElement.fill && shapeElement.fill !== "transparent") {
				pdf.setFillColor(shapeElement.fill);
			}

			if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
				pdf.setDrawColor(shapeElement.stroke);
				pdf.setLineWidth(shapeElement.strokeWidth);
			}

			// If there's rotation, we have to handle the shape drawing differently
			if (shapeElement.rotation && shapeElement.rotation !== 0) {
				const angleInRadians = (shapeElement.rotation * Math.PI) / 180;
				const cos = Math.cos(angleInRadians);
				const sin = Math.sin(angleInRadians);

				// Calculate the center of the shape
				const centerX = shapeElement.x + shapeElement.width / 2;
				const centerY = shapeElement.y + shapeElement.height / 2;

				if (shapeElement.shapeType === "rectangle") {
					// For rotated rectangles, we'll need to calculate the 4 corner points after rotation
					// and draw using lines instead
					const halfWidth = shapeElement.width / 2;
					const halfHeight = shapeElement.height / 2;

					// Calculate the 4 corner points relative to center
					const points = [
						[-halfWidth, -halfHeight], // top-left
						[halfWidth, -halfHeight], // top-right
						[halfWidth, halfHeight], // bottom-right
						[-halfWidth, halfHeight], // bottom-left
					];

					// Rotate each point and translate to actual position
					const rotatedPoints = points.map(([x, y]) => {
						const rotX = x * cos - y * sin + centerX;
						const rotY = x * sin + y * cos + centerY;
						return [rotX, rotY];
					});

					// Draw the rotated rectangle as a polygon
					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						// For filled polygons, we need to use multiple triangles from center
						for (let i = 0; i < rotatedPoints.length; i++) {
							const p1 = rotatedPoints[i];
							const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];

							pdf.triangle(centerX, centerY, p1[0], p1[1], p2[0], p2[1], "F");
						}
					}

					// Draw the border if needed
					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						for (let i = 0; i < rotatedPoints.length; i++) {
							const p1 = rotatedPoints[i];
							const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];

							pdf.line(p1[0], p1[1], p2[0], p2[1]);
						}
					}
				} else if (shapeElement.shapeType === "circle") {
					// For circles, the center stays the same, just draw at the center
					const radius = shapeElement.width / 2;

					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						pdf.circle(centerX, centerY, radius, "F");
					}

					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						pdf.circle(centerX, centerY, radius, "D");
					}
				} else if (shapeElement.shapeType === "line") {
					// For rotated lines, we need to calculate the endpoints after rotation
					const halfLength = shapeElement.width / 2;

					// Calculate rotated endpoints
					const x1 = centerX - halfLength * cos;
					const y1 = centerY - halfLength * sin;
					const x2 = centerX + halfLength * cos;
					const y2 = centerY + halfLength * sin;

					pdf.line(x1, y1, x2, y2);
				}
			} else {
				// No rotation, handle normally
				if (shapeElement.shapeType === "rectangle") {
					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						pdf.rect(
							shapeElement.x,
							shapeElement.y,
							shapeElement.width,
							shapeElement.height,
							"F",
						);
					}

					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						pdf.rect(
							shapeElement.x,
							shapeElement.y,
							shapeElement.width,
							shapeElement.height,
							"D",
						);
					}
				} else if (shapeElement.shapeType === "circle") {
					const radius = shapeElement.width / 2;
					const centerX = shapeElement.x + radius;
					const centerY = shapeElement.y + radius;

					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						pdf.circle(centerX, centerY, radius, "F");
					}

					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						pdf.circle(centerX, centerY, radius, "D");
					}
				} else if (shapeElement.shapeType === "line") {
					pdf.line(
						shapeElement.x,
						shapeElement.y,
						shapeElement.x + shapeElement.width,
						shapeElement.y,
					);
				}
			}

			// Restore transformation state
			pdf.restoreGraphicsState();
		} else if (element.type === "table") {
			const tableElement = element as TableElement;

			// Set border color if specified
			if (tableElement.borderColor) {
				pdf.setDrawColor(tableElement.borderColor);
			} else {
				pdf.setDrawColor(0, 0, 0); // Default black
			}

			// Draw table border
			pdf.rect(
				tableElement.x,
				tableElement.y,
				tableElement.width,
				tableElement.height,
				"D",
			);

			// jsPDF has limited table capabilities
			// For a full implementation, you'd need to draw cells individually
			// or use a plugin like jspdf-autotable
		} else if (element.type === "pencil") {
			const pencilElement = element as PencilDrawingElement;

			if (pencilElement.points.length > 1) {
				pdf.setDrawColor(pencilElement.color);
				pdf.setLineWidth(pencilElement.strokeWidth);

				// Draw the pencil path
				for (let i = 1; i < pencilElement.points.length; i++) {
					const prevPoint = pencilElement.points[i - 1];
					const currentPoint = pencilElement.points[i];

					pdf.line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
				}
			}
		}
	}
};

export const generatePDF = async (document: PDFDocument) => {
	// Initialize jsPDF with the right page size and orientation
	let format: string | [number, number] = "a4";

	// Set standard paper formats
	if (
		[
			"a3",
			"a4",
			"a5",
			"letter",
			"legal",
			"tabloid",
			"executive",
			"b5",
			"b4",
		].includes(document.pageSize)
	) {
		format = document.pageSize;
	}

	// Handle custom and non-standard sizes
	if (
		document.pageSize === "custom" &&
		document.customWidth &&
		document.customHeight
	) {
		// Convert mm to points for jsPDF (1mm = 2.83465 points)
		const width = document.customWidth * 2.83465;
		const height = document.customHeight * 2.83465;
		format = [width, height];
	} else if (["jisb4", "jisb5"].includes(document.pageSize)) {
		// Handle JIS B sizes which aren't standard in jsPDF
		if (document.pageSize === "jisb4") {
			format = [729, 1032]; // JIS B4 in points
		} else if (document.pageSize === "jisb5") {
			format = [516, 729]; // JIS B5 in points
		}
	}

	const orientation = document.orientation === "portrait" ? "p" : "l";

	const pdf = new jsPDF({
		orientation,
		unit: "pt",
		format,
	});

	// Set metadata
	pdf.setProperties({
		title: document.title,
		creator: "PDF Crafter Ninja",
	});

	// Process all pages
	document.pages.forEach((page: { elements: any[] }, index: number) => {
		// Add new page for all pages after the first one
		if (index > 0) {
			pdf.addPage(format, orientation);
		}

		// Add all elements from the current page
		addPageElementsToPDF(pdf, page.elements);
	});

	// Save PDF with document title as filename
	pdf.save(`${document.title.replace(/\s+/g, "_")}.pdf`);
};
