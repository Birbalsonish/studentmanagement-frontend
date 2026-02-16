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
import type { Student } from "@/lib/types";
import { studentService } from "@/lib/api";

interface ManageStudentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  admission_number: yup.string().required("Admission number is required"),
  admission_date: yup.string().required("Admission date is required"),
  address: yup.string().optional(),
  guardian_name: yup.string().optional(),
  guardian_phone: yup.string().optional(),
  gender: yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageStudentDetails({
  isOpen,
  onOpenChange,
  student,
  onSuccess,
}: ManageStudentProps) {
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
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        date_of_birth: student.date_of_birth,
        admission_number: student.admission_number,
        admission_date: student.admission_date,
        address: student.address || "",
        guardian_name: student.guardian_name || "",
        guardian_phone: student.guardian_phone || "",
        gender: student.gender,
        status: student.status,
      });
    } else {
      reset({
        status: "Active",
        gender: "Male",
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (student) {
        // Update existing student
        const response = await studentService.update(student.id, data);
        console.log("Student updated:", response.data);
        alert("Student updated successfully!");
      } else {
        // Create new student
        const response = await studentService.create(data);
        console.log("Student created:", response.data);
        alert("Student created successfully!");
      }
      
      reset();
      onOpenChange(false);
      
      // Refresh the student list
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving student:", error);
      
      // Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(student ? "Failed to update student" : "Failed to create student");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{student ? "Edit Student" : "Add Student"}</SheetTitle>
          <SheetDescription>
            {student
              ? "Update the student details below."
              : "Fill in the student details below."}
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
                <Input type="email" {...register("email")} placeholder="john@example.com" />
              </FormField>

              <FormField label="Phone *" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="+977 98XXXXXXXX" />
              </FormField>

              <FormField label="Date of Birth *" error={errors.date_of_birth?.message}>
                <Input 
                  type="date" 
                  {...register("date_of_birth")} 
                />
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

            {/* Admission Information */}
            <Section title="Admission Information">
              <FormField label="Admission Number *" error={errors.admission_number?.message}>
                <Input 
                  {...register("admission_number")} 
                  placeholder="ADM2024001"
                  disabled={!!student}
                />
              </FormField>

              <FormField label="Admission Date *" error={errors.admission_date?.message}>
                <Input 
                  type="date" 
                  {...register("admission_date")} 
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

            {/* Guardian Information */}
            <Section title="Guardian Information">
              <FormField label="Guardian Name" error={errors.guardian_name?.message}>
                <Input {...register("guardian_name")} placeholder="Parent/Guardian name" />
              </FormField>

              <FormField label="Guardian Phone" error={errors.guardian_phone?.message}>
                <Input {...register("guardian_phone")} placeholder="Guardian contact" />
              </FormField>
            </Section>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : student ? "Update Student" : "Add Student"}
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