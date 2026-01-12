"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { PDFDocument } from "@/types/global";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import { ModeToggle } from "../shared/ModeToggle";

interface PdfSettingsProps {
	document: PDFDocument;
	onUpdate: (settings: Partial<PDFDocument>) => void;
	onClose: () => void;
}

const fontOptions = [
	{ value: "Arial", label: "Arial" },
	{ value: "Times-Roman", label: "Times New Roman" },
	{ value: "Courier", label: "Courier" },
	{ value: "Helvetica", label: "Helvetica" },
	{ value: "Georgia", label: "Georgia" },
	{ value: "Verdana", label: "Verdana" },
];

const paperSizes = [
	// A Series
	{ value: "a0", label: "A0 (841 × 1189 mm)" },
	{ value: "a1", label: "A1 (594 × 841 mm)" },
	{ value: "a2", label: "A2 (420 × 594 mm)" },
	{ value: "a3", label: "A3 (297 × 420 mm)" },
	{ value: "a4", label: "A4 (210 × 297 mm)" },
	{ value: "a5", label: "A5 (148 × 210 mm)" },
	{ value: "a6", label: "A6 (105 × 148 mm)" },
	{ value: "a7", label: "A7 (74 × 105 mm)" },
	{ value: "a8", label: "A8 (52 × 74 mm)" },
	{ value: "a9", label: "A9 (37 × 52 mm)" },
	{ value: "a10", label: "A10 (26 × 37 mm)" },
	
	// B Series
	{ value: "b0", label: "B0 (1000 × 1414 mm)" },
	{ value: "b1", label: "B1 (707 × 1000 mm)" },
	{ value: "b2", label: "B2 (500 × 707 mm)" },
	{ value: "b3", label: "B3 (353 × 500 mm)" },
	{ value: "b4", label: "B4 (250 × 353 mm)" },
	{ value: "b5", label: "B5 (176 × 250 mm)" },
	{ value: "b6", label: "B6 (125 × 176 mm)" },
	{ value: "b7", label: "B7 (88 × 125 mm)" },
	{ value: "b8", label: "B8 (62 × 88 mm)" },
	{ value: "b9", label: "B9 (44 × 62 mm)" },
	{ value: "b10", label: "B10 (31 × 44 mm)" },
	
	// North American Sizes
	{ value: "letter", label: "Letter (8.5 × 11 in)" },
	{ value: "legal", label: "Legal (8.5 × 14 in)" },
	{ value: "tabloid", label: "Tabloid (11 × 17 in)" },
	{ value: "ledger", label: "Ledger (17 × 11 in)" },
	{ value: "executive", label: "Executive (7.25 × 10.5 in)" },
	{ value: "folio", label: "Folio (8.5 × 13 in)" },
	{ value: "quarto", label: "Quarto (8 × 10 in)" },
	{ value: "government_letter", label: "Government Letter (8 × 10.5 in)" },
	{ value: "government_legal", label: "Government Legal (8.5 × 13 in)" },
	{ value: "junior_legal", label: "Junior Legal (8 × 5 in)" },
	{ value: "half_letter", label: "Half Letter (5.5 × 8.5 in)" },
	{ value: "statement", label: "Statement (5.5 × 8.5 in)" },
	
	// Traditional Paper Sizes
	{ value: "crown_quarto", label: "Crown Quarto (7.44 × 9.68 in)" },
	{ value: "crown_octavo", label: "Crown Octavo (5.06 × 7.44 in)" },
	{ value: "demy_quarto", label: "Demy Quarto (8.5 × 10.75 in)" },
	{ value: "demy_octavo", label: "Demy Octavo (5.44 × 8.5 in)" },
	
	// JIS B Series
	{ value: "jisb0", label: "JIS B0 (1030 × 1456 mm)" },
	{ value: "jisb1", label: "JIS B1 (728 × 1030 mm)" },
	{ value: "jisb2", label: "JIS B2 (515 × 728 mm)" },
	{ value: "jisb3", label: "JIS B3 (364 × 515 mm)" },
	{ value: "jisb4", label: "JIS B4 (257 × 364 mm)" },
	{ value: "jisb5", label: "JIS B5 (182 × 257 mm)" },
	{ value: "jisb6", label: "JIS B6 (128 × 182 mm)" },
	{ value: "jisb7", label: "JIS B7 (91 × 128 mm)" },
	{ value: "jisb8", label: "JIS B8 (64 × 91 mm)" },
	{ value: "jisb9", label: "JIS B9 (45 × 64 mm)" },
	{ value: "jisb10", label: "JIS B10 (32 × 45 mm)" },
	
	// C Series (Envelope)
	{ value: "c0", label: "C0 (917 × 1297 mm)" },
	{ value: "c1", label: "C1 (648 × 917 mm)" },
	{ value: "c2", label: "C2 (458 × 648 mm)" },
	{ value: "c3", label: "C3 (324 × 458 mm)" },
	{ value: "c4", label: "C4 (229 × 324 mm)" },
	{ value: "c5", label: "C5 (162 × 229 mm)" },
	{ value: "c6", label: "C6 (114 × 162 mm)" },
	{ value: "c7", label: "C7 (81 × 114 mm)" },
	{ value: "c8", label: "C8 (57 × 81 mm)" },
	{ value: "c9", label: "C9 (40 × 57 mm)" },
	{ value: "c10", label: "C10 (28 × 40 mm)" },
	
	// Photo Sizes
	{ value: "photo_4x6", label: "Photo 4x6 (4 × 6 in)" },
	{ value: "photo_5x7", label: "Photo 5x7 (5 × 7 in)" },
	{ value: "photo_8x10", label: "Photo 8x10 (8 × 10 in)" },
	
	// Square Sizes
	{ value: "square_200x200", label: "Square 200x200 (200 × 200 mm)" },
	{ value: "square_250x250", label: "Square 250x250 (250 × 250 mm)" },
	{ value: "square_300x300", label: "Square 300x300 (300 × 300 mm)" },
	
	// Custom Size
	{ value: "custom", label: "Custom Size" },
];

