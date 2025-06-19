"use client";

import * as React from "react";
import { House, CalendarCheck, CalendarPlus, TreePine } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getUserData } from "@/lib/getUserData";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"


interface IUser {
  role: "ADMIN" | "USER";
  email: string;
  name: string | "UserX";
  initials: string;
}

const user = (await getUserData()) as IUser;

const data = {
  user: {
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.initials,
  },
  projects: [
    {
      name: "Home",
      url: "#",
      icon: House,
    },
    {
      name: "My Requests",
      url: "#",
      icon: CalendarCheck,
    },
    {
      name: "Book a room",
      url: "#",
      icon: CalendarPlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <TreePine className="h-6 w-6 shrink-0" />
          <span
            className={cn(
              "text-2xl font-bold transition-all duration-300",
              isCollapsed
                ? "opacity-0 scale-95 w-0 overflow-hidden"
                : "opacity-100"
            )}
          >
            RoomMaze
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
