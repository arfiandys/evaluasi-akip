"use client"

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarSubmenuItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    submenuItems?: {
        label: string;
        href: string;
    }[];
};

export const SidebarSubmenuItem = ({
    icon: Icon,
    label,
    href,
    submenuItems,
}: SidebarSubmenuItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const [submenuOpen, setSubmenuOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => (setSubmenuOpen(!submenuOpen))}
                type="button"
                className="flex items-center gap-x-2 text-slate-500 text-sm font-[500] px-6 transition-all hover:text-slate-600 hover:bg-slate-300/20">
                <div className="flex items-center gap-x-2 py-4">
                    <Icon
                        size={22}
                        className={cn(
                            "text-slate-500"
                        )}
                    />
                    {label}
                </div>
                <ChevronUp className={`ml-auto w-[22px] h-[22px] duration-300 ${submenuOpen && "rotate-180 "}`} />
            </button>
            <div className={`flex flex-col ${submenuOpen && "hidden"}`}>
                {
                    submenuItems?.map((submenuItem, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                router.push(submenuItem.href);
                            }}
                            type="button"
                            className={cn(
                                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-12 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                                (pathname === submenuItem.href ||
                                    pathname?.startsWith(`${submenuItem.href}/`))
                                && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
                            )}
                        >
                            <div className="flex items-center gap-x-2 py-4">
                                {submenuItem.label}
                            </div>
                            <div
                                className={cn(
                                    "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
                                    (pathname === submenuItem.href ||
                                        pathname?.startsWith(`${submenuItem.href}/`))
                                    && "opacity-100"
                                )}
                            />
                        </button>
                    ))
                }
            </div>

        </div>
    )
}