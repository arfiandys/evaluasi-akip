import Header from "./_component/header-l";
import { PageWrapper } from "./_component/pagewrapper-l";
import { SideBar } from "./_component/sidebar-l";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({
    children
}: ProtectedLayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <SideBar></SideBar>
            <Header></Header>
            <PageWrapper>
                {children}
            </PageWrapper>
        </div>
    );
}

export default ProtectedLayout;