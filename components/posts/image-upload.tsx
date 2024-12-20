"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const { uploadImage, uploading } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    []
  );

  const handleUpload = async () => {
    if (selectedFile) {
      const url = await uploadImage(selectedFile);
      if (url) {
        onUploadComplete(url);
        reset();
      }
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={uploading}
          asChild
        >
          <span>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Image"}
          </span>
        </Button>
      </label>

      {previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            alt="Preview"
            width={500}
            height={300}
            className="w-80 max-h-60 rounded-md object-contain"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              className="bg-indigo-600 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
