"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Image, Upload } from "lucide-react";
import {
	type ChangeEvent,
	type DragEvent,
	type FC,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
	onUpload: (imageSrc: string) => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ onUpload }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(true);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				onUpload(event.target.result as string);
				setOpen(false);

				// Clear the file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];

			if (!file.type.startsWith("image/")) {
				toast.error("Please drop a valid image file");
				return;
			}

			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) {
					onUpload(event.target.result as string);
					setOpen(false);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Upload Image</DialogTitle>
				</DialogHeader>
				<div
					className="grid place-items-center border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer"
					onClick={() => fileInputRef.current?.click()}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
				>
					<div className="flex flex-col items-center gap-4">
						<Image className="h-8 w-8 text-gray-400" />
						<div className="flex flex-col items-center gap-1">
							<p className="text-sm font-medium">
								Click to upload or drag and drop
							</p>
							<p className="text-xs text-gray-500">
								SVG, PNG, JPG or GIF (max. 5MB)
							</p>
						</div>
						<Button variant="outline" size="sm">
							<Upload className="h-4 w-4 mr-2" />
							Upload Image
						</Button>
					</div>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
