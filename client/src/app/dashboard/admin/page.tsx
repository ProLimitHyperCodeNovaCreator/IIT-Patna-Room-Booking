import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

// Import the ExtendedSession type or define it here
interface ExtendedSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
  expires: string;
}

export default async function AdminDashboard() {
  // Pass authOptions to getServerSession and cast the result
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user has admin role (safely)
  const userRoles = session.user?.roles || [];
  if (!userRoles.includes("admin")) {
    redirect("/dashboard/user"); // Redirect non-admins
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {session.user?.name || "Admin"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total users: 42</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Last updated: Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>System performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Active sessions: 12</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}