"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Check, FileText, Upload } from "lucide-react";
import { type FC, useMemo, useState } from "react";
import { toast } from "sonner";

interface ChartImportDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onImport: (data: { label: string; value: number }[]) => void;
}

export const ChartImportDialog: FC<ChartImportDialogProps> = ({
	isOpen,
	onClose,
	onImport,
}) => {
	const [rawData, setRawData] = useState("");
	const [parsedData, setParsedData] = useState<
		{ label: string; value: number }[]
	>([]);

	const handleRawDataChange = (value: string) => {
		setRawData(value);
		if (!value.trim()) {
			setParsedData([]);
			return;
		}

		try {
			let newData: { label: string; value: number }[] = [];
			if (value.trim().startsWith("[") || value.trim().startsWith("{")) {
				const parsed = JSON.parse(value);
				const normalized = Array.isArray(parsed) ? parsed : [parsed];
				newData = normalized
					.map((item: any) => ({
						label: String(item.label || item.name || "Item"),
						value: Number.parseFloat(item.value || item.amount || "0"),
					}))
					.filter((item) => !isNaN(item.value));
			} else {
				const lines = value.split("\n");
				newData = lines
					.map((line) => {
						const [label, val] = line.split(/[,;\t]/);
						return {
							label: label?.trim() || "Item",
							value: Number.parseFloat(val?.trim() || "0"),
						};
					})
					.filter((item) => item.label && !isNaN(item.value));
			}
			setParsedData(newData);
		} catch (err) {
			console.error("Failed to parse data:", err);
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result as string;
			setRawData(content);
			handleRawDataChange(content);
		};
		reader.readAsText(file);
	};

	const handleApply = () => {
		if (parsedData.length === 0) {
			toast.error("No valid data found to import");
			return;
		}
		onImport(parsedData);
		toast.success(`Imported ${parsedData.length} data points`);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Import Chart Data</DialogTitle>
					<DialogDescription>
						Paste CSV, JSON or upload a file to import data points. Supported
						formats: Label,Value OR JSON arrays.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto space-y-4 py-4 custom-scrollbar">
					<div className="space-y-2">
						<Label className="text-sm font-semibold">Paste Raw Data</Label>
						<textarea
							placeholder="Jan,45&#10;Feb,52&#10;Mar,38"
							className="w-full min-h-[120px] p-3 text-xs border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 font-mono focus:ring-1 focus:ring-editor-primary outline-none transition-all"
							value={rawData}
							onChange={(e) => handleRawDataChange(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex-1">
							<Label
								htmlFor="chart-file-upload-dialog"
								className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-medium"
							>
								<Upload size={16} className="text-editor-primary" />
								Upload CSV/JSON
							</Label>
							<input
								id="chart-file-upload-dialog"
								type="file"
								accept=".csv,.json,.txt"
								className="hidden"
								onChange={handleFileUpload}
							/>
						</div>
					</div>

					{parsedData.length > 0 && (
						<div className="space-y-2">
							<Label className="text-sm font-semibold flex items-center gap-2">
								<Check size={14} className="text-green-500" />
								Preview ({parsedData.length} points)
							</Label>
							<div className="border rounded-lg overflow-hidden border-gray-100 dark:border-gray-800">
								<Table>
									<TableHeader className="bg-gray-50 dark:bg-gray-900">
										<TableRow>
											<TableHead className="w-1/2">Label</TableHead>
											<TableHead className="w-1/2">Value</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{parsedData.slice(0, 10).map((row, i) => (
											<TableRow key={i}>
												<TableCell>{row.label}</TableCell>
												<TableCell>{row.value}</TableCell>
											</TableRow>
										))}
										{parsedData.length > 10 && (
											<TableRow>
												<TableCell
													colSpan={2}
													className="text-center text-xs text-gray-500"
												>
													...and {parsedData.length - 10} more items
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleApply}
						disabled={parsedData.length === 0}
						className="bg-editor-primary hover:bg-editor-primary/90"
					>
						Import Data
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
