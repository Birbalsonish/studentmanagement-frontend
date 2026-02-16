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
import type { Subject } from "@/lib/types";
import { subjectService, teacherService, classService } from "@/lib/api";

interface ManageSubjectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
  teacher_id: yup.number().optional().positive(),
  class_id: yup.number().optional().positive(),
  credits: yup.number().required("Credits is required").positive(),
  type: yup.string().oneOf(["Theory", "Practical", "Both"]).required("Type is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
  description: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageSubjectDetails({
  isOpen,
  onOpenChange,
  subject,
  onSuccess,
}: ManageSubjectProps) {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

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
      type: "Theory",
      credits: 3,
    },
  });

  // Fetch teachers and classes for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, classesRes] = await Promise.all([
          teacherService.getAll(),
          classService.getAll(),
        ]);

        const teachersData = teachersRes.data.data.data || teachersRes.data.data;
        const classesData = classesRes.data.data.data || classesRes.data.data;

        setTeachers(Array.isArray(teachersData) ? teachersData : []);
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
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code,
        teacher_id: subject.teacher_id,
        class_id: subject.class_id,
        credits: subject.credits,
        type: subject.type,
        status: subject.status,
        description: subject.description || "",
      });
    } else {
      reset({
        status: "Active",
        type: "Theory",
        credits: 3,
      });
    }
  }, [subject, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        name: data.name,
        code: data.code,
        teacher_id: data.teacher_id || null,
        class_id: data.class_id || null,
        credits: Number(data.credits),
        type: data.type,
        status: data.status,
        description: data.description || null,
      };

      if (subject) {
        await subjectService.update(subject.id, submitData);
        alert("Subject updated successfully!");
      } else {
        await subjectService.create(submitData);
        alert("Subject created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving subject:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(subject ? "Failed to update subject" : "Failed to create subject");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{subject ? "Edit Subject" : "Add Subject"}</SheetTitle>
          <SheetDescription>
            {subject
              ? "Update the subject details below."
              : "Fill in the subject details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Subject Details">
              <FormField label="Subject Name *" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Mathematics" />
              </FormField>

              <FormField label="Subject Code *" error={errors.code?.message}>
                <Input {...register("code")} placeholder="MATH101" />
              </FormField>

              <FormField label="Teacher" error={errors.teacher_id?.message}>
                <Controller
                  name="teacher_id"
                  control={control}
                  render={({ field }) => (
                    <Select
  value={field.value?.toString()}
  onValueChange={(value) => field.onChange(Number(value))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select teacher (optional)" />
  </SelectTrigger>
  <SelectContent>
    {teachers.map((teacher) => (
      <SelectItem key={teacher.id} value={teacher.id.toString()}>
        {teacher.name} ({teacher.employee_id})
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                  )}
                />
              </FormField>

              <FormField label="Class" error={errors.class_id?.message}>
                <Controller
                  name="class_id"
                  control={control}
                  render={({ field }) => (
                   <Select
  value={field.value?.toString()}
  onValueChange={(value) => field.onChange(Number(value))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select class (optional)" />
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

              <FormField label="Credits *" error={errors.credits?.message}>
                <Controller
                  name="credits"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="3"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
                />
              </FormField>

              <FormField label="Type *" error={errors.type?.message}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
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

              <FormField label="Description" error={errors.description?.message}>
                <Input {...register("description")} placeholder="Optional description" />
              </FormField>
            </Section>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : subject ? "Update Subject" : "Add Subject"}
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