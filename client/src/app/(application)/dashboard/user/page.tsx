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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Calendar, Eye, Loader2, Laugh } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";

interface IUser {
  role: "ADMIN" | "USER";
  email?: string;
  name?: string;
}

interface IRoomResponse {
  message: string;
  rooms: IRoom[];
}

interface IRoom {
  id: string;
  name: string;
  capacity: number;
  description: string[];
  location: string;
  isAvailable: boolean;
}

const Page: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth() as { user: IUser | null; loading: boolean };
  const [query, setQuery] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rooms = await get("/user/rooms");
        if(rooms.status !== 200) {
          throw new Error("Failed to fetch rooms");
        }else{
          const roomRes = rooms.data as IRoomResponse;
          setRooms(roomRes.rooms);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch rooms. Please try again later.");
      }finally{
        setLoad(false);
      }
    };

    fetchData();
  }, [router]);
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(query.toLowerCase())
  );

  const AvailabilityBadge = ({ isAvailable }: { isAvailable: boolean }) => (
    <Badge
      variant="outline"
      className={`${
        isAvailable
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      } font-medium`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          isAvailable ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </Badge>
  );

  const RoomCard = ({ room }: { room: IRoom }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors">
            {room.name}
          </CardTitle>
          <AvailabilityBadge isAvailable={room.isAvailable} />
        </div>

        <div className="space-y-2">
          <CardDescription className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            {room.location}
          </CardDescription>
          <CardDescription className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-gray-500" />
            Up to {room.capacity} people
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {room.description && room.description.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.description.map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-normal"
              >
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-3">
        <Button
          disabled={!room.isAvailable}
          onClick={() => router.push(`/roomBook/${room.id}`)}
          className={`flex-1 font-medium transition-all duration-200 ${
            room.isAvailable
              ? "bg-black hover:bg-gray-800 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
          }`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {room.isAvailable ? "Book Now" : "Unavailable"}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push(`/vacancyChart/${room.id}`)}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Schedule
        </Button>
      </CardFooter>
    </Card>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-6">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No rooms found
      </h3>
      <p className="text-gray-500 max-w-md">
        {query
          ? `No rooms match "${query}". Try adjusting your search terms.`
          : "No rooms are available for booking at the moment."}
      </p>
    </div>
  );

  if (loading || load) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600 font-medium">
              Loading dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Laugh className="inline-block h-8 w-8 mr-2" />
            User Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back,{" "}
            <span className="font-semibold text-gray-900">
              {user?.name || "User"}
            </span>
            !
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search rooms..."
              className="pl-10 border-gray-300 focus:border-gray-400 focus:ring-gray-400 bg-white"
              value={query}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Rooms
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.length}
                  </p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Available Now
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {rooms.filter((room) => room.isAvailable).length}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Capacity
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.reduce((sum, room) => sum + room.capacity, 0)}
                  </p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
