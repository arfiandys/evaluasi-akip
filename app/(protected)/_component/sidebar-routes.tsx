"use client"

import { Laptop2, Server, Settings, UserCog } from "lucide-react"
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
    {
        icon: UserCog,
        label: "Admin",
        href: "/admin",
    },
    {
        icon: Laptop2,
        label: "Client",
        href: "/client",
    },
    {
        icon: Server,
        label: "Server",
        href: "/server",
    },
    {
        icon: Settings,
        label: "Settings",
        href: "/settings",
    },
]

export const SidebarRoutes = () => {
    const routes = guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                />
            ))}
        </div>
    )
}