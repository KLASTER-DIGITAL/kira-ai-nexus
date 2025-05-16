
import React from "react";
import { Shield } from "lucide-react";

const AdminBadge: React.FC = () => {
  return (
    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
      <Shield size={12} className="mr-1" />
      Админ
    </span>
  );
};

export default AdminBadge;
