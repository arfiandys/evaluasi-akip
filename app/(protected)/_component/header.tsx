'use client';
import { useSideBarToggle } from "@/hooks/use-sidebar-toggle";
import { BsList } from "react-icons/bs"
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@/components/auth/user-button";

export default function Header() {

    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
    const sidebarToggle = () => {
        invokeToggleCollapse();
    }
    const headerStyle = cn("bg-background fixed w-full z-[11] px-4 shadow-sm shadow-slate-500/40 xl:shadow-none xl:border-y border-dashed",
        {
            ["sm:pl-[20rem] xl:pl-[0rem]"]: !toggleCollapse,
            ["sm:pl-[5.6rem] xl:pl-[0rem]"]: toggleCollapse,
        });
    return (
        <header className={headerStyle}>
            <div className="h-16 flex items-center justify-between xl:justify-end">
                <button onClick={sidebarToggle} className="order-2 xl:hidden sm:order-1 shrink-btn float-right bg-muted text-muted-foreground hover:bg-foreground hover:text-background ml-3 rounded-md w-[30px] h-[30px] flex items-center justify-center shadow-md shadow-black/10  transition duration-300 ease-in-out">
                    <BsList />
                </button>

                <div className="flex items-center justify-between sm:order-2 order-1">
                    <div className="p-2">
                        <ModeToggle />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-center">
                        <UserButton />
                    </div>
                </div>
            </div>
        </header>
    )
}