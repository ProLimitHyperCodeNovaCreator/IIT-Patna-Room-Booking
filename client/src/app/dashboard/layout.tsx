import type React from "react"
import { NavHeader } from "../../components/nav-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavHeader />
      <main>{children}</main>
    </div>
  )
}
