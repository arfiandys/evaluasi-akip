"use client"

import { Laptop2, Server, Settings, UserCog, UserRoundSearch } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";

const koordinatorRoutes = [
    {
        icon: UserRoundSearch,
        label: "Koordinator",
        href: "/koordinator",
    },
    {
        icon: UserCog,
        label: "Admin",
        href: "/admin",
    },
    {
        icon: Settings,
        label: "Settings",
        href: "/settings",
    },
]

const picUnitKerjaRoutes = [
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
    // const [routes, setRoutes] = useState(picUnitKerjaRoutes);
    const user = useCurrentUser();
    
    // useEffect(() => {
    //     if (user?.role === UserRole.ADMIN) {
    //         setRoutes(koordinatorRoutes);
    //     }
    //   }, [routes]);

    const routes = user?.role === UserRole.ADMIN ? koordinatorRoutes : picUnitKerjaRoutes;
    
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