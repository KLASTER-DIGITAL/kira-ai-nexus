
// Chunking function for processing large datasets in batches
export const processInChunks = <T,>(
  items: T[], 
  chunkSize: number, 
  processor: (chunk: T[]) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const chunks = Math.ceil(items.length / chunkSize);
    let processed = 0;
    
    const processNextChunk = () => {
      if (processed >= chunks) {
        resolve();
        return;
      }
      
      const start = processed * chunkSize;
      const end = Math.min(start + chunkSize, items.length);
      const chunk = items.slice(start, end);
      
      processor(chunk);
      processed++;
      
      setTimeout(processNextChunk, 0); // Allow UI to update between chunks
    };
    
    processNextChunk();
  });
};

// Helper function to safely extract tags from node content
export const extractTags = (nodeContent: any): string[] => {
  if (!nodeContent) return [];
  
  // If content is an object with tags property
  if (typeof nodeContent === 'object' && nodeContent !== null) {
    // Check if tags exists directly on the object
    if (Array.isArray(nodeContent.tags)) {
      return nodeContent.tags;
    }
    // If tags are nested in a text property
    if (nodeContent.text && typeof nodeContent.text === 'object' && Array.isArray(nodeContent.text.tags)) {
      return nodeContent.text.tags;
    }
  }
  
  return []; // Return empty array if no tags found
};
