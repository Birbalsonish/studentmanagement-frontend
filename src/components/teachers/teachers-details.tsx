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
import type { Teacher } from "@/lib/types";
import { teacherService } from "@/lib/api";

interface ManageTeacherProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: Teacher | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().optional(),
  gender: yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  qualification: yup.string().optional(),
  specialization: yup.string().optional(),
  joining_date: yup.string().required("Joining date is required"),
  salary: yup.number().optional().positive(),
  employee_id: yup.string().required("Employee ID is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageTeacherDetails({
  isOpen,
  onOpenChange,
  teacher,
  onSuccess,
}: ManageTeacherProps) {
  const [loading, setLoading] = useState(false);

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
      gender: "Male",
      joining_date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (teacher) {
      reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address || "",
        gender: teacher.gender,
        qualification: teacher.qualification || "",
        specialization: teacher.specialization || "",
        joining_date: teacher.joining_date,
        salary: teacher.salary,
        employee_id: teacher.employee_id,
        status: teacher.status,
      });
    } else {
      reset({
        status: "Active",
        gender: "Male",
        joining_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [teacher, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || "",
        gender: data.gender,
        qualification: data.qualification || "",
        specialization: data.specialization || "",
        joining_date: data.joining_date,
        salary: data.salary ? Number(data.salary) : undefined,
        employee_id: data.employee_id,
        status: data.status,
      };

      if (teacher) {
        await teacherService.update(teacher.id, submitData);
        alert("Teacher updated successfully!");
      } else {
        await teacherService.create(submitData);
        alert("Teacher created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving teacher:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(teacher ? "Failed to update teacher" : "Failed to create teacher");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{teacher ? "Edit Teacher" : "Add Teacher"}</SheetTitle>
          <SheetDescription>
            {teacher
              ? "Update the teacher details below."
              : "Fill in the teacher details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <Section title="Personal Information">
              <FormField label="Full Name *" error={errors.name?.message}>
                <Input {...register("name")} placeholder="John Doe" />
              </FormField>

              <FormField label="Email *" error={errors.email?.message}>
                <Input type="email" {...register("email")} placeholder="john@school.com" />
              </FormField>

              <FormField label="Phone *" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="+977 98XXXXXXXX" />
              </FormField>

              <FormField label="Gender *" error={errors.gender?.message}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Address" error={errors.address?.message}>
                <Input {...register("address")} placeholder="Street, City" />
              </FormField>
            </Section>

            {/* Employment Information */}
            <Section title="Employment Information">
              <FormField label="Employee ID *" error={errors.employee_id?.message}>
                <Input 
                  {...register("employee_id")} 
                  placeholder="EMP001"
                  disabled={!!teacher}
                />
              </FormField>

              <FormField label="Joining Date *" error={errors.joining_date?.message}>
                <Input 
                  type="date" 
                  {...register("joining_date")} 
                />
              </FormField>

              <FormField label="Qualification" error={errors.qualification?.message}>
                <Input 
                  {...register("qualification")} 
                  placeholder="B.Ed, M.Ed, Ph.D"
                />
              </FormField>

              <FormField label="Specialization" error={errors.specialization?.message}>
                <Input 
                  {...register("specialization")} 
                  placeholder="Mathematics, Science, etc."
                />
              </FormField>

              <FormField label="Salary" error={errors.salary?.message}>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="50000"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
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
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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
                {loading ? "Saving..." : teacher ? "Update Teacher" : "Add Teacher"}
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