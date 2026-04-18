"use client";

import { driver } from "driver.js";
import { useCallback } from "react";

export const useTour = () => {
  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      overlayColor: "rgba(15, 23, 42, 0.65)", // Slate-900 with opacity
      popoverClass: "driverjs-theme",
      steps: [
        {
          element: "#tour-toolbar",
          popover: {
            title: "⚒️ Element Toolbar",
            description: "Choose from a wide variety of elements to add to your PDF. We support text, shapes, charts, tables, and even QR codes!",
            side: "right",
            align: "start"
          }
        },
        {
          element: "#tour-canvas-area",
          popover: {
            title: "🎨 Design Canvas",
            description: "This is your workspace. Click anywhere on the canvas to place your selected tool. You can drag, resize, and rotate elements with ease.",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-start-btn",
          popover: {
            title: "💡 Interactive Help",
            description: "Need a refresher? You can restart this tour anytime by clicking this help icon in the header.",
            side: "bottom",
            align: "end"
          }
        },
        {
          element: "#tour-settings-panel",
          popover: {
            title: "📄 Document Settings",
            description: "Configure your page size (A4, Letter, Custom), orientation, and document-wide typography from this panel.",
            side: "left",
            align: "start"
          }
        },
        {
          element: "#tour-download-btn",
          popover: {
            title: "🚀 Ready to Export?",
            description: "Once your masterpiece is finished, click here to download your professional PDF. You can even enable compression for smaller file sizes!",
            side: "bottom",
            align: "end"
          }
        }
      ]
    });

    driverObj.drive();
  }, []);

  return { startTour };
};
