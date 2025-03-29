"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PDFDocument } from "@/types";
import { X } from "lucide-react";
import type { FC } from "react";
import { ModeToggle } from "../shared/ModeToggle";

interface DocumentSettingsProps {
	document: PDFDocument;
	onUpdate: (settings: Partial<PDFDocument>) => void;
	onClose: () => void;
}

export const DocumentSettings: FC<DocumentSettingsProps> = ({
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
					<RadioGroup
						value={document.pageSize}
						onValueChange={(value) =>
							onUpdate({
								pageSize: value as
									| "a4"
									| "letter"
									| "legal"
									| "tabloid"
									| "executive"
									| "b5",
							})
						}
						className="flex flex-col space-y-1"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="a4" id="a4" />
							<Label htmlFor="a4">A4 (210 × 297 mm)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="letter" id="letter" />
							<Label htmlFor="letter">Letter (8.5 × 11 in)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="legal" id="legal" />
							<Label htmlFor="legal">Legal (8.5 × 14 in)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="tabloid" id="tabloid" />
							<Label htmlFor="tabloid">Tabloid (11 × 17 in)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="executive" id="executive" />
							<Label htmlFor="executive">Executive (7.25 × 10.5 in)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="b5" id="b5" />
							<Label htmlFor="b5">B5 (176 × 250 mm)</Label>
						</div>
					</RadioGroup>
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

				<div className="flex justify-between">
					<Label>Enable Dark Mode</Label>
					<ModeToggle />
				</div>
			</div>
		</div>
	);
};
