import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
            <div className="flex flex-row p-6 justify-center items-center">
                <Logo />
                <p className="font-bold">AKIP Evaluation</p>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
} 