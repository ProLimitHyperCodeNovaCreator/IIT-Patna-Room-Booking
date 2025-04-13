import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>
        <p className="text-xl mb-8 text-center">Welcome, {session?.user?.name || "User"}!</p>
        <div className="flex justify-center">
          <Link href="/api/auth/signout">
            <Button>Sign Out</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
