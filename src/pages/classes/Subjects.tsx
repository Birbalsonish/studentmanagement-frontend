"use client";

import { useState } from "react";
import ManageSubjectDetails from "@/components/classes/subjects-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, CalendarCheck } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export default function Subjects() {
  const [isManage, setIsManage] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsManage(true)}
            >
              <UserPlus className="w-5 h-5" />
              Add Subject
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Subjects" value="18" icon={Users} color="bg-blue-500/70 text-white" />
          <StatCard title="Total Classes" value="12" icon={UserPlus} color="bg-green-500/70 text-white" />
          <StatCard title="Total Teachers" value="10" icon={CalendarCheck} color="bg-yellow-500/70 text-white" />
        </div>

        {/* Subjects List */}
        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/20 dark:bg-gray-700">
                  <tr>
                    <th className="p-2">Subject Name</th>
                    <th className="p-2">Class Assigned</th>
                    <th className="p-2">Teacher</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">Mathematics</td>
                    <td className="p-2">10th A</td>
                    <td className="p-2">Alice Johnson</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium dark:bg-green-800 dark:text-green-100">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/10 dark:hover:bg-gray-600">
                    <td className="p-2">Physics</td>
                    <td className="p-2">9th B</td>
                    <td className="p-2">Robert Smith</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium dark:bg-red-800 dark:text-red-100">
                        Inactive
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Manage Subject Modal */}
      <ManageSubjectDetails isOpen={isManage} onOpenChange={setIsManage} />
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
