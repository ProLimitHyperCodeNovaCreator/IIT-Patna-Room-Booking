import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UserDashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {session.user.name || "User"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Email: {session.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Activities</CardTitle>
            <CardDescription>Recent actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Last login: Today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
