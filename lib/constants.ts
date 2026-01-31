export interface PaperSize {
	value: string;
	label: string;
	width: number; // in mm
	height: number; // in mm
}

export const PAPER_SIZES: PaperSize[] = [
	// A Series
	{ value: "a0", label: "A0 (841 × 1189 mm)", width: 841, height: 1189 },
	{ value: "a1", label: "A1 (594 × 841 mm)", width: 594, height: 841 },
	{ value: "a2", label: "A2 (420 × 594 mm)", width: 420, height: 594 },
	{ value: "a3", label: "A3 (297 × 420 mm)", width: 297, height: 420 },
	{ value: "a4", label: "A4 (210 × 297 mm)", width: 210, height: 297 },
	{ value: "a5", label: "A5 (148 × 210 mm)", width: 148, height: 210 },
	{ value: "a6", label: "A6 (105 × 148 mm)", width: 105, height: 148 },
	{ value: "a7", label: "A7 (74 × 105 mm)", width: 74, height: 105 },
	{ value: "a8", label: "A8 (52 × 74 mm)", width: 52, height: 74 },
	{ value: "a9", label: "A9 (37 × 52 mm)", width: 37, height: 52 },
	{ value: "a10", label: "A10 (26 × 37 mm)", width: 26, height: 37 },

	// B Series
	{ value: "b0", label: "B0 (1000 × 1414 mm)", width: 1000, height: 1414 },
	{ value: "b1", label: "B1 (707 × 1000 mm)", width: 707, height: 1000 },
	{ value: "b2", label: "B2 (500 × 707 mm)", width: 500, height: 707 },
	{ value: "b3", label: "B3 (353 × 500 mm)", width: 353, height: 500 },
	{ value: "b4", label: "B4 (250 × 353 mm)", width: 250, height: 353 },
	{ value: "b5", label: "B5 (176 × 250 mm)", width: 176, height: 250 },
	{ value: "b6", label: "B6 (125 × 176 mm)", width: 125, height: 176 },
	{ value: "b7", label: "B7 (88 × 125 mm)", width: 88, height: 125 },
	{ value: "b8", label: "B8 (62 × 88 mm)", width: 62, height: 88 },
	{ value: "b9", label: "B9 (44 × 62 mm)", width: 44, height: 62 },
	{ value: "b10", label: "B10 (31 × 44 mm)", width: 31, height: 44 },

	// North American Sizes (Converted to mm approximately for internal logic, but label stays inches)
	{
		value: "letter",
		label: "Letter (8.5 × 11 in)",
		width: 215.9,
		height: 279.4,
	},
	{ value: "legal", label: "Legal (8.5 × 14 in)", width: 215.9, height: 355.6 },
	{
		value: "tabloid",
		label: "Tabloid (11 × 17 in)",
		width: 279.4,
		height: 431.8,
	},
	{
		value: "ledger",
		label: "Ledger (17 × 11 in)",
		width: 431.8,
		height: 279.4,
	},
	{
		value: "executive",
		label: "Executive (7.25 × 10.5 in)",
		width: 184.15,
		height: 266.7,
	},
	{ value: "folio", label: "Folio (8.5 × 13 in)", width: 215.9, height: 330.2 },
	{ value: "quarto", label: "Quarto (8 × 10 in)", width: 203.2, height: 254 },
	{
		value: "government_letter",
		label: "Government Letter (8 × 10.5 in)",
		width: 203.2,
		height: 266.7,
	},
	{
		value: "government_legal",
		label: "Government Legal (8.5 × 13 in)",
		width: 215.9,
		height: 330.2,
	},
	{
		value: "junior_legal",
		label: "Junior Legal (8 × 5 in)",
		width: 203.2,
		height: 127,
	},
	{
		value: "half_letter",
		label: "Half Letter (5.5 × 8.5 in)",
		width: 139.7,
		height: 215.9,
	},
	{
		value: "statement",
		label: "Statement (5.5 × 8.5 in)",
		width: 139.7,
		height: 215.9,
	},

	// Traditional Paper Sizes
	{
		value: "crown_quarto",
		label: "Crown Quarto (7.44 × 9.68 in)",
		width: 189,
		height: 246,
	},
	{
		value: "crown_octavo",
		label: "Crown Octavo (5.06 × 7.44 in)",
		width: 129,
		height: 189,
	},
	{
		value: "demy_quarto",
		label: "Demy Quarto (8.5 × 10.75 in)",
		width: 216,
		height: 273,
	},
	{
		value: "demy_octavo",
		label: "Demy Octavo (5.44 × 8.5 in)",
		width: 138,
		height: 216,
	},

	// JIS B Series
	{
		value: "jisb0",
		label: "JIS B0 (1030 × 1456 mm)",
		width: 1030,
		height: 1456,
	},
	{ value: "jisb1", label: "JIS B1 (728 × 1030 mm)", width: 728, height: 1030 },
	{ value: "jisb2", label: "JIS B2 (515 × 728 mm)", width: 515, height: 728 },
	{ value: "jisb3", label: "JIS B3 (364 × 515 mm)", width: 364, height: 515 },
	{ value: "jisb4", label: "JIS B4 (257 × 364 mm)", width: 257, height: 364 },
	{ value: "jisb5", label: "JIS B5 (182 × 257 mm)", width: 182, height: 257 },
	{ value: "jisb6", label: "JIS B6 (128 × 182 mm)", width: 128, height: 182 },
	{ value: "jisb7", label: "JIS B7 (91 × 128 mm)", width: 91, height: 128 },
	{ value: "jisb8", label: "JIS B8 (64 × 91 mm)", width: 64, height: 91 },
	{ value: "jisb9", label: "JIS B9 (45 × 64 mm)", width: 45, height: 64 },
	{ value: "jisb10", label: "JIS B10 (32 × 45 mm)", width: 32, height: 45 },

	// C Series (Envelope)
	{ value: "c0", label: "C0 (917 × 1297 mm)", width: 917, height: 1297 },
	{ value: "c1", label: "C1 (648 × 917 mm)", width: 648, height: 917 },
	{ value: "c2", label: "C2 (458 × 648 mm)", width: 458, height: 648 },
	{ value: "c3", label: "C3 (324 × 458 mm)", width: 324, height: 458 },
	{ value: "c4", label: "C4 (229 × 324 mm)", width: 229, height: 324 },
	{ value: "c5", label: "C5 (162 × 229 mm)", width: 162, height: 229 },
	{ value: "c6", label: "C6 (114 × 162 mm)", width: 114, height: 162 },
	{ value: "c7", label: "C7 (81 × 114 mm)", width: 81, height: 114 },
	{ value: "c8", label: "C8 (57 × 81 mm)", width: 57, height: 81 },
	{ value: "c9", label: "C9 (40 × 57 mm)", width: 40, height: 57 },
	{ value: "c10", label: "C10 (28 × 40 mm)", width: 28, height: 40 },

	// Photo Sizes
	{
		value: "photo_4x6",
		label: "Photo 4x6 (4 × 6 in)",
		width: 101.6,
		height: 152.4,
	},
	{
		value: "photo_5x7",
		label: "Photo 5x7 (5 × 7 in)",
		width: 127,
		height: 177.8,
	},
	{
		value: "photo_8x10",
		label: "Photo 8x10 (8 × 10 in)",
		width: 203.2,
		height: 254,
	},

	// Square Sizes
	{
		value: "square_200x200",
		label: "Square 200x200 (200 × 200 mm)",
		width: 200,
		height: 200,
	},
	{
		value: "square_250x250",
		label: "Square 250x250 (250 × 250 mm)",
		width: 250,
		height: 250,
	},
	{
		value: "square_300x300",
		label: "Square 300x300 (300 × 300 mm)",
		width: 300,
		height: 300,
	},

	// Custom Size
	{ value: "custom", label: "Custom Size", width: 0, height: 0 },
];

