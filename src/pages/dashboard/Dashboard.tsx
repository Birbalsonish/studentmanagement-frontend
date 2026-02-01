import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, ClipboardCheck, Wallet } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value="1,245" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Teachers" value="78" icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Today's Attendance" value="92%" icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Pending Fees" value="NRS 1,20,000" icon={<Wallet className="h-5 w-5" />} />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
