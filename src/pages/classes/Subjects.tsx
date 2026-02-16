import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageSubjectDetails from "@/components/classes/subjects-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Subject } from "@/lib/types";
import { subjectService } from "@/lib/api";

export default function Subjects() {
  const [isManage, setIsManage] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAll();

      const data = response.data.data;

      if (data.data) {
        setSubjects(data.data);
      } else {
        setSubjects(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching subjects:", err);
      setError(err.response?.data?.message || "Failed to fetch subjects");
      alert("Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsManage(true);
  };

  const handleDelete = async (subject: Subject) => {
    if (!confirm(`Are you sure you want to delete ${subject.name}?`)) {
      return;
    }

    try {
      await subjectService.delete(subject.id);
      alert("Subject deleted successfully");
      fetchSubjects();
    } catch (err: any) {
      console.error("Error deleting subject:", err);
      alert(err.response?.data?.message || "Failed to delete subject");
    }
  };

  const handleAddNew = () => {
    setSelectedSubject(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchSubjects();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (subjects.length === 0) {
      return {
        totalSubjects: 0,
        activeSubjects: 0,
        totalCredits: 0,
      };
    }

    const totalSubjects = subjects.length;
    const activeSubjects = subjects.filter((s) => s.status === "Active").length;
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

    return {
      totalSubjects,
      activeSubjects,
      totalCredits,
    };
  }, [subjects]);

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Subject Name",
      },
      {
        id: "code",
        accessorKey: "code",
        header: "Subject Code",
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        header: "Teacher",
        cell: ({ row }) => row.original.teacher?.name || "Not Assigned",
      },
      {
        id: "class",
        accessorKey: "class.name",
        header: "Class",
        cell: ({ row }) => {
          const cls = row.original.class;
          return cls ? `${cls.name} ${cls.section || ""}` : "All Classes";
        },
      },
      {
        id: "credits",
        accessorKey: "credits",
        header: "Credits",
      },
      {
        id: "type",
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === "Theory"
                  ? "bg-blue-100 text-blue-800"
                  : type === "Practical"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {type}
            </span>
          );
        },
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
          <Button onClick={fetchSubjects} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <BookOpen className="w-5 h-5" />
              Add Subject
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Subjects"
            value={String(stats.totalSubjects)}
            icon={BookOpen}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Subjects"
            value={String(stats.activeSubjects)}
            icon={Users}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Total Credits"
            value={String(stats.totalCredits)}
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading subjects...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={subjects}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "code"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Subject Modal */}
      <ManageSubjectDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        subject={selectedSubject}
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