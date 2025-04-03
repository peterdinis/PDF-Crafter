"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/types";
import {
	Circle,
	GripHorizontal,
	Image,
	Minus,
	Pencil,
	PointerIcon,
	Settings,
	Square,
	Table,
	TableProperties,
	Type,
} from "lucide-react";
import type React from "react";

interface ToolbarProps {
	activeTool: Tool;
	onToolSelect: (tool: Tool) => void;
	onSettingsToggle: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
	activeTool,
	onToolSelect,
	onSettingsToggle,
}) => {
	const tools = [
		{ name: "Select", value: "select" as Tool, icon: PointerIcon },
		{ name: "Text", value: "text" as Tool, icon: Type },
		{ name: "Image", value: "image" as Tool, icon: Image },
		{ name: "Rectangle", value: "shape_rectangle" as Tool, icon: Square },
		{ name: "Circle", value: "shape_circle" as Tool, icon: Circle },
		{ name: "Line", value: "shape_line" as Tool, icon: Minus },
		{ name: "Pencil", value: "pencil" as Tool, icon: Pencil },
		{ name: "Simple Table", value: "table_simple" as Tool, icon: Table },
		{
			name: "Striped Table",
			value: "table_striped" as Tool,
			icon: TableProperties,
		},
		{
			name: "Bordered Table",
			value: "table_bordered" as Tool,
			icon: GripHorizontal,
		},
	];

	return (
		<div className="w-64 bg-editor-background border-r border-editor-border flex flex-col">
			<div className="p-4 border-b border-editor-border">
				<h2 className="text-lg font-semibold text-editor-foreground">
					PDF Crafter Ninja
				</h2>
			</div>

			<div className="p-4">
				<h3 className="text-sm font-medium text-editor-foreground mb-3">
					Tools
				</h3>
				<div className="flex flex-col gap-2">
					{tools.map((tool) => (
						<div
							key={tool.value}
							className={cn(
								"tool-item flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-editor-primary/10",
								activeTool === tool.value &&
									"bg-editor-primary/20 text-editor-primary",
							)}
							onClick={() => onToolSelect(tool.value)}
						>
							<tool.icon size={16} />
							<span>{tool.name}</span>
						</div>
					))}
				</div>
			</div>

			<div className="mt-auto p-4 border-t border-editor-border">
				<Button
					variant="outline"
					className="w-full flex items-center gap-2 justify-center"
					onClick={onSettingsToggle}
				>
					<Settings size={16} />
					Document Settings
				</Button>
			</div>
		</div>
	);
};
