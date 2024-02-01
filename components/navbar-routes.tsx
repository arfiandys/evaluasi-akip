"use client";

import { ModeToggle } from "@/app/(protected)/_component/mode-toggle";
import { UserButton } from "./auth/user-button";

export const NavbarRoutes = () => {
    return (
        <div className="flex gap-x-2 ml-auto">
            <ModeToggle />
            <UserButton />
        </div>
    ) 
}