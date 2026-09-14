
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function SharedDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<any>
}) {
  // Unwrap async params for Next.js 15 Server Component
  await params;
  
  return <DashboardLayout>{children}</DashboardLayout>
}
