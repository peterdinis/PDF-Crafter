import type {
	ChartElement,
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

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
	if (!hex || hex === "transparent") return { r: 0, g: 0, b: 0 };
	hex = hex.replace(/^#/, "");
	if (hex.length === 3) {
		hex = hex.split("").map((c) => c + c).join("");
	}
	const num = parseInt(hex, 16);
	return {
		r: (num >> 16) & 255,
		g: (num >> 8) & 255,
		b: num & 255,
	};
};

const addPageElementsToPDF = (pdf: jsPDF, elements: PDFElement[]) => {
	for (const element of elements) {
		try {
			if (element.type === "text") {
				const textElement = element as TextElement;
				const style = textElement.style || "normal";
				
				// Určenie font štýlu na základe text štýlu
				let fontWeight = textElement.fontWeight || "normal";
				let fontStyle = textElement.fontStyle || "normal";
				
				if (style === "bold") {
					fontWeight = "bold";
				} else if (style === "italic") {
					fontStyle = "italic";
				} else if (style === "underline") {
					// Underline sa aplikuje nižšie
				} else if (style.startsWith("h")) {
					fontWeight = "bold";
				}
				
				const fontStyleStr = getFontStyle(fontWeight, fontStyle);

				try {
					pdf.setFont(textElement.fontFamily || "Helvetica", fontStyleStr);
				} catch {
					pdf.setFont("Helvetica", fontStyleStr);
				}

				const fontSize = typeof textElement.fontSize === "string"
					? parseInt(textElement.fontSize, 10)
					: textElement.fontSize || 12;
				pdf.setFontSize(fontSize);

				if (textElement.color) {
					const color = hexToRgb(textElement.color);
					pdf.setTextColor(color.r, color.g, color.b);
				} else {
					pdf.setTextColor(0, 0, 0);
				}

				const content = textElement.content || "";
				const x = element.x || 0;
				const y = element.y || 0;

				// Špecifické vykreslenie pre rôzne štýly
				if (style === "list" || style === "numbered") {
					// Zoznam s bodkami alebo číslami
					const lines = content.split('\n');
					let currentY = y + fontSize;
					
					lines.forEach((line, index) => {
						if (line.trim()) {
							// Odstránime existujúce bodky/čísla ak sú v texte
							const cleanLine = line.replace(/^[•\-\*]\s*/, '').replace(/^\d+\.\s*/, '');
							
							if (style === "list") {
								// Bullet list
								pdf.circle(x + 5, currentY - fontSize/3, 2, "F");
								pdf.text(cleanLine, x + 15, currentY);
							} else {
								// Numbered list
								pdf.text(`${index + 1}.`, x, currentY);
								pdf.text(cleanLine, x + 20, currentY);
							}
							currentY += fontSize * 1.5;
						}
					});
				} else if (style === "quote") {
					// Citát s čiarou na ľavej strane
					pdf.setDrawColor(100, 100, 100);
					pdf.setLineWidth(3);
					pdf.line(x, y, x, y + textElement.height);
					
					const lines = pdf.splitTextToSize(content, (textElement.width || 200) - 20);
					pdf.text(lines, x + 15, y + fontSize);
				} else if (style === "underline") {
					// Podčiarknutý text
					const lines = pdf.splitTextToSize(content, textElement.width || 200);
					pdf.text(lines, x, y + fontSize);
					
					// Pridáme podčiarknutie
					const textWidth = pdf.getTextWidth(content);
					pdf.setDrawColor(0, 0, 0);
					pdf.setLineWidth(0.5);
					pdf.line(x, y + fontSize + 2, x + textWidth, y + fontSize + 2);
				} else {
					// Normálny text, nadpisy, paragraf
					const lines = pdf.splitTextToSize(content, textElement.width || 200);
					pdf.text(lines, x, y + fontSize);
				}

			} else if (element.type === "image") {
				const imageElement = element as ImageElement;
				if (!imageElement.src || imageElement.src.trim() === "") {
					console.warn("Image element has no source");
					continue;
				}

				try {
					pdf.addImage(
						imageElement.src,
						"PNG",
						imageElement.x || 0,
						imageElement.y || 0,
						imageElement.width || 100,
						imageElement.height || 100,
					);
				} catch (error) {
					console.error("Failed to add image to PDF:", error);
					pdf.setDrawColor(200, 200, 200);
					pdf.setFillColor(240, 240, 240);
					pdf.rect(imageElement.x || 0, imageElement.y || 0, imageElement.width || 100, imageElement.height || 100, "FD");
				}

			} else if (element.type === "shape") {
				const shapeElement = element as ShapeElement;
				pdf.saveGraphicsState();

				const fillColor = shapeElement.fillColor;
				if (fillColor && fillColor !== "transparent") {
					const rgb = hexToRgb(fillColor);
					pdf.setFillColor(rgb.r, rgb.g, rgb.b);
				}

				const strokeColor = shapeElement.strokeColor;
				if (strokeColor && strokeColor !== "transparent") {
					const rgb = hexToRgb(strokeColor);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
					pdf.setLineWidth(shapeElement.strokeWidth || 1);
				}

				const x = shapeElement.x || 0;
				const y = shapeElement.y || 0;
				const w = shapeElement.width || 100;
				const h = shapeElement.height || 100;

				// Vykreslenie rôznych tvarov
				switch (shapeElement.shapeType) {
					case "rectangle":
						if (fillColor && fillColor !== "transparent") {
							pdf.rect(x, y, w, h, "F");
						}
						if (strokeColor && strokeColor !== "transparent") {
							pdf.rect(x, y, w, h, "D");
						}
						break;

					case "circle":
						const radius = w / 2;
						const centerX = x + radius;
						const centerY = y + radius;
						if (fillColor && fillColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "F");
						}
						if (strokeColor && strokeColor !== "transparent") {
							pdf.circle(centerX, centerY, radius, "D");
						}
						break;

					case "line":
						if (strokeColor && strokeColor !== "transparent") {
							pdf.setLineWidth(shapeElement.strokeWidth || 2);
							pdf.line(x, y + h / 2, x + w, y + h / 2);
						}
						break;

					case "triangle":
						const points = [
							[x + w / 2, y],
							[x + w, y + h],
							[x, y + h]
						];
						if (fillColor && fillColor !== "transparent") {
							pdf.triangle(points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1], "F");
						}
						if (strokeColor && strokeColor !== "transparent") {
							pdf.line(points[0][0], points[0][1], points[1][0], points[1][1]);
							pdf.line(points[1][0], points[1][1], points[2][0], points[2][1]);
							pdf.line(points[2][0], points[2][1], points[0][0], points[0][1]);
						}
						break;

					case "arrow":
						if (strokeColor && strokeColor !== "transparent") {
							const arrowW = shapeElement.strokeWidth || 2;
							pdf.setLineWidth(arrowW);
							// Telo šípky
							pdf.line(x, y + h / 2, x + w - 15, y + h / 2);
							// Hrot šípky
							pdf.line(x + w - 15, y + h / 2 - 10, x + w, y + h / 2);
							pdf.line(x + w - 15, y + h / 2 + 10, x + w, y + h / 2);
						}
						break;

					default:
						// Pre ostatné tvary vykreslíme rectangle ako fallback
						if (fillColor && fillColor !== "transparent") {
							pdf.rect(x, y, w, h, "F");
						}
						if (strokeColor && strokeColor !== "transparent") {
							pdf.rect(x, y, w, h, "D");
						}
				}

				pdf.restoreGraphicsState();

			} else if (element.type === "table") {
				const tableElement = element as TableElement;
				const { x = 0, y = 0, width = 300, height = 200, data = { headers: [], rows: [] } } = tableElement;

				const columns = data.headers?.length || 2;
				const rows = (data.rows?.length || 0) + 1; // +1 pre header
				const cellWidth = width / columns;
				const cellHeight = height / rows;

				pdf.saveGraphicsState();

				// Ohraničenie tabuľky
				if (tableElement.borderColor) {
					const rgb = hexToRgb(tableElement.borderColor);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
				}
				pdf.setLineWidth(tableElement.borderWidth || 1);

				// Header riadok
				if (data.headers && data.headers.length > 0) {
					if (tableElement.headerColor) {
						const rgb = hexToRgb(tableElement.headerColor);
						pdf.setFillColor(rgb.r, rgb.g, rgb.b);
						pdf.rect(x, y, width, cellHeight, "F");
					}

					pdf.setTextColor(255, 255, 255);
					pdf.setFont("Helvetica", "bold");
					pdf.setFontSize(10);

					data.headers.forEach((header, col) => {
						const cellX = x + col * cellWidth;
						const text = pdf.splitTextToSize(header, cellWidth - 4);
						pdf.text(text, cellX + 2, y + cellHeight / 2 + 3);
						
						// Vertikálne čiary
						if (tableElement.style === "bordered") {
							pdf.line(cellX, y, cellX, y + cellHeight);
						}
					});
					
					// Horizontálna čiara pod headerom
					pdf.line(x, y + cellHeight, x + width, y + cellHeight);
				}

				// Dátové riadky
				if (data.rows && data.rows.length > 0) {
					pdf.setFont("Helvetica", "normal");
					pdf.setTextColor(0, 0, 0);

					data.rows.forEach((row, rowIndex) => {
						const rowY = y + cellHeight * (rowIndex + 1);

						// Pruhované pozadie
						if (tableElement.style === "striped" && rowIndex % 2 === 1) {
							pdf.setFillColor(245, 245, 245);
							pdf.rect(x, rowY, width, cellHeight, "F");
						}

						row.forEach((cell, col) => {
							const cellX = x + col * cellWidth;
							const text = pdf.splitTextToSize(String(cell), cellWidth - 4);
							pdf.text(text, cellX + 2, rowY + cellHeight / 2 + 3);

							// Vertikálne čiary pre bordered štýl
							if (tableElement.style === "bordered") {
								pdf.line(cellX, rowY, cellX, rowY + cellHeight);
							}
						});

						// Horizontálne čiary
						if (tableElement.style === "bordered") {
							pdf.line(x, rowY + cellHeight, x + width, rowY + cellHeight);
						}
					});
				}

				// Vonkajší rámec
				pdf.rect(x, y, width, height, "D");
				pdf.restoreGraphicsState();

			} else if (element.type === "drawing") {
				const drawingElement = element as any;
				if (drawingElement.paths && drawingElement.paths.length > 0) {
					const rgb = hexToRgb(drawingElement.strokeColor || "#000000");
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
					pdf.setLineWidth(drawingElement.strokeWidth || 2);

					drawingElement.paths.forEach((path: any) => {
						if (path.points && path.points.length > 1) {
							for (let i = 1; i < path.points.length; i++) {
								const p1 = path.points[i - 1];
								const p2 = path.points[i];
								pdf.line(
									(element.x || 0) + p1.x,
									(element.y || 0) + p1.y,
									(element.x || 0) + p2.x,
									(element.y || 0) + p2.y
								);
							}
						}
					});
				}

			} else if (element.type === "qrcode") {
				const qrcodeElement = element as any;
				// QR kód vykreslíme ako placeholder, pretože jsPDF nepodporuje QR kódy natívne
				pdf.setDrawColor(0, 0, 0);
				pdf.setFillColor(255, 255, 255);
				pdf.rect(qrcodeElement.x || 0, qrcodeElement.y || 0, qrcodeElement.width || 100, qrcodeElement.height || 100, "FD");
				pdf.setFontSize(8);
				pdf.setTextColor(100, 100, 100);
				pdf.text("QR Code", (qrcodeElement.x || 0) + 10, (qrcodeElement.y || 0) + 50);
				pdf.text(qrcodeElement.content || "", (qrcodeElement.x || 0) + 10, (qrcodeElement.y || 0) + 60);

			} else if (element.type === "barcode") {
				const barcodeElement = element as any;
				// Barcode vykreslíme ako placeholder
				pdf.setDrawColor(0, 0, 0);
				pdf.setFillColor(255, 255, 255);
				pdf.rect(barcodeElement.x || 0, barcodeElement.y || 0, barcodeElement.width || 200, barcodeElement.height || 80, "FD");
				
				// Simulácia čiarového kódu
				const barWidth = (barcodeElement.width || 200) / 12;
				for (let i = 0; i < 12; i++) {
					if (i % 2 === 0) {
						pdf.setFillColor(0, 0, 0);
						pdf.rect((barcodeElement.x || 0) + i * barWidth, (barcodeElement.y || 0) + 10, barWidth * 0.8, (barcodeElement.height || 80) - 30, "F");
					}
				}
				
				pdf.setFontSize(10);
				pdf.setTextColor(0, 0, 0);
				pdf.text(barcodeElement.value || "", (barcodeElement.x || 0) + 10, (barcodeElement.y || 0) + (barcodeElement.height || 80) - 5);

			} else if (element.type === "signature") {
				const signatureElement = element as any;
				pdf.setDrawColor(200, 200, 200);
				pdf.setLineWidth(1);
				pdf.line(
					signatureElement.x || 0,
					(signatureElement.y || 0) + (signatureElement.height || 100) - 5,
					(signatureElement.x || 0) + (signatureElement.width || 200),
					(signatureElement.y || 0) + (signatureElement.height || 100) - 5
				);
				pdf.setFontSize(10);
				pdf.setTextColor(150, 150, 150);
				pdf.text(
					signatureElement.placeholder || "Sign here",
					(signatureElement.x || 0) + 10,
					(signatureElement.y || 0) + (signatureElement.height || 100) / 2
				);

			} else if (element.type === "divider") {
				const dividerElement = element as any;
				const rgb = hexToRgb(dividerElement.color || "#d1d5db");
				pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
				pdf.setLineWidth(dividerElement.thickness || 1);
				
				if (dividerElement.style === "dashed") {
					pdf.setLineDash([5, 5]);
				} else if (dividerElement.style === "dotted") {
					pdf.setLineDash([1, 3]);
				}
				
				pdf.line(
					dividerElement.x || 0,
					(dividerElement.y || 0) + (dividerElement.height || 2) / 2,
					(dividerElement.x || 0) + (dividerElement.width || 400),
					(dividerElement.y || 0) + (dividerElement.height || 2) / 2
				);
				
				pdf.setLineDash([]);

			} else if (element.type === "form") {
				const formElement = element as any;
				
				// Label
				pdf.setFontSize(10);
				pdf.setTextColor(0, 0, 0);
				pdf.text(formElement.label || "", formElement.x || 0, (formElement.y || 0) - 5);
				
				// Pole
				pdf.setDrawColor(200, 200, 200);
				pdf.setFillColor(255, 255, 255);
				pdf.rect(
					formElement.x || 0,
					formElement.y || 0,
					formElement.width || 200,
					formElement.height || 40,
					"FD"
				);
				
				// Placeholder text
				pdf.setFontSize(9);
				pdf.setTextColor(150, 150, 150);
				pdf.text(
					formElement.placeholder || "",
					(formElement.x || 0) + 5,
					(formElement.y || 0) + 20
				);

			} else if (element.type === "code") {
				const codeElement = element as any;
				
				// Pozadie kódu
				pdf.setFillColor(30, 41, 59);
				pdf.rect(
					codeElement.x || 0,
					codeElement.y || 0,
					codeElement.width || 400,
					codeElement.height || 200,
					"F"
				);
				
				// Text kódu
				pdf.setFontSize(codeElement.fontSize || 10);
				pdf.setFont("Courier", "normal");
				pdf.setTextColor(203, 213, 225);
				
				const lines = (codeElement.content || "").split("\n");
				lines.forEach((line: string, index: number) => {
					pdf.text(
						line,
						(codeElement.x || 0) + 10,
						(codeElement.y || 0) + 20 + index * (codeElement.fontSize || 10) * 1.5
					);
				});

			} else if (element.type === "chart") {
				const chartElement = element as ChartElement;
				const { x = 0, y = 0, width = 300, height = 200 } = chartElement;

				pdf.saveGraphicsState();

				// Pozadie grafu
				if (chartElement.backgroundColor && chartElement.backgroundColor !== "transparent") {
					const rgb = hexToRgb(chartElement.backgroundColor);
					pdf.setFillColor(rgb.r, rgb.g, rgb.b);
					pdf.rect(x, y, width, height, "F");
				}

				// Titulok
				if (chartElement.title) {
					pdf.setFontSize(12);
					pdf.setFont("Helvetica", "bold");
					pdf.setTextColor(0, 0, 0);
					pdf.text(chartElement.title, x + width / 2, y + 15, { align: "center" });
				}

				const padding = 40;
				const innerWidth = width - padding * 2;
				const innerHeight = height - padding * 2;

				// Spracovanie dát
				let chartData: Array<{ value: number; label?: string; color?: string }> = [];
				const seriesColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

				if (chartElement.data && "datasets" in chartElement.data && chartElement.data.datasets.length > 0) {
					const dataset = chartElement.data.datasets[0];
					chartData = dataset.data.map((value: any, index: number) => ({
						value: typeof value === "object" ? value.y : value,
						label: chartElement.data.labels?.[index] || `Item ${index + 1}`,
						color: Array.isArray(dataset.backgroundColor)
							? dataset.backgroundColor[index]
							: dataset.backgroundColor || seriesColors[index % seriesColors.length],
					}));
				}

				const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value || 0), 10) : 100;

				// Vykreslenie grafu podľa typu
				if (chartElement.chartType === "bar") {
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
				} else if (chartElement.chartType === "line" && chartData.length > 1) {
					const step = innerWidth / (chartData.length - 1);
					const rgb = hexToRgb(seriesColors[0]);
					pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
					pdf.setLineWidth(2);

					for (let i = 1; i < chartData.length; i++) {
						const x1 = x + padding + (i - 1) * step;
						const y1 = y + height - padding - ((chartData[i - 1].value || 0) / maxValue) * innerHeight;
						const x2 = x + padding + i * step;
						const y2 = y + height - padding - ((chartData[i].value || 0) / maxValue) * innerHeight;
						pdf.line(x1, y1, x2, y2);
					}
				} else if (chartElement.chartType === "pie") {
					const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);
					if (total > 0) {
						const centerX = x + width / 2;
						const centerY = y + height / 2 + 10;
						const radius = Math.min(innerWidth, innerHeight - 20) / 2;
						let startAngle = 0;

						chartData.forEach((d, i) => {
							const sliceAngle = ((d.value || 0) / total) * 360;
							const color = d.color || seriesColors[i % seriesColors.length];
							const rgb = hexToRgb(color);
							pdf.setFillColor(rgb.r, rgb.g, rgb.b);

							const segments = Math.max(2, Math.floor(sliceAngle / 5));
							for (let s = 0; s < segments; s++) {
								const a1 = ((startAngle + (s * sliceAngle) / segments) * Math.PI) / 180;
								const a2 = ((startAngle + ((s + 1) * sliceAngle) / segments) * Math.PI) / 180;
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
		}
	}
};

export const generatePDF = async (
	document: PDFDocument,
	options: { compress?: boolean } = {},
) => {
	let format: string | [number, number] = "a4";

	if (["a3", "a4", "a5", "letter", "legal", "tabloid", "executive"].includes(document.pageSize)) {
		format = document.pageSize;
	} else if (document.pageSize === "custom" && document.customWidth && document.customHeight) {
		const width = document.customWidth * 2.83465;
		const height = document.customHeight * 2.83465;
		format = [width, height];
	}

	const orientation = document.orientation === "portrait" ? "p" : "l";
	const pdf = new jsPDF({
		orientation,
		unit: "pt",
		format,
		compress: options.compress,
	});

	pdf.setProperties({
		title: document.title || "Untitled Document",
		subject: "Created with PDF Crafter",
		creator: "PDF Crafter",
		author: document.metadata?.author || "PDF Crafter User",
	});

	document.pages.forEach((page, index) => {
		if (index > 0) {
			pdf.addPage(format, orientation);
		}
		addPageElementsToPDF(pdf, page.elements || []);
	});

	const fileName = (document.title || "document").replace(/[^\w\s]/gi, "_").replace(/\s+/g, "_") + ".pdf";
	pdf.save(fileName);
};