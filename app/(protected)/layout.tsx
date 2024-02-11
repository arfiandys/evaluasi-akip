import { Navbar } from "./_component/navbar";
import { Sidebar } from "./_component/sidebar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({
    children
}: ProtectedLayoutProps) => {
    return (
        <div className="h-fit min-h-full bg-primary-foreground">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="pt-[80px] md:pl-80 h-full">
                {children}
            </main>
        </div>
    );
}

export default ProtectedLayout;