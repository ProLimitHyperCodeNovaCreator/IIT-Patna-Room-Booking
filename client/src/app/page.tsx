import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Route based on user role
  if (session.user.role === "admin") {
    redirect("/dashboard/admin")
  } else {
    redirect("/dashboard/user")
  }

  // This will never be rendered
  return null
}
