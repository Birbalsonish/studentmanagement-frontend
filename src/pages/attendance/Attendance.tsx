import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageAttendanceDetails from "@/components/attendance/attendance-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Attendance } from "@/lib/types";
import { attendanceService } from "@/lib/api";

export default function Attendance() {
  const [isManage, setIsManage] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAll();

      const data = response.data.data;

      if (data.data) {
        setAttendanceData(data.data);
      } else {
        setAttendanceData(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching attendance:", err);
      setError(err.response?.data?.message || "Failed to fetch attendance");
      alert("Failed to load attendance records");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsManage(true);
  };

  const handleDelete = async (attendance: Attendance) => {
    if (!confirm(`Are you sure you want to delete this attendance record?`)) {
      return;
    }

    try {
      await attendanceService.delete(attendance.id);
      alert("Attendance record deleted successfully");
      fetchAttendance();
    } catch (err: any) {
      console.error("Error deleting attendance:", err);
      alert(err.response?.data?.message || "Failed to delete attendance record");
    }
  };

  const handleAddNew = () => {
    setSelectedAttendance(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchAttendance();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (attendanceData.length === 0) {
      return {
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      };
    }

    const presentCount = attendanceData.filter((a) => a.status === "Present").length;
    const absentCount = attendanceData.filter((a) => a.status === "Absent").length;
    const lateCount = attendanceData.filter((a) => a.status === "Late").length;
    const excusedCount = attendanceData.filter((a) => a.status === "Excused").length;

    return {
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
    };
  }, [attendanceData]);

  const columns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        id: "student_name",
        accessorKey: "student.name",
        header: "Student Name",
        cell: ({ row }) => row.original.student?.name || "N/A",
      },
      {
        id: "class_name",
        accessorKey: "class.name",
        header: "Class",
        cell: ({ row }) => {
          const cls = row.original.class;
          return cls ? `${cls.name} ${cls.section || ""}` : "N/A";
        },
      },
      {
        id: "subject_name",
        accessorKey: "subject.name",
        header: "Subject",
        cell: ({ row }) => row.original.subject?.name || "General",
      },
      {
        id: "date",
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        id: "check_in_time",
        accessorKey: "check_in_time",
        header: "Check-in",
        cell: ({ getValue }) => getValue() || "N/A",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                status === "Present"
                  ? "bg-green-100 text-green-800"
                  : status === "Absent"
                  ? "bg-red-100 text-red-800"
                  : status === "Late"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {status === "Present" && <CheckCircle className="w-3 h-3" />}
              {status === "Absent" && <XCircle className="w-3 h-3" />}
              {status === "Late" && <AlertCircle className="w-3 h-3" />}
              {status === "Excused" && <AlertCircle className="w-3 h-3" />}
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={fetchAttendance} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <CheckCircle className="w-5 h-5" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Present"
            value={String(stats.presentCount)}
            icon={CheckCircle}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Absent"
            value={String(stats.absentCount)}
            icon={XCircle}
            color="bg-red-500/70 text-white"
          />
          <StatCard
            title="Late"
            value={String(stats.lateCount)}
            icon={AlertCircle}
            color="bg-yellow-500/70 text-white"
          />
          <StatCard
            title="Excused"
            value={String(stats.excusedCount)}
            icon={AlertCircle}
            color="bg-blue-500/70 text-white"
          />
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading attendance records...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={attendanceData}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["date"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Attendance Modal */}
      <ManageAttendanceDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        attendance={selectedAttendance}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

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