import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageStudentDetails from "@/components/students/student-details";
import type { Student } from "@/lib/types";
import { studentService } from "@/lib/api";
import type { ColumnDef } from "@tanstack/react-table";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isManage, setIsManage] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();

      // Handle Laravel pagination response
      const data = response.data.data;
      
      if (data.data) {
        // Paginated response
        setStudents(data.data);
      } else {
        // Non-paginated response
        setStudents(Array.isArray(data) ? data : []);
      }
      
      setError("");
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to fetch students");
      alert("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsManage(true);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }

    try {
      await studentService.delete(student.id);
      alert("Student deleted successfully");
      fetchStudents(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting student:", err);
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsManage(true);
  };

  const handleSuccess = () => {
    fetchStudents(); // Refresh the list after create/update
  };

  // Define columns using TanStack React Table format
  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        id: "admission_number",
        accessorKey: "admission_number",
        header: "Admission No.",
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
        id: "gender",
        accessorKey: "gender",
        header: "Gender",
      },
      {
        id: "date_of_birth",
        accessorKey: "date_of_birth",
        header: "Date of Birth",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString();
        },
      },
      {
        id: "admission_date",
        accessorKey: "admission_date",
        header: "Admission Date",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString();
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {value}
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
          <Button onClick={fetchStudents} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and records
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
      ) : (
        <GenericTable
          data={students}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchKeys={["name", "email", "admission_number"]}
        />
      )}

      <ManageStudentDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        student={selectedStudent}
        onSuccess={handleSuccess}
      />
    </div>
  );
}