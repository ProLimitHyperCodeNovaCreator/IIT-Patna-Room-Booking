"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  const handleSignIn = () => {
    // Force Microsoft to show the account picker every time
    signIn("azure-ad", {
      callbackUrl: "/",
      prompt: "select_account", // This forces the account selection screen
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account using Microsoft</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSignIn} className="w-full">
            Sign in with Microsoft
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Secure authentication powered by Microsoft
        </CardFooter>
      </Card>
    </div>
  )
}
