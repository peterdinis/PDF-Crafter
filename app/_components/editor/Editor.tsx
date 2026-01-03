"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdfUtils";
import type {
	PDFDocument,
	PDFElement,
	PDFPage,
	TextElement,
	Tool,
} from "@/types/global";
import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Canvas } from "../canvas/Canvas";
import { PdfSettings } from "../pdf/PdfSettings";
import { ScrollToTop } from "../shared/ScrollToTop";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toolbar } from "./Toolbar";

const PDFEditor = () => {
	const [document, setDocument] = useState<PDFDocument>({
		title: "Untitled Document",
		pageSize: "a4",
		orientation: "portrait",
		defaultTextColor: "#000000",
		defaultFontFamily: "Arial",
		defaultFontSize: 16,
		pages: [
			{
				id: crypto.randomUUID(),
				elements: [],
			},
		],
		currentPage: 0,
	});

	const [activeTool, setActiveTool] = useState<Tool>("select");
	const [selectedElement, setSelectedElement] = useState<string | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [showClearPageDialog, setShowClearPageDialog] = useState(false);
	const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Delete key
			if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
				e.preventDefault();
				deleteElement(selectedElement);
				toast.success("Element deleted");
			}

			// Escape key to deselect
			if (e.key === "Escape") {
				setSelectedElement(null);
			}

			// Duplicate element with Ctrl/Cmd + D
			if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedElement) {
				e.preventDefault();
				duplicateElement(selectedElement);
			}

			// Open properties panel with Ctrl/Cmd + E
			if ((e.ctrlKey || e.metaKey) && e.key === "e" && selectedElement) {
				e.preventDefault();
				setShowPropertiesPanel(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedElement]);

	const handleToolSelect = (tool: Tool) => {
		setActiveTool(tool);
	};

	const handleDownload = async () => {
		try {
			await generatePDF(document);
			toast.success("PDF downloaded successfully!");
		} catch (error) {
			console.error("Failed to download PDF:", error);
			toast.error("Failed to download PDF. Please try again.");
		}
	};

	const addPage = () => {
		const newPage: PDFPage = {
			id: crypto.randomUUID(),
			elements: [],
		};

		setDocument((prev) => ({
			...prev,
			pages: [...prev.pages, newPage],
			currentPage: prev.pages.length,
		}));

		setSelectedElement(null);
		toast.success("New page added");
	};

	const changePage = (pageIndex: number) => {
		if (pageIndex >= 0 && pageIndex < document.pages.length) {
			setDocument((prev) => ({
				...prev,
				currentPage: pageIndex,
			}));
			setSelectedElement(null);
		}
	};

	const deletePage = (pageIndex: number) => {
		if (document.pages.length <= 1) {
			toast.error("Cannot delete the only page");
			return;
		}

		setDocument((prev) => {
			const newPages = prev.pages.filter((_, index) => index !== pageIndex);
			const newCurrentPage =
				prev.currentPage >= newPages.length
					? newPages.length - 1
					: prev.currentPage;

			return {
				...prev,
				pages: newPages,
				currentPage: newCurrentPage,
			};
		});

		setSelectedElement(null);
		toast.success("Page deleted");
	};

	const clearCurrentPage = () => {
		setDocument((prev) => {
			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: [],
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});

		setSelectedElement(null);
		toast.success("All elements deleted from current page");
		setShowClearPageDialog(false);
	};

	const addElement = (element: PDFElement) => {
		if (element.type === "text") {
			(element as TextElement).color = document.defaultTextColor;
			(element as TextElement).fontFamily = document.defaultFontFamily;
			(element as TextElement).fontSize = document.defaultFontSize;
		}

		setDocument((prev) => {
			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: [...updatedPages[prev.currentPage].elements, element],
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});

		setSelectedElement(element.id);
	};

	const updateElement = (element: PDFElement) => {
		setDocument((prev) => {
			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: updatedPages[prev.currentPage].elements.map((el) =>
					el.id === element.id ? element : el,
				),
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});
	};

	const deleteElement = (id: string) => {
		setDocument((prev) => {
			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: updatedPages[prev.currentPage].elements.filter(
					(el) => el.id !== id,
				),
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});

		if (selectedElement === id) {
			setSelectedElement(null);
			setShowPropertiesPanel(false);
		}
		toast.success("Element deleted");
	};

	const duplicateElement = (id: string) => {
		setDocument((prev) => {
			const currentPage = prev.pages[prev.currentPage];
			const elementToDuplicate = currentPage.elements.find(
				(el) => el.id === id,
			);

			if (
				!elementToDuplicate ||
				elementToDuplicate.x === undefined ||
				elementToDuplicate.y === undefined
			)
				return prev;

			const duplicatedElement = {
				...elementToDuplicate,
				id: crypto.randomUUID(),
				x: elementToDuplicate.x + 20,
				y: elementToDuplicate.y + 20,
			};

			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: [
					...updatedPages[prev.currentPage].elements,
					duplicatedElement,
				],
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});

		toast.success("Element duplicated");
	};

	const moveElementInList = (id: string, direction: "up" | "down") => {
		setDocument((prev) => {
			const currentPage = prev.pages[prev.currentPage];
			const index = currentPage.elements.findIndex((el) => el.id === id);
			if (index === -1) return prev;

			const newElements = [...currentPage.elements];
			const targetIndex = direction === "up" ? index + 1 : index - 1;

			if (targetIndex < 0 || targetIndex >= newElements.length) return prev;

			// Swap elements
			[newElements[index], newElements[targetIndex]] = [
				newElements[targetIndex],
				newElements[index],
			];

			const updatedPages = [...prev.pages];
			updatedPages[prev.currentPage] = {
				...updatedPages[prev.currentPage],
				elements: newElements,
			};

			return {
				...prev,
				pages: updatedPages,
			};
		});
	};

	// Get selected element object
	const selectedElementObj = selectedElement
		? document.pages[document.currentPage]?.elements.find(
				(el) => el.id === selectedElement,
			) || null
		: null;

	// Show properties panel when element is selected
	useEffect(() => {
		if (selectedElement) {
			setShowPropertiesPanel(true);
		} else {
			setShowPropertiesPanel(false);
		}
	}, [selectedElement]);

	const updateDocumentSettings = (settings: Partial<PDFDocument>) => {
		setDocument({
			...document,
			...settings,
		});
	};

	return (
		<div className="flex h-screen overflow-hidden bg-editor-background">
			<Toolbar
				activeTool={activeTool}
				onToolSelect={handleToolSelect}
				onSettingsToggle={() => setShowSettings(!showSettings)}
				pageElements={document.pages[document.currentPage]?.elements || []}
				selectedElement={selectedElement}
				onSelectElement={setSelectedElement}
				onMoveElement={moveElementInList}
				onDeleteElement={deleteElement}
			/>

			<div className="flex-1 overflow-hidden flex flex-col">
				<div className="p-4 border-b border-editor-border flex items-center justify-between">
					<h1 className="text-lg font-medium">{document.title}</h1>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => setShowClearPageDialog(true)}
							variant="outline"
							className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
						>
							<Trash2 size={16} />
							Clear Page
						</Button>
						<Button
							onClick={handleDownload}
							variant="default"
							className="flex items-center gap-2"
						>
							<Download size={16} />
							Download PDF
						</Button>
					</div>
				</div>

				<div className="flex-1 overflow-auto relative">
					<div className="flex items-center justify-center p-4 dark:bg-stone-800 bg-gray-100 border-b border-editor-border">
						<div className="flex items-center space-x-2">
							{document.pages.map((page, index) => (
								<Button
									key={page.id}
									variant={
										document.currentPage === index ? "default" : "outline"
									}
									size="sm"
									onClick={() => changePage(index)}
									className="min-w-10 h-8"
								>
									{index + 1}
								</Button>
							))}
							<Button
								variant="outline"
								size="sm"
								onClick={addPage}
								className="h-8"
							>
								<Plus size={16} />
							</Button>
							{document.pages.length > 1 && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => deletePage(document.currentPage)}
									className="text-red-500 hover:text-red-700 h-8"
								>
									Delete
								</Button>
							)}
						</div>
					</div>

					<Canvas
						document={document}
						activeTool={activeTool}
						selectedElement={selectedElement}
						onSelectElement={setSelectedElement}
						onAddElement={addElement}
						onUpdateElement={updateElement}
						onDeleteElement={deleteElement}
					/>
				</div>
			</div>

			{showSettings && (
				<PdfSettings
					document={document}
					onUpdate={updateDocumentSettings}
					onClose={() => setShowSettings(false)}
				/>
			)}

			{showPropertiesPanel && selectedElementObj && (
				<PropertiesPanel
					element={selectedElementObj}
					onUpdate={updateElement}
					onDelete={deleteElement}
					onDuplicate={duplicateElement}
					onClose={() => {
						setShowPropertiesPanel(false);
						setSelectedElement(null);
					}}
				/>
			)}

			<AlertDialog
				open={showClearPageDialog}
				onOpenChange={setShowClearPageDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear Page</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete all elements from the current
							page? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={clearCurrentPage}
							className="bg-red-500 text-white hover:bg-red-600"
						>
							Delete All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ScrollToTop />
		</div>
	);
};

export default PDFEditor;
