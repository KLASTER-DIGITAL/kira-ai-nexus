
import { useState, useCallback } from 'react';

export const useChatAttachments = () => {
  const [attachments, setAttachments] = useState<File[]>([]);

  // Handle file attachments
  const addAttachment = useCallback((file: File) => {
    setAttachments(prev => [...prev, file]);
  }, []);

  const removeAttachment = useCallback((fileName: string) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  return {
    attachments,
    addAttachment,
    removeAttachment,
    clearAttachments
  };
};
