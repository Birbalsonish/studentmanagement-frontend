"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

/* ================= Types ================= */

type Currency = "NPR" | "USD";

interface SettingsState {
  schoolName: string;
  academicYear: string;
  contactEmail: string;
  phone: string;
  currency: Currency;
  defaultClass: string;
  defaultSection: string;
  minAttendance: number;
  defaultFeeAmount: number;
  feeDueDay: number;
  lateFee: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    schoolName: "",
    academicYear: "2024-2025",
    contactEmail: "",
    phone: "",
    currency: "NPR",
    defaultClass: "10",
    defaultSection: "A",
    minAttendance: 75,
    defaultFeeAmount: 0,
    feeDueDay: 10,
    lateFee: 0,
    notificationsEnabled: true,
    darkMode: false,
  });

  const handleChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    // later → API / localStorage
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6 max-w-5xl">
        <h1 className="text-2xl font-semibold">Settings</h1>

        {/* Institute Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Institute Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="School Name">
              <Input
                value={settings.schoolName}
                onChange={(e) =>
                  handleChange("schoolName", e.target.value)
                }
              />
            </Field>

            <Field label="Academic Year">
              <Input
                value={settings.academicYear}
                onChange={(e) =>
                  handleChange("academicYear", e.target.value)
                }
              />
            </Field>

            <Field label="Contact Email">
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  handleChange("contactEmail", e.target.value)
                }
              />
            </Field>

            <Field label="Phone Number">
              <Input
                value={settings.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            </Field>

            <Field label="Currency">
              <Select
                value={settings.currency}
                onValueChange={(v) =>
                  handleChange("currency", v as Currency)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NPR">NPR (₨)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* Academic Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Default Class">
              <Input
                value={settings.defaultClass}
                onChange={(e) =>
                  handleChange("defaultClass", e.target.value)
                }
              />
            </Field>

            <Field label="Default Section">
              <Input
                value={settings.defaultSection}
                onChange={(e) =>
                  handleChange("defaultSection", e.target.value)
                }
              />
            </Field>

            <Field label="Minimum Attendance (%)">
              <Input
                type="number"
                value={settings.minAttendance}
                onChange={(e) =>
                  handleChange("minAttendance", Number(e.target.value))
                }
              />
            </Field>
          </CardContent>
        </Card>

        {/* Fees Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Fees Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Default Fee Amount">
              <Input
                type="number"
                value={settings.defaultFeeAmount}
                onChange={(e) =>
                  handleChange(
                    "defaultFeeAmount",
                    Number(e.target.value)
                  )
                }
              />
            </Field>

            <Field label="Fee Due Day (Monthly)">
              <Input
                type="number"
                value={settings.feeDueDay}
                onChange={(e) =>
                  handleChange("feeDueDay", Number(e.target.value))
                }
              />
            </Field>

            <Field label="Late Fee Amount">
              <Input
                type="number"
                value={settings.lateFee}
                onChange={(e) =>
                  handleChange("lateFee", Number(e.target.value))
                }
              />
            </Field>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleField
              label="Enable Notifications"
              value={settings.notificationsEnabled}
              onChange={(v) =>
                handleChange("notificationsEnabled", v)
              }
            />

            <Separator />

            <ToggleField
              label="Dark Mode"
              value={settings.darkMode}
              onChange={(v) => handleChange("darkMode", v)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </main>
    </div>
  );
}

/* ================= Helpers ================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 max-w-md">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between max-w-md">
      <Label>{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
