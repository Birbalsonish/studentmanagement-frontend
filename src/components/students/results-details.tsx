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
import { useEffect, useState, useMemo } from "react";
import type { Result } from "@/lib/types";
import { resultService, enrollmentService } from "@/lib/api";

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
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedClassName, setSelectedClassName] = useState<string>("all");

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

  // Fetch enrollments with student and class data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await enrollmentService.getAll();
        const enrollmentsData = response.data.data.data || response.data.data;
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Get unique class names from enrollments
  const classNames = useMemo(() => {
    const uniqueClasses = new Set<string>();
    enrollments.forEach((enrollment) => {
      if (enrollment.class?.name) {
        const className = enrollment.class.section 
          ? `${enrollment.class.name} - ${enrollment.class.section}`
          : enrollment.class.name;
        uniqueClasses.add(className);
      }
    });
    return Array.from(uniqueClasses).sort();
  }, [enrollments]);

  // Get unique class IDs mapped to names
  const classesMap = useMemo(() => {
    const map = new Map<number, string>();
    enrollments.forEach((enrollment) => {
      if (enrollment.class) {
        const className = enrollment.class.section 
          ? `${enrollment.class.name} - ${enrollment.class.section}`
          : enrollment.class.name;
        map.set(enrollment.class.id, className);
      }
    });
    return map;
  }, [enrollments]);

  // Filter students based on selected class name
  const filteredEnrollments = useMemo(() => {
    if (selectedClassName === "all") {
      return enrollments;
    }

    return enrollments.filter((enrollment) => {
      if (!enrollment.class) return false;
      
      const className = enrollment.class.section 
        ? `${enrollment.class.name} - ${enrollment.class.section}`
        : enrollment.class.name;
      
      return className === selectedClassName;
    });
  }, [selectedClassName, enrollments]);

  // Get the class_id from selected class name
  const selectedClassId = useMemo(() => {
    if (selectedClassName === "all") return null;
    
    const enrollment = enrollments.find((e) => {
      if (!e.class) return false;
      const className = e.class.section 
        ? `${e.class.name} - ${e.class.section}`
        : e.class.name;
      return className === selectedClassName;
    });
    
    return enrollment?.class?.id || null;
  }, [selectedClassName, enrollments]);

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

      // Set the selected class name based on class_id
      const className = classesMap.get(Number(result.class_id));
      if (className) {
        setSelectedClassName(className);
      }
    } else {
      reset({
        academic_year: new Date().getFullYear().toString(),
      });
      setSelectedClassName("all");
    }
  }, [result, reset, classesMap]);

  // Auto-calculate percentage
  const totalMarks = watch("total_marks");
  const obtainedMarks = watch("obtained_marks");

  const handleClassChange = (value: string) => {
    setSelectedClassName(value);
    
    // Reset student selection
    setValue("student_id", 0);
    
    // Set class_id based on selected class name
    if (value === "all") {
      setValue("class_id", 0);
    } else {
      const enrollment = enrollments.find((e) => {
        if (!e.class) return false;
        const className = e.class.section 
          ? `${e.class.name} - ${e.class.section}`
          : e.class.name;
        return className === value;
      });
      
      if (enrollment?.class?.id) {
        setValue("class_id", enrollment.class.id);
      }
    }
  };

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
      setSelectedClassName("all");
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
            <Section title="Student & Class Selection">
              {/* Class Filter by Name */}
              <FormField label="Select Class First *" error={errors.class_id?.message}>
                <Select
                  value={selectedClassName}
                  onValueChange={handleClassChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" disabled>
                      -- Select a Class --
                    </SelectItem>
                    {classNames.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {/* Student Dropdown (filtered by class) */}
              <FormField label="Student *" error={errors.student_id?.message}>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={selectedClassName === "all"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedClassName === "all" ? "Select class first" : "Select student"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEnrollments.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            {selectedClassName !== "all"
                              ? "No students in selected class"
                              : "Please select a class first"}
                          </div>
                        ) : (
                          filteredEnrollments.map((enrollment) => {
                            if (!enrollment.student) return null;
                            
                            return (
                              <SelectItem 
                                key={enrollment.student.id} 
                                value={enrollment.student.id.toString()}
                              >
                                {enrollment.student.name} ({enrollment.student.admission_number})
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {/* Show selected class info */}
              {selectedClassName !== "all" && (
                <div className="col-span-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
                  <span className="font-medium">Selected Class: </span>
                  {selectedClassName}
                  {" "}({filteredEnrollments.length} students)
                </div>
              )}
            </Section>

            <Section title="Exam Details">
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

              <FormField label="Academic Year *" error={errors.academic_year?.message}>
                <Input
                  {...register("academic_year")}
                  placeholder="2024"
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
                <div className="relative">
                  <Input
                    type="text"
                    value={`${calculatedPercentage}%`}
                    disabled
                    className="bg-gray-50 font-semibold text-primary"
                  />
                  {Number(calculatedPercentage) >= 40 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xs">
                      ✓ Pass
                    </span>
                  )}
                </div>
              </FormField>

              <FormField label="Remarks" error={errors.remarks?.message}>
                <Input
                  {...register("remarks")}
                  placeholder="Optional remarks"
                  className="col-span-2"
                />
              </FormField>
            </Section>

            {/* Summary Box */}
            {totalMarks && obtainedMarks && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-sm mb-3">Result Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Marks</p>
                    <p className="font-bold text-blue-600 text-lg">{totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Obtained Marks</p>
                    <p className="font-bold text-green-600 text-lg">{obtainedMarks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Percentage</p>
                    <p className="font-bold text-purple-600 text-lg">{calculatedPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Result</p>
                    <p className={`font-bold text-lg ${Number(calculatedPercentage) >= 40 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(calculatedPercentage) >= 40 ? 'PASS' : 'FAIL'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading || selectedClassName === "all"}>
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