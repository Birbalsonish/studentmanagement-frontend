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
import type { Fee } from "@/lib/types";
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";

interface ManageFeeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fee?: Fee | null;
}

const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  studentId: yup.number().required("Student ID is required"),
  amount: yup.number().required("Amount is required").min(0),
  dueDate: yup.string().required("Due date is required"),
  status: yup.string().oneOf(["Paid", "Pending", "Overdue"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageFeeDetails({
  isOpen,
  onOpenChange,
  fee,
}: ManageFeeProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "Pending",
    },
  });

  useEffect(() => {
    if (fee) {
      reset({
        studentName: fee.studentName,
        studentId: fee.studentId,
        amount: fee.amount,
        dueDate: fee.dueDate,
        status: fee.status,
      });
    } else {
      reset({
        status: "Pending",
      });
    }
  }, [fee, reset]);

  const onSubmit = (data: FormData) => {
    if (fee) {
      console.log("Update Fee:", { ...fee, ...data });
    } else {
      console.log("Create Fee:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
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
            <Section title="Fee Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} placeholder="Student name" />
              </FormField>

              <FormField label="Student ID" error={errors.studentId?.message}>
                <Input 
                  type="number" 
                  {...register("studentId")} 
                  placeholder="Student ID" 
                />
              </FormField>

              <FormField label="Amount (NPR)" error={errors.amount?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rs.
                  </span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register("amount")} 
                    placeholder="0.00"
                    className="pl-12"
                  />
                </div>
              </FormField>

              <NepaliDatePickerField
                name="dueDate"
                control={control}
                label="Due Date (Nepali)"
                error={errors.dueDate?.message}
              />

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
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">
                {fee ? "Update" : "Save"} Fee
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