"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get, post } from "@/services/apiEndPoints";
import { toast } from "sonner";
import { Calendar, Clock, Mail, User, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthProvider";

interface IUser {
  role: "ADMIN" | "USER";
  email?: string;
  name?: string;
  id?: string;
}

interface IBookResponse {
  message?: string;
  bookings?: IBooking[];
}

interface IBooking {
  id: string;
  eventTitle?: string;
  eventDescription?: string;
  startDate?: Date;
  endDate?: Date;
  requestedBy?: {
    name?: string;
    email?: string;
  };
}

const Page: React.FC = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { id } = useParams();
  const { user, loading } = useAuth() as { user: IUser | null, loading: boolean };
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const Bookresponse = await get(`/admin/requestedBookings/${id}`);
        const Bookrequest = Bookresponse.data as IBookResponse;
        const data = Bookrequest.bookings as IBooking[];
        setBookings(data);
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load booking requests")
      }finally{
        setLoad(false)
      }
    };

    FetchData();
  }, [router, id]);

  if (!user || user.role !== "ADMIN") {
    toast.error("Unauthorized access");
    router.push("/dashboard/user");
    return null; // Prevent rendering if unauthorized
  }

  const handleDecline = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const response = await post(`/admin/declineBooking`, { bookingId })
      if (response.status === 200) {
        toast.success("Booking request declined")
        // Refresh bookings
        const bookingResponse = await get(`/admin/requestedBookings/${id}`)
        const bookingRequest = bookingResponse.data as IBookResponse
        setBookings(bookingRequest.bookings || [])
      } else {
        toast.error("Failed to decline booking")
      }
    } catch (error) {
      console.error("Error declining booking:", error)
      toast.error("Failed to decline booking")
    } finally {
      setProcessingId(null)
    }
  }

  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const response = await post(`/admin/acceptBooking`, { bookingId })
      if (response.status === 200) {
        toast.success("Booking request accepted")
        // Refresh bookings
        const bookingResponse = await get(`/admin/requestedBookings/${id}`)
        const bookingRequest = bookingResponse.data as IBookResponse
        setBookings(bookingRequest.bookings || [])
      } else {
        toast.error("Failed to accept booking")
      }
    } catch (error) {
      console.error("Error accepting booking:", error)
      toast.error("Failed to accept booking")
    } finally {
      setProcessingId(null)
    }
  }
  if (loading || load) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
          <span className="text-lg font-medium text-black">Loading requests...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
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
            <h1 className="text-3xl font-light text-black tracking-tight">Booking Requests</h1>
            <p className="text-gray-600 font-light">Review and manage room booking requests</p>
          </div>
        </div>

        {/* Booking Requests */}
        {bookings.length > 0 ? (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="border border-gray-100 shadow-none hover:shadow-sm transition-shadow duration-200"
              >
                <CardContent className="p-8">
                  {/* Event Title */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-light text-black mb-2">{booking.eventTitle}</h2>
                    <p className="text-gray-600 leading-relaxed">{booking.eventDescription}</p>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-black mb-1">Start Time</p>
                          <p className="text-gray-600">
                            {new Date(booking.startDate!).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-black mb-1">End Time</p>
                          <p className="text-gray-600">
                            {new Date(booking.endDate!).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-black mb-1">Requested By</p>
                          <p className="text-gray-600">{booking.requestedBy?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-black mb-1">Email</p>
                          <p className="text-gray-600">{booking.requestedBy?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(booking.id)}
                      disabled={processingId === booking.id}
                      className="border-gray-200 text-black hover:bg-gray-50 font-normal"
                    >
                      {processingId === booking.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Decline
                    </Button>

                    <Button
                      onClick={() => handleAccept(booking.id)}
                      disabled={processingId === booking.id}
                      className="bg-black text-white hover:bg-gray-800 font-normal"
                    >
                      {processingId === booking.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Accept
                    </Button>
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
              <h3 className="text-xl font-light text-black mb-2">No Pending Requests</h3>
              <p className="text-gray-600 font-light">All booking requests have been processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
