
import React from "react";
import FileAttachment from "./FileAttachment";
import { ChatAttachment } from "@/types/chat";

interface FileAttachmentsListProps {
  files: Array<File | ChatAttachment>;
  onRemove?: (fileName: string) => void;
}

const FileAttachmentsList: React.FC<FileAttachmentsListProps> = ({ files, onRemove }) => {
  if (!files || files.length === 0) return null;
  
  return (
    <div className="border-t pt-2 px-2 mb-2">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <FileAttachment
            key={('name' in file ? file.name : '') + index}
            file={file}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default FileAttachmentsList;
