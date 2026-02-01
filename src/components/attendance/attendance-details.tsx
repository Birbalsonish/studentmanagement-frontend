"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ManageAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ================= YUP VALIDATION SCHEMA ================= */
const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  className: yup.string().required("Class is required"),
  rollNo: yup
    .number()
    .typeError("Roll number must be a number")
    .required("Roll number is required")
    .min(1, "Invalid roll number"),
  date: yup.string().required("Date is required"),
  status: yup.string().required("Attendance status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageAttendanceDetails({
  isOpen,
  onOpenChange,
}: ManageAttendanceProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Attendance Data:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Mark Attendance</SheetTitle>
          <SheetDescription>
            Fill in the attendance details below.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Attendance Details">
              <FormField
                label="Student Name"
                error={errors.studentName?.message}
              >
                <Input {...register("studentName")} />
              </FormField>

              <FormField label="Class" error={errors.className?.message}>
                <Input {...register("className")} />
              </FormField>

              <FormField label="Roll No" error={errors.rollNo?.message}>
                <Input type="number" {...register("rollNo")} />
              </FormField>

              <FormField label="Date" error={errors.date?.message}>
                <Input type="date" {...register("date")} />
              </FormField>

              <FormField label="Status" error={errors.status?.message}>
                <Input
                  placeholder="Present / Absent"
                  {...register("status")}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">Save Attendance</Button>
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

/* ================= Helper Components ================= */
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
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
    <div className="grid gap-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
