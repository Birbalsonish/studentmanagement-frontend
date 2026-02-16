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
import type { Fee } from "@/lib/types";
import { feeService, enrollmentService } from "@/lib/api";

interface ManageFeeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fee?: Fee | null;
  onSuccess?: () => void;
}

const schema = yup.object({
  student_id: yup.number().required("Student is required").positive(),
  fee_type: yup.string().required("Fee type is required"),
  amount: yup.number().required("Amount is required").positive(),
  paid_amount: yup.number().required("Paid amount is required").min(0),
  due_date: yup.string().required("Due date is required"),
  academic_year: yup.string().required("Academic year is required"),
  status: yup.string().oneOf(["Paid", "Pending", "Partial", "Overdue"]).required("Status is required"),
  remarks: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageFeeDetails({
  isOpen,
  onOpenChange,
  fee,
  onSuccess,
}: ManageFeeProps) {
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedClassName, setSelectedClassName] = useState<string>("all");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      academic_year: new Date().getFullYear().toString(),
      due_date: new Date().toISOString().split('T')[0],
      status: "Pending",
      paid_amount: 0,
    },
  });

  // Watch amount and paid_amount to auto-suggest status
  const amount = watch("amount");
  const paidAmount = watch("paid_amount");

  // Auto-update status based on payment
  useEffect(() => {
    if (amount && paidAmount !== undefined) {
      if (paidAmount >= amount) {
        setValue("status", "Paid");
      } else if (paidAmount > 0) {
        setValue("status", "Partial");
      } else {
        setValue("status", "Pending");
      }
    }
  }, [amount, paidAmount, setValue]);

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

  useEffect(() => {
    if (fee) {
      reset({
        student_id: Number(fee.student_id),
        fee_type: fee.fee_type,
        amount: Number(fee.amount),
        paid_amount: Number(fee.paid_amount || 0),
        due_date: fee.due_date,
        academic_year: fee.academic_year,
        status: fee.status,
        remarks: fee.remarks || "",
      });

      // Find the class of the student when editing
      const studentEnrollment = enrollments.find(
        (e) => e.student_id === fee.student_id
      );
      if (studentEnrollment?.class) {
        const className = studentEnrollment.class.section 
          ? `${studentEnrollment.class.name} - ${studentEnrollment.class.section}`
          : studentEnrollment.class.name;
        setSelectedClassName(className);
      }
    } else {
      reset({
        academic_year: new Date().getFullYear().toString(),
        due_date: new Date().toISOString().split('T')[0],
        status: "Pending",
        paid_amount: 0,
      });
      setSelectedClassName("all");
    }
  }, [fee, reset, enrollments]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        student_id: Number(data.student_id),
        fee_type: data.fee_type,
        amount: Number(data.amount),
        paid_amount: Number(data.paid_amount),
        due_date: data.due_date,
        academic_year: data.academic_year,
        status: data.status,
        remarks: data.remarks || null,
      };

      if (fee) {
        await feeService.update(fee.id, submitData);
        alert("Fee updated successfully!");
      } else {
        await feeService.create(submitData);
        alert("Fee created successfully!");
      }

      reset();
      setSelectedClassName("all");
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving fee:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(fee ? "Failed to update fee" : "Failed to create fee");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (value: string) => {
    setSelectedClassName(value);
    setValue("student_id", 0);
  };

  // Calculate pending amount
  const pendingAmount = amount && paidAmount !== undefined 
    ? Math.max(0, amount - paidAmount) 
    : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[35vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{fee ? "Edit Fee" : "Add Fee"}</SheetTitle>
          <SheetDescription>
            {fee
              ? "Update the fee details below."
              : "Fill in the fee details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Student Selection">
              {/* Class Filter by Name */}
              <FormField label="Filter by Class">
                <Select
                  value={selectedClassName}
                  onValueChange={handleClassChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEnrollments.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            {selectedClassName !== "all"
                              ? "No students in selected class"
                              : "No students available"}
                          </div>
                        ) : (
                          filteredEnrollments.map((enrollment) => {
                            if (!enrollment.student) return null;
                            
                            const className = enrollment.class?.section 
                              ? `${enrollment.class.name} - ${enrollment.class.section}`
                              : enrollment.class?.name || "";

                            return (
                              <SelectItem 
                                key={enrollment.student.id} 
                                value={enrollment.student.id.toString()}
                              >
                                {enrollment.student.name} ({enrollment.student.admission_number})
                                {selectedClassName === "all" && className && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    - {className}
                                  </span>
                                )}
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
                  <span className="font-medium">Filtered by: </span>
                  {selectedClassName}
                  {" "}({filteredEnrollments.length} students)
                </div>
              )}
            </Section>

            <Section title="Fee Details">
              <FormField label="Fee Type *" error={errors.fee_type?.message}>
                <Controller
                  name="fee_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                        <SelectItem value="Admission Fee">Admission Fee</SelectItem>
                        <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                        <SelectItem value="Library Fee">Library Fee</SelectItem>
                        <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                        <SelectItem value="Laboratory Fee">Laboratory Fee</SelectItem>
                        <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Total Amount (NPR) *" error={errors.amount?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rs.
                  </span>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="5000.00"
                        className="pl-12"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    )}
                  />
                </div>
              </FormField>

              <FormField label="Paid Amount (NPR) *" error={errors.paid_amount?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rs.
                  </span>
                  <Controller
                    name="paid_amount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-12"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    )}
                  />
                </div>
              </FormField>

              {/* Show Pending Amount */}
              <FormField label="Pending Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rs.
                  </span>
                  <Input
                    type="text"
                    value={pendingAmount.toFixed(2)}
                    disabled
                    className="pl-12 bg-gray-50"
                  />
                </div>
              </FormField>

              <FormField label="Due Date *" error={errors.due_date?.message}>
                <Input
                  type="date"
                  {...register("due_date")}
                />
              </FormField>

              <FormField label="Academic Year *" error={errors.academic_year?.message}>
                <Input
                  {...register("academic_year")}
                  placeholder="2024"
                />
              </FormField>

              <FormField label="Payment Status *" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Remarks" error={errors.remarks?.message}>
                <Input
                  {...register("remarks")}
                  placeholder="Optional remarks"
                  className="col-span-2"
                />
              </FormField>

              {/* Payment Summary */}
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Payment Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-blue-600">Rs. {amount?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Paid Amount</p>
                    <p className="font-semibold text-green-600">Rs. {paidAmount?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-semibold text-red-600">Rs. {pendingAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Section>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : fee ? "Update Fee" : "Add Fee"}
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




