"use client";
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { SideNavItem } from '@/types/type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { BsChevronRight } from 'react-icons/bs';

interface SideBarMenuItemProps {
    item : SideNavItem;
}

export const SideBarMenuItem = ({ item }: SideBarMenuItemProps) => {

    const { toggleCollapse } = useSideBarToggle();

    const pathname = usePathname();

    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const inactiveLink = cn("cursor-pointer flex items-center min-h-[40px] h-full py-2 px-4 hover:text-muted-foreground  hover:bg-muted rounded-md transition duration-200"
    );

    const activeLink = cn("active text-primary-foreground bg-primary hover:bg-primary/90");

    const navMenuDropdownItem = "px-14 py-2 hover:bg-muted text-muted-foreground transition duration-200 rounded-md"

    const dropdownMenuHeaderLink = cn(inactiveLink,
        {
            ["bg-muted"]: subMenuOpen
        }
    );
    return (
        <>
            {item.submenu ? (
                <div className="min-w-[18px]">
                    <a className={`${dropdownMenuHeaderLink} ${pathname.includes(item.path) ? activeLink : ''}`}
                        onClick={toggleSubMenu}>
                        {item.icon}
                        {!toggleCollapse && <>
                            <span className='ml-3 text-base leading-6 font-semibold'>{item.title}</span>
                            <BsChevronRight className={`${subMenuOpen ? 'rotate-90' : ''} ml-auto stroke-2 text-xs`} />
                        </>
                        }
                    </a>
                    {subMenuOpen && !toggleCollapse && (
                        <div>
                            <div className='grid gap-y-2 leading-5 py-2'>
                                {item.subMenuItems?.map((subItem, idx) => {
                                    return (
                                        <Link
                                        key={idx}
                                            href={subItem.path}
                                            className={`${navMenuDropdownItem} ${subItem.path === pathname ? 'text-primary font-medium' : ''}`}
                                        >
                                            <span>{subItem.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>)
                    }
                </div>
            ) :
                (<Link href={item.path} className={`${inactiveLink} ${item.path === pathname ? activeLink : ''}`}>
                    {item.icon}
                    {!toggleCollapse && (<span className="ml-3 leading-6 font-semibold">{item.title}</span>)}
                </Link>)}
        </>
    );
};