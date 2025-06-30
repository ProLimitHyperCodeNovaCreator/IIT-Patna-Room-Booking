import {get} from "@/services/apiEndPoints";

interface IBooking{
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

interface IBookingsResponse {
    message: string;
    bookings: IBooking[];
}

export const getBookings = async (): Promise<IBooking[]> => {
    try {
        const response = await get("/user/requestedBookings");
        if (response.status === 200) {
            const request =  response.data as IBookingsResponse;
            return request.bookings;
        } else {
            throw new Error("Failed to fetch bookings");
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};