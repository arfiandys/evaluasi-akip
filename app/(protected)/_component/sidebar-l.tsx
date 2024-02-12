'use client'
import React, { useEffect, useState } from 'react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import SideBarMenuGroup from './sidebar-menu-group';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { SIDENAV_ITEMS_ADMIN, SIDENAV_ITEMS_USER } from './menu_constants-l';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';


export const SideBar = () => {
    const [mounted, setMounted] = useState(false);
    const { toggleCollapse } = useSideBarToggle();

    const asideStyle = cn("sidebar overflow-y-auto overflow-x-auto fixed bg-background h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out z-[12]",
        {
            ["w-[20rem]"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%]"]: toggleCollapse,
        });

    useEffect(() => setMounted(true), []);

    const user = useCurrentUser();

    const routes = user?.role === UserRole.ADMIN ? SIDENAV_ITEMS_ADMIN : SIDENAV_ITEMS_USER;

    return (
        <aside className={asideStyle}>
            <div className="sidebar-top relative flex items-center px-5 py-5">
                {mounted && <Logo />}
                <h3 className={cn("pl-2 font-bold text-xl min-w-max",
                    { hidden: toggleCollapse })}>
                    AKIP Evaluation</h3>
            </div>
            <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
                <div className="flex flex-col gap-2 px-5">
                    {routes.map((item, idx) => {
                        return <SideBarMenuGroup key={idx} menuGroup={item} />;
                    })}
                </div>
            </nav>
        </aside>
    )
}
