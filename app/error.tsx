"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ErrorType = "error" | "warning" | "info" | "success";

interface ErrorProps {
	message: string;
	type?: ErrorType;
	duration?: number;
	onClose?: () => void;
	showCloseButton?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

const Error: React.FC<ErrorProps> = ({
	message,
	type = "error",
	duration = 5000,
	onClose,
	showCloseButton = true,
	className,
	style,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				onClose?.();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		onClose?.();
	};

	const typeConfig = {
		error: {
			icon: AlertCircle,
			bgColor: "bg-red-500/10",
			borderColor: "border-red-500/20",
			textColor: "text-red-600",
			iconColor: "text-red-500",
			title: "Error",
		},
		warning: {
			icon: AlertTriangle,
			bgColor: "bg-yellow-500/10",
			borderColor: "border-yellow-500/20",
			textColor: "text-yellow-600",
			iconColor: "text-yellow-500",
			title: "Warning",
		},
		info: {
			icon: Info,
			bgColor: "bg-blue-500/10",
			borderColor: "border-blue-500/20",
			textColor: "text-blue-600",
			iconColor: "text-blue-500",
			title: "Info",
		},
		success: {
			icon: CheckCircle,
			bgColor: "bg-green-500/10",
			borderColor: "border-green-500/20",
			textColor: "text-green-600",
			iconColor: "text-green-500",
			title: "Success",
		},
	};

	const config = typeConfig[type];
	const Icon = config.icon;

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -30, scale: 0.9 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 25,
					}}
					className={cn(
						"relative w-full shadow-2xl rounded-lg border backdrop-blur-sm",
						config.bgColor,
						config.borderColor,
						className,
					)}
					style={style}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: "100%" }}
						transition={{ duration: duration / 1000, ease: "linear" }}
						className="h-0.5 bg-linear-to-r from-transparent via-current to-transparent opacity-30"
					/>

					<div className="p-4">
						<div className="flex items-start gap-3">
							<motion.div
								initial={{ scale: 0, rotate: -180 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{
									type: "spring",
									stiffness: 200,
									damping: 15,
									delay: 0.1,
								}}
								className="shrink-0"
							>
								<Icon className={cn("w-5 h-5", config.iconColor)} />
							</motion.div>

							<div className="flex-1 min-w-0">
								<motion.p
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className={cn("font-medium text-sm", config.textColor)}
								>
									{config.title}
								</motion.p>
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="text-sm text-muted-foreground mt-1"
								>
									{message}
								</motion.p>
							</div>

							{showCloseButton && (
								<motion.button
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.1 }}
									onClick={handleClose}
									className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									aria-label="Close notification"
								>
									<X className="w-4 h-4 text-muted-foreground" />
								</motion.button>
							)}
						</div>
					</div>

					{/* Floating particles effect */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
						{[...Array(3)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-1 h-1 bg-current opacity-20 rounded-full"
								initial={{
									x: Math.random() * 100 - 50,
									y: Math.random() * 100 - 50,
									opacity: 0,
								}}
								animate={{
									x: [
										Math.random() * 100 - 50,
										Math.random() * 100 - 50,
										Math.random() * 100 - 50,
									],
									y: [
										Math.random() * 100 - 50,
										Math.random() * 100 - 50,
										Math.random() * 100 - 50,
									],
									opacity: [0, 0.2, 0],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "loop",
									delay: i * 0.3,
									ease: "easeInOut",
								}}
								style={{
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
								}}
							/>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Error;