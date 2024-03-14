import { SideNavItemGroup } from "@/types/type";
import { UserRole, AccountRole } from "@prisma/client";
import { Building2, FileCheck, HelpCircle, Home, Settings, Sheet, TableProperties, User, User2, UserCheck2, UserRoundCheck } from "lucide-react";

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
                icon: <UserRoundCheck size={20} />,
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
                title: 'LKE',
                path: '/koordinator/lke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'Komponen', path: '/koordinator/lke/komponen' },
                    { title: 'Variabel', path: '/koordinator/lke/variabel' },
                    { title: 'Generate LKE', path: '/koordinator/lke/generate-lke' },
                ],
            },
            {
                title: 'KKE',
                path: '/koordinator/kke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'Kelompok Kriteria', path: '/koordinator/kke/kelompok-kriteria' },
                    { title: 'Variabel KKE', path: '/koordinator/kke/variabel' },
                    { title: 'Variabel IKU', path: '/koordinator/kke/variabel-iku' },
                    { title: 'IKU Unit Kerja', path: '/koordinator/kke/variabelIKUUnitKerja' },
                    { title: 'KKE Unit Kerja', path: '/koordinator/kke/variabelKKEUnitKerja' },
                ],
            },
            {
                title: 'Permindok',
                path: '/koordinator/permindok',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/koordinator/permindok/list' },
                    { title: 'Generate permindok', path: '/koordinator/permindok/generate-permindok' },
                ],
            },
            {
                title: 'IKU Unit Kerja',
                path: '/koordinator/iku',
                icon: <TableProperties size={20} />,
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
                title: 'LKE',
                path: '/anggota/lke',
                icon: <Sheet size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/anggota/lke/list' },
                ],
            },
            {
                title: 'KKE',
                path: '/anggota/kke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/anggota/kke/list' },
                ],
            },
            {
                title: 'Permindok',
                path: '/anggota/permindok',
                icon: <FileCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/anggota/permindok/list' },
                ],
            },
            {
                title: 'Unit kerja',
                path: '/anggota/unitKerja',
                icon: <Building2 size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/anggota/unitKerja/list' },
                ],
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
                title: 'LKE',
                path: '/ketua/lke',
                icon: <Sheet size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/ketua/lke/list' },
                ],
            },
            {
                title: 'KKE',
                path: '/ketua/kke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/ketua/kke/list' },
                ],
            },
            {
                title: 'Permindok',
                path: '/ketua/permindok',
                icon: <FileCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/ketua/permindok/list' },
                ],
            },
            {
                title: 'Unit kerja',
                path: '/ketua/unitKerja',
                icon: <Building2 size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/ketua/unitKerja/list' },
                ],
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
                title: 'LKE',
                path: '/dalnis/lke',
                icon: <Sheet size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/dalnis/lke/list' },
                ],
            },
            {
                title: 'KKE',
                path: '/dalnis/kke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/dalnis/kke/list' },
                ],
            },
            {
                title: 'Permindok',
                path: '/dalnis/permindok',
                icon: <FileCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/dalnis/permindok/list' },
                ],
            },
            {
                title: 'Unit kerja',
                path: '/dalnis/unitKerja',
                icon: <Building2 size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/dalnis/unitKerja/list' },
                ],
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
                title: 'KKE',
                path: '/pic/kke',
                icon: <TableProperties size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/pic/kke/list' },
                ],
            },
            {
                title: 'Permindok',
                path: '/pic/permindok',
                icon: <FileCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/pic/permindok' },
                ],
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
        enumRole: AccountRole.ADMIN,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_ADMIN
    },
    {
        label: "User default",
        role: "user",
        enumRole: AccountRole.USER,
        icon: <UserCheck2 size={20} />,
        route: SIDENAV_ITEMS_USER
    },
]

export type Account = (typeof accounts)[number]