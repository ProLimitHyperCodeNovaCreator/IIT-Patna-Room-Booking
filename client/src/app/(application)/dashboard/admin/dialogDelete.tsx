import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { post } from "@/services/apiEndPoints"

interface IRoom {
  id: string;
  name: string;
  capacity: number;
  description: string[];
  location: string;
  isAvailable: boolean;
}

interface IRoomResponse {
  message?: string;
  room?: IRoom;
  rooms?: IRoom[];
}

export function DeleteRoom({roomId, setRooms}: {roomId: string, setRooms: React.Dispatch<React.SetStateAction<IRoom[]>>}) {
    const handleDeleteRoom = async (roomId: string) => {
    try {
      const response = await post(`/admin/roomDelete`, {
        roomId,
      });
      console.log(response);
      if (response.status === 200) {
        const roomRes = response.data as IRoomResponse;
        const deletedRoom = roomRes.room;
        if (deletedRoom) {
          setRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== deletedRoom.id)
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Room</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete the room?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteRoom(roomId)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
