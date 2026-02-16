import { useState, useEffect, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageClassDetails from "@/components/classes/classes-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Class } from "@/lib/types";
import { classService } from "@/lib/api";

export default function Classes() {
  const [isManage, setIsManage] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classService.getAll();

      const data = response.data.data;

      if (data.data) {
        setClasses(data.data);
      } else {
        setClasses(Array.isArray(data) ? data : []);
      }

      setError("");
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      setError(err.response?.data?.message || "Failed to fetch classes");
      alert("Failed to load classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classData: Class) => {
    setSelectedClass(classData);
    setIsManage(true);
  };

  const handleDelete = async (classData: Class) => {
    if (!confirm(`Are you sure you want to delete ${classData.name}${classData.section ? ` - ${classData.section}` : ''}?`)) {
      return;
    }

    try {
      await classService.delete(classData.id);
      alert("Class deleted successfully");
      fetchClasses();
    } catch (err: any) {
      console.error("Error deleting class:", err);
      alert(err.response?.data?.message || "Failed to delete class");
    }
  };

  const handleAddNew = () => {
    setSelectedClass(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchClasses();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (classes.length === 0) {
      return {
        totalClasses: 0,
        totalCapacity: 0,
        activeClasses: 0,
      };
    }

    const totalClasses = classes.length;
    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
    const activeClasses = classes.filter((c) => c.status === "Active").length;

    return {
      totalClasses,
      totalCapacity,
      activeClasses,
    };
  }, [classes]);

  const columns = useMemo<ColumnDef<Class>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Class Name",
        cell: ({ row }) => {
          const cls = row.original;
          return `${cls.name}${cls.section ? ` - ${cls.section}` : ''}`;
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        header: "Class Teacher",
        cell: ({ row }) => row.original.teacher?.name || "Not Assigned",
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        header: "Capacity",
      },
      {
        id: "room_number",
        accessorKey: "room_number",
        header: "Room Number",
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
          <Button onClick={fetchClasses} className="mt-4">
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
          <h1 className="text-2xl font-semibold">Classes</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddNew}
            >
              <BookOpen className="w-5 h-5" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Classes"
            value={String(stats.totalClasses)}
            icon={BookOpen}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Total Capacity"
            value={String(stats.totalCapacity)}
            icon={Users}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Active Classes"
            value={String(stats.activeClasses)}
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading classes...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={classes}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "section", "room_number"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Manage Class Modal */}
      <ManageClassDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        classData={selectedClass}
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