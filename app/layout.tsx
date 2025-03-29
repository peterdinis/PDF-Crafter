import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./_components/shared/theme-provider";

export const metadata: Metadata = {
	title: "PDF Crafting",
	description: "Build your pdf files like a lego bricks",
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
