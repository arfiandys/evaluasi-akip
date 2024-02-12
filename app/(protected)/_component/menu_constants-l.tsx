import { SideNavItemGroup } from "@/types/type";
import { Building2, HelpCircle, Home, Settings, UserRoundCheck } from "lucide-react";

export const SIDENAV_ITEMS_ADMIN: SideNavItemGroup[] = [

    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/koordinator/tim-evaluasi',
            icon: <Home size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Tim Evaluasi',
                path: '/koordinator/tim-eval',
                icon: <UserRoundCheck size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'List', path: '/koordinator/tim-eval' },
                    { title: 'Create', path: '/koordinator/tim-eval/create' },
                    { title: 'Edit', path: '/koordinator/tim-eval/edit' },
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