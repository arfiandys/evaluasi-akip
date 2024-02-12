import { useSideBarToggle } from '@/hooks/use-sidebar-toggle'
import { SideNavItemGroup } from '@/types/type'
import React from 'react'
import { SideBarMenuItem } from './sidebar-menu-item';
import { cn } from '@/lib/utils';

interface SideBarMenuGroupProps {
    menuGroup: SideNavItemGroup;
}

const SideBarMenuGroup = ({ menuGroup }: SideBarMenuGroupProps ) => {

    const { toggleCollapse } = useSideBarToggle();

    const menuGroupTitleSyle = cn('py-4 tracking-[.1rem] font-medium uppercase text-sm',
        {
            'text-center': toggleCollapse
        }
    )
    return (
        <>
            <h3 className={menuGroupTitleSyle}>{!toggleCollapse ? menuGroup.title : ''}</h3>
            {
                menuGroup.menuList?.map((item, index) => {
                    return <SideBarMenuItem key={index} item={item} />
                })
            }
        </>
    )
}

export default SideBarMenuGroup