export const PdfSettings: React.FC<PdfSettingsProps> = ({
	document,
	onUpdate,
	onClose,
}) => {
	return (
		<motion.div
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{
				type: "spring",
				damping: 25,
				stiffness: 300,
			}}
			className="w-80 bg-background border-l border-editor-border h-full overflow-y-auto"
		>
			<div className="p-4 border-b border-editor-border flex items-center justify-between">
				<motion.h2
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="text-lg font-semibold"
				>
					Settings
				</motion.h2>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X size={18} />
				</Button>
			</div>

			<div className="p-4 space-y-6">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="space-y-2"
				>
					<Label htmlFor="title">Document Title</Label>
					<Input
						id="title"
						value={document.title}
						onChange={(e) => onUpdate({ title: e.target.value })}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.25 }}
					className="space-y-2"
				>
					<Label>Page Size</Label>
					<Select
						value={document.pageSize}
						onValueChange={(value) =>
							onUpdate({
								pageSize: value as PDFDocument["pageSize"],
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select Page Size" />
						</SelectTrigger>
						<SelectContent className="max-h-96 overflow-y-auto">
							{paperSizes.map((size) => (
								<SelectItem key={size.value} value={size.value}>
									{size.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{document.pageSize === "custom" && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							transition={{ duration: 0.2 }}
							className="mt-3 space-y-2 overflow-hidden"
						>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<Label htmlFor="customWidth">Width (mm)</Label>
									<Input
										id="customWidth"
										type="number"
										value={document.customWidth || 210}
										onChange={(e) =>
											onUpdate({ customWidth: Number(e.target.value) })
										}
										className="mt-1"
										min={50}
										max={2000}
									/>
								</div>
								<div>
									<Label htmlFor="customHeight">Height (mm)</Label>
									<Input
										id="customHeight"
										type="number"
										value={document.customHeight || 297}
										onChange={(e) =>
											onUpdate({ customHeight: Number(e.target.value) })
										}
										className="mt-1"
										min={50}
										max={2000}
									/>
								</div>
							</div>
						</motion.div>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="space-y-2"
				>
					<Label>Orientation</Label>
					<RadioGroup
						value={document.orientation}
						onValueChange={(value) =>
							onUpdate({ orientation: value as PDFDocument["orientation"] })
						}
						className="flex flex-col space-y-1"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="portrait" id="portrait" />
							<Label htmlFor="portrait">Portrait</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="landscape" id="landscape" />
							<Label htmlFor="landscape">Landscape</Label>
						</div>
					</RadioGroup>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.35 }}
					className="space-y-2"
				>
					<Label>Default Font</Label>
					<Select
						value={document.defaultFontFamily}
						onValueChange={(value) => onUpdate({ defaultFontFamily: value })}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select Font" />
						</SelectTrigger>
						<SelectContent>
							{fontOptions.map((font) => (
								<SelectItem key={font.value} value={font.value}>
									{font.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="space-y-2"
				>
					<Label>Default Text Color</Label>
					<div className="flex items-center gap-2">
						<Input
							type="color"
							value={document.defaultTextColor || "#000000"}
							onChange={(e) => onUpdate({ defaultTextColor: e.target.value })}
							className="w-12 h-10 p-1 cursor-pointer"
						/>
						<Input
							type="text"
							value={document.defaultTextColor || "#000000"}
							onChange={(e) => onUpdate({ defaultTextColor: e.target.value })}
							className="flex-1"
							maxLength={7}
						/>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.45 }}
					className="flex justify-between"
				>
					<Label>Enable Dark Mode</Label>
					<ModeToggle />
				</motion.div>
			</div>
		</motion.div>
	);
};