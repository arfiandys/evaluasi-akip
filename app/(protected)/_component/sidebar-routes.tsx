"use client"

import { Laptop2, Server, Settings, User, UserCog, UserRoundSearch } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { SidebarSubmenuItem } from "./sidebar-submenu-item";

const koordinatorRoutes = [
    {
        icon: UserRoundSearch,
        label: "Koordinator",
        href: "/koordinator",
        submenu: true,
        submenuItems: [
            {
                label: "Contoh",
                href: "/koordinator/tim-evaluasi",
            },
            {
                label: "Unit Kerja",
                href: "/koordinator/unit-kerja",
            },
            {
                label: "Tim Evaluasi",
                href: "/koordinator/tim-eval",
            },
        ],
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
        icon: User,
        label: "PIC KabKota",
        href: "/pic-kabkota",
        submenu: true,
        submenuItems: [
            {
                label: "Team List",
                href: "/pic-kabkota/team-list",
            },
        ],
    },
    {
        icon: Laptop2,
        label: "Client",
        href: "/client",
        submenu: false,
        submenuItems: [],
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
    const user = useCurrentUser();

    const routes = user?.role === UserRole.ADMIN ? koordinatorRoutes : picUnitKerjaRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => {
                if (!route.submenu) {
                    return (
                        <SidebarItem
                            key={route.href}
                            icon={route.icon}
                            label={route.label}
                            href={route.href}
                        />
                    )
                }
                if (route.submenu) {
                    return (
                        <SidebarSubmenuItem
                            key={route.href}
                            icon={route.icon}
                            label={route.label}
                            href={route.href}
                            submenuItems={route.submenuItems}
                        />
                    )
                }

            })}
        </div>
    )
}