export const GOOGLE_FONTS = [
	{ value: "Roboto", label: "Roboto" },
	{ value: "Open Sans", label: "Open Sans" },
	{ value: "Lato", label: "Lato" },
	{ value: "Montserrat", label: "Montserrat" },
	{ value: "Oswald", label: "Oswald" },
	{ value: "Raleway", label: "Raleway" },
	{ value: "Merriweather", label: "Merriweather" },
	{ value: "Nunito", label: "Nunito" },
	{ value: "Playfair Display", label: "Playfair Display" },
	{ value: "Ubuntu", label: "Ubuntu" },
	{ value: "Poppins", label: "Poppins" },
	{ value: "Rubik", label: "Rubik" },
	{ value: "Inter", label: "Inter" },
	{ value: "Dancing Script", label: "Dancing Script" },
	{ value: "Pacifico", label: "Pacifico" },
];

export const STANDARD_FONTS = [
	{ value: "Arial", label: "Arial" },
	{ value: "Times-Roman", label: "Times New Roman" },
	{ value: "Courier", label: "Courier" },
	{ value: "Helvetica", label: "Helvetica" },
	{ value: "Georgia", label: "Georgia" },
	{ value: "Verdana", label: "Verdana" },
	{ value: "Trebuchet MS", label: "Trebuchet MS" },
	{ value: "Impact", label: "Impact" },
];

export const ALL_FONTS = [...STANDARD_FONTS, ...GOOGLE_FONTS];
