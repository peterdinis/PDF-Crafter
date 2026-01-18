"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eraser, Pen } from "lucide-react";
import type { FC } from "react";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (signatureData: string) => void;
    initialData?: string;
}

export const SignatureDialog: FC<SignatureDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [penColor, setPenColor] = useState("#000000");

    const handleClear = () => {
        sigCanvas.current?.clear();
    };

    const handleSave = () => {
        if (sigCanvas.current) {
            if (sigCanvas.current.isEmpty()) {
                onSave("");
            } else {
                onSave(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
            }
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle>Create Signature</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-64 bg-white">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor={penColor}
                            canvasProps={{
                                className: "w-full h-full cursor-crosshair",
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPenColor("#000000")}
                                className={`w-6 h-6 p-0 rounded-full border-2 ${penColor === "#000000" ? "border-blue-500" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: "#000000" }}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPenColor("#1d4ed8")}
                                className={`w-6 h-6 p-0 rounded-full border-2 ${penColor === "#1d4ed8" ? "border-blue-500" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: "#1d4ed8" }}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPenColor("#dc2626")}
                                className={`w-6 h-6 p-0 rounded-full border-2 ${penColor === "#dc2626" ? "border-blue-500" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: "#dc2626" }}
                            />
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleClear}>
                            <Eraser size={16} className="mr-2" />
                            Clear
                        </Button>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        <Pen size={16} className="mr-2" />
                        Save Signature
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
