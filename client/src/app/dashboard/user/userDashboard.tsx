"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"

// Define the extended session type to match your backend
interface ExtendedSession extends Session {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    roles?: string[]
  }
}

// Props interface using the extended session type
interface UserDashboardProps {
  session?: ExtendedSession
}

export default function UserDashboard({ session: propSession }: UserDashboardProps) {
  // Get session from useSession hook if not provided as prop
  const { data: hookSession } = useSession()

  // Cast the hook session to our extended type and use prop session if provided
  const session = propSession || (hookSession as unknown as ExtendedSession)

  const [query, setQuery] = useState<string>("")

  // Log user roles when component mounts - with improved debugging
  useEffect(() => {
    if (session) {
      console.log("Full session object:", JSON.stringify(session, null, 2))
      console.log("User object:", JSON.stringify(session.user, null, 2))

      // Access roles directly after casting
      const roles = session.user?.roles
      console.log("User roles:", roles)

      // Check if user has specific roles
      if (roles?.includes("admin")) {
        console.log("User has admin privileges")
      }

      // Check if roles is defined but empty
      if (roles && roles.length === 0) {
        console.log("Roles array exists but is empty")
      }

      // Check if roles is undefined
      if (roles === undefined) {
        console.log("Roles property is undefined")
      }
    } else {
      console.log("No session available")
    }
  }, [session])

  // If no session is available yet, show a loading state
  if (!session) {
    return <div>Loading user data...</div>
  }

  const rooms: string[] = [
    "Exhibition room",
    "Yoga room",
    "CLH",
    "Kelvin room",
    "Tutorial Room",
    "Classroom",
    "Conference room",
    "Meeting room",
    "Seminar room",
    "Lecture hall",
    "Auditorium",
    "Library",
    "Computer lab",
    "Physics lab",
    "Chemistry lab",
    "Biology lab",
    "Engineering workshop",
    "Design studio",
    "Art studio",
    "Music room",
  ]

  const filteredRooms = rooms.filter((room) => room.toLowerCase().includes(query.toLowerCase()))

  // Safely access roles with proper casting
  const userRoles = session.user?.roles || []

  // Check if user has admin role
  const isAdmin = userRoles.includes("admin")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {session.user?.name || "User"}!</p>

      <div className="w-full mb-3">
        <Card>
          <CardHeader>
            <CardTitle>My Activities</CardTitle>
            <CardDescription>Recent actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Last login: Today</p>
            <p>Email: {session.user?.email || "No email available"}</p>
            {userRoles.length > 0 ? (
              <div>
                <p>Roles: {userRoles.join(", ")}</p>
                {isAdmin && <p className="text-green-600 font-medium mt-2">You have administrator privileges</p>}
              </div>
            ) : (
              <p>Roles: No roles assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col items-start mt-4">
        <div className="flex gap-2 items-center w-full max-w-md mb-4">
          <Search className="w-6 h-6" />
          <Input onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search rooms" />
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 w-full">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <Card key={room} className="w-full mb-2">
                <CardHeader>
                  <CardTitle>{room}</CardTitle>
                  <CardDescription>Available</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Room details and booking options</p>
                  {isAdmin && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-blue-600">Admin options available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center font-bold text-xl">
              No such rooms found or they are not for booking :(
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
