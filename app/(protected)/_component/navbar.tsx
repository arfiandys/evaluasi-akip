"use client"

import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
    return (
        <div className=" bg-background flex items-center p-4 h-full border-b shadow-sm">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}