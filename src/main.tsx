import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

// Styles
import "./index.css";
import "./styles/tiptap.css";
import "./styles/wiki-links.css"; // Add this import for Wiki Links styles

// Auth Provider
import { AuthProvider } from "./context/auth";
import { queryClient } from "./lib/utils";

// Import routes
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";
import TasksPage from "./pages/TasksPage";
import NotesGraphPage from "./pages/NotesGraphPage";

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/notes",
    element: <NotesPage />,
  },
  {
    path: "/notes/graph",
    element: <NotesGraphPage />,
  },
  {
    path: "/tasks",
    element: <TasksPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
