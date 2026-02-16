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
import type { Grade } from "@/lib/types";
import { gradeService, studentService, subjectService } from "@/lib/api";

interface ManageGradeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  grade?: Grade | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  student_id: yup.number().required("Student is required").positive(),
  subject_id: yup.number().required("Subject is required").positive(),
  exam_type: yup.string().required("Exam type is required"),
  marks_obtained: yup.number().required("Marks obtained is required").min(0),
  total_marks: yup.number().required("Total marks is required").positive(),
  exam_date: yup.string().required("Exam date is required"),
  academic_year: yup.string().required("Academic year is required"),
  remarks: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageGradeDetails({
  isOpen,
  onOpenChange,
  grade,
  onSuccess,
}: ManageGradeProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      academic_year: new Date().getFullYear().toString(),
      exam_date: new Date().toISOString().split('T')[0],
    },
  });

  // Fetch students and subjects for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          studentService.getAll(),
          subjectService.getAll(),
        ]);

        const studentsData = studentsRes.data.data.data || studentsRes.data.data;
        const subjectsData = subjectsRes.data.data.data || subjectsRes.data.data;

        setStudents(Array.isArray(studentsData) ? studentsData : []);
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
    if (grade) {
      reset({
        student_id: Number(grade.student_id),
        subject_id: Number(grade.subject_id),
        exam_type: grade.exam_type,
        marks_obtained: Number(grade.marks_obtained),
        total_marks: Number(grade.total_marks),
        exam_date: grade.exam_date,
        academic_year: grade.academic_year,
        remarks: grade.remarks || "",
      });
    } else {
      reset({
        academic_year: new Date().getFullYear().toString(),
        exam_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [grade, reset]);

  // Auto-calculate percentage and grade
  const totalMarks = watch("total_marks");
  const marksObtained = watch("marks_obtained");

  const calculatedPercentage = totalMarks && marksObtained
    ? ((marksObtained / totalMarks) * 100).toFixed(2)
    : "0";

  const calculatedGrade = () => {
    const percentage = parseFloat(calculatedPercentage);
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        student_id: Number(data.student_id),
        subject_id: Number(data.subject_id),
        exam_type: data.exam_type,
        marks_obtained: Number(data.marks_obtained),
        total_marks: Number(data.total_marks),
        exam_date: data.exam_date,
        academic_year: data.academic_year,
        remarks: data.remarks || "",
      };

      if (grade) {
        await gradeService.update(grade.id, submitData);
        alert("Grade updated successfully!");
      } else {
        await gradeService.create(submitData);
        alert("Grade created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving grade:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(grade ? "Failed to update grade" : "Failed to create grade");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{grade ? "Edit Grade" : "Add Grade"}</SheetTitle>
          <SheetDescription>
            {grade
              ? "Update the grade details below."
              : "Fill in the grade details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Grade Details">
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

              <FormField label="Subject *" error={errors.subject_id?.message}>
                <Controller
                  name="subject_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
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
                        <SelectItem value="Quiz">Quiz</SelectItem>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Marks Obtained *" error={errors.marks_obtained?.message}>
                <Controller
                  name="marks_obtained"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="85"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
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
                      placeholder="100"
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

              <FormField label="Grade (Auto-calculated)">
                <Input
                  type="text"
                  value={calculatedGrade()}
                  disabled
                  className="bg-gray-100"
                />
              </FormField>

              <FormField label="Exam Date *" error={errors.exam_date?.message}>
                <Input
                  type="date"
                  {...register("exam_date")}
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
                {loading ? "Saving..." : grade ? "Update Grade" : "Add Grade"}
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