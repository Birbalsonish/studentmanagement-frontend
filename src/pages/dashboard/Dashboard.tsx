"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

/* ================= Dashboard Page ================= */
export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 space-y-10 bg-linear-to-br from-background via-muted/30 to-background">

      {/* ================= Header ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary via-indigo-500 to-purple-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            School Management Dashboard
          </h1>
          <p className="text-sm text-white/80 mt-2">
            Overview of students, teachers, attendance & finance
          </p>
        </div>

        {/* glow effect */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      </div>

      {/* ================= Stats Cards ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,245"
          icon={Users}
          gradient="from-blue-500 to-cyan-400"
        />
        <StatCard
          title="Total Teachers"
          value="78"
          icon={GraduationCap}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard
          title="Today's Attendance"
          value="92%"
          icon={ClipboardCheck}
          gradient="from-green-500 to-emerald-400"
        />
        <StatCard
          title="Pending Fees"
          value="Rs1,20,000"
          icon={Wallet}
          gradient="from-yellow-500 to-orange-400"
        />
      </div>

      {/* ================= Analytics Section ================= */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Growth */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Student enrollment increased by
            </p>
            <p className="text-4xl font-bold text-green-600 mt-2">+18%</p>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AlertItem text="3 students with low attendance" />
            <AlertItem text="2 fee payments overdue" />
            <AlertItem text="1 class missing teacher assignment" />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow label="Active Classes" value="32" />
            <SummaryRow label="Subjects Offered" value="18" />
            <SummaryRow label="Exams This Month" value="5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= Stat Card ================= */
function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${gradient} p-6 text-white shadow-xl transition-transform hover:-translate-y-1`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="rounded-full bg-white/20 p-4">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 h-32 w-32 bg-white/20 blur-3xl" />
    </div>
  );
}

/* ================= Small Components ================= */
function AlertItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      <span>{text}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
