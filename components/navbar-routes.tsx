"use client";

import { ModeToggle } from "@/app/(protected)/_component/mode-toggle";
import { UserButton } from "./auth/user-button";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";



export const NavbarRoutes = () => {
    const pathname = usePathname();
    const isTeamListPage = pathname === "/pic-kabkota/team-list"
    return (
        <>
        {isTeamListPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            <ModeToggle />
            <UserButton />
        </div>
        </>
    ) 
}