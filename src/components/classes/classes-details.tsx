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
import type { Class } from "@/lib/types";
import { classService, teacherService } from "@/lib/api";

interface ManageClassProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: Class | null;
  onSuccess?: () => void;
}

// Updated schema to match Laravel backend
const schema = yup.object({
  name: yup.string().required("Class name is required"),
  section: yup.string().optional(),
  teacher_id: yup.number().optional().positive(),
  capacity: yup.number().required("Capacity is required").positive(),
  room_number: yup.string().optional(),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
  description: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageClassDetails({
  isOpen,
  onOpenChange,
  classData,
  onSuccess,
}: ManageClassProps) {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);

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
      capacity: 30,
    },
  });

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teacherService.getAll();
        const teachersData = response.data.data.data || response.data.data;
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (classData) {
      reset({
        name: classData.name,
        section: classData.section || "",
        teacher_id: classData.teacher_id,
        capacity: classData.capacity,
        room_number: classData.room_number || "",
        status: classData.status,
        description: classData.description || "",
      });
    } else {
      reset({
        status: "Active",
        capacity: 30,
      });
    }
  }, [classData, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const submitData = {
        name: data.name,
        section: data.section || null,
        teacher_id: data.teacher_id || null,
        capacity: Number(data.capacity),
        room_number: data.room_number || null,
        status: data.status,
        description: data.description || null,
      };

      if (classData) {
        await classService.update(classData.id, submitData);
        alert("Class updated successfully!");
      } else {
        await classService.create(submitData);
        alert("Class created successfully!");
      }

      reset();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving class:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(classData ? "Failed to update class" : "Failed to create class");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{classData ? "Edit Class" : "Add Class"}</SheetTitle>
          <SheetDescription>
            {classData
              ? "Update the class details below."
              : "Fill in the class details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Class Details">
              <FormField label="Class Name *" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Grade 10" />
              </FormField>

              <FormField label="Section" error={errors.section?.message}>
                <Input {...register("section")} placeholder="A, B, C, etc." />
              </FormField>

              <FormField label="Class Teacher" error={errors.teacher_id?.message}>
                <Controller
                  name="teacher_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher (optional)" />
                      </SelectTrigger>
                      <SelectContent>
  {teachers.map((teacher) => (
    <SelectItem
      key={teacher.id}
      value={teacher.id.toString()}
    >
      {teacher.name} ({teacher.employee_id})
    </SelectItem>
  ))}
</SelectContent>

                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Capacity *" error={errors.capacity?.message}>
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="30"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  )}
                />
              </FormField>

              <FormField label="Room Number" error={errors.room_number?.message}>
                <Input {...register("room_number")} placeholder="Room 101" />
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
                {loading ? "Saving..." : classData ? "Update Class" : "Add Class"}
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