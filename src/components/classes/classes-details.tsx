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

interface ManageClassProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ================= YUP VALIDATION SCHEMA ================= */
const schema = yup.object({
  className: yup.string().required("Class name is required"),
  classTeacher: yup.string().required("Class teacher is required"),
  totalStudents: yup
    .number()
    .typeError("Total students must be a number")
    .required("Total students is required")
    .min(1, "At least 1 student required"),
  section: yup.string().required("Section/Grade is required"),
  subjectsAssigned: yup.string().required("Assigned subjects are required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageClassDetails({
  isOpen,
  onOpenChange,
}: ManageClassProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Class Data:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Add Class</SheetTitle>
          <SheetDescription>Fill in the class details below.</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Class Details">
              <FormField label="Class Name" error={errors.className?.message}>
                <Input {...register("className")} />
              </FormField>

              <FormField
                label="Class Teacher"
                error={errors.classTeacher?.message}
              >
                <Input {...register("classTeacher")} />
              </FormField>

              <FormField
                label="Total Students"
                error={errors.totalStudents?.message}
              >
                <Input type="number" {...register("totalStudents")} />
              </FormField>

              <FormField label="Section/Grade" error={errors.section?.message}>
                <Input {...register("section")} />
              </FormField>

              <FormField
                label="Assigned Subjects"
                error={errors.subjectsAssigned?.message}
              >
                <Input {...register("subjectsAssigned")} />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">Save Class</Button>
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
    <div className="grid gap-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
