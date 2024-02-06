"use client"

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
    onChange: (url?: string, name?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url, res?.[0].name);
            toast.error("Image uploaded!")
        }}
        onUploadError={(error: Error) => {
            toast.error(`${error?.message}`)
        }}
        />
    )
}