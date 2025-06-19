"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DateTimeInput from "@/components/dateTimeInput";
import { post, get } from "@/services/apiEndPoints";

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await get("/auth/token");

        if (response.status === 200) {
          console.log("You can proceed to book a room");
        } else if (response.status === 401) {
          console.log("You need to login to book a room");
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    checkAuth(); // Call the async function
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Event Name:", eventName);
    console.log("Event Description:", eventDescription);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (!eventName || !eventDescription || !startDate || !endDate) {
      setError("Please fill out all fields.");
      return;
    }

    if (startDate < new Date()) {
      setError("Start date and time must be in the future.");
      return;
    }

    if (startDate >= endDate) {
      setError("End date and time must be after start date and time.");
      return;
    }
    try {
      const response = await post("/user/roomBook", {
        roomId: id,
        eventName,
        eventDescription,
        startDate,
        endDate,
      });
      console.log(response);
      if (response.status === 201) {
        setError(null);
        alert("Room booked successfully!");
      } else if (response.status === 400) {
        setError("Room is already booked for this period");
      }
      setEventName("");
      setEventDescription("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Booking failed:", error);
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Book a Room
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Fill in the event details below to request a room.
        </p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Event Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Event Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Description
          </label>
          <textarea
            rows={4}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Describe the event purpose, audience, etc."
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Start Date & Time
          </label>
          <DateTimeInput value={startDate} onChange={setStartDate} />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            End Date & Time
          </label>
          <DateTimeInput value={endDate} onChange={setEndDate} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-all"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Page;
