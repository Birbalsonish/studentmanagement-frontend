// src/components/common/NepaliDatePickerField.tsx

import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface NepaliDatePickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
}

// Nepali months with correct days
const nepaliMonths = [
  { name: "बैशाख", days: 31 },
  { name: "जेठ", days: 31 },
  { name: "असार", days: 31 },
  { name: "श्रावण", days: 32 },
  { name: "भदौ", days: 31 },
  { name: "असोज", days: 30 },
  { name: "कार्तिक", days: 29 },
  { name: "मंसिर", days: 30 },
  { name: "पौष", days: 29 },
  { name: "माघ", days: 30 },
  { name: "फाग", days: 29 },
  { name: "चैत्र", days: 30 },
];

export function NepaliDatePickerField<T extends FieldValues>({
  name,
  control,
  label,
  error,
}: NepaliDatePickerFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2081);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const daysInCurrentMonth = nepaliMonths[selectedMonth - 1].days;

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start font-normal w-full"
              >
                {field.value ? field.value : "Select Nepali date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 space-y-4 bg-background">
                {/* Year and Month Selection */}
                <div className="flex gap-2">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="border rounded px-1.5 py-0.5 text-sm flex-1 bg-background text-foreground"
                  >
                    {Array.from({ length: 91 }, (_, i) => 2000 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border rounded px-1.5 py-0.5 text-sm flex-1 bg-background text-foreground"
                  >
                    {nepaliMonths.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map(
                    (day) => (
                      <button
                        key={day}
                        onClick={() => {
                          const formattedDate = `${selectedYear}-${String(
                            selectedMonth
                          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          field.onChange(formattedDate);
                          setOpen(false);
                        }}
                        className="w-8 h-8 text-sm border rounded hover:bg-blue-500 hover:text-white transition"
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>

                {/* Format helper */}
                <p className="text-xs text-muted-foreground">Format: YYYY-MM-DD</p>
              </div>
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}