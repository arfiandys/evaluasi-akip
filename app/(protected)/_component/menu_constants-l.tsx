import { SideNavItemGroup } from "@/types/type";
import { Building2, HelpCircle, Home, Settings, TableProperties, User, UserRoundCheck } from "lucide-react";

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
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/koordinator/tim-evaluasi' },
                    { title: 'Create', path: '/koordinator/tim-evaluasi/create' },
                    { title: 'Edit', path: '/koordinator/tim-evaluasi/edit' },
                ],
            },
            {
                title: 'Unit Kerja',
                path: '/koordinator/unit-kerja',
                icon: <Building2 size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/koordinator/unit-kerja' },
                    { title: 'Create', path: '/koordinator/unit-kerja/create' },
                    { title: 'Edit', path: '/koordinator/unit-kerja/edit' },
                ],
            },
            {
                title: 'Pengguna',
                path: '/koordinator/user',
                icon: <User size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/koordinator/user' },
                    { title: 'Create', path: '/koordinator/user/create' },
                    { title: 'Edit', path: '/koordinator/user/edit' },
                ],
            },
            {
                title: 'Variabel LKE',
                path: '/koordinator/komponen-lke',
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
        title: "Manage",
        menuList: [
            {
                title: 'Tim Evaluasi',
                path: '/pic-kabkota',
                icon: <UserRoundCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/pic-kabkota/team-list' },
                    { title: 'Create', path: '/pic-kabkota/team-list/create' },
                ],
            },
            {
                title: 'Unit Kerja',
                path: '/pic-kabkota',
                icon: <Building2 size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/pic-kabkota/unit-kerja' },
                    { title: 'Create', path: '/pic-kabkota/unit-kerja/create' },
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