import type {
	ChartElement,
	DrawingElement,
	ImageElement,
	PDFDocument,
	PDFElement,
	ShapeElement,
	TableElement,
	TextElement,
} from "@/types/global";
import { jsPDF } from "jspdf";

const getFontStyle = (fontWeight?: string, fontStyle?: string) => {
	if (fontWeight === "bold" && fontStyle === "italic") return "bolditalic";
	if (fontWeight === "bold") return "bold";
	if (fontStyle === "italic") return "italic";
	return "normal";
};

const addPageElementsToPDF = (pdf: jsPDF, elements: PDFElement[]) => {
	for (const element of elements) {
		try {
			if (element.type === "text") {
				const textElement = element as TextElement;

				const fontStyle = getFontStyle(
					textElement.fontWeight,
					textElement.fontStyle,
				);

				// Nastav font, ak nie je k dispozícii, použij Helvetica
				try {
					pdf.setFont(textElement.fontFamily || "Helvetica", fontStyle);
				} catch {
					pdf.setFont("Helvetica", fontStyle);
				}

				const fontSize =
					typeof textElement.fontSize === "string"
						? Number.parseInt(textElement.fontSize, 10)
						: textElement.fontSize || 12;
				pdf.setFontSize(fontSize);

				// Nastav farbu textu
				if (textElement.color) {
					const color = hexToRgb(textElement.color);
					pdf.setTextColor(color.r, color.g, color.b);
				} else {
					pdf.setTextColor(0, 0, 0);
				}

				const lines = pdf.splitTextToSize(
					textElement.content || "",
					textElement.width || 200,
				);
				pdf.text(lines, element.x || 0, (element.y || 0) + fontSize);
			} else if (element.type === "image") {
				const imageElement = element as ImageElement;

				// Skontroluj, či máme platný zdroj obrázka
				if (!imageElement.src || imageElement.src.trim() === "") {
					console.warn("Image element has no source");
					continue;
				}

				try {
					// Pokús sa pridať obrázok
					pdf.addImage(
						imageElement.src,
						"PNG", // Použi PNG ako default
						imageElement.x || 0,
						imageElement.y || 0,
						imageElement.width || 100,
						imageElement.height || 100,
					);
				} catch (error) {
					console.error("Failed to add image to PDF:", error);
					// Nakresli placeholder
					pdf.setDrawColor(200, 200, 200);
					pdf.setFillColor(240, 240, 240);
					pdf.rect(
						imageElement.x || 0,
						imageElement.y || 0,
						imageElement.width || 100,
						imageElement.height || 100,
						"FD",
					);
					pdf.setFontSize(10);
					pdf.setTextColor(150, 150, 150);
					pdf.text(
						"Image",
						(imageElement.x || 0) + (imageElement.width || 100) / 2 - 10,
						(imageElement.y || 0) + (imageElement.height || 100) / 2,
					);
				}
			} else if (element.type === "shape") {
				const shapeElement = element as ShapeElement;

				pdf.saveGraphicsState();

				// Použi fillColor alebo fill pre farbu výplne
				const fillColor = shapeElement.fillColor || shapeElement.fill;
				if (fillColor && fillColor !== "transparent") {
					const rgb = hexToRgb(fillColor);
					pdf.setFillColor(rgb.r, rgb.g, rgb.b);
				}

				// Použi strokeColor alebo stroke pre farbu čiary
				const strokeColor = shapeElement.strokeColor || shapeElement.stroke;
				if (strokeColor && strokeColor !== "transparent") {
					const rgb = hexToRgb(strokeColor);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
					pdf.setLineWidth(shapeElement.strokeWidth || 1);
				}

				const rotation = shapeElement.rotation || 0;
				if (rotation !== 0) {
					const angleInRadians = (rotation * Math.PI) / 180;
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

						if (fillColor && fillColor !== "transparent") {
							for (let i = 0; i < rotatedPoints.length; i++) {
								const p1 = rotatedPoints[i];
								const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];
								pdf.triangle(centerX, centerY, p1[0], p1[1], p2[0], p2[1], "F");
							}
						}

						if (strokeColor && strokeColor !== "transparent") {
							for (let i = 0; i < rotatedPoints.length; i++) {
								const p1 = rotatedPoints[i];
								const p2 = rotatedPoints[(i + 1) % rotatedPoints.length];
								pdf.line(p1[0], p1[1], p2[0], p2[1]);
							}
						}
					} else if (shapeElement.shapeType === "circle") {
						const radius = shapeElement.width / 2;

						if (fillColor && fillColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "F");
						}

						if (strokeColor && strokeColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "D");
						}
					} else if (shapeElement.shapeType === "line") {
						const halfLength = shapeElement.width / 2;
						const x1 = centerX - halfLength * cos;
						const y1 = centerY - halfLength * sin;
						const x2 = centerX + halfLength * cos;
						const y2 = centerY + halfLength * sin;

						if (strokeColor && strokeColor !== "transparent") {
							pdf.setLineWidth(
								shapeElement.strokeWidth || shapeElement.height || 1,
							);
							pdf.line(x1, y1, x2, y2);
						}
					}
				} else {
					// Bez rotácie
					if (shapeElement.shapeType === "rectangle") {
						if (fillColor && fillColor !== "transparent") {
							pdf.rect(
								shapeElement.x,
								shapeElement.y,
								shapeElement.width,
								shapeElement.height,
								"F",
							);
						}

						if (strokeColor && strokeColor !== "transparent") {
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

						if (fillColor && fillColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "F");
						}

						if (strokeColor && strokeColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "D");
						}
					} else if (shapeElement.shapeType === "line") {
						if (strokeColor && strokeColor !== "transparent") {
							pdf.setLineWidth(shapeElement.strokeWidth || 1);
							pdf.line(
								shapeElement.x,
								shapeElement.y,
								shapeElement.x + shapeElement.width,
								shapeElement.y + (shapeElement.height || 0),
							);
						}
					}
				}

				pdf.restoreGraphicsState();
			} else if (element.type === "table") {
				const tableElement = element as TableElement;
				const {
					x = 0,
					y = 0,
					width = 300,
					height = 200,
					rows = 2,
					columns = 2,
					data = { headers: [], rows: [] },
					tableStyle = "simple",
					headerType = "firstRow",
				} = tableElement;

				const cellWidth = width / columns;
				const cellHeight = height / rows;

				pdf.saveGraphicsState();

				// Nastav farbu okrajov
				if (tableElement.borderColor) {
					const rgb = hexToRgb(tableElement.borderColor);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
				} else {
					pdf.setDrawColor(0, 0, 0);
				}
				pdf.setLineWidth(tableElement.borderWidth || 1);

				// Priprav dátá pre tabuľku
				const tableData =
					data.rows || Array(rows).fill(Array(columns).fill(""));
				const headers = data.headers || Array(columns).fill(`Header`);

				for (let r = 0; r < rows; r++) {
					const isHeader = headerType !== "none" && r === 0;
					const rowY = y + r * cellHeight;

					// Vyplň riadok
					if (isHeader && tableElement.headerColor) {
						const rgb = hexToRgb(tableElement.headerColor);
						pdf.setFillColor(rgb.r, rgb.g, rgb.b);
						pdf.rect(x, rowY, width, cellHeight, "F");
					} else if (!isHeader) {
						if (tableStyle === "striped" && r % 2 === 0) {
							pdf.setFillColor(245, 245, 245);
							pdf.rect(x, rowY, width, cellHeight, "F");
						} else if (tableElement.cellColor) {
							const rgb = hexToRgb(tableElement.cellColor);
							pdf.setFillColor(rgb.r, rgb.g, rgb.b);
							pdf.rect(x, rowY, width, cellHeight, "F");
						}
					}

					for (let c = 0; c < columns; c++) {
						const cellX = x + c * cellWidth;

						// Nakresli ohraničenie
						if (tableStyle === "bordered") {
							pdf.rect(cellX, rowY, cellWidth, cellHeight, "D");
						}

						// Získaj obsah bunky
						let content = "";
						if (isHeader && headers[c]) {
							content = headers[c];
						} else if (tableData[r] && tableData[r][c] !== undefined) {
							content = String(tableData[r][c]);
						}

						// Zobraz obsah
						if (content) {
							// Nastav farbu textu
							if (tableElement.textColor) {
								const rgb = hexToRgb(tableElement.textColor);
								pdf.setTextColor(rgb.r, rgb.g, rgb.b);
							} else {
								pdf.setTextColor(0, 0, 0);
							}

							pdf.setFontSize(10);
							if (isHeader) {
								pdf.setFont("Helvetica", "bold");
							} else {
								pdf.setFont("Helvetica", "normal");
							}

							const textLines = pdf.splitTextToSize(content, cellWidth - 4);
							const textX = cellX + 2;
							const textY = rowY + cellHeight / 2 + 3;
							pdf.text(textLines, textX, textY);
						}
					}
				}

				// Nakresli vonkajšie ohraničenie
				if (tableStyle !== "bordered") {
					pdf.rect(x, y, width, height, "D");
				}

				pdf.restoreGraphicsState();
			} else if (element.type === "pencil") {
				const pencilElement = element as any;

				if (pencilElement.points && pencilElement.points.length > 1) {
					const rgb = hexToRgb(pencilElement.color);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
					pdf.setLineWidth(pencilElement.strokeWidth || 1);

					for (let i = 1; i < pencilElement.points.length; i++) {
						const prevPoint = pencilElement.points[i - 1];
						const currentPoint = pencilElement.points[i];

						pdf.line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
					}
				}
			} else if (element.type === "chart") {
				const chartElement = element as ChartElement;
				const {
					x = 0,
					y = 0,
					width = 300,
					height = 200,
					chartType = "bar",
					data,
					seriesColors = [
						"#3b82f6",
						"#10b981",
						"#f59e0b",
						"#ef4444",
						"#8b5cf6",
					],
				} = chartElement;

				pdf.saveGraphicsState();

				// Pozadie grafu
				if (
					chartElement.backgroundColor &&
					chartElement.backgroundColor !== "transparent"
				) {
					const rgb = hexToRgb(chartElement.backgroundColor);
					pdf.setFillColor(rgb.r, rgb.g, rgb.b);
					pdf.rect(x, y, width, height, "F");
				}

				const padding = 40;
				const innerWidth = width - padding * 2;
				const innerHeight = height - padding * 2;

				// Konvertuj dáta do spoločného formátu
				let chartData: Array<{
					value: number;
					label?: string;
					color?: string;
				}> = [];

				if (Array.isArray(data)) {
					chartData = data;
				} else if (data && "datasets" in data && data.datasets.length > 0) {
					// Konvertuj nový formát na starý
					const dataset = data.datasets[0];
					chartData = dataset.data.map((value, index) => ({
						value,
						label: data.labels?.[index] || `Item ${index + 1}`,
						color:
							dataset.backgroundColor ||
							seriesColors[index % seriesColors.length],
					}));
				}

				const maxValue =
					chartData.length > 0
						? Math.max(...chartData.map((d) => d.value || 0), 10)
						: 100;

				// Mriežka a osi
				if (chartType !== "pie") {
					if (chartElement.showGrid) {
						const gridColor = chartElement.gridColor || "#e5e7eb";
						const rgb = hexToRgb(gridColor);
						pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
						pdf.setLineWidth(0.5);
						for (let i = 0; i <= 5; i++) {
							const gridY = y + padding + (i * innerHeight) / 5;
							pdf.line(x + padding, gridY, x + width - padding, gridY);
						}
					}

					if (chartElement.showAxes !== false) {
						const axesColor = chartElement.axesColor || "#9ca3af";
						const rgb = hexToRgb(axesColor);
						pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
						pdf.setLineWidth(1);
						pdf.line(
							x + padding,
							y + padding,
							x + padding,
							y + height - padding,
						);
						pdf.line(
							x + padding,
							y + height - padding,
							x + width - padding,
							y + height - padding,
						);
					}
				}

				// Nakresli graf podľa typu
				if (chartType === "bar") {
					const barWidth = innerWidth / chartData.length;
					chartData.forEach((d, i) => {
						const barHeight = ((d.value || 0) / maxValue) * innerHeight;
						const barX = x + padding + i * barWidth + barWidth * 0.1;
						const barY = y + height - padding - barHeight;
						const color = d.color || seriesColors[i % seriesColors.length];
						const rgb = hexToRgb(color);

						pdf.setFillColor(rgb.r, rgb.g, rgb.b);
						pdf.rect(barX, barY, barWidth * 0.8, barHeight, "F");
					});
				} else if (chartType === "line") {
					if (chartData.length > 1) {
						const step = innerWidth / (chartData.length - 1);
						const primaryColor = seriesColors[0];
						const rgb = hexToRgb(primaryColor);

						pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
						pdf.setLineWidth(2);

						for (let i = 1; i < chartData.length; i++) {
							const x1 = x + padding + (i - 1) * step;
							const y1 =
								y +
								height -
								padding -
								((chartData[i - 1].value || 0) / maxValue) * innerHeight;
							const x2 = x + padding + i * step;
							const y2 =
								y +
								height -
								padding -
								((chartData[i].value || 0) / maxValue) * innerHeight;
							pdf.line(x1, y1, x2, y2);
						}

						// Bodky
						chartData.forEach((d, i) => {
							const pX = x + padding + i * step;
							const pY =
								y +
								height -
								padding -
								((d.value || 0) / maxValue) * innerHeight;
							const color = d.color || seriesColors[0];
							const rgb = hexToRgb(color);

							pdf.setFillColor(rgb.r, rgb.g, rgb.b);
							pdf.circle(pX, pY, 3, "F");
						});
					}
				} else if (chartType === "pie") {
					const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);
					if (total > 0) {
						const centerX = x + width / 2;
						const centerY = y + height / 2;
						const radius = Math.min(innerWidth, innerHeight) / 2;
						let startAngle = 0;

						chartData.forEach((d, i) => {
							const sliceAngle = ((d.value || 0) / total) * 360;
							const color = d.color || seriesColors[i % seriesColors.length];
							const rgb = hexToRgb(color);

							pdf.setFillColor(rgb.r, rgb.g, rgb.b);

							const segments = Math.max(2, Math.floor(sliceAngle / 5));
							for (let s = 0; s < segments; s++) {
								const a1 =
									((startAngle + (s * sliceAngle) / segments) * Math.PI) / 180;
								const a2 =
									((startAngle + ((s + 1) * sliceAngle) / segments) * Math.PI) /
									180;

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
		} catch (error) {
			console.error(`Error adding element ${element.type} to PDF:`, error);
			// Pokračuj s ďalšími elementami
		}
	}
};

// Pomocná funkcia na konverziu hex farby na RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
	// Odstráň # ak existuje
	hex = hex.replace(/^#/, "");

	// Konvertuj 3-digit hex na 6-digit
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((c) => c + c)
			.join("");
	}

	// Konvertuj 6-digit hex na RGB
	const num = Number.parseInt(hex, 16);
	return {
		r: (num >> 16) & 255,
		g: (num >> 8) & 255,
		b: num & 255,
	};
};

export const generatePDF = async (
	document: PDFDocument,
	options: { compress?: boolean } = {},
) => {
	let format: string | [number, number] = "a4";

	// Nastav formát podľa pageSize
	if (
		["a3", "a4", "a5", "letter", "legal", "tabloid", "executive"].includes(
			document.pageSize,
		)
	) {
		format = document.pageSize;
	} else if (
		document.pageSize === "custom" &&
		document.customWidth &&
		document.customHeight
	) {
		const width = document.customWidth * 2.83465; // Konvertuj mm na points (1 mm = 2.83465 points)
		const height = document.customHeight * 2.83465;
		format = [width, height];
	} else {
		// Default na A4
		format = "a4";
	}

	const orientation = document.orientation === "portrait" ? "p" : "l";

	const pdf = new jsPDF({
		orientation,
		unit: "pt",
		format,
		compress: options.compress,
	});

	// Nastav metadáta PDF
	pdf.setProperties({
		title: document.title || "Untitled Document",
		subject: "Created with PDF Crafter",
		creator: "PDF Crafter",
		author: document.metadata?.author || "PDF Crafter User",
	});

	// Pridaj elementy z každej stránky
	document.pages.forEach((page, index) => {
		if (index > 0) {
			pdf.addPage(format, orientation);
		}

		addPageElementsToPDF(pdf, page.elements || []);
	});

	// Ulož PDF
	const fileName =
		(document.title || "document")
			.replace(/[^\w\s]/gi, "_")
			.replace(/\s+/g, "_") + ".pdf";
	pdf.save(fileName);
};
