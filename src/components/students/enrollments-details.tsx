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
import type { Enrollment } from "@/lib/types";
import { enrollmentService, studentService, classService } from "@/lib/api";

interface ManageEnrollmentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment?: Enrollment | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  student_id: yup.number().required("Student is required").positive(),
  class_id: yup.number().required("Class is required").positive(),
  enrollment_date: yup.string().required("Enrollment date is required"),
  academic_year: yup.string().required("Academic year is required"),
  status: yup.string().oneOf(["Active", "Completed", "Dropped"]).required("Status is required"),
  remarks: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageEnrollmentDetails({
  isOpen,
  onOpenChange,
  enrollment,
  onSuccess,
}: ManageEnrollmentProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "Active",
      enrollment_date: new Date().toISOString().split('T')[0],
      academic_year: new Date().getFullYear().toString(),
    },
  });

  // Fetch students and classes for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
        ]);

        const studentsData = studentsRes.data.data.data || studentsRes.data.data;
        const classesData = classesRes.data.data.data || classesRes.data.data;

        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (enrollment) {
      reset({
        student_id: Number(enrollment.student_id),
        class_id: Number(enrollment.class_id),
        enrollment_date: enrollment.enrollment_date,
        academic_year: enrollment.academic_year,
        status: enrollment.status,
        remarks: enrollment.remarks || "",
      });
    } else {
      reset({
        status: "Active",
        enrollment_date: new Date().toISOString().split('T')[0],
        academic_year: new Date().getFullYear().toString(),
      });
    }
  }, [enrollment, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        student_id: Number(data.student_id),
        class_id: Number(data.class_id),
        enrollment_date: data.enrollment_date,
        academic_year: data.academic_year,
        status: data.status,
        remarks: data.remarks || "",
      };

      if (enrollment) {
        await enrollmentService.update(enrollment.id, submitData);
        alert("Enrollment updated successfully!");
      } else {
        await enrollmentService.create(submitData);
        alert("Enrollment created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving enrollment:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(enrollment ? "Failed to update enrollment" : "Failed to create enrollment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{enrollment ? "Edit Enrollment" : "Add Enrollment"}</SheetTitle>
          <SheetDescription>
            {enrollment
              ? "Update the enrollment details below."
              : "Fill in the enrollment details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Enrollment Details">
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

              <FormField label="Enrollment Date *" error={errors.enrollment_date?.message}>
                <Input
                  type="date"
                  {...register("enrollment_date")}
                />
              </FormField>

              <FormField label="Academic Year *" error={errors.academic_year?.message}>
                <Input
                  {...register("academic_year")}
                  placeholder="2024"
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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
                {loading ? "Saving..." : enrollment ? "Update Enrollment" : "Add Enrollment"}
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