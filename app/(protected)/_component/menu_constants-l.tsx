import { SideNavItemGroup } from "@/types/type";
import { UserRole, AccountRole } from "@prisma/client";
import { Building2, ClipboardPenLine, FileCheck, HelpCircle, Home, Settings, Sheet, TableProperties, User, User2, UserCheck2, UserRoundCheck, Users } from "lucide-react";

export const SIDENAV_ITEMS_ADMIN: SideNavItemGroup[] = [

    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Tim Evaluasi',
                path: '/koordinator/tim-evaluasi',
                icon: <Users size={20} />,
            },
            {
                title: 'Unit Kerja',
                path: '/koordinator/unit-kerja',
                icon: <Building2 size={20} />,
            },
            {
                title: 'Pengguna',
                path: '/koordinator/user',
                icon: <User size={20} />,
            },
            {
                title: 'Evaluasi',
                path: '/koordinator/evaluasi',
                icon: <ClipboardPenLine size={20} />,
            },
        ]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const SIDENAV_ITEMS_USER: SideNavItemGroup[] = [

    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];


export const SIDENAV_ITEMS_ANGGOTA: SideNavItemGroup[] = [
    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Evaluasi',
                path: '/anggota/evaluasi',
                icon: <Sheet size={20} />,
            },
        ]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const SIDENAV_ITEMS_KETUA: SideNavItemGroup[] = [
    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Evaluasi',
                path: '/ketua/evaluasi',
                icon: <Sheet size={20} />,
            },
        ]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const SIDENAV_ITEMS_DALNIS: SideNavItemGroup[] = [
    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Evaluasi',
                path: '/dalnis/evaluasi',
                icon: <Sheet size={20} />,
            },
        ]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const SIDENAV_ITEMS_PIC: SideNavItemGroup[] = [
    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Evaluasi',
                path: '/pic/evaluasi',
                icon: <Sheet size={20} />,
            },
        ]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const SIDENAV_ITEMS_PIMPINAN: SideNavItemGroup[] = [
    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Others",
        menuList: [
            {
                title: 'Settings',
                path: '/settings',
                icon: <Settings size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <HelpCircle size={20} />,
            }
        ]
    },
];

export const accounts = [
    {
        label: "Ketua tim",
        role: "ketua",
        enumRole: UserRole.KETUA,
        icon: <User2 size={20} />,
        route: SIDENAV_ITEMS_KETUA
    },
    {
        label: "Anggota tim",
        role: "anggota",
        enumRole: UserRole.ANGGOTA,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_ANGGOTA
    },
    {
        label: "Dalnis tim",
        role: "dalnis",
        enumRole: UserRole.DALNIS,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_DALNIS
    },
    {
        label: "Pimpinan unit kerja",
        role: "pimpinan",
        enumRole: UserRole.PIMPINAN,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_PIMPINAN
    },
    {
        label: "PIC unit kerja",
        role: "pic",
        enumRole: UserRole.PIC,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_PIC
    },
    {
        label: "Koordinator tim",
        role: "admin",
        enumRole: UserRole.KOORDINATOR,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_ADMIN
    },
    {
        label: "User default",
        role: "user",
        enumRole: UserRole.NONE,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_USER
    },
]

export type Account = (typeof accounts)[number]