
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SharedDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
