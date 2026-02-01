"use client";

import { useState } from "react";
import ManageClassDetails from "@/components/classes/classes-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, CalendarCheck } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export default function Classes() {
  const [isManage, setIsManage] = useState(false);

  // Mock class data
  const classesData = [
    {
      id: 1,
      name: "10th A",
      teacher: "Alice Johnson",
      totalStudents: 30,
      subjects: "Math, Science, English",
    },
    {
      id: 2,
      name: "9th B",
      teacher: "Robert Smith",
      totalStudents: 28,
      subjects: "History, Geography, English",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Classes</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsManage(true)}
            >
              <UserPlus className="w-5 h-5" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Classes" value="12" icon={Users} color="bg-blue-500/70 text-white" />
          <StatCard title="Total Students" value="345" icon={UserPlus} color="bg-green-500/70 text-white" />
          <StatCard title="Average Attendance" value="95%" icon={CalendarCheck} color="bg-yellow-500/70 text-white" />
        </div>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/20 dark:bg-gray-700">
                  <tr>
                    <th className="p-2">Class Name</th>
                    <th className="p-2">Class Teacher</th>
                    <th className="p-2">Total Students</th>
                    <th className="p-2">Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {classesData.map((cls) => (
                    <tr key={cls.id} className="hover:bg-muted/10 dark:hover:bg-gray-600">
                      <td className="p-2">{cls.name}</td>
                      <td className="p-2">{cls.teacher}</td>
                      <td className="p-2">{cls.totalStudents}</td>
                      <td className="p-2">{cls.subjects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Manage Class Modal */}
      <ManageClassDetails isOpen={isManage} onOpenChange={setIsManage} />
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

function StatCard({ title, value, icon: Icon, color = "bg-white" }: StatCardProps) {
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
