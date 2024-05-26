"use client"

import { FaUser } from "react-icons/fa"
import { CreditCard, Keyboard, LogOut, Settings, User } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { Account, accounts } from "@/app/(protected)/_component/menu_constants-l"
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import Link from "next/link";


type Props = {
    setSelectedRole: (data: UserRole) => void;
    selectedRole: UserRole;
    existingRole: UserRole[]
}

export const UserButton = ({ setSelectedRole, selectedRole, existingRole }: Props) => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback>
                        <FaUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-40" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className=" cursor-pointer">
                        <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Ganti role</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger
                                className={cn("flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0")}
                                aria-label="Select account"
                            >
                                <SelectValue placeholder="Select an account">
                                    {accounts.find((account) => account.enumRole === selectedRole)?.icon}
                                    <span className={cn("ml-2")}>
                                        {
                                            accounts.find((account) => account.enumRole === selectedRole)
                                                ?.label
                                        }
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((account) => {
                                    const exist = existingRole.includes(account.enumRole);
                                    if (exist) {
                                        return (
                                            <SelectItem key={account.enumRole} value={account.enumRole}>
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
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <LogoutButton>
                    <DropdownMenuItem className=" cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}