"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

interface ManageResultProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/* ================= YUP VALIDATION SCHEMA ================= */
const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  rollNo: yup.string().required("Roll number is required"),
  examName: yup.string().required("Exam name is required"),
  totalMarks: yup.number().required("Total marks are required"),
  resultStatus: yup.string().required("Result status is required"),
})

type FormData = yup.InferType<typeof schema>

export default function ManageResultDetails({
  isOpen,
  onOpenChange,
}: ManageResultProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log("Result Data:", data)
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Add Result</SheetTitle>
          <SheetDescription>
            Enter the student result details.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Result Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} />
              </FormField>

              <FormField label="Roll Number" error={errors.rollNo?.message}>
                <Input {...register("rollNo")} />
              </FormField>

              <FormField label="Exam Name" error={errors.examName?.message}>
                <Input placeholder="Midterm / Final" {...register("examName")} />
              </FormField>

              <FormField label="Total Marks" error={errors.totalMarks?.message}>
                <Input type="number" {...register("totalMarks")} />
              </FormField>

              <FormField label="Result Status" error={errors.resultStatus?.message}>
                <Input placeholder="Pass / Fail" {...register("resultStatus")} />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">Save Result</Button>
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
  )
}

/* ================= Helpers ================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
