"use client";


import React, { useRef } from 'react';
import { Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUpload: (imageSrc: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept both images and SVG files
    if (!file.type.startsWith('image/') && !file.type.includes('svg')) {
      toast.error('Please select a valid image or SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpload(event.target.result as string);
        setOpen(false);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Show success message with file type
        const fileType = file.type.includes('svg') ? 'SVG' : 'image';
        toast.success(`${fileType} uploaded successfully`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Accept both images and SVG files
      if (!file.type.startsWith('image/') && !file.type.includes('svg')) {
        toast.error('Please select a valid image or SVG file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
          setOpen(false);
          
          // Show success message with file type
          const fileType = file.type.includes('svg') ? 'SVG' : 'image';
          toast.success(`${fileType} uploaded successfully`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image or SVG</DialogTitle>
        </DialogHeader>
        <div 
          className="grid place-items-center border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center gap-4">
            <Image className="h-8 w-8 text-gray-400" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image or SVG
            </Button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,.svg" 
            className="hidden" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};