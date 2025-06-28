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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MapPin, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DeleteRoom } from "./dialogDelete";

interface IUser {
  role: "ADMIN" | "USER";
  email?: string;
  name?: string;
}

interface IAuthResponse {
  message?: string;
  user?: IUser;
}

interface IRoom {
  id: string;
  name: string;
  capacity: number;
  description: string[];
  location: string;
  isAvailable: boolean;
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
  const [roomDescription, setRoomDescription] = useState<string[]>([]);
  const [roomLocation, setRoomLocation] = useState<string>("");
  const [tagAdding, setTagAdding] = useState<boolean>(false);
  const [tag, setTag] = useState<string>("");
  const [checkBoxes, setCheckBoxes] = useState<string[]>([
    "AC Available",
    "Projector Available",
    "Whiteboard Available",
    "Computer Room",
    "Meeting Room",
    "Wifi Enabled",
    "TV Available",
    "Classroom",
  ]);

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
            if (currentUser.role !== "ADMIN") {
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
      if(
        roomName === "" ||
        roomCapacity === 0 ||
        roomDescription.length === 0 ||
        roomLocation === ""
      ){
        toast.error("Atleast fill all the neccesary details. Damm it!!");
        return;
      }
      const response = await post(`/admin/createRoom`, {
        name: roomName,
        capacity: roomCapacity,
        description: roomDescription,
        location: roomLocation,
      });
      console.log(response);
      if (response.status === 200) {
        const roomRes = response.data as IRoomResponse;
        const newRoom = roomRes.room as IRoom;
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        toast.success(
          <div className="p-2">
            <h1 className="text-lg ">Room created successfully</h1>
            <p className="text-sm ">Room details: {JSON.stringify(newRoom)}</p>
          </div>
        );
        setRoomName("");
        setRoomCapacity(0);
        setRoomDescription([]);
        setRoomLocation("");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error creating room: ${error}`);
    }
  };

  const handleAvailabilityChange = async (
    roomId: string,
    isAvailable: boolean
  ) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, isAvailable } : room))
    );
    try {
      const response = await post(`/admin/avaibilityChange`, {
        roomId,
        isAvailable,
      });
      console.log(response);
      if (response.status === 200) {
        const roomRes = response.data as IRoomResponse;
        const updatedRoom = roomRes.room;
        console.log(updatedRoom);
        if (updatedRoom?.isAvailable) {
          toast.success("Room is now available for booking");
        } else {
          toast.warning("The room set to not for booking");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error changing the room status: ${error}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-xl mb-8">Welcome, {user?.name || "Admin"}!</p>

      <div className="w-full py-6">
        <h1 className="text-2xl font-bold mb-4">Create a room</h1>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <input
            onChange={(e) => setRoomName(e.target.value)}
            type="text"
            placeholder="Room name"
            className="border border-gray-300 rounded-md p-2 mr-2 my-2"
          />
          <input
            onChange={(e) => setRoomCapacity(parseInt(e.target.value))}
            type="number"
            placeholder="Capacity"
            className="border border-gray-300 rounded-md p-2 mr-2 my-2"
          />
          <input
            onChange={(e) => setRoomLocation(e.target.value)}
            type="text"
            placeholder="Location"
            className="border border-gray-300 rounded-md p-2 mr-2 my-2"
          />
          {/* <textarea
            onChange={(e) => setRoomDescription(e.target.value)}
            name="description"
            placeholder="Description"
            className="border border-gray-300 rounded-md p-2 mt-2 w-full"
          ></textarea> */}
          <div className=" mb-4 flex gap-3 items-center flex-wrap">
            {checkBoxes.map((checkbox, index) => (
              <label key={index} className="flex items-center mt-2 mr-3">
                <Checkbox
                  checked={roomDescription.includes(checkbox)}
                  onCheckedChange={(checked) => {
                    setRoomDescription((prev) =>
                      checked
                        ? [...prev, checkbox]
                        : prev.filter((tag) => tag !== checkbox)
                    );
                  }}
                />
                <span className="ml-2">{checkbox}</span>
              </label>
            ))}

            {!tagAdding && (
              <div
                className="self-end text-base mt-2 ml-1 px-2 py-1 rounded-md text-purple-600 font-semibold cursor-pointer hover:text-purple-800 hover:bg-purple-100 transition-colors duration-200"
                onClick={() => setTagAdding(true)}
              >
                + Add tag
              </div>
            )}
          </div>

          {tagAdding && (
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="text"
                placeholder="New tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="max-w-sm"
              />
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                onClick={() => {
                  if (tag && !checkBoxes.includes(tag)) {
                    setCheckBoxes((prev) => [...prev, tag]);
                    setRoomDescription((prev) => [...prev, tag]);
                  }
                  setTag("");
                  setTagAdding(false);
                }}
              >
                Add
              </button>
            </div>
          )}
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
                  <CardTitle>
                    <div className="flex justify-between">
                      <h1 className="text-2xl font-bold">{room.name}</h1>
                      <div className="flex flex-col justify-center items-center">
                        <Switch
                          checked={room.isAvailable}
                          onCheckedChange={(checked) =>
                            handleAvailabilityChange(room.id, checked)
                          }
                          className="cursor-pointer"
                        ></Switch>
                        <p className="text-sm text-gray-500">
                          {room.isAvailable ? "" : "NA"}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex gap-2">
                    <MapPin /> {room.location}
                  </CardDescription>
                  <CardDescription className="flex gap-2">
                    <User />
                    {room.capacity} people
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {room.description && (
                    <div className="flex gap-1 flex-wrap">
                      {room.description.map((description, index) => (
                        <span
                          className="bg-blue-200 bg-opacity-10 px-2 py-1 rounded-full text-blue-600 border border-blue-600"
                          key={index}
                        >
                          {description}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <Button
                      className="cursor-pointer"
                      onClick={() => router.push(`/bookingDetails/${room.id}`)}
                    >
                      View Booking requests
                    </Button>
                    <DeleteRoom roomId={room.id} setRooms={setRooms} />
                  </div>
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
