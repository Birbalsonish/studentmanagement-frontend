"use client";

import { useState } from "react";
import ManageAttendance from "@/components/attendance/attendance-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, CalendarCheck, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function Attendance() {
  const [isManage, setIsManage] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsManage(true)}
            >
              <UserCheck className="w-5 h-5" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Students"
            value="1,245"
            icon={Users}
            color="bg-purple-500/70 text-white"
          />
          <StatCard
            title="Present Today"
            value="1,138"
            icon={UserCheck}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Attendance Rate"
            value="91%"
            icon={CalendarCheck}
            color="bg-yellow-500/70 text-white"
          />
        </div>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/20 dark:bg-gray-700">
                  <tr>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">John Doe</td>
                    <td className="p-2">10th A</td>
                    <td className="p-2">23</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium dark:bg-green-800 dark:text-green-100">
                        Present
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">Jane Smith</td>
                    <td className="p-2">9th B</td>
                    <td className="p-2">12</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium dark:bg-red-800 dark:text-red-100">
                        Absent
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Manage Attendance Modal */}
      <ManageAttendance isOpen={isManage} onOpenChange={setIsManage} />
    </div>
  );
}

/* ===================== StatCard Component ===================== */
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
    <Card className={`rounded-lg shadow-lg p-0 overflow-hidden ${color}`}>
      <div className="flex items-center justify-between p-6 h-full">
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
