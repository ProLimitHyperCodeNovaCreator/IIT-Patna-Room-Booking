"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function SheetProvider() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!session) {
    return null
  }

  const initials = session.user?.name
    ? session.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <Sheet>
      <SheetTrigger asChild >
        <Button variant="secondary">View</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-2xl">IITP ARBA</SheetTitle>
          <div className="py-4 flex flex-col gap-4">
            <p className="text-md font-semibold">Home</p>
            <p className="text-md font-semibold">[Option 1]</p>
            <p className="text-md font-semibold">[option 2]</p>
            <p className="text-md font-semibold">[option 3]</p>
            <p className="text-md font-semibold">[option 4]</p>
            <p className="text-md font-semibold">[option 5]</p>
          </div>
        </SheetHeader>
        <SheetHeader>
        <Link href="/api/auth/signout"><Button variant="destructive">Sign out</Button></Link>
        </SheetHeader>
        <SheetFooter>
            <div className="flex gap-2 justify-start items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center gap-1 py-4">
                    <p className="text-md font-semibold">{user?.name}</p>
                    <p className="text-sm text-muted-foreground italic">{user?.email}</p>
                </div>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
