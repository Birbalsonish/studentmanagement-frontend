import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/common/ThemeToggle"

// Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Students from "@/pages/students/Students";
import Teachers from "@/pages/teachers/Teachers";
import Grades from "@/pages/students/Grades";
import Results from "@/pages/students/Results";
import Enrollments from "@/pages/students/Enrollments";
import Classes from "@/pages/classes/Classes";
import Subjects from "@/pages/classes/Subjects";
import Attendance from "@/pages/attendance/Attendance";
import Fees from "@/pages/fees/Fees";
import Settings from "@/pages/settings/Settings";

function AppContent() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("expandedItems");
    return saved ? JSON.parse(saved) : ["Students"];
  });

  // Get parent item based on current route
  const getParentFromRoute = useCallback((pathname: string): string | null => {
    if (pathname.startsWith("/students")) return "Students";
    if (pathname.startsWith("/classes")) return "Classes";
    if (pathname.startsWith("/teachers")) return "Teachers";
    if (pathname.startsWith("/attendance")) return "Attendance";
    if (pathname.startsWith("/fees")) return "Fees";
    if (pathname.startsWith("/settings")) return "Settings";
    return null;
  }, []);

  // Update expanded items based on route
  useEffect(() => {
    const parent = getParentFromRoute(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setExpandedItems(prevItems => {
      if (parent && !prevItems.includes(parent)) {
        const newItems = [...prevItems, parent];
        localStorage.setItem("expandedItems", JSON.stringify(newItems));
        return newItems;
      }
      return prevItems;
    });
  }, [location.pathname, getParentFromRoute]);

  const handleSetExpandedItems = (items: string[]) => {
    setExpandedItems(items);
    localStorage.setItem("expandedItems", JSON.stringify(items));
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar expandedItems={expandedItems} setExpandedItems={handleSetExpandedItems} />

      {/* This keeps layout consistent */}
      <SidebarInset className="min-h-screen">
        <Header currentPage="Dashboard" />
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Main Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students/grades" element={<Grades />} />
          <Route path="/students/results" element={<Results />} />
          <Route path="/students/enrollments" element={<Enrollments />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/settings" element={<Settings />} />

          {/* 404 */}
          <Route
            path="*"
            element={<h1 className="p-6">404 | Page Not Found</h1>}
          />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}