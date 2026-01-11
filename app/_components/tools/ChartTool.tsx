"use client";

import { cn } from "@/lib/utils";
import type { ChartElement } from "@/types/global";
import { type FC, type MouseEvent, useMemo } from "react";

interface ChartToolProps {
	element: ChartElement;
	isSelected: boolean;
	onMouseDown: (e: MouseEvent) => void;
}

export const ChartTool: FC<ChartToolProps> = ({
	element,
	isSelected,
	onMouseDown,
}) => {
	const {
		chartType,
		data,
		width,
		height,
		seriesColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
		backgroundColor = "transparent",
		gridColor = "#e5e7eb",
		axesColor = "#9ca3af",
		showGrid = true,
		showAxes = true,
	} = element;

	const padding = 40;
	const innerWidth = width - padding * 2;
	const innerHeight = height - padding * 2;

	const { labels, datasets } = data;
	const dataset = datasets[0] || { data: [] };
	const values = dataset.data;

	const maxValue = useMemo(() => {
		if (values.length === 0) return 100;
		return Math.max(...values, 10);
	}, [values]);

	const renderBars = () => {
		if (values.length === 0) return null;
		const barWidth = innerWidth / values.length;
		return values.map((value, i) => {
			const barHeight = (value / maxValue) * innerHeight;
			const x = padding + i * barWidth + barWidth * 0.1;
			const y = height - padding - barHeight;
			const color =
				dataset.backgroundColor || seriesColors[i % seriesColors.length];

			return (
				<rect
					key={`bar-${i}`}
					x={x}
					y={y}
					width={barWidth * 0.8}
					height={barHeight}
					fill={color}
					className="transition-all duration-300"
				/>
			);
		});
	};

	const renderLine = () => {
		if (values.length < 2) return null;
		const step = innerWidth / (values.length - 1);
		const points = values
			.map((value, i) => {
				const x = padding + i * step;
				const y = height - padding - (value / maxValue) * innerHeight;
				return `${x},${y}`;
			})
			.join(" ");

		return (
			<>
				<polyline
					points={points}
					fill="none"
					stroke={seriesColors[0]}
					strokeWidth="2"
					strokeLinejoin="round"
					strokeLinecap="round"
				/>
				{values.map((value, i) => {
					const x = padding + i * step;
					const y = height - padding - (value / maxValue) * innerHeight;
					return (
						<circle
							key={`point-${i}`}
							cx={x}
							cy={y}
							r="4"
							fill={seriesColors[0]}
							stroke="white"
							strokeWidth="1"
						/>
					);
				})}
			</>
		);
	};

	const renderPie = () => {
		const total = values.reduce((sum, val) => sum + val, 0);
		if (total === 0) return null;

		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(innerWidth, innerHeight) / 2;

		let startAngle = 0;
		return values.map((value, i) => {
			const sliceAngle = (value / total) * 360;
			const endAngle = startAngle + sliceAngle;

			const x1 = centerX + radius * Math.cos((Math.PI * startAngle) / 180);
			const y1 = centerY + radius * Math.sin((Math.PI * startAngle) / 180);
			const x2 = centerX + radius * Math.cos((Math.PI * endAngle) / 180);
			const y2 = centerY + radius * Math.sin((Math.PI * endAngle) / 180);

			const largeArcFlag = sliceAngle > 180 ? 1 : 0;
			const dPath = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

			const color = seriesColors[i % seriesColors.length];
			startAngle = endAngle;

			return (
				<path
					key={`slice-${i}`}
					d={dPath}
					fill={color}
					stroke="white"
					strokeWidth="1"
				/>
			);
		});
	};

	const renderGrid = () => {
		if (!showGrid || chartType === "pie") return null;
		const lines = 5;
		return Array.from({ length: lines + 1 }).map((_, i) => {
			const y = padding + (i * innerHeight) / lines;
			return (
				<line
					key={`grid-${i}`}
					x1={padding}
					y1={y}
					x2={width - padding}
					y2={y}
					stroke={gridColor}
					strokeWidth="1"
					strokeDasharray="4"
				/>
			);
		});
	};

	const renderAxes = () => {
		if (!showAxes || chartType === "pie") return null;
		return (
			<g stroke={axesColor} strokeWidth="2">
				{/* Y Axis */}
				<line x1={padding} y1={padding} x2={padding} y2={height - padding} />
				{/* X Axis */}
				<line
					x1={padding}
					y1={height - padding}
					x2={width - padding}
					y2={height - padding}
				/>
				{/* X Labels */}
				{labels.map((label, i) => {
					if (i % Math.ceil(labels.length / 5) !== 0) return null;
					const x = padding + (i / (labels.length - 1)) * innerWidth;
					return (
						<text
							key={`label-${i}`}
							x={x}
							y={height - padding + 20}
							textAnchor="middle"
							fontSize="10"
							fill={axesColor}
							strokeWidth="0"
						>
							{label}
						</text>
					);
				})}
			</g>
		);
	};

	return (
		<div
			className={cn(
				"w-full h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden",
				isSelected && "ring-2 ring-editor-primary ring-offset-2",
			)}
			onMouseDown={onMouseDown}
			style={{ backgroundColor }}
		>
			<svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
				{renderGrid()}
				{renderAxes()}
				{chartType === "bar" && renderBars()}
				{chartType === "line" && renderLine()}
				{chartType === "pie" && renderPie()}
			</svg>
		</div>
	);
};
