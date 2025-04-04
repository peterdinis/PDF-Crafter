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
import type { PDFDocument } from "@/types/types";
import { X } from "lucide-react";
import type React from "react";

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
	{ value: "a3", label: "A3 (297 × 420 mm)" },
	{ value: "a4", label: "A4 (210 × 297 mm)" },
	{ value: "a5", label: "A5 (148 × 210 mm)" },
	{ value: "letter", label: "Letter (8.5 × 11 in)" },
	{ value: "legal", label: "Legal (8.5 × 14 in)" },
	{ value: "tabloid", label: "Tabloid (11 × 17 in)" },
	{ value: "executive", label: "Executive (7.25 × 10.5 in)" },
	{ value: "b5", label: "B5 (176 × 250 mm)" },
	{ value: "b4", label: "B4 (250 × 353 mm)" },
	{ value: "jisb4", label: "JIS B4 (257 × 364 mm)" },
	{ value: "jisb5", label: "JIS B5 (182 × 257 mm)" },
	{ value: "custom", label: "Custom Size" },
];

export const PdfSettings: React.FC<PdfSettingsProps> = ({
	document,
	onUpdate,
	onClose,
}) => {
	return (
		<div className="w-80 bg-background border-l border-editor-border h-full overflow-y-auto">
			<div className="p-4 border-b border-editor-border flex items-center justify-between">
				<h2 className="text-lg font-semibold">Document Settings</h2>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X size={18} />
				</Button>
			</div>

			<div className="p-4 space-y-6">
				<div className="space-y-2">
					<Label htmlFor="title">Document Title</Label>
					<Input
						id="title"
						value={document.title}
						onChange={(e) => onUpdate({ title: e.target.value })}
					/>
				</div>

				<div className="space-y-2">
					<Label>Page Size</Label>
					<Select
						value={document.pageSize}
						onValueChange={(value) =>
							onUpdate({
								pageSize: value as
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
									| "custom",
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select Page Size" />
						</SelectTrigger>
						<SelectContent>
							{paperSizes.map((size) => (
								<SelectItem key={size.value} value={size.value}>
									{size.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{document.pageSize === "custom" && (
						<div className="mt-3 space-y-2">
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
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label>Orientation</Label>
					<RadioGroup
						value={document.orientation}
						onValueChange={(value) =>
							onUpdate({ orientation: value as "portrait" | "landscape" })
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
				</div>

				<div className="space-y-2">
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
				</div>

				<div className="space-y-2">
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
				</div>
			</div>
		</div>
	);
};
