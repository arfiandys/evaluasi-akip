"use client";
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { SideNavItem, SideNavItemGroup } from '@/types/type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { BsChevronBarDown, BsChevronDown, BsChevronRight } from 'react-icons/bs';

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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreditCard, Keyboard, Mail, MessageSquare, Plus, PlusCircle, Settings, UserPlus, Users } from 'lucide-react';

interface TopBarMenuItemProps {
    selectedRoute: SideNavItemGroup[];
}

export const TopBarMenuItem = ({ selectedRoute }: TopBarMenuItemProps) => {

    const { toggleCollapse } = useSideBarToggle();

    const pathname = usePathname();

    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const inactiveLink = cn("bg-background text-primary hover:text-muted-foreground  hover:bg-muted");

    const activeLink = cn("text-primary-foreground bg-primary hover:bg-primary/90");

    const navMenuDropdownItem = "px-14 py-2 hover:bg-muted text-muted-foreground transition duration-200 rounded-md"

    const dropdownMenuHeaderLink = cn(inactiveLink,
        {
            ["bg-muted"]: subMenuOpen
        }
    );
    return (
        <NavigationMenu className='sidebar ml-[220px] overflow-y-auto overflow-x-auto'>
            <NavigationMenuList className='flex flex-row gap-2 justify-center items-center'>
                {selectedRoute.map((item: SideNavItemGroup, idx) => {
                    return (
                        <div key={idx} className='flex flex-row gap-2'>
                            {item.menuList.map((items: SideNavItem, idxs) => {
                                if (!items.submenu) {
                                    return (
                                        <Link href={items.path} key={idxs}>
                                            <Button className={`${inactiveLink} ${pathname.includes(items.path) ? activeLink : ''}`}>
                                                {items.icon}
                                                <span className='ml-3 leading-6 font-semibold'>{items.title}</span>
                                            </Button>
                                        </Link>
                                    )
                                } else {
                                    return (
                                        <DropdownMenu
                                            key={idxs}
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button className={`${inactiveLink} ${pathname.includes(items.path) ? activeLink : ''}`}>
                                                    {items.icon}
                                                    <span className='ml-3 leading-6 font-semibold'>{items.title}</span>
                                                    <BsChevronDown className="ml-2 h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    {items.subMenuItems?.map((subitem, idxss) => {
                                                        return (
                                                            <Link href={subitem.path} key={idxss}>
                                                                <DropdownMenuItem>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    <span>{subitem.title}</span>
                                                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        )
                                                    })}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )
                                }
                            })}
                        </div>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
};