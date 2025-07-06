"use client"
import type React from "react"
import { useState, useEffect, useCallback, memo } from "react"
import { get, post } from "@/services/apiEndPoints"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Search,
  MapPin,
  Users,
  Plus,
  Eye,
  Building,
  Calendar,
  Loader2,
  Shield,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { DeleteRoom } from "./dialogDelete"
import { useAuth } from "@/context/AuthProvider"

interface IUser {
  role: "ADMIN" | "USER"
  email?: string
  name?: string
}

interface IRoom {
  id: string
  name: string
  capacity: number
  description: string[]
  location: string
  isAvailable: boolean
}

interface IRoomResponse {
  message?: string
  room?: IRoom
  rooms?: IRoom[]
  error?: boolean
}

// Move components outside to prevent recreation on re-renders
const AvailabilityBadge = memo(({ isAvailable }: { isAvailable: boolean }) => (
  <Badge
    variant="outline"
    className={`${
      isAvailable ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
    } font-medium`}
  >
    <div className={`w-2 h-2 rounded-full mr-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`} />
    {isAvailable ? "Available" : "Unavailable"}
  </Badge>
))

AvailabilityBadge.displayName = "AvailabilityBadge"

interface CreateRoomFormProps {
  onSubmit: (formData: {
    name: string
    capacity: number
    description: string[]
    location: string
  }) => Promise<void>
  onCancel: () => void
}

const CreateRoomForm = memo(({ onSubmit, onCancel }: CreateRoomFormProps) => {
  const [roomName, setRoomName] = useState<string>("")
  const [roomCapacity, setRoomCapacity] = useState<number>(0)
  const [roomDescription, setRoomDescription] = useState<string[]>([])
  const [roomLocation, setRoomLocation] = useState<string>("")
  const [tagAdding, setTagAdding] = useState<boolean>(false)
  const [tag, setTag] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [checkBoxes, setCheckBoxes] = useState<string[]>([
      "AC Available",
      "Projector Available",
      "Whiteboard Available",
      "Computer Room",
      "Meeting Room",
      "Wifi Enabled",
      "TV Available",
      "Classroom",
    ]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (roomName === "" || roomCapacity === 0 || roomDescription.length === 0 || roomLocation === "") {
      toast.error("Please fill all the necessary details!")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: roomName,
        capacity: roomCapacity,
        description: roomDescription,
        location: roomLocation,
      })

      // Reset form
      setRoomName("")
      setRoomCapacity(0)
      setRoomDescription([])
      setRoomLocation("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-gray-200 bg-white mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Create New Room</CardTitle>
            <CardDescription className="text-gray-600">Add a new room to the booking system</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Room Name</label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                type="text"
                placeholder="Room name"
                className="border-gray-300 focus:border-gray-400"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Capacity</label>
              <Input
                value={roomCapacity || ""}
                onChange={(e) => setRoomCapacity(Number.parseInt(e.target.value) || 0)}
                type="number"
                placeholder="Capacity"
                className="border-gray-300 focus:border-gray-400"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                value={roomLocation}
                onChange={(e) => setRoomLocation(e.target.value)}
                type="text"
                placeholder="Location"
                className="border-gray-300 focus:border-gray-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Room Features</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {checkBoxes.map((checkbox, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={roomDescription.includes(checkbox)}
                    onCheckedChange={(checked) => {
                      setRoomDescription((prev) =>
                        checked ? [...prev, checkbox] : prev.filter((tag) => tag !== checkbox),
                      )
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{checkbox}</span>
                </label>
              ))}
            </div>

            {!tagAdding && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTagAdding(true)}
                className="text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Feature
              </Button>
            )}

            {tagAdding && (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Custom feature name"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="max-w-sm border-gray-300"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (tag && !checkBoxes.includes(tag)) {
                      setRoomDescription((prev) => [...prev, tag])
                      setCheckBoxes((prev) => [...prev, tag])
                    }
                    setTag("")
                    setTagAdding(false)
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTag("")
                    setTagAdding(false)
                  }}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})

CreateRoomForm.displayName = "CreateRoomForm"

interface RoomCardProps {
  room: IRoom
  onAvailabilityChange: (roomId: string, isAvailable: boolean) => void
  onViewRequests: (roomId: string) => void
  setRooms: React.Dispatch<React.SetStateAction<IRoom[]>>
}

