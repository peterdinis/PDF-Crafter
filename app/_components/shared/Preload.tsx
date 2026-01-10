"use client"

import { FC } from "react"

const Preload: FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
            <div className="relative">
                {/* Main PDF document */}
                <div className="relative w-64 h-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Top section - PDF header */}
                    <div className="h-8 bg-linear-to-r from-blue-500 to-blue-600 flex items-center px-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="ml-4 text-white text-xs font-medium">PDF Crafter</div>
                    </div>

                    {/* PDF document content */}
                    <div className="p-6 space-y-4">
                        {/* Row 1 */}
                        <div className="h-3 bg-linear-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse"></div>

                        {/* Row 2 - longer */}
                        <div className="h-3 bg-linear-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse w-5/6"></div>

                        {/* Paragraph */}
                        <div className="space-y-2 mt-6">
                            <div className="h-3 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 rounded animate-pulse"></div>
                            <div className="h-3 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 rounded animate-pulse w-11/12"></div>
                            <div className="h-3 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 rounded animate-pulse w-4/5"></div>
                        </div>

                        {/* Table */}
                        <div className="mt-8 space-y-2">
                            <div className="h-4 bg-linear-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse"></div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex space-x-2">
                                    <div className="h-3 flex-1 bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                    <div className="h-3 w-16 bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom section - pagination */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <div className="w-4 h-4 border-t-2 border-l-2 border-blue-500 -rotate-45 animate-pulse"></div>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <span className="text-blue-600 dark:text-blue-400">1</span> / 3
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center">
                                <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Animated page edge */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-64 bg-linear-to-l from-slate-300/50 to-transparent dark:from-slate-600/50 animate-pulse rounded-l-lg"></div>
                </div>

                {/* Floating elements around document */}
                <div className="absolute -top-8 -left-8 w-16 h-16">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 dark:text-blue-400">
                            PDF
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-14 h-14">
                    <div className="absolute inset-0 bg-linear-to-r from-green-500 to-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-green-600 dark:text-green-400">
                            DOC
                        </div>
                    </div>
                </div>

                {/* Rotating tools */}
                <div className="absolute -top-6 -right-6">
                    <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                </div>

                <div className="absolute -bottom-4 -left-4">
                    <div className="w-10 h-10 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </div>
            </div>

            {/* Text and indicator */}
            <div className="mt-12 text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent animate-pulse">
                        Creating Your PDF Document
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md">
                        Preparing all elements, formatting content and optimizing for printing...
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 md:w-80 mx-auto">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full animate-[shimmer_2s_infinite] bg-size-[200%_100%]"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Loading...</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400 animate-pulse">72%</span>
                        <span>Complete</span>
                    </div>
                </div>

                {/* Loading tasks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                    {[
                        { text: 'Adding pages', icon: '📄' },
                        { text: 'Formatting text', icon: '✏️' },
                        { text: 'Generating PDF', icon: '⚡' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                            <span className="text-xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                                {item.icon}
                            </span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 max-w-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center space-x-2">
                        <span className="text-lg">💡</span>
                        <span>Using latest technologies for perfect PDF creation</span>
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
        </div>
    )
}

export default Preload