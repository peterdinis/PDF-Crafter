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

	const renderDoughnut = () => {
		const total = values.reduce((sum, val) => sum + val, 0);
		if (total === 0) return null;

		const centerX = width / 2;
		const centerY = height / 2;
		const outerRadius = Math.min(innerWidth, innerHeight) / 2;
		const innerRadius = outerRadius * 0.6;

		let startAngle = 0;
		return (
			<>
				{values.map((value, i) => {
					const sliceAngle = (value / total) * 360;
					const endAngle = startAngle + sliceAngle;

					// Calculate points for outer arc
					const x1_out =
						centerX + outerRadius * Math.cos((Math.PI * startAngle) / 180);
					const y1_out =
						centerY + outerRadius * Math.sin((Math.PI * startAngle) / 180);
					const x2_out =
						centerX + outerRadius * Math.cos((Math.PI * endAngle) / 180);
					const y2_out =
						centerY + outerRadius * Math.sin((Math.PI * endAngle) / 180);

					// Calculate points for inner arc
					const x1_in =
						centerX + innerRadius * Math.cos((Math.PI * startAngle) / 180);
					const y1_in =
						centerY + innerRadius * Math.sin((Math.PI * startAngle) / 180);
					const x2_in =
						centerX + innerRadius * Math.cos((Math.PI * endAngle) / 180);
					const y2_in =
						centerY + innerRadius * Math.sin((Math.PI * endAngle) / 180);

					const largeArcFlag = sliceAngle > 180 ? 1 : 0;

					const dPath = [
						`M ${x1_out} ${y1_out}`,
						`A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}`,
						`L ${x2_in} ${y2_in}`,
						`A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}`,
						"Z",
					].join(" ");

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
				})}
			</>
		);
	};

	const renderArea = () => {
		if (values.length < 2) return null;
		const step = innerWidth / (values.length - 1);

		// Build the line path
		const points = values.map((value, i) => {
			const x = padding + i * step;
			const y = height - padding - (value / maxValue) * innerHeight;
			return { x, y };
		});

		const firstPoint = points[0];
		const lastPoint = points[points.length - 1];

		const dPath = [
			`M ${firstPoint.x} ${height - padding}`, // Start at bottom left
			...points.map((p) => `L ${p.x} ${p.y}`), // Go through all points
			`L ${lastPoint.x} ${height - padding}`, // Go to bottom right
			"Z", // Close
		].join(" ");

		return (
			<>
				<path
					d={dPath}
					fill={seriesColors[0]}
					fillOpacity="0.3"
					stroke="none"
				/>
				<polyline
					points={points.map((p) => `${p.x},${p.y}`).join(" ")}
					fill="none"
					stroke={seriesColors[0]}
					strokeWidth="2"
					strokeLinejoin="round"
					strokeLinecap="round"
				/>
				{points.map((p, i) => (
					<circle
						key={`point-${i}`}
						cx={p.x}
						cy={p.y}
						r="4"
						fill={seriesColors[0]}
						stroke="white"
						strokeWidth="1"
					/>
				))}
			</>
		);
	};

	const renderScatter = () => {
		// Mock scatter data generation from scalar values
		// In a real app, data structure would need to support x/y pairs
		// Here we map index to x and value to y
		if (values.length === 0) return null;

		return (
			<>
				{values.map((value, i) => {
					// Add some randomness to x to simulate scatter if using just 1D array
					// Or just map linearly
					const x =
						padding +
						(i / (values.length - 1)) * innerWidth +
						(Math.random() * 20 - 10);
					const y = height - padding - (value / maxValue) * innerHeight;
					const color = seriesColors[i % seriesColors.length];
					return (
						<circle
							key={`point-${i}`}
							cx={x}
							cy={y}
							r="5"
							fill={color}
							opacity="0.7"
						/>
					);
				})}
			</>
		);
	};

	const renderRadar = () => {
		if (values.length < 3) return null; // Need at least 3 points for a radar
		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(innerWidth, innerHeight) / 2;
		const angleStep = (2 * Math.PI) / values.length;

		const points = values.map((value, i) => {
			const angle = i * angleStep - Math.PI / 2; // Start from top
			const r = (value / maxValue) * radius;
			const x = centerX + r * Math.cos(angle);
			const y = centerY + r * Math.sin(angle);
			return `${x},${y}`;
		}).join(" ");

		const gridPoints = values.map((_, i) => {
			const angle = i * angleStep - Math.PI / 2;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
			return { x, y };
		});

		return (
			<>
				{/* Background Grid */}
				<polygon
					points={gridPoints.map(p => `${p.x},${p.y}`).join(" ")}
					fill="none"
					stroke={gridColor}
					strokeWidth="1"
				/>
				{/* Axis lines */}
				{gridPoints.map((p, i) => (
					<line
						key={`axis-${i}`}
						x1={centerX}
						y1={centerY}
						x2={p.x}
						y2={p.y}
						stroke={gridColor}
						strokeWidth="1"
					/>
				))}
				{/* Data Polygon */}
				<polygon
					points={points}
					fill={seriesColors[0]}
					fillOpacity="0.4"
					stroke={seriesColors[0]}
					strokeWidth="2"
				/>
			</>
		);
	};

	const renderGauge = () => {
		if (values.length === 0) return null;
		const value = values[0]; // Take first value
		const percent = Math.min(Math.max(value / maxValue, 0), 1);

		const centerX = width / 2;
		const centerY = height - padding;
		const radius = Math.min(innerWidth, height - padding * 2);

		const startAngle = Math.PI; // 180 deg
		const endAngle = 0; // 0 deg
		const currentAngle = startAngle - (startAngle - endAngle) * percent;

		const x = centerX + radius * Math.cos(currentAngle);
		const y = centerY - radius * Math.sin(currentAngle); // Subtract because y goes down

		return (
			<>
				{/* Background Arc */}
				<path
					d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
					fill="none"
					stroke="#e5e7eb"
					strokeWidth="20"
					strokeLinecap="round"
				/>
				{/* Value Arc (This is tricky with simple SVG path for arc, easier to overlay a masked circle or just simple arc) */}
				{/* Needle */}
				<line
					x1={centerX}
					y1={centerY}
					x2={centerX + radius * 0.8 * Math.cos(currentAngle)}
					y2={centerY - radius * 0.8 * Math.sin(Math.abs(currentAngle))} // Correct y calculation for svg coord system
					stroke={seriesColors[0]}
					strokeWidth="4"
					strokeLinecap="round"
				/>
				<circle cx={centerX} cy={centerY} r="8" fill={seriesColors[0]} />
				<text x={centerX} y={centerY + 25} textAnchor="middle" fontSize="16" fontWeight="bold">
					{Math.round(value)}
				</text>
			</>
		);
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
				{chartType === "doughnut" && renderDoughnut()}
				{chartType === "area" && renderArea()}
				{chartType === "scatter" && renderScatter()}
				{chartType === "radar" && renderRadar()}
				{chartType === "gauge" && renderGauge()}
			</svg>
		</div>
	);
};
