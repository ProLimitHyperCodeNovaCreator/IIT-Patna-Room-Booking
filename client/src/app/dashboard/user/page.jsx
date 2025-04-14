import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import UserDashboard from "./userDashboard"

export default async function UserPage() {
    const session = await getServerSession();

    if(!session){
        redirect("auth/signin");
    }

    return <UserDashboard session={session} />;
}