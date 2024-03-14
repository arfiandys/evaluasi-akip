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
    const bodyStyle = cn("h-full bg-background flex-grow pt-16 2xl:pt-32",
        {
            ["sm:pl-[20rem] 2xl:pl-[0rem]"]: !toggleCollapse,
            ["sm:pl-[5.4rem] 2xl:pl-[0rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}