const RoomCard = memo(({ room, onAvailabilityChange, onViewRequests, setRooms }: RoomCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300 bg-white">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between mb-3">
        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors">
          {room.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Switch
            checked={room.isAvailable}
            onCheckedChange={(checked) => onAvailabilityChange(room.id, checked)}
            className="data-[state=checked]:bg-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <CardDescription className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-500" />
          {room.location}
        </CardDescription>
        <CardDescription className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4 text-gray-500" />
          Up to {room.capacity} people
        </CardDescription>
      </div>

      <div className="mt-3">
        <AvailabilityBadge isAvailable={room.isAvailable} />
      </div>
    </CardHeader>

    <CardContent className="pb-4">
      {room.description && room.description.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {room.description.map((feature, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-normal"
            >
              {feature}
            </Badge>
          ))}
        </div>
      )}
    </CardContent>

    <CardFooter className="pt-0 flex gap-3">
      <Button
        onClick={() => onViewRequests(room.id)}
        className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
      >
        <Eye className="h-4 w-4 mr-2" />
        View Requests
      </Button>
      <DeleteRoom roomId={room.id} setRooms={setRooms} />
    </CardFooter>
  </Card>
))

RoomCard.displayName = "RoomCard"

const Page: React.FC = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>("")
  const [rooms, setRooms] = useState<IRoom[]>([])
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { user, loading } = useAuth() as { user: IUser | null, loading: boolean }
  const [load, setLoad] = useState<boolean>(true)
  useEffect(() => {
    if(loading) return;
    const fetchData = async () => {
      try {
        if (!user || user.role !== "ADMIN") {
          toast.error("Unauthorized access")
          router.push("/dashboard/user")
          return
        }
        setError(null)
        const roomsResponse = await get("/user/rooms");
        const roomsRequest = roomsResponse.data as IRoomResponse;
        // Check if user is authenticated and has ADMIN role
        // Handle rooms response
        if (roomsResponse.status === 200 && !roomsRequest.error) {
          const roomRes = roomsResponse.data as IRoomResponse
          setRooms(roomRes.rooms || [])
        } else if (roomsRequest.error) {
          setError(roomsRequest.message || "Failed to fetch rooms")
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Fetch error:", error);
        }
        setError("Failed to load dashboard data")
      }finally{
        setLoad(false)
      }
    }

    fetchData()
  }, [router, user, loading])

  const filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(query.toLowerCase()))

  const handleCreateRoom = useCallback(
    async (formData: {
      name: string
      capacity: number
      description: string[]
      location: string
    }) => {
      try {
        const response = await post(`/admin/createRoom`, formData)
        const request = response.data as IRoomResponse
        if (response.status === 201 && !request.error) {
          const newRoom = request.room as IRoom
          setRooms((prevRooms) => [...prevRooms, newRoom])
          toast.success("Room created successfully!")
          setShowCreateForm(false)
        } else {
          toast.error(request.message || "Failed to create room")
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
        toast.error("Error creating room")
      }
    },
    [],
  )

  const handleAvailabilityChange = useCallback(async (roomId: string, isAvailable: boolean) => {
    // Optimistically update UI
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, isAvailable } : room)))

    try {
      const response = await post(`/admin/avaibilityChange`, {
        roomId,
        isAvailable,
      })
        const request = response.data as IRoomResponse
      if (response.status === 200 && !request.error) {
        if (isAvailable) {
          toast.success("Room is now available for booking")
        } else {
          toast.warning("Room is no longer available for booking")
        }
      } else {
        // Revert optimistic update on error
        setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, isAvailable: !isAvailable } : room)))
        toast.error(request.message || "Failed to update room availability")
      }
    } catch (error) {
      // Revert optimistic update on error
      setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, isAvailable: !isAvailable } : room)))
      if (process.env.NODE_ENV === "development") {
        console.error(error)
      }
      toast.error("Error changing room status")
    }
  }, [])

  const handleViewRequests = useCallback(
    (roomId: string) => {
      router.push(`/bookingDetails/${roomId}`)
    },
    [router],
  )

  if (loading || load) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600 font-medium">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-red-100 p-4 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-black hover:bg-gray-800 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Shield className="h-6 w-6 mr-2 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{user?.name || "Admin"}</span>!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Building className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Now</p>
                  <p className="text-2xl font-bold text-green-600">{rooms.filter((room) => room.isAvailable).length}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.reduce((sum, room) => sum + room.capacity, 0)}
                  </p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Room Button */}
        {!showCreateForm && (
          <div className="mb-8">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-black hover:bg-gray-800 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Room
            </Button>
          </div>
        )}

        {/* Create Room Form */}
        {showCreateForm && <CreateRoomForm onSubmit={handleCreateRoom} onCancel={() => setShowCreateForm(false)} />}

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search rooms..."
              className="pl-10 border-gray-300 focus:border-gray-400 focus:ring-gray-400 bg-white"
              value={query}
            />
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onAvailabilityChange={handleAvailabilityChange}
                onViewRequests={handleViewRequests}
                setRooms={setRooms}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-500 max-w-md">
                {query ? `No rooms match "${query}". Try adjusting your search terms.` : "No rooms available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
