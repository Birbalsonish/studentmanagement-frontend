
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Award,
} from "lucide-react";
import { dashboardService } from "@/lib/api";

interface DashboardStats {
  overview: {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    total_subjects: number;
    total_enrollments: number;
  };
  fee_statistics: {
    total_fees: number;
    collected_fees: number;
    pending_fees: number;
    overdue_fees: number;
  };
  attendance_summary: {
    total_today: number;
    present_today: number;
    absent_today: number;
    attendance_rate: number;
  };
  top_performers: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values if fetch fails
      setStats({
        overview: {
          total_students: 0,
          total_teachers: 0,
          total_classes: 0,
          total_subjects: 0,
          total_enrollments: 0,
        },
        fee_statistics: {
          total_fees: 0,
          collected_fees: 0,
          pending_fees: 0,
          overdue_fees: 0,
        },
        attendance_summary: {
          total_today: 0,
          present_today: 0,
          absent_today: 0,
          attendance_rate: 0,
        },
        top_performers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

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
          value={stats.overview.total_students.toString()}
          icon={Users}
          gradient="from-blue-500 to-cyan-400"
        />
        <StatCard
          title="Total Teachers"
          value={stats.overview.total_teachers.toString()}
          icon={GraduationCap}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.attendance_summary.attendance_rate.toFixed(1)}%`}
          icon={ClipboardCheck}
          gradient="from-green-500 to-emerald-400"
        />
        <StatCard
          title="Pending Fees"
          value={`Rs. ${stats.fee_statistics.pending_fees.toLocaleString()}`}
          icon={Wallet}
          gradient="from-yellow-500 to-orange-400"
        />
      </div>

      {/* ================= Secondary Stats ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStatCard
          title="Total Classes"
          value={stats.overview.total_classes.toString()}
          icon={BookOpen}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <MiniStatCard
          title="Total Subjects"
          value={stats.overview.total_subjects.toString()}
          icon={Award}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <MiniStatCard
          title="Active Enrollments"
          value={stats.overview.total_enrollments.toString()}
          icon={ClipboardCheck}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <MiniStatCard
          title="Collected Fees"
          value={`Rs. ${stats.fee_statistics.collected_fees.toLocaleString()}`}
          icon={Wallet}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
      </div>

      {/* ================= Analytics Section ================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Details */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Attendance Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-semibold">{stats.attendance_summary.total_today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Present</span>
              <span className="font-semibold text-green-600">
                {stats.attendance_summary.present_today}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Absent</span>
              <span className="font-semibold text-red-600">
                {stats.attendance_summary.absent_today}
              </span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-2xl font-bold text-primary">
                  {stats.attendance_summary.attendance_rate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Statistics */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-yellow-500" />
              Fee Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Fees</span>
              <span className="font-semibold">
                Rs. {stats.fee_statistics.total_fees.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Collected</span>
              <span className="font-semibold text-green-600">
                Rs. {stats.fee_statistics.collected_fees.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="font-semibold text-yellow-600">
                Rs. {stats.fee_statistics.pending_fees.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overdue</span>
              <span className="font-semibold text-red-600">
                Rs. {stats.fee_statistics.overdue_fees.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection Rate</span>
                <span className="text-2xl font-bold text-primary">
                  {((stats.fee_statistics.collected_fees / stats.fee_statistics.total_fees) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow
              label="Active Classes"
              value={stats.overview.total_classes.toString()}
            />
            <SummaryRow
              label="Subjects Offered"
              value={stats.overview.total_subjects.toString()}
            />
            <SummaryRow
              label="Total Students"
              value={stats.overview.total_students.toString()}
            />
            <SummaryRow
              label="Total Teachers"
              value={stats.overview.total_teachers.toString()}
            />
            <SummaryRow
              label="Active Enrollments"
              value={stats.overview.total_enrollments.toString()}
            />
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

/* ================= Mini Stat Card ================= */
function MiniStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`rounded-full ${bgColor} p-3`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ================= Small Components ================= */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}