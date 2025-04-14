'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";
import { useState } from "react";

interface userDashboardProps{
  session:{
    user:{
      name?:string,
      email?:string,
      image?:string
    }
  }
}

export default function UserDashboard({session}: userDashboardProps) {
  const [query, setQuery] = useState<string>("");
  const rooms: string[] = ["Exhibition room", "Yoga room", "CLH", "Kelvin room", "Tutorial Room", "Classroom", "Conference room", "Meeting room", "Seminar room", "Lecture hall", "Auditorium", "Library", "Computer lab", "Physics lab", "Chemistry lab", "Biology lab", "Engineering workshop", "Design studio", "Art studio", "Music room"];
  const filteredRooms = rooms.filter((room)=> 
    room.toLowerCase().startsWith(query.toLocaleLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {session.user.name || "User"}!</p>

      <div className="w-full mb-3">
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
      <div className="w-full flex flex-col items-start mt-4">
        <div className="flex gap-2 justofy-center items-center w-full max-w-md mb-4">
          <Search className="w-8 h-8"></Search>
          <Input onChange={(e) => {setQuery(e.target.value)}} type="text" placeholder="Search"></Input>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 w-full">
          {filteredRooms.length>0 ? filteredRooms.map((room)=>(
            <Card key={room} className="w-full mb-2">
              <CardHeader>
                <CardTitle>{room}</CardTitle>
                <CardDescription>Available</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Room details and booking options</p>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center font-bold text-xl">No such rooms found or they are not for booking :&#x28;</div>
          )}
        </div>
      </div>
    </div>
  )
}
