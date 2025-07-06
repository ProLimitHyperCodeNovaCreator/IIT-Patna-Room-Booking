"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { post} from "@/services/apiEndPoints";
import { toast } from "sonner"
import { ArrowLeft, Calendar, Clock, FileText, Type, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthProvider";


const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false)
  const {loading} = useAuth() as {loading: boolean};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Event Name:", eventName);
    // console.log("Event Description:", eventDescription);
    // console.log("Start Date:", startDate);
    // console.log("End Date:", endDate);
    setError(null);

    if (!eventName || !eventDescription || !startDate || !endDate) {
      setError("Please fill out all fields.");
      return;
    }

    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)

    if (startDateTime < new Date()) {
      setError("Start date and time must be in the future.")
      return
    }

    if (startDateTime >= endDateTime) {
      setError("End date and time must be after start date and time.")
      return
    }

    setSubmitting(true)
    try {
      const response = await post("/user/roomBook", {
        roomId: id,
        eventName,
        eventDescription,
        startDate: startDateTime,
        endDate: endDateTime,
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("Room booking request submitted successfully!")
        setEventName("")
        setEventDescription("")
        setStartDate("")
        setEndDate("")
        router.push("/dashboard/user")
      } else if (response.status === 400) {
        setError("Room is already booked for this period")
      } else {
        setError("Booking failed. Please try again.")
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Booking error:", error)
      }
      // console.error("Booking failed:", error)
      setError("Booking failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
          <span className="text-lg font-medium text-black">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-black hover:bg-gray-50 p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-light text-black tracking-tight">Book Room</h1>
            <p className="text-gray-600 font-light">Submit a request to reserve this room for your event</p>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Event Name */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Type className="h-5 w-5 text-black" />
                  <label className="text-sm font-medium text-black">Event Name</label>
                </div>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter the name of your event"
                  className="border-gray-200 focus:border-black focus:ring-0 text-black placeholder:text-gray-400"
                  disabled={submitting}
                />
              </div>

              {/* Event Description */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-black" />
                  <label className="text-sm font-medium text-black">Event Description</label>
                </div>
                <Textarea
                  rows={4}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe the purpose, audience, and any special requirements for your event"
                  className="border-gray-200 focus:border-black focus:ring-0 text-black placeholder:text-gray-400 resize-none"
                  disabled={submitting}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-black" />
                    <label className="text-sm font-medium text-black">Start Date & Time</label>
                  </div>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-gray-200 focus:border-black focus:ring-0 text-black"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-black" />
                    <label className="text-sm font-medium text-black">End Date & Time</label>
                  </div>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-gray-200 focus:border-black focus:ring-0 text-black"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white hover:bg-gray-800 font-normal py-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
