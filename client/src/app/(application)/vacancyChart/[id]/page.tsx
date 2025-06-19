"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/services/apiEndPoints";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userDetails, bookings] = await Promise.all([
          get("/auth/token"),
          get(`/user/roomBookings/${id}`),
        ]);
        if (userDetails.status === 401) {
          router.push("/login");
        }
        const bookingData = bookings.data as Iresponse;
        const bookingsData = bookingData.bookings as IBooking[];
        setBookings(bookingsData);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router, id]);

  return (
    <div className="p-6 max-w-[100vw] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-auto">
        <Table>
          <TableCaption className="text-base py-4 text-gray-700">
            A list of scheduled events for this room
          </TableCaption>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="text-gray-600 font-semibold">Event Name</TableHead>
              <TableHead className="text-gray-600 font-semibold">Description</TableHead>
              <TableHead className="text-gray-600 font-semibold">Start Date</TableHead>
              <TableHead className="text-gray-600 font-semibold">End Date</TableHead>
              <TableHead className="text-gray-600 font-semibold">User Name</TableHead>
              <TableHead className="text-gray-600 font-semibold">User Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <TableRow
                  key={booking.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                  <TableCell className="text-sm">{booking.eventDescription}</TableCell>
                  <TableCell>
                    {booking.startDate
                      ? format(new Date(booking.startDate), "dd MMMM yyyy, h:mm a")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {booking.endDate
                      ? format(new Date(booking.endDate), "dd MMMM yyyy, h:mm a")
                      : "—"}
                  </TableCell>
                  <TableCell>{booking.requestedBy?.name}</TableCell>
                  <TableCell>{booking.requestedBy?.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
