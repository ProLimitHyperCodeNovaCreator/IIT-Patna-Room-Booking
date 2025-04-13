"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDemo() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchData(endpoint: string) {
    if (!session?.accessToken) {
      setError("You must be signed in to access protected data")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "X-User-Role": session.user.role || "user",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>API Demo</CardTitle>
          <CardDescription>Test the authentication with your Express backend</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="public">Public API</TabsTrigger>
              <TabsTrigger value="protected">Protected API</TabsTrigger>
              <TabsTrigger value="admin">Admin API</TabsTrigger>
            </TabsList>

            <TabsContent value="public" className="space-y-4">
              <p>This endpoint is accessible to everyone, even without authentication.</p>
              <Button onClick={() => fetchData("public")} disabled={loading}>
                {loading ? "Loading..." : "Fetch Public Data"}
              </Button>
            </TabsContent>

            <TabsContent value="protected" className="space-y-4">
              <p>This endpoint requires authentication but is available to all users.</p>
              <Button onClick={() => fetchData("protected")} disabled={loading || !session?.accessToken}>
                {loading ? "Loading..." : "Fetch Protected Data"}
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <p>This endpoint requires authentication AND admin role.</p>
              <Button onClick={() => fetchData("admin")} disabled={loading || !session?.accessToken}>
                {loading ? "Loading..." : "Fetch Admin Data"}
              </Button>
            </TabsContent>
          </Tabs>

          {error && <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {data && (
            <div className="p-4 mt-4 bg-gray-100 rounded-md">
              <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
