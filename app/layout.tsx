import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./_components/shared/theme-provider";

export const metadata: Metadata = {
	title: "PDF Builder – Create, Edit & Customize PDF Files Online",
	description: "Build professional PDF documents effortlessly. Merge, split, edit, and annotate PDFs with an intuitive drag-and-drop interface. Perfect for work, study, and personal projects.",
	keywords: [
		"PDF editor",
		"online PDF builder",
		"create PDF files",
		"edit PDFs",
		"merge PDFs",
		"split PDFs",
		"annotate PDFs",
		"custom PDF creator",
		"PDF generator",
	],
	authors: {
		name: "Peter Dinis",
		url: "https://dinis-portfolio.vercel.app/"
	},
	robots: "index, follow",
	openGraph: {
		title: "PDF Builder – Create, Edit & Customize PDF Files Online",
		description:
			"Build professional PDF documents effortlessly. Merge, split, edit, and annotate PDFs with an intuitive drag-and-drop interface.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PDF Builder – Create, Edit & Customize PDF Files Online",
		description:
			"Build professional PDF documents effortlessly. Merge, split, edit, and annotate PDFs with an intuitive drag-and-drop interface.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
