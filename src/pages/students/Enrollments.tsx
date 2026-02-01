"use client";

import { useState } from "react";
import ManageEnrollment from "@/components/students/enrollments-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export default function Enrollments() {
  const [isManage, setIsManage] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Enrollments</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsManage(true)}
            >
              <UserPlus className="w-5 h-5" />
              Add Enrollment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Enrollments"
            value="820"
            icon={ClipboardList}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Enrollments"
            value="760"
            icon={UserCheck}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="New This Month"
            value="60"
            icon={UserPlus}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Enrollment List */}
        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/20 dark:bg-gray-700">
                  <tr>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Course / Class</th>
                    <th className="p-2">Enrolled On</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">Rahul Sharma</td>
                    <td className="p-2">CSE102</td>
                    <td className="p-2">B.Tech CSE</td>
                    <td className="p-2">12 Jan 2025</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium dark:bg-green-800 dark:text-green-100">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">Ananya Verma</td>
                    <td className="p-2">ECE054</td>
                    <td className="p-2">B.Tech ECE</td>
                    <td className="p-2">05 Dec 2024</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium dark:bg-yellow-800 dark:text-yellow-100">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Manage Enrollment Sheet */}
      <ManageEnrollment isOpen={isManage} onOpenChange={setIsManage} />
    </div>
  );
}

/* ===================== StatCard ===================== */
interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-white",
}: StatCardProps) {
  return (
    <Card className={`rounded-lg shadow-lg overflow-hidden ${color}`}>
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}