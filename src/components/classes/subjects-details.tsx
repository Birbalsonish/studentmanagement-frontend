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

interface ManageSubjectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ================= YUP VALIDATION SCHEMA ================= */
const schema = yup.object({
  subjectName: yup.string().required("Subject name is required"),
  classAssigned: yup.string().required("Class assigned is required"),
  teacherAssigned: yup.string().required("Teacher assigned is required"),
  subjectCode: yup.string().required("Subject code is required"),
  description: yup.string().required("Description is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageSubjectDetails({
  isOpen,
  onOpenChange,
}: ManageSubjectProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Subject Data:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Add Subject</SheetTitle>
          <SheetDescription>Fill in the subject details below.</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ================= Subject Details ================= */}
            <Section title="Subject Details">
              <FormField label="Subject Name" error={errors.subjectName?.message}>
                <Input {...register("subjectName")} />
              </FormField>

              <FormField label="Class Assigned" error={errors.classAssigned?.message}>
                <Input {...register("classAssigned")} />
              </FormField>

              <FormField label="Teacher Assigned" error={errors.teacherAssigned?.message}>
                <Input {...register("teacherAssigned")} />
              </FormField>

              <FormField label="Subject Code" error={errors.subjectCode?.message}>
                <Input {...register("subjectCode")} />
              </FormField>

              <FormField label="Description" error={errors.description?.message}>
                <Input {...register("description")} />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">Save Subject</Button>
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
