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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl space-y-6 border"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Book a room for an event
        </h2>
        {error && (
          <div className="text-red-500 bg-red-100 p-4 border-2 border-red-400 rounded-xl w-full text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Event Description
          </label>
          <input
            type="text"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Enter event description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Start Date & Time
          </label>
          <DateTimeInput label="" value={startDate} onChange={setStartDate} />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            End Date & Time
          </label>
          <DateTimeInput label="" value={endDate} onChange={setEndDate} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
