import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageResultDetails from "@/components/students/results-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Percent, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Result } from "@/lib/types";
import { resultService } from "@/lib/api";

export default function Results() {
  const [isManage, setIsManage] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await resultService.getAll();

      const data = response.data.data;

      if (data.data) {
        setResults(data.data);
      } else {
        setResults(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(err.response?.data?.message || "Failed to fetch results");
      alert("Failed to load results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setIsManage(true);
  };

  const handleDelete = async (result: Result) => {
    if (!confirm(`Are you sure you want to delete this result?`)) {
      return;
    }

    try {
      await resultService.delete(result.id);
      alert("Result deleted successfully");
      fetchResults();
    } catch (err: any) {
      console.error("Error deleting result:", err);
      alert(err.response?.data?.message || "Failed to delete result");
    }
  };

  const handleAddNew = () => {
    setSelectedResult(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchResults();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalResults: 0,
        averagePercentage: 0,
        passRate: 0,
      };
    }

    const totalResults = results.length;
    const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
    const averagePercentage = (totalPercentage / totalResults).toFixed(2);
    const passCount = results.filter((r) => r.result_status === "Pass").length;
    const passRate = ((passCount / totalResults) * 100).toFixed(0);

    return {
      totalResults,
      averagePercentage,
      passRate,
    };
  }, [results]);

  const columns = useMemo<ColumnDef<Result>[]>(
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
        id: "exam_type",
        accessorKey: "exam_type",
        header: "Exam Type",
      },
      {
        id: "total_marks",
        accessorKey: "total_marks",
        header: "Total Marks",
      },
      {
        id: "obtained_marks",
        accessorKey: "obtained_marks",
        header: "Obtained Marks",
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
          <span className="font-semibold">{getValue() as string}</span>
        ),
      },
      {
        id: "result_status",
        accessorKey: "result_status",
        header: "Result",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "Pass"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "academic_year",
        accessorKey: "academic_year",
        header: "Year",
      },
    ],
    []
  );

  if (error && !loading) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={fetchResults} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Results</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <FileText className="w-5 h-5" />
              Add Result
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Results"
            value={String(stats.totalResults)}
            icon={FileText}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Average Percentage"
            value={`${stats.averagePercentage}%`}
            icon={Percent}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading results...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={results}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["exam_type", "academic_year"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Result Modal */}
      <ManageResultDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        result={selectedResult}
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