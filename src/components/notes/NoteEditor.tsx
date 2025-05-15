
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useNoteLinks } from "@/hooks/notes/useNoteLinks";
import { useNoteAutosave } from "@/hooks/notes/useNoteAutosave";
import NoteMetadata from "./editor/NoteMetadata";
import NoteContent from "./editor/NoteContent";
import NoteEditorActions from "./editor/NoteEditorActions";
import { LocalGraphView } from "@/components/graph"; // Import the LocalGraphView component

// Add this empty export to define the component index file location
<lov-write file_path="src/components/graph/index.ts">
export { default as GraphView } from './GraphView';
export { default as LocalGraphView } from './LocalGraphView';
export { default as TaskNode } from './nodes/TaskNode';
export { default as EventNode } from './nodes/EventNode';
