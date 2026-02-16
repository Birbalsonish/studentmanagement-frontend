import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import type { Attendance } from "@/lib/types";
import { attendanceService, studentService, classService, subjectService } from "@/lib/api";

interface ManageAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: Attendance | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  student_id: yup.number().required("Student is required").positive(),
  class_id: yup.number().required("Class is required").positive(),
  subject_id: yup.number().optional().positive(),
  date: yup.string().required("Date is required"),
  status: yup.string().oneOf(["Present", "Absent", "Late", "Excused"]).required("Status is required"),
  check_in_time: yup.string().optional(),
  check_out_time: yup.string().optional(),
  remarks: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageAttendanceDetails({
  isOpen,
  onOpenChange,
  attendance,
  onSuccess,
}: ManageAttendanceProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "Present",
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Fetch students, classes, and subjects for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, subjectsRes] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          subjectService.getAll(),
        ]);

        const studentsData = studentsRes.data.data.data || studentsRes.data.data;
        const classesData = classesRes.data.data.data || classesRes.data.data;
        const subjectsData = subjectsRes.data.data.data || subjectsRes.data.data;

        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (attendance) {
      reset({
        student_id: Number(attendance.student_id),
        class_id: Number(attendance.class_id),
        subject_id: attendance.subject_id ? Number(attendance.subject_id) : undefined,
        date: attendance.date,
        status: attendance.status,
        check_in_time: attendance.check_in_time || "",
        check_out_time: attendance.check_out_time || "",
        remarks: attendance.remarks || "",
      });
    } else {
      reset({
        status: "Present",
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [attendance, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        student_id: Number(data.student_id),
        class_id: Number(data.class_id),
        subject_id: data.subject_id ? Number(data.subject_id) : null,
        date: data.date,
        status: data.status,
        check_in_time: data.check_in_time || null,
        check_out_time: data.check_out_time || null,
        remarks: data.remarks || null,
      };

      if (attendance) {
        await attendanceService.update(attendance.id, submitData);
        alert("Attendance updated successfully!");
      } else {
        await attendanceService.create(submitData);
        alert("Attendance marked successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving attendance:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(attendance ? "Failed to update attendance" : "Failed to mark attendance");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{attendance ? "Edit Attendance" : "Mark Attendance"}</SheetTitle>
          <SheetDescription>
            {attendance
              ? "Update the attendance record below."
              : "Fill in the attendance record below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Attendance Details">
              <FormField label="Student *" error={errors.student_id?.message}>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} ({student.admission_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Class *" error={errors.class_id?.message}>
                <Controller
                  name="class_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name} {cls.section ? `- ${cls.section}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

             <FormField label="Subject (Optional)" error={errors.subject_id?.message}>
  <Controller
    name="subject_id"
    control={control}
    render={({ field }) => (
      <Select
        value={field.value ? field.value.toString() : undefined}
        onValueChange={(value) => field.onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subject (optional)" />
        </SelectTrigger>

        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id.toString()}>
              {subject.name} ({subject.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  />
</FormField>


              <FormField label="Date *" error={errors.date?.message}>
                <Input
                  type="date"
                  {...register("date")}
                />
              </FormField>

              <FormField label="Status *" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Excused">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Check-in Time" error={errors.check_in_time?.message}>
                <Input
                  type="time"
                  {...register("check_in_time")}
                />
              </FormField>

              <FormField label="Check-out Time" error={errors.check_out_time?.message}>
                <Input
                  type="time"
                  {...register("check_out_time")}
                />
              </FormField>

              <FormField label="Remarks" error={errors.remarks?.message}>
                <Input
                  {...register("remarks")}
                  placeholder="Optional remarks"
                />
              </FormField>
            </Section>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : attendance ? "Update" : "Mark"} Attendance
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}