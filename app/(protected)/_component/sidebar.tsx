'use client'
import React, { useEffect, useState } from 'react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Account, accounts } from './menu_constants-l';
import { useCurrentUser } from '@/hooks/use-current-user';
import { User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole, AccountRole } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SideNavItemGroup } from '@/types/type';
import { usePathname, useRouter } from 'next/navigation';
import SidebarItemsPage from './sidebar-items';
import { TopBarMenuItem } from './topbar-menu-item';
import { Button } from '@/components/ui/button';





interface SidebarProps {
    asUser: (User & { unitKerjas: UserOnUnitKerja[]; timEvaluasis: UserOnTimEvaluasi[] }) | null;
}

export const SideBar = ({
    asUser
}: SidebarProps) => {
    const [mounted, setMounted] = useState(false);
    const { toggleCollapse } = useSideBarToggle();
    const router = useRouter();
    const pathname = usePathname();

    const asideStyle = cn("sidebar overflow-y-auto overflow-x-auto fixed bg-background h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out z-[12]",
        {
            ["w-[20rem] 2xl:hidden"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%] 2xl:hidden"]: toggleCollapse,
        });

    const user = useCurrentUser();

    const existingRole: string[] = findRolesValue()

    function findRolesValue() {
        const existingRole: string[] = []
        const asAdmin = user?.role === AccountRole.ADMIN;
        const asUsers = user?.role === AccountRole.USER;
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
        if (asUsers && !(asDalnis||asKetua||asAnggota||asPIC||asPimpinan)) {
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
        function findAccount(arr1: Account[], arr2: string) {
            for (const value of arr1) {
                if (arr2 === value.role) {
                    return setSelectedAccount(value);
                }
            }
            return selectedAccount;
        }
        findAccount(accounts, selectedRole)
        setSelectedRoute(selectedAccount.route)
        router.refresh()
    }, [selectedRole, selectedAccount, selectedRoute, router]);

    return (
        <>
            <div className='bg-background/30 backdrop-blur-sm shadow-sm shadow-slate-500/40 hidden 2xl:flex justify-between fixed w-screen z-[11] mt-16 h-16 items-center'>
                <div className="fixed inset-y-0 pl-[20px] flex items-center z-[13] w-[200px]">
                    <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger
                            className={cn("flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0")}
                            aria-label="Select account"
                        >
                            <SelectValue placeholder="Select an account">
                                {accounts.find((account) => account.role === selectedRole)?.icon}
                                <span className={cn("ml-2")}>
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
                <TopBarMenuItem selectedRoute={selectedRoute} />                
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
