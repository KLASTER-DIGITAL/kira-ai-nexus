
/// <reference types="vite/client" />

// This fixes the ReactFlow import
declare module 'reactflow' {
  export * from '@xyflow/react';
}
