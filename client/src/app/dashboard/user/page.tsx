"use client";
import React, { useState, useEffect } from "react";
import { get } from "@/services/apiEndPoints";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MapPin, User } from 'lucide-react';

interface IUser {
  role: "admin" | "user";
  email?: string;
  name?: string;
}

interface IAuthResponse {
  message?: string;
  user?: IUser;
}

interface IRoomResponse {
  message: string;
  rooms: IRoom[];
}

interface IRoom {
  name: string;
  capacity: number;
  description: string[];
  location: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [query, setQuery] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, rooms] = await Promise.all([
          get("/auth/token"),
          get("/user/rooms"),
        ]);

        if (response.status === 200) {
          const request = response.data as IAuthResponse;
          const currentUser = request.user;

          if (currentUser) {
            if (rooms.status === 200) {
              console.log(rooms);
              const roomRes = rooms.data as IRoomResponse;
              setRooms(roomRes.rooms);
            }
            setUser(currentUser);
          }
        } else if (response.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {user?.name || "User"}!</p>

      <div className="w-full mb-3">
        <Card>
          <CardHeader>
            <CardTitle>My Activities</CardTitle>
            <CardDescription>Recent actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Last login: Today</p>
            <p>Email: {user?.email || "No email available"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col items-start mt-4">
        <div className="flex gap-2 items-center w-full max-w-md mb-4">
          <Search className="w-6 h-6" />
          <Input
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search rooms"
          />
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 w-full">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <Card key={room.name}>
                <CardHeader>
                  <CardTitle className="mb-2"><h1 className="text-2xl">{room.name}</h1></CardTitle>
                  <CardDescription className="flex gap-2"><MapPin/> {room.location}</CardDescription>
                  <CardDescription className="flex gap-2"><User/> {room.capacity} people</CardDescription>
                </CardHeader>
                <CardContent>
                  {room.description && (
                    <div className="flex gap-1 flex-wrap">
                      {room.description.map((description, index) => (
                        <span className="bg-blue-200 bg-opacity-10 px-2 py-1 rounded-full text-blue-600 border border-blue-600" key={index}>{description}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-start gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`/booking/${room.name}`)}
                  >
                    Book Now
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`/booking/${room.name}`)}
                  >
                    See Vacancy Chart
                  </button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center font-bold text-xl">
              No such rooms found or they are not for booking :&#40;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
