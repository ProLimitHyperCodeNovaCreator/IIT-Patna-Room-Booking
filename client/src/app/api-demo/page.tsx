"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {get} from "@/services/apiEndPoints"
import { useRouter } from "next/navigation"

export default function ApiDemo() {
  const router = useRouter();
  const [user, setUser] = useState<null | { id?: string; role?: string; name?: string; email?: string }>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  type AuthResponse = {
    message?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    };
  };

  useEffect(() => {
      get("/api/auth/token")
        .then((res) => {
          const response = res?.data as AuthResponse;
          const user = response.user;
          if (!user) {
            router.push("/login");
          } else {
            setUser(user);
          }
        })
        .catch(() => {
          router.push("/login");
        });
    },[]);

  async function fetchData(endpoint: string) {

    if (!user || !user?.id) {
      setError("You must be signed in to access protected data")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await get(`/api/${endpoint}`)

      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: ${response.data.message || "Unknown error"}`)
      }

      const result = await response.data;
      setResult(result)
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
              <Button onClick={() => fetchData("protected")} disabled={loading || !user?.id}>
                {loading ? "Loading..." : "Fetch Protected Data"}
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <p>This endpoint requires authentication AND admin role.</p>
              <Button onClick={() => fetchData("admin")} disabled={loading || !user?.id || user?.role !== "admin"}>
                {loading ? "Loading..." : "Fetch Admin data"}
              </Button>
            </TabsContent>
          </Tabs>

          {error && <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {user && (
            <div className="p-4 mt-4 bg-gray-100 rounded-md">
              <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
