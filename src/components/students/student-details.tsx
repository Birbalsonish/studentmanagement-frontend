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
import { useEffect } from "react"

interface Student {
  id: number;
  name: string;
  class: string;
  rollNo: number;
  status: "Active" | "Inactive";
}

interface ManageStudentProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  student?: Student | null
}

/* ================= YUP VALIDATION SCHEMA ================= */
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  dob: yup.date().required("Date of birth is required"),
  studentId: yup.string().required("Student ID is required"),
})

type FormData = yup.InferType<typeof schema>

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
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (student) {
      setValue("fullName", student.name)
      setValue("studentId", String(student.rollNo))
    } else {
      reset()
    }
  }, [student, setValue, reset])

  const onSubmit = (data: FormData) => {
    if (student) {
      console.log("Update Student:", { ...student, ...data })
    } else {
      console.log("Create Student:", data)
    }
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{student ? "Edit Student" : "Add Student"}</SheetTitle>
          <SheetDescription>
            {student ? "Update the student details below." : "Fill in the student details below."}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ================= Student Details ================= */}
            <Section title="Student Details">
              <FormField label="Full Name" error={errors.fullName?.message}>
                <Input {...register("fullName")} />
              </FormField>

              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register("email")} />
              </FormField>

              <FormField label="Phone Number" error={errors.phone?.message}>
                <Input {...register("phone")} />
              </FormField>

              <FormField label="Date of Birth" error={errors.dob?.message}>
                <Input type="date" {...register("dob")} />
              </FormField>

              <FormField label="Student ID" error={errors.studentId?.message}>
                <Input {...register("studentId")} />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">{student ? "Update Student" : "Save Student"}</Button>
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

/* ================= Helper Components ================= */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
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