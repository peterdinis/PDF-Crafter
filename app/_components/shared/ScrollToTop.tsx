"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"fixed bottom-20 right-6 z-[100] rounded-full shadow-lg transition-all duration-300",
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-10 pointer-events-none",
			)}
			onClick={scrollToTop}
			title="Scroll to top"
		>
			<ChevronUp className="h-5 w-5" />
		</Button>
	);
};
