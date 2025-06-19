"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get, post } from "@/services/apiEndPoints";
import { toast } from "sonner";
import { Calendar, Clock, Mail, User } from "lucide-react";

interface IUser {
  role: "ADMIN" | "USER";
  email?: string;
  name?: string;
  id?: string;
}

interface IAuthResponse {
  message?: string;
  user?: IUser;
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
  const { id } = useParams();
  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await get("/auth/token");
        const request = response.data as IAuthResponse;
        if (response.status === 401) {
          toast.error("You need to login");
          router.push("/login");
        } else if (request.user?.role !== "ADMIN") {
          toast.error("You are not authorized to view this page");
          router.push("/dashboard/user");
        } else {
          const response = await get(`/admin/requestedBookings/${id}`);
          const request = response.data as IBookResponse;
          const data = request.bookings as IBooking[];
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/login"); // fallback in case of fetch failure
      }
    };

    FetchData();
  }, [router, id]);

  const handleDecline = async (bookingId: string) => {
    try {
      const response = await post(`/admin/declineBooking`, { bookingId });
      if (response.status === 200) {
        console.log("Booking declined successfully");
        const response = await get(`/admin/requestedBookings/${id}`);
        const request = response.data as IBookResponse;
        const data = request.bookings as IBooking[];
        setBookings(data);
      } else {
        console.log(
          "Error declining booking:",
          response.data || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      const response = await post(`/admin/acceptBooking`, { bookingId });
      if (response.status === 200) {
        console.log("Booking accepted successfully");
        const response = await get(`/admin/requestedBookings/${id}`);
        const request = response.data as IBookResponse;
        const data = request.bookings as IBooking[];
        setBookings(data);
      } else {
        console.log(
          "Error accepting booking:",
          response.data || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };
  return (
  <div className="min-h-screen bg-muted/50 py-10 px-4">
    {bookings.length > 0 ? (
      <div className="max-w-full mx-auto space-y-8">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-6"
          >
            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-primary">
              {booking.eventTitle}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base text-center">
              {booking.eventDescription}
            </p>

            {/* Booking Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Start:</span>{" "}
                {new Date(booking.startDate!).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hour12: true,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="font-medium">End:</span>{" "}
                {new Date(booking.endDate!).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hour12: true,
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Requested By:</span>{" "}
                {booking.requestedBy?.name}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Email:</span>{" "}
                {booking.requestedBy?.email}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => handleDecline(booking.id)}
                className="border border-red-500 text-red-600 hover:bg-red-50 font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => handleAccept(booking.id)}
                className="border border-green-500 text-green-600 hover:bg-green-50 font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-10 text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">
            No Bookings Requested
          </h2>
          <p className="text-sm text-gray-500">
            You&apos;re all caught up for now.
          </p>
        </div>
      </div>
    )}
  </div>
);
};

export default Page;
