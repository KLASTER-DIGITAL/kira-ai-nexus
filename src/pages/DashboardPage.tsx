
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { LoadingScreen } from "@/components/features/auth";

const DashboardPage: React.FC = () => {
  const { isLoading, profile } = useAuth();

  // Show loading screen while determining user role
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect based on the user's role
  if (profile?.role === "superadmin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // Default to user dashboard
  return <Navigate to="/dashboard/user" replace />;
};

export default DashboardPage;
