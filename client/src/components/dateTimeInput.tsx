"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function DateTimeInput({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(value || undefined);
  const [time, setTime] = useState("12:00");

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const [hours, minutes] = time.split(":").map(Number);
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    setDate(selectedDate);
    onChange(selectedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date) {
      const updatedDate = new Date(date);
      const [hours, minutes] = newTime.split(":").map(Number);
      updatedDate.setHours(hours);
      updatedDate.setMinutes(minutes);
      onChange(updatedDate);
    }
  };

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 border border-gray-200 rounded-lg shadow-lg bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
