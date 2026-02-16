import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageEnrollmentDetails from "@/components/students/enrollments-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, UserCheck, UserPlus } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Enrollment } from "@/lib/types";
import { enrollmentService } from "@/lib/api";

export default function Enrollments() {
  const [isManage, setIsManage] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getAll();

      const data = response.data.data;

      if (data.data) {
        setEnrollments(data.data);
      } else {
        setEnrollments(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching enrollments:", err);
      setError(err.response?.data?.message || "Failed to fetch enrollments");
      alert("Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsManage(true);
  };

  const handleDelete = async (enrollment: Enrollment) => {
    if (!confirm(`Are you sure you want to delete this enrollment?`)) {
      return;
    }

    try {
      await enrollmentService.delete(enrollment.id);
      alert("Enrollment deleted successfully");
      fetchEnrollments();
    } catch (err: any) {
      console.error("Error deleting enrollment:", err);
      alert(err.response?.data?.message || "Failed to delete enrollment");
    }
  };

  const handleAddNew = () => {
    setSelectedEnrollment(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchEnrollments();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (enrollments.length === 0) {
      return {
        totalEnrollments: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
      };
    }

    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter((e) => e.status === "Active").length;
    const completedEnrollments = enrollments.filter((e) => e.status === "Completed").length;

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
    };
  }, [enrollments]);

  const columns = useMemo<ColumnDef<Enrollment>[]>(
    () => [
      {
        id: "student_name",
        accessorKey: "student.name",
        header: "Student Name",
        cell: ({ row }) => row.original.student?.name || "N/A",
      },
      {
        id: "student_admission",
        accessorKey: "student.admission_number",
        header: "Admission No.",
        cell: ({ row }) => row.original.student?.admission_number || "N/A",
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
        id: "enrollment_date",
        accessorKey: "enrollment_date",
        header: "Enrolled On",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        id: "academic_year",
        accessorKey: "academic_year",
        header: "Academic Year",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-green-100 text-green-800"
                  : status === "Completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
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
          <Button onClick={fetchEnrollments} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Enrollments</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
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
            value={String(stats.totalEnrollments)}
            icon={ClipboardList}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Enrollments"
            value={String(stats.activeEnrollments)}
            icon={UserCheck}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Completed"
            value={String(stats.completedEnrollments)}
            icon={UserPlus}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading enrollments...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={enrollments}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["academic_year"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Enrollment Modal */}
      <ManageEnrollmentDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        enrollment={selectedEnrollment}
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