import { STANDARD_FONTS } from "@/lib/constants";
import type { PDFDocument, TextElement } from "@/types/global";
import { useEffect } from "react";

export const useFontLoader = (document: PDFDocument) => {
	useEffect(() => {
		const loadFonts = () => {
			const usedFonts = new Set<string>();

			// Add default font
			if (document.defaultFontFamily) {
				usedFonts.add(document.defaultFontFamily);
			}

			// Add fonts from all text elements
			document.pages.forEach((page) => {
				page.elements.forEach((element) => {
					if (element.type === "text") {
						const textElement = element as TextElement;
						if (textElement.fontFamily) {
							usedFonts.add(textElement.fontFamily);
						}
					}
				});
			});

			const standardFontNames = new Set(STANDARD_FONTS.map((f) => f.value));
			const fontsToLoad = Array.from(usedFonts).filter(
				(font) => !standardFontNames.has(font),
			);

			if (fontsToLoad.length === 0) return;

			// Check if fonts are already loaded (simple check by ID)
			const linkId = "pdf-crafter-google-fonts";

			// Use window.document for DOM operations
			const domDocument = window.document;
			let link = domDocument.getElementById(linkId) as HTMLLinkElement;

			if (!link) {
				link = domDocument.createElement("link");
				link.id = linkId;
				link.rel = "stylesheet";
				domDocument.head.appendChild(link);
			}

			// Construct Google Fonts URL
			// Example: https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:ital,wght@0,400;0,700;1,400&display=swap
			// For simplicity, we'll load regular(400) and bold(700) and italic(400i) for now if possible,
			// or just standard weight to minimize bandwidth if not specified.
			// Ideally we checks fontWeight/fontStyle too, but let's just load 400,700,400i,700i for coverage.

			const families = fontsToLoad
				.map((font) => {
					// Handle spaces in font names for URL
					const fontName = font.replace(/\s+/g, "+");
					return `family=${fontName}:ital,wght@0,400;0,700;1,400;1,700`;
				})
				.join("&");

			const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;

			if (link.href !== url) {
				link.href = url;
			}
		};

		loadFonts();
	}, [document]);
};
