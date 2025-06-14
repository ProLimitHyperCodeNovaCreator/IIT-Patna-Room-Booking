"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get, post } from "@/services/apiEndPoints";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gray-100 py-8">
      {bookings.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-6 px-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md p-6 space-y-4"
            >
              <h2 className="text-2xl font-semibold text-center text-blue-700">
                {booking.eventTitle}
              </h2>
              <p className="text-gray-700 text-md">
                {booking.eventDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(booking.startDate!).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(booking.endDate!).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Requested By:</span>{" "}
                  {booking.requestedBy?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  {booking.requestedBy?.email}
                </p>
              </div>

              <div className="flex justify-center gap-6 pt-4">
                <button
                  onClick={() => handleDecline(booking.id)}
                  className="bg-red-500 hover:bg-red-600 transition-colors text-white font-medium py-2 px-6 rounded-lg"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(booking.id)}
                  className="bg-green-500 hover:bg-green-600 transition-colors text-white font-medium py-2 px-6 rounded-lg"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Bookings Requested for now
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
