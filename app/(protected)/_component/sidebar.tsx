'use client'
import React, { useEffect, useState } from 'react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Account, accounts } from './menu_constants-l';
import { useCurrentUser } from '@/hooks/use-current-user';
import { User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SideNavItem, SideNavItemGroup } from '@/types/type';
import { useRouter } from 'next/navigation';
import SidebarItemsPage from './sidebar-items';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from 'next/link';



interface SidebarProps {
    asUser: (User & { unitKerjas: UserOnUnitKerja[]; timEvaluasis: UserOnTimEvaluasi[] }) | null;
}

export const SideBar = ({
    asUser
}: SidebarProps) => {
    const [mounted, setMounted] = useState(false);
    const { toggleCollapse } = useSideBarToggle();
    const router = useRouter();

    const asideStyle = cn("sidebar overflow-y-auto overflow-x-auto fixed bg-background h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out z-[12]",
        {
            ["w-[20rem] xl:hidden"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%] xl:hidden"]: toggleCollapse,
        });

    const user = useCurrentUser();

    const existingRole: string[] = findRolesValue()

    function findRolesValue() {
        const existingRole: string[] = []
        const asAdmin = user?.role === UserRole.ADMIN;
        const asUsers = user?.role === UserRole.USER;
        const asAnggota = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.ANGGOTA })
        const asKetua = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.KETUA })
        const asDalnis = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.DALNIS })
        const asPIC = asUser?.unitKerjas.some((user) => { return user.assignedRole === UserRole.PIC })
        const asPimpinan = asUser?.unitKerjas.some((user) => { return user.assignedRole === UserRole.PIMPINAN })
        if (asAdmin) {
            existingRole.push("admin")
        }
        if (asDalnis) {
            existingRole.push("dalnis")
        }
        if (asKetua) {
            existingRole.push("ketua")
        }
        if (asAnggota) {
            existingRole.push("anggota")
        }
        if (asPimpinan) {
            existingRole.push("pimpinan")
        }
        if (asPIC) {
            existingRole.push("pic")
        }
        if (asUsers) {
            existingRole.push("user")
        }

        return existingRole;
    }



    function findDefaultAccount(arr1: Account[], arr2: string[]) {
        for (const value of arr1) {
            if (arr2.includes(value.role)) {
                return value;
            }
        }
        return arr1[6];
    }



    const [selectedAccount, setSelectedAccount] = React.useState<Account>(
        findDefaultAccount(accounts, existingRole)
    )

    const [selectedRole, setSelectedRole] = React.useState<string>(
        selectedAccount.role
    )
    const [selectedRoute, setSelectedRoute] = React.useState<SideNavItemGroup[]>(
        selectedAccount.route
    )

    useEffect(() => {
        setMounted(true);
        console.log(selectedRole)
        function findAccount(arr1: Account[], arr2: string) {
            for (const value of arr1) {
                if (arr2 === value.role) {
                    return setSelectedAccount(value);
                }
            }
            return selectedAccount;
        }
        findAccount(accounts, selectedRole)
        console.log(selectedAccount)
        setSelectedRoute(selectedAccount.route)
        console.log(selectedRoute)
        router.refresh()
    }, [selectedRole, selectedAccount, selectedRoute, router]);


    const ListItem = React.forwardRef<
        React.ElementRef<"a">,
        React.ComponentPropsWithoutRef<"a">
    >(({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    })
    ListItem.displayName = "ListItem"

    return (
        <>
            <div className='bg-background/30 backdrop-blur-sm shadow-sm shadow-slate-500/40 hidden xl:flex justify-between fixed w-screen z-[11] mt-16 h-16 items-center'>
                <div className="fixed inset-y-0 left-5 flex items-center z-[13]">
                    <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger
                            className={cn(
                                "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                                toggleCollapse &&
                                "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                            )}
                            aria-label="Select account"
                        >
                            <SelectValue placeholder="Select an account">
                                {accounts.find((account) => account.role === selectedRole)?.icon}
                                <span className={cn("ml-2", toggleCollapse && "hidden")}>
                                    {
                                        accounts.find((account) => account.role === selectedRole)
                                            ?.label
                                    }
                                </span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => {
                                const exist = existingRole.includes(account.role);
                                if (exist) {
                                    return (
                                        <SelectItem key={account.role} value={account.role}>
                                            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                                {account.icon}
                                                {account.label}
                                            </div>
                                        </SelectItem>)
                                } else {
                                    <></>
                                }
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <NavigationMenu className=''>
                    <NavigationMenuList className='flex flex-row gap-2 justify-center items-center w-screen'>
                        {selectedRoute.map((item: SideNavItemGroup, idx) => {
                            return (
                                <div key={idx} className='flex flex-row gap-2'>
                                    {item.menuList.map((items: SideNavItem, idxs) => {
                                        if (!items.submenu) {
                                            return (
                                                <NavigationMenuItem key={idxs}>
                                                    <Link href={items.path} legacyBehavior passHref>
                                                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparment")}>
                                                            {items.title}
                                                        </NavigationMenuLink>
                                                    </Link>
                                                </NavigationMenuItem>
                                            )
                                        } else {
                                            return(
                                            <NavigationMenuItem key={idxs}>
                                                <NavigationMenuTrigger>{items.title}</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[200px] gap-3 p-4 ">
                                                        {items?.subMenuItems!.map((component) => (
                                                            <ListItem
                                                                key={component.title}
                                                                title={component.title}
                                                                href={component.path}
                                                            >
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        })}

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            {/* ============================= */}
            <aside className={asideStyle}>
                <div className="sidebar-top relative flex items-center px-5 pt-5">
                    {mounted && <Logo />}
                    <h3 className={cn("pl-2 font-bold text-xl min-w-max",
                        { hidden: toggleCollapse })}>
                        AKIP Evaluation</h3>
                </div>
                <div className="sidebar-top relative flex items-center px-5 py-5">
                    <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger
                            className={cn(
                                "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                                toggleCollapse &&
                                "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                            )}
                            aria-label="Select account"
                        >
                            <SelectValue placeholder="Select an account">
                                {accounts.find((account) => account.role === selectedRole)?.icon}
                                <span className={cn("ml-2", toggleCollapse && "hidden")}>
                                    {
                                        accounts.find((account) => account.role === selectedRole)
                                            ?.label
                                    }
                                </span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => {
                                const exist = existingRole.includes(account.role);
                                if (exist) {
                                    return (
                                        <SelectItem key={account.role} value={account.role}>
                                            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                                {account.icon}
                                                {account.label}
                                            </div>
                                        </SelectItem>)
                                } else {
                                    <></>
                                }
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <SidebarItemsPage selectedRoute={selectedRoute} />
            </aside>
        </>
    )
}
