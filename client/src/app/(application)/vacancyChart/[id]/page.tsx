"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/services/apiEndPoints";
import { format } from "date-fns"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthProvider";

interface IBooking {
  id?: string;
  eventTitle?: string;
  eventDescription?: string;
  startDate?: Date;
  endDate?: Date;
  requestedBy?: {
    name?: string;
    email?: string;
  };
}

interface Iresponse{
  message?: string
  bookings?: IBooking[]
}

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const { loading } = useAuth() as { loading: boolean };
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await get(`/user/roomBookings/${id}`);
        const bookingData = bookings.data as Iresponse;
        const bookingsData = bookingData.bookings as IBooking[];
        setBookings(bookingsData);
      } catch (error) {
        // console.log(error);
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch bookings:", error);
        }
        router.push("/login");
      }finally{
        setLoad(false);
      }
    };

    fetchData();
  }, [router, id]);

  if (loading || load) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
          <span className="text-lg font-medium text-black">Loading bookings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-black hover:bg-gray-50 p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-light text-black tracking-tight">Room Schedule</h1>
            <p className="text-gray-600 font-light">View all confirmed bookings for this room</p>
          </div>
        </div>

        {/* Bookings */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <Card
                key={booking.id || index}
                className="border border-gray-100 shadow-none hover:shadow-sm transition-shadow duration-200"
              >
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-xl font-medium text-black mb-2">{booking.eventTitle}</h3>
                        <p className="text-gray-600 leading-relaxed">{booking.eventDescription}</p>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-black" />
                          <span className="text-gray-600">
                            {booking.startDate ? format(new Date(booking.startDate), "MMM dd, yyyy") : "—"}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {booking.startDate && booking.endDate
                            ? `${format(new Date(booking.startDate), "h:mm a")} - ${format(new Date(booking.endDate), "h:mm a")}`
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-black mb-1">Organizer</p>
                        <p className="text-gray-600">{booking.requestedBy?.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black mb-1">Contact</p>
                        <p className="text-gray-600 text-sm">{booking.requestedBy?.email || "—"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-light text-black mb-2">No Bookings Scheduled</h3>
              <p className="text-gray-600 font-light">This room has no confirmed bookings at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
