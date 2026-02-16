import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageGradeDetails from "@/components/students/grades-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpenCheck, Percent, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Grade } from "@/lib/types";
import { gradeService } from "@/lib/api";

export default function Grades() {
  const [isManage, setIsManage] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await gradeService.getAll();

      const data = response.data.data;

      if (data.data) {
        setGrades(data.data);
      } else {
        setGrades(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching grades:", err);
      setError(err.response?.data?.message || "Failed to fetch grades");
      alert("Failed to load grades");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsManage(true);
  };

  const handleDelete = async (grade: Grade) => {
    if (!confirm(`Are you sure you want to delete this grade?`)) {
      return;
    }

    try {
      await gradeService.delete(grade.id);
      alert("Grade deleted successfully");
      fetchGrades();
    } catch (err: any) {
      console.error("Error deleting grade:", err);
      alert(err.response?.data?.message || "Failed to delete grade");
    }
  };

  const handleAddNew = () => {
    setSelectedGrade(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchGrades();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (grades.length === 0) {
      return {
        totalGrades: 0,
        averagePercentage: 0,
        topGrade: "N/A",
      };
    }

    const totalGrades = grades.length;
    const totalPercentage = grades.reduce((sum, g) => sum + g.percentage, 0);
    const averagePercentage = (totalPercentage / totalGrades).toFixed(2);
    
    // Find most common top grade
    const gradeCount: any = {};
    grades.forEach(g => {
      gradeCount[g.grade] = (gradeCount[g.grade] || 0) + 1;
    });
    const topGrade = Object.keys(gradeCount).reduce((a, b) => 
      gradeCount[a] > gradeCount[b] ? a : b, 'N/A'
    );

    return {
      totalGrades,
      averagePercentage,
      topGrade,
    };
  }, [grades]);

  const columns = useMemo<ColumnDef<Grade>[]>(
    () => [
      {
        id: "student_name",
        accessorKey: "student.name",
        header: "Student Name",
        cell: ({ row }) => row.original.student?.name || "N/A",
      },
      {
        id: "subject_name",
        accessorKey: "subject.name",
        header: "Subject",
        cell: ({ row }) => row.original.subject?.name || "N/A",
      },
      {
        id: "exam_type",
        accessorKey: "exam_type",
        header: "Exam Type",
      },
      {
        id: "marks_obtained",
        accessorKey: "marks_obtained",
        header: "Marks Obtained",
      },
      {
        id: "total_marks",
        accessorKey: "total_marks",
        header: "Total Marks",
      },
      {
        id: "percentage",
        accessorKey: "percentage",
        header: "Percentage",
        cell: ({ getValue }) => `${Number(getValue()).toFixed(2)}%`,
      },
      {
        id: "grade",
        accessorKey: "grade",
        header: "Grade",
        cell: ({ getValue }) => (
          <span className="font-semibold text-lg">{getValue() as string}</span>
        ),
      },
      {
        id: "exam_date",
        accessorKey: "exam_date",
        header: "Exam Date",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
    ],
    []
  );

  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={fetchGrades} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Grades</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <Award className="w-5 h-5" />
              Add Grade
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Records"
            value={String(stats.totalGrades)}
            icon={BookOpenCheck}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averagePercentage}%`}
            icon={Percent}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Top Grade"
            value={stats.topGrade}
            icon={Award}
            color="bg-pink-500/70 text-white"
          />
        </div>

        {/* Grades Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading grades...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={grades}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["exam_type"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Grade Modal */}
      <ManageGradeDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        grade={selectedGrade}
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