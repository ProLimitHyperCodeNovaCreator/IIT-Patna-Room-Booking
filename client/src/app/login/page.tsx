'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  const handleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER}/auth/google`;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account using Google</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => handleSignIn()} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Secure authentication powered by Google
        </CardFooter>
      </Card>
    </div>
  )
}