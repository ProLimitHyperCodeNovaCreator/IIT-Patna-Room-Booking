"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/services/apiEndPoints";
import { toast } from "sonner";
import { getBookings } from "@/lib/bookingsRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";

interface IBookings {
  id: string;
  room: IRoom;
  eventTitle: string;
  eventDescription: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  startDate: Date;
  endDate: Date;
}

interface IRoom {
  name: string;
}
const Page: React.FC = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBookings[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await get("/auth/token");
        if (response.status === 401) {
          toast.error("You need to login");
          router.push("/login");
          return;
        }
        const bookingsData = await getBookings();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings" + error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);
  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-gray-100 text-gray-800 border-gray-200",
      APPROVED: "bg-black text-white border-black",
      REJECTED: "bg-gray-900 text-white border-gray-900",
    };

    return (
      <Badge
        className={`${variants[status as keyof typeof variants]} font-medium`}
      >
        {status.toLowerCase()}
      </Badge>
    );
  };

  const renderBookingCard = (booking: IBookings) => (
    <Card
      key={booking.id}
      className="mb-6 border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white"
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {booking.eventTitle}
            </CardTitle>
            <CardDescription className="text-gray-600 leading-relaxed">
              {booking.eventDescription}
            </CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{booking.room.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>
              {new Date(booking.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {new Date(booking.startDate).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
              {" - "}
              {new Date(booking.endDate).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="h-12 w-12 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Requests
          </h1>
          <p className="text-gray-600">
            Manage and track your room booking requests
          </p>
        </div>

        {bookings.length === 0 ? (
          renderEmptyState("No bookings found")
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1 rounded-lg mb-8">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600 font-medium transition-all duration-200"
              >
                Pending ({bookings.filter((b) => b.status === "PENDING").length}
                )
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600 font-medium transition-all duration-200"
              >
                Approved (
                {bookings.filter((b) => b.status === "APPROVED").length})
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-600 font-medium transition-all duration-200"
              >
                Rejected (
                {bookings.filter((b) => b.status === "REJECTED").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-0">
              {bookings.filter((booking) => booking.status === "PENDING")
                .length === 0 ? (
                renderEmptyState("No pending bookings")
              ) : (
                <div className="space-y-0">
                  {bookings
                    .filter((booking) => booking.status === "PENDING")
                    .map(renderBookingCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-0">
              {bookings.filter((booking) => booking.status === "APPROVED")
                .length === 0 ? (
                renderEmptyState("No approved bookings")
              ) : (
                <div className="space-y-0">
                  {bookings
                    .filter((booking) => booking.status === "APPROVED")
                    .map(renderBookingCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              {bookings.filter((booking) => booking.status === "REJECTED")
                .length === 0 ? (
                renderEmptyState("No rejected bookings")
              ) : (
                <div className="space-y-0">
                  {bookings
                    .filter((booking) => booking.status === "REJECTED")
                    .map(renderBookingCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Page;
