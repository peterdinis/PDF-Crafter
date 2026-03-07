"use client";

import { motion } from "framer-motion";
import { FileText, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground transition-colors duration-500">
            <div className="relative mb-8">
                {/* Animated PDF Icon */}
                <motion.div
                    initial={{ y: 0, rotate: 0 }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    className="relative z-10"
                >
                    <div className="flex h-32 w-24 items-center justify-center rounded-lg border-2 border-primary bg-card shadow-2xl">
                        <FileText className="h-16 w-16 text-primary" />
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute -top-4 -left-4 h-40 w-32 rounded-lg bg-primary blur-2xl"
                />

                {/* Floating "ghost" pages */}
                <motion.div
                    animate={{
                        x: [0, 30, -10, 0],
                        y: [0, -40, 20, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute top-0 right-0 h-12 w-8 border border-muted-foreground/30 bg-muted/20"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 20, 0],
                        y: [0, -20, 60, 0],
                        opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    className="absolute bottom-0 left-0 h-10 w-7 border border-muted-foreground/30 bg-muted/20"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-8xl font-black text-transparent">
                    404
                </h1>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">
                    This document is lost in the stack
                </h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                    We couldn't find the page you're looking for. It might have been
                    moved, deleted, or never existed in our archives.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild variant="default" size="lg" className="px-8">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="px-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </motion.div>

            {/* Background grid effect */}
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
    );
}
