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
    const bodyStyle = cn("h-screen bg-background flex-grow pt-16",
        {
            ["sm:pl-[20rem]"]: !toggleCollapse,
            ["sm:pl-[5.4rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}