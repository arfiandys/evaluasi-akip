'use client';
import { useSideBarToggle } from "@/hooks/use-sidebar-toggle";
import { BsList } from "react-icons/bs"
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@/components/auth/user-button";
import { Logo } from './logo';
import { UserRole } from "@prisma/client";

type Props = {
    setSelectedRole: (data: UserRole) => void;
    selectedRole: UserRole;
    existingRole: UserRole[]
}

export default function Header({ existingRole, selectedRole, setSelectedRole }: Props) {

    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
    const sidebarToggle = () => {
        invokeToggleCollapse();
    }
    const headerStyle = cn("bg-background/30 backdrop-blur-sm fixed w-full z-[11] px-4 shadow-sm shadow-slate-500/40 2xl:shadow-none",
        {
            ["sm:pl-[20rem] 2xl:pl-[0rem]"]: !toggleCollapse,
            ["sm:pl-[5.6rem] 2xl:pl-[0rem]"]: toggleCollapse,
        });
    return (
        <header className={headerStyle}>
            <div className="h-16 flex items-center justify-between">
                <button onClick={sidebarToggle} className="order-2 2xl:hidden sm:order-1 shrink-btn float-right bg-muted text-muted-foreground hover:bg-foreground hover:text-background ml-3 rounded-md w-[30px] h-[30px] flex items-center justify-center shadow-md shadow-black/10  transition duration-300 ease-in-out">
                    <BsList />
                </button>
                <div className="hidden 2xl:flex sidebar-top relative 2xl:items-center 2xl:justify-center px-5">
                    <Logo />
                    <h3 className={cn("pl-2 font-bold text-xl min-w-max")}>
                        Evaluasi AKIP</h3>
                </div>

                <div className="flex items-center justify-between sm:order-2 order-1">
                    <div className="p-2">
                        <ModeToggle />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-center">
                        <UserButton selectedRole={selectedRole} setSelectedRole={setSelectedRole} existingRole={existingRole} />
                    </div>
                </div>
            </div>
        </header>
    )
}