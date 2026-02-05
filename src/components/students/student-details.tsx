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
import { useEffect } from "react";
import type { Student } from "@/lib/types";
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";

interface ManageStudentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  dob: yup.string().required("Date of birth is required"),
  studentId: yup.string().required("Student ID is required"),
  class: yup.string().required("Class is required"),
  rollNo: yup.number().required("Roll No is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageStudentDetails({
  isOpen,
  onOpenChange,
  student,
}: ManageStudentProps) {
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
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        dob: student.dob,
        studentId: student.studentId,
        class: student.class,
        rollNo: student.rollNo,
        status: student.status,
      });
    } else {
      reset({
        status: "Active",
      });
    }
  }, [student, reset]);

  const onSubmit = (data: FormData) => {
    if (student) {
      console.log("Update Student:", { ...student, ...data });
    } else {
      console.log("Create Student:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
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
            <Section title="Student Details">
              <FormField label="Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Full name" />
              </FormField>

              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register("email")} placeholder="Email" />
              </FormField>

              <FormField label="Phone" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="Phone number" />
              </FormField>

              <NepaliDatePickerField
                name="dob"
                control={control}
                label="Date of Birth (Nepali)"
                error={errors.dob?.message}
              />

              <FormField label="Student ID" error={errors.studentId?.message}>
                <Input {...register("studentId")} placeholder="Student ID" />
              </FormField>

              <FormField label="Class" error={errors.class?.message}>
                <Input {...register("class")} placeholder="Class" />
              </FormField>

              <FormField label="Roll No" error={errors.rollNo?.message}>
                <Input type="number" {...register("rollNo")} placeholder="Roll No" />
              </FormField>

              <FormField label="Status" error={errors.status?.message}>
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
              <Button type="submit">
                {student ? "Update" : "Save"} Student
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
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