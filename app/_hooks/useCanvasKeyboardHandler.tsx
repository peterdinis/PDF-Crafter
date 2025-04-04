"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface CanvasKeyboardHandlerProps {
	selectedElement: string | null;
	onDeleteElement: (id: string) => void;
	isEditing?: boolean;
}

export const useCanvasKeyboardHandler = ({
	selectedElement,
	onDeleteElement,
	isEditing = false,
}: CanvasKeyboardHandlerProps) => {
	const handleKeyDown = (e: KeyboardEvent) => {
		if (isEditing) {
			return;
		}

		if (e.key === "Delete" && selectedElement) {
			onDeleteElement(selectedElement);
			toast.info("Element deleted");
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedElement, isEditing]);
};
