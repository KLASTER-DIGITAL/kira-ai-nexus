
import React from "react";
import { FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatAttachment } from "@/types/chat";

interface FileAttachmentProps {
  file: File | ChatAttachment;
  onRemove?: (fileName: string) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ file, onRemove }) => {
  const isUploadedFile = 'url' in file;
  const fileName = 'name' in file ? file.name : (file as File).name;
  
  return (
    <div className="flex items-center bg-secondary rounded-full px-2 py-1 text-sm">
      <FileIcon size={14} className="mr-1" />
      <span className="truncate max-w-[120px]">{fileName}</span>
      
      {isUploadedFile && 'url' in file && file.url && (
        <a 
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          (Открыть)
        </a>
      )}
      
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-1 p-0 hover:bg-destructive/20 hover:text-destructive"
          onClick={() => onRemove(fileName)}
        >
          <X size={12} />
        </Button>
      )}
    </div>
  );
};

export default FileAttachment;
