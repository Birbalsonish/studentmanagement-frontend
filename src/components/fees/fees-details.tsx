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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ManageFeesProps {
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
  feeType: yup.string().required("Fee type is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  paymentDate: yup.string().required("Payment date is required"),
  paymentStatus: yup.string().required("Payment status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageFeesDetails({
  isOpen,
  onOpenChange,
}: ManageFeesProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Fees Data:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Add / Collect Fees</SheetTitle>
          <SheetDescription>
            Enter student fee payment details below.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Fees Details">
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

              <FormField label="Fee Type" error={errors.feeType?.message}>
                <Select onValueChange={(value) => setValue("feeType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tuition">Tuition</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Amount (NRS)" error={errors.amount?.message}>
                <Input type="number" {...register("amount")} />
              </FormField>

              <FormField
                label="Payment Date"
                error={errors.paymentDate?.message}
              >
                <Input type="date" {...register("paymentDate")} />
              </FormField>

              <FormField
                label="Payment Status"
                error={errors.paymentStatus?.message}
              >
                <Select
                  onValueChange={(value) =>
                    setValue("paymentStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">Save Fees</Button>
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
