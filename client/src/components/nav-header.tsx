"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SheetProvider from "@/components/sheetProvider";

type ExtendedSession = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
}

export function NavHeader() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  // Cast session to our extended type
  const extendedSession = session as unknown as ExtendedSession;
  
  const initials = extendedSession.user?.name
    ? extendedSession.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U";

  // Check if user has admin role
  const isAdmin = extendedSession.user?.roles?.includes("admin");

  const handleSignOut = () => {
    // Sign out completely and redirect to sign-in page
    signOut({
      callbackUrl: "/auth/signin",
      redirect: true,
    });
  };

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <SheetProvider></SheetProvider>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/dashboard/admin">
              <Button variant="ghost">Admin Dashboard</Button>
            </Link>
          )}

          <Link href="/dashboard/user">
            <Button variant="ghost">User Dashboard</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={extendedSession.user.image || ""} alt={extendedSession.user.name || "User"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{extendedSession.user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{extendedSession.user.email}</p>
                  {isAdmin && (
                    <p className="text-xs leading-none text-muted-foreground mt-1">Role: Admin</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}