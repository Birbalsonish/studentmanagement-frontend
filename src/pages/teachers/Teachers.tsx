import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageTeacherDetails from "@/components/teachers/teachers-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Teacher } from "@/lib/types";
import { teacherService } from "@/lib/api";

export default function Teachers() {
  const [isManage, setIsManage] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAll();

      const data = response.data.data;

      if (data.data) {
        setTeachers(data.data);
      } else {
        setTeachers(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError(err.response?.data?.message || "Failed to fetch teachers");
      alert("Failed to load teachers");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsManage(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      return;
    }

    try {
      await teacherService.delete(teacher.id);
      alert("Teacher deleted successfully");
      fetchTeachers();
    } catch (err: any) {
      console.error("Error deleting teacher:", err);
      alert(err.response?.data?.message || "Failed to delete teacher");
    }
  };

  const handleAddNew = () => {
    setSelectedTeacher(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchTeachers();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (teachers.length === 0) {
      return {
        totalTeachers: 0,
        activeTeachers: 0,
        specializations: 0,
      };
    }

    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter((t) => t.status === "Active").length;
    
    // Count unique specializations
    const uniqueSpecializations = new Set(
      teachers
        .map(t => t.specialization)
        .filter(s => s && s.trim() !== "")
    );
    const specializations = uniqueSpecializations.size;

    return {
      totalTeachers,
      activeTeachers,
      specializations,
    };
  }, [teachers]);

  const columns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      {
        id: "employee_id",
        accessorKey: "employee_id",
        header: "Employee ID",
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
      },
      {
        id: "specialization",
        accessorKey: "specialization",
        header: "Specialization",
        cell: ({ getValue }) => getValue() || "N/A",
      },
      {
        id: "qualification",
        accessorKey: "qualification",
        header: "Qualification",
        cell: ({ getValue }) => getValue() || "N/A",
      },
      {
        id: "joining_date",
        accessorKey: "joining_date",
        header: "Joining Date",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
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
                  : "bg-red-100 text-red-800"
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
          <Button onClick={fetchTeachers} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <Award className="w-5 h-5" />
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Teachers"
            value={String(stats.totalTeachers)}
            icon={Users}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Teachers"
            value={String(stats.activeTeachers)}
            icon={BookOpen}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Specializations"
            value={String(stats.specializations)}
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading teachers...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={teachers}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "email", "employee_id"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Teacher Modal */}
      <ManageTeacherDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        teacher={selectedTeacher}
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