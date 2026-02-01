"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Wallet,
  Settings,
  School,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// School Management Sidebar Data
const data = {
  user: {
    name: "Admin",
    email: "admin@school.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Green Valley School",
      logo: School,
      plan: "School Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Students",
      url: "#",
      icon: Users,
      items: [
        { title: "All Students", url: "/students" },
        { title: "Grades", url: "/students/grades" },
        { title: "Results", url: "/students/results" },
        { title: "Enrollments", url: "/students/enrollments" },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: GraduationCap,
      items: [
        { title: "All Teachers", url: "/teachers" },
      ],
    },
    {
      title: "Classes",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Classes", url: "/classes" },
        { title: "Subjects", url: "/subjects" },
      ],
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: ClipboardCheck,
      items: [
        { title: "Attendance", url: "/attendance" },
      ],
    },
    {
      title: "Fees",
      url: "/fees",
      icon: Wallet,
      items: [
        { title: "Fees", url: "/fees" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "Settings", url: "/settings" },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  expandedItems?: string[];
  setExpandedItems?: (items: string[]) => void;
}

export function AppSidebar({ expandedItems = [], setExpandedItems, ...props }: AppSidebarProps) {
  return (
    <>
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="sidebar-scrollbar">
          <NavMain 
            items={data.navMain} 
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
          />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  );
}