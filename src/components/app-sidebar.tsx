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

// Sidebar Data (NO DROPDOWNS, DIRECT LINKS)
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
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },

    { title: "All Students", url: "/students", icon: Users },
    { title: "Grades", url: "/students/grades", icon: ClipboardCheck },
    { title: "Results", url: "/students/results", icon: ClipboardCheck },
    { title: "Enrollments", url: "/students/enrollments", icon: ClipboardCheck },

    { title: "Teachers", url: "/teachers", icon: GraduationCap },

    { title: "Classes", url: "/classes", icon: BookOpen },
    { title: "Subjects", url: "/subjects", icon: BookOpen },

    { title: "Attendance", url: "/attendance", icon: ClipboardCheck },

    { title: "Fees", url: "/fees", icon: Wallet },

    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}