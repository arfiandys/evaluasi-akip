import Header from "./_component/header";
import { PageWrapper } from "./_component/pagewrapper";
import { SideBar } from "./_component/sidebar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({
    children
}: ProtectedLayoutProps) => {
    return (
        <div>
            <SideBar></SideBar>
            <Header></Header>
            <PageWrapper>
                {children}
            </PageWrapper>
        </div>
    );
}

export default ProtectedLayout;