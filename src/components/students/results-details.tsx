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
import type { Result } from "@/lib/types";
import { resultService, studentService, classService } from "@/lib/api";

interface ManageResultProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result?: Result | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  student_id: yup.number().required("Student is required").positive(),
  class_id: yup.number().required("Class is required").positive(),
  exam_type: yup.string().required("Exam type is required"),
  total_marks: yup.number().required("Total marks is required").positive(),
  obtained_marks: yup.number().required("Obtained marks is required").min(0),
  academic_year: yup.string().required("Academic year is required"),
  remarks: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageResultDetails({
  isOpen,
  onOpenChange,
  result,
  onSuccess,
}: ManageResultProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
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
    if (result) {
      reset({
        student_id: Number(result.student_id),
        class_id: Number(result.class_id),
        exam_type: result.exam_type,
        total_marks: Number(result.total_marks),
        obtained_marks: Number(result.obtained_marks),
        academic_year: result.academic_year,
        remarks: result.remarks || "",
      });
    } else {
      reset({
        academic_year: new Date().getFullYear().toString(),
      });
    }
  }, [result, reset]);

  // Auto-calculate percentage
  const totalMarks = watch("total_marks");
  const obtainedMarks = watch("obtained_marks");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Prepare data for backend
      const submitData = {
        student_id: Number(data.student_id),
        class_id: Number(data.class_id),
        exam_type: data.exam_type,
        total_marks: Number(data.total_marks),
        obtained_marks: Number(data.obtained_marks),
        academic_year: data.academic_year,
        remarks: data.remarks || "",
      };

      if (result) {
        // Update existing result
        await resultService.update(result.id, submitData);
        alert("Result updated successfully!");
      } else {
        // Create new result
        await resultService.create(submitData);
        alert("Result created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving result:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(result ? "Failed to update result" : "Failed to create result");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatedPercentage = totalMarks && obtainedMarks 
    ? ((obtainedMarks / totalMarks) * 100).toFixed(2) 
    : "0";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{result ? "Edit Result" : "Add Result"}</SheetTitle>
          <SheetDescription>
            {result
              ? "Update the result details below."
              : "Fill in the result details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Result Details">
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

              <FormField label="Exam Type *" error={errors.exam_type?.message}>
                <Controller
                  name="exam_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mid-term">Mid-term</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Total Marks *" error={errors.total_marks?.message}>
                <Controller
                  name="total_marks"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="500"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
                />
              </FormField>

              <FormField label="Obtained Marks *" error={errors.obtained_marks?.message}>
                <Controller
                  name="obtained_marks"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="450"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
                />
              </FormField>

              <FormField label="Percentage (Auto-calculated)">
                <Input
                  type="text"
                  value={`${calculatedPercentage}%`}
                  disabled
                  className="bg-gray-100"
                />
              </FormField>

              <FormField label="Academic Year *" error={errors.academic_year?.message}>
                <Input
                  {...register("academic_year")}
                  placeholder="2024"
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
                {loading ? "Saving..." : result ? "Update Result" : "Add Result"}
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