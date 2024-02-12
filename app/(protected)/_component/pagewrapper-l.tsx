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
    const bodyStyle = cn("bg-background flex-grow mt-16 px-4",
        {
            ["sm:pl-[21rem]"]: !toggleCollapse,
            ["sm:pl-[6.4rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}