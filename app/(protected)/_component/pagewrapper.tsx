'use client'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
    children: React.ReactNode;
}

export const PageWrapper = ({
    children
}: PageWrapperProps) => {

    const { toggleCollapse } = useSideBarToggle();
    const bodyStyle = cn("h-full flex-grow pt-16 xl:pt-32",
        {
            ["sm:pl-[20rem] xl:pl-[0rem]"]: !toggleCollapse,
            ["sm:pl-[5.4rem] xl:pl-[0rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}