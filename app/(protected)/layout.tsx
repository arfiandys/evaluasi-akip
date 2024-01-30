import { Navbar } from "./_component/navbar";
import { OrgSidebar } from "./_component/org-sidebar";
import { Sidebar } from "./_component/sidebar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({
    children
}: ProtectedLayoutProps) => {
    return (
        <main className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <Sidebar />
            <div className="pl-[60px] h-full">
                <div className="flex h-full">
                    <OrgSidebar />
                    <div className="h-full flex-1">
                        <Navbar />
                        {children}
                    </div>
                </div>
            </div>

        </main>
    );
}

export default ProtectedLayout;