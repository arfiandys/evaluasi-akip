'use client'
import React, { useEffect, useState } from 'react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Account, accounts } from './menu_constants-l';
import { useCurrentUser } from '@/hooks/use-current-user';
import { User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole, AccountRole } from '@prisma/client';
import { SideNavItemGroup } from '@/types/type';
import { useRouter } from 'next/navigation';
import SidebarItemsPage from './sidebar-items';
import { TopBarMenuItem } from './topbar-menu-item';
import Header from './header';
import { useSession } from 'next-auth/react';





interface SidebarProps {
    asUser: (User & { unitKerjas: UserOnUnitKerja[]; timEvaluasis: UserOnTimEvaluasi[] }) | null;
}

export const SideBar = ({
    asUser
}: SidebarProps) => {
    const { toggleCollapse } = useSideBarToggle();
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const asideStyle = cn("sidebar overflow-y-auto overflow-x-auto fixed bg-background h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out z-[12]",
        {
            ["w-[20rem] xl:hidden"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%] xl:hidden"]: toggleCollapse,
        });

    const user = useCurrentUser();

    const existingRole: UserRole[] = findRolesValue()

    function findRolesValue() {
        const existingRole: UserRole[] = []
        const asAdmin = user?.role === AccountRole.ADMIN;
        const asUsers = user?.role === AccountRole.USER;
        const asAnggota = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.ANGGOTA })
        const asKetua = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.KETUA })
        const asDalnis = asUser?.timEvaluasis.some((user) => { return user.assignedRole === UserRole.DALNIS })
        const asPIC = asUser?.unitKerjas.some((user) => { return user.assignedRole === UserRole.PIC })
        const asPimpinan = asUser?.unitKerjas.some((user) => { return user.assignedRole === UserRole.PIMPINAN })
        if (asAdmin) {
            existingRole.push(UserRole.KOORDINATOR)
        }
        if (asDalnis) {
            existingRole.push(UserRole.DALNIS)
        }
        if (asKetua) {
            existingRole.push(UserRole.KETUA)
        }
        if (asAnggota) {
            existingRole.push(UserRole.ANGGOTA)
        }
        if (asPimpinan) {
            existingRole.push(UserRole.PIMPINAN)
        }
        if (asPIC) {
            existingRole.push(UserRole.PIC)
        }
        if (!asDalnis && !asKetua && !asAnggota && !asPIC && !asPimpinan && !asAdmin && asUsers) {
            existingRole.push(UserRole.NONE)
        }

        return existingRole;
    }



    function findDefaultAccount(arr1: Account[], arr2: UserRole[]) {
        if (user?.userRole === UserRole.NONE) {
            for (const value of arr1) {
                if (arr2.includes(value.enumRole)) {
                    return value;
                }
            }
            return arr1[6];
        } else {
            for (const value of arr1) {
                if (value.enumRole === user?.userRole) {
                    return value;
                }
            }
            return arr1[6];
        }
    }



    const [selectedAccount, setSelectedAccount] = React.useState<Account>(
        findDefaultAccount(accounts, existingRole)
    )

    const [selectedRole, setSelectedRole] = React.useState<UserRole>(
        selectedAccount.enumRole
    )
    const [selectedRoute, setSelectedRoute] = React.useState<SideNavItemGroup[]>(
        selectedAccount.route
    )


    const setRole = (data: UserRole) => {
        setSelectedRole(data)
    }

    useEffect(() => {
        function findAccount(arr1: Account[], arr2: UserRole) {
            for (const value of arr1) {
                if (arr2 === value.enumRole) {
                    update({ userRole: value.enumRole })
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
            <Header setSelectedRole={setRole} selectedRole={selectedRole} existingRole={existingRole} />
            <div className='border-t border-dashed bg-background/30 backdrop-blur-sm shadow-sm shadow-slate-500/40 hidden xl:flex justify-center fixed w-screen z-[11] mt-16 h-16 items-center'>
                <TopBarMenuItem selectedRoute={selectedRoute} />
            </div>
            {/* ============================= */}
            <aside className={asideStyle}>
                <div className="sidebar-top relative flex items-center px-5 pt-5">
                    <Logo />
                    <h3 className={cn("pl-2 font-bold text-xl min-w-max",
                        { hidden: toggleCollapse })}>
                        Evaluasi AKIP</h3>
                </div>
                <SidebarItemsPage selectedRoute={selectedRoute} />
            </aside>
        </>
    )
}
