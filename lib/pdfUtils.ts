import type {
	ImageElement,
	PDFDocument,
	PDFElement,
	PencilDrawingElement,
	ShapeElement,
	TableElement,
	TextElement,
	ChartElement,
	ChartDataPoint,
} from "@/types/global";
import { jsPDF } from "jspdf";

const getFontStyle = (fontWeight: string, fontStyle: string) => {
	if (fontWeight === "bold" && fontStyle === "italic") return "bolditalic";
	if (fontWeight === "bold") return "bold";
	if (fontStyle === "italic") return "italic";
	return "normal";
};

const addPageElementsToPDF = (pdf: jsPDF, elements: PDFElement[]) => {
	for (const element of elements) {
		if (element.type === "text") {
			const textElement = element as TextElement;

			const fontStyle = getFontStyle(
				textElement.fontWeight,
				textElement.fontStyle,
			);
			pdf.setFont(textElement.fontFamily || "Helvetica", fontStyle);

			const fontSize =
				typeof textElement.fontSize === "string"
					? Number.parseInt(textElement.fontSize, 10)
					: textElement.fontSize;
			pdf.setFontSize(fontSize);

			pdf.setTextColor(textElement.color);

			const lines = pdf.splitTextToSize(textElement.content, textElement.width);
			pdf.text(lines, textElement.x, textElement.y + fontSize);
		} else if (element.type === "image") {
			const imageElement = element as ImageElement;
			try {
				const isSvg =
					imageElement.src.toLowerCase().endsWith(".svg") ||
					imageElement.src.toLowerCase().includes("image/svg+xml");

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

			pdf.saveGraphicsState();

			if (shapeElement.fill && shapeElement.fill !== "transparent") {
				pdf.setFillColor(shapeElement.fill);
			}

			if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
				pdf.setDrawColor(shapeElement.stroke);
				pdf.setLineWidth(shapeElement.strokeWidth);
			}

			if (shapeElement.rotation && shapeElement.rotation !== 0) {
				const angleInRadians = (shapeElement.rotation * Math.PI) / 180;
				const cos = Math.cos(angleInRadians);
				const sin = Math.sin(angleInRadians);

				const centerX = shapeElement.x + shapeElement.width / 2;
				const centerY = shapeElement.y + shapeElement.height / 2;

				if (shapeElement.shapeType === "rectangle") {
					const halfWidth = shapeElement.width / 2;
					const halfHeight = shapeElement.height / 2;

					const points = [
						[-halfWidth, -halfHeight],
						[halfWidth, -halfHeight],
						[halfWidth, halfHeight],
						[-halfWidth, halfHeight],
					];

					const rotatedPoints = points.map(([x, y]) => {
						const rotX = x * cos - y * sin + centerX;
						const rotY = x * sin + y * cos + centerY;
						return [rotX, rotY];
					});

					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						for (let i = 0; i < rotatedPoints.length; i++) {
							const p1 = rotatedPoints[i];
							const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];

							pdf.triangle(centerX, centerY, p1[0], p1[1], p2[0], p2[1], "F");
						}
					}

					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						for (let i = 0; i < rotatedPoints.length; i++) {
							const p1 = rotatedPoints[i];
							const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];

							pdf.line(p1[0], p1[1], p2[0], p2[1]);
						}
					}
				} else if (shapeElement.shapeType === "circle") {
					const radius = shapeElement.width / 2;

					if (shapeElement.fill && shapeElement.fill !== "transparent") {
						pdf.circle(centerX, centerY, radius, "F");
					}

					if (shapeElement.stroke && shapeElement.stroke !== "transparent") {
						pdf.circle(centerX, centerY, radius, "D");
					}
				} else if (shapeElement.shapeType === "line") {
					const halfLength = shapeElement.width / 2;
					const x1 = centerX - halfLength * cos;
					const y1 = centerY - halfLength * sin;
					const x2 = centerX + halfLength * cos;
					const y2 = centerY + halfLength * sin;

					if (shapeElement.height && shapeElement.height > 1) {
						pdf.setLineWidth(shapeElement.height);
					}
					pdf.line(x1, y1, x2, y2);
				}
			} else {
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

			pdf.restoreGraphicsState();
		} else if (element.type === "table") {
			const tableElement = element as TableElement;
			const { x, y, width, height, rows, columns, data, tableStyle, headerType } = tableElement;

			const cellWidth = width / columns;
			const cellHeight = height / rows;

			pdf.saveGraphicsState();

			if (tableElement.borderColor) {
				pdf.setDrawColor(tableElement.borderColor);
			} else {
				pdf.setDrawColor(0, 0, 0);
			}
			pdf.setLineWidth(1);

			const tableData = data || Array(rows).fill(Array(columns).fill(""));

			for (let r = 0; r < rows; r++) {
				const isHeader = headerType !== "none" && r === 0;
				const rowY = y + r * cellHeight;

				if (isHeader && tableElement.headerColor) {
					pdf.setFillColor(tableElement.headerColor);
					pdf.rect(x, rowY, width, cellHeight, "F");
				} else if (!isHeader) {
					if (tableStyle === "striped" && r % 2 === 0) {
						pdf.setFillColor(245, 245, 245);
						pdf.rect(x, rowY, width, cellHeight, "F");
					} else if (tableElement.cellColor) {
						pdf.setFillColor(tableElement.cellColor);
						pdf.rect(x, rowY, width, cellHeight, "F");
					}
				}

				for (let c = 0; c < columns; c++) {
					const cellX = x + c * cellWidth;

					if (tableStyle === "bordered") {
						pdf.rect(cellX, rowY, cellWidth, cellHeight, "D");
					}

					const content = tableData[r]?.[c] || "";
					if (content) {
						if (tableElement.textColor) {
							pdf.setTextColor(tableElement.textColor);
						} else {
							pdf.setTextColor(0, 0, 0);
						}

						pdf.setFontSize(10);
						if (isHeader) {
							pdf.setFont("Helvetica", "bold");
						} else {
							pdf.setFont("Helvetica", "normal");
						}

						const textLines = pdf.splitTextToSize(content.toString(), cellWidth - 4);
						const textX = cellX + 2;
						const textY = rowY + (cellHeight / 2) + 3;
						pdf.text(textLines, textX, textY);
					}
				}
			}

			if (tableStyle !== "bordered") {
				pdf.rect(x, y, width, height, "D");
			}

			pdf.restoreGraphicsState();
		} else if (element.type === "pencil") {
			const pencilElement = element as PencilDrawingElement;

			if (pencilElement.points.length > 1) {
				pdf.setDrawColor(pencilElement.color);
				pdf.setLineWidth(pencilElement.strokeWidth);

				for (let i = 1; i < pencilElement.points.length; i++) {
					const prevPoint = pencilElement.points[i - 1];
					const currentPoint = pencilElement.points[i];

					pdf.line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
				}
			}
		} else if (element.type === "chart") {
			const chartElement = element as ChartElement;
			const { x, y, width, height, chartType, data, seriesColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"] } = chartElement;

			pdf.saveGraphicsState();

			if (chartElement.backgroundColor && chartElement.backgroundColor !== "transparent") {
				pdf.setFillColor(chartElement.backgroundColor);
				pdf.rect(x, y, width, height, "F");
			}

			const padding = 40;
			const innerWidth = width - padding * 2;
			const innerHeight = height - padding * 2;
			const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value), 10) : 100;

			if (chartType !== "pie") {
				if (chartElement.showGrid) {
					pdf.setDrawColor(chartElement.gridColor || "#e5e7eb");
					pdf.setLineWidth(0.5);
					for (let i = 0; i <= 5; i++) {
						const gridY = y + padding + (i * innerHeight) / 5;
						pdf.line(x + padding, gridY, x + width - padding, gridY);
					}
				}
				if (chartElement.showAxes) {
					pdf.setDrawColor(chartElement.axesColor || "#9ca3af");
					pdf.setLineWidth(1);
					pdf.line(x + padding, y + padding, x + padding, y + height - padding);
					pdf.line(x + padding, y + height - padding, x + width - padding, y + height - padding);
				}
			}

			if (chartType === "bar") {
				const barWidth = innerWidth / data.length;
				data.forEach((d, i) => {
					const barHeight = (d.value / maxValue) * innerHeight;
					const barX = x + padding + i * barWidth + barWidth * 0.1;
					const barY = y + height - padding - barHeight;
					const color = d.color || seriesColors[i % seriesColors.length];

					pdf.setFillColor(color);
					pdf.rect(barX, barY, barWidth * 0.8, barHeight, "F");
				});
			} else if (chartType === "line") {
				if (data.length > 1) {
					const step = innerWidth / (data.length - 1);
					pdf.setDrawColor(seriesColors[0]);
					pdf.setLineWidth(2);

					for (let i = 1; i < data.length; i++) {
						const x1 = x + padding + (i - 1) * step;
						const y1 = y + height - padding - (data[i - 1].value / maxValue) * innerHeight;
						const x2 = x + padding + i * step;
						const y2 = y + height - padding - (data[i].value / maxValue) * innerHeight;
						pdf.line(x1, y1, x2, y2);
					}

					data.forEach((d, i) => {
						const pX = x + padding + i * step;
						const pY = y + height - padding - (d.value / maxValue) * innerHeight;
						pdf.setFillColor(seriesColors[0]);
						pdf.circle(pX, pY, 3, "F");
					});
				}
			} else if (chartType === "pie") {
				const total = data.reduce((sum, d) => sum + d.value, 0);
				if (total > 0) {
					const centerX = x + width / 2;
					const centerY = y + height / 2;
					const radius = Math.min(innerWidth, innerHeight) / 2;
					let startAngle = 0;

					data.forEach((d, i) => {
						const sliceAngle = (d.value / total) * 360;
						const color = d.color || seriesColors[i % seriesColors.length];
						pdf.setFillColor(color);

						const segments = Math.max(2, Math.floor(sliceAngle / 5));
						for (let s = 0; s < segments; s++) {
							const a1 = (startAngle + (s * sliceAngle) / segments) * Math.PI / 180;
							const a2 = (startAngle + ((s + 1) * sliceAngle) / segments) * Math.PI / 180;

							const x1 = centerX + radius * Math.cos(a1);
							const y1 = centerY + radius * Math.sin(a1);
							const x2 = centerX + radius * Math.cos(a2);
							const y2 = centerY + radius * Math.sin(a2);

							pdf.triangle(centerX, centerY, x1, y1, x2, y2, "F");
						}

						startAngle += sliceAngle;
					});
				}
			}

			pdf.restoreGraphicsState();
		}
	}
};

export const generatePDF = async (document: PDFDocument) => {
	let format: string | [number, number] = "a4";

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
	if (
		document.pageSize === "custom" &&
		document.customWidth &&
		document.customHeight
	) {
		const width = document.customWidth * 2.83465;
		const height = document.customHeight * 2.83465;
		format = [width, height];
	} else if (["jisb4", "jisb5"].includes(document.pageSize)) {
		if (document.pageSize === "jisb4") {
			format = [729, 1032];
		} else if (document.pageSize === "jisb5") {
			format = [516, 729];
		}
	}

	const orientation = document.orientation === "portrait" ? "p" : "l";

	const pdf = new jsPDF({
		orientation,
		unit: "pt",
		format,
	});

	pdf.setProperties({
		title: document.title,
		creator: "PDF Crafter",
	});

	document.pages.forEach((page: { elements: any[] }, index: number) => {
		if (index > 0) {
			pdf.addPage(format, orientation);
		}

		addPageElementsToPDF(pdf, page.elements);
	});
	pdf.save(`${document.title.replace(/\s+/g, "_")}.pdf`);
};
