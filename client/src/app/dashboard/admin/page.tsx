"use client";
import React, { useState, useEffect } from "react";
import { get, post } from "@/services/apiEndPoints";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface IUser {
  role: "admin" | "user";
  email?: string;
  name?: string;
}

interface IAuthResponse {
  message?: string;
  user?: IUser;
}

interface IRoom {
  name: string;
  capacity: number;
  description: string;
  location: string;
}

interface IRoomResponse {
  message?: string;
  room?: IRoom;
  rooms?: IRoom[];
}

const Page: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [query, setQuery] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [roomCapacity, setRoomCapacity] = useState<number>(0);
  const [roomDescription, setRoomDescription] = useState<string>("");
  const [roomLocation, setRoomLocation] = useState<string>("");

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
            if (currentUser.role !== "admin") {
              router.push("/dashboard/user");
            }
            if (rooms.status === 200) {
              const roomRes = rooms.data as IRoomResponse;
              console.log(roomRes);
              setRooms(roomRes.rooms || []);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await post(`/admin/createRoom`, {
        name: roomName,
        capacity: roomCapacity,
        description: roomDescription,
        location: roomLocation,
      });
      console.log(response);
      if (response.status === 200) {
        const roomRes = response.data as IRoomResponse;
        const newRoom = roomRes.room;
        if (newRoom) {
          setRooms((prevRooms) => [...prevRooms, newRoom]);
        }
        setRoomName("");
        setRoomCapacity(0);
        setRoomDescription("");
        setRoomLocation("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {user?.name || "Admin"}!</p>

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

      <div className="w-full py-6">
        <h1 className="text-2xl font-bold mb-4">Create a room</h1>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <input
            onChange={(e) => setRoomName(e.target.value)}
            type="text"
            placeholder="Room name"
            className="border border-gray-300 rounded-md p-2 mr-2"
          />
          <input
            onChange={(e) => setRoomCapacity(parseInt(e.target.value))}
            type="number"
            placeholder="Capacity"
            className="border border-gray-300 rounded-md p-2 mr-2"
          />
          <input
            onChange={(e) => setRoomLocation(e.target.value)}
            type="text"
            placeholder="Location"
            className="border border-gray-300 rounded-md p-2 mr-2"
          />
          <textarea
            onChange={(e) => setRoomDescription(e.target.value)}
            name="description"
            placeholder="Description"
            className="border border-gray-300 rounded-md p-2 mt-2 w-full"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600"
          >
            Create
          </button>
        </form>
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
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>{room.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Capacity: {room.capacity}</p>
                  <p>{room.description}</p>
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
  );
};

export default Page;
