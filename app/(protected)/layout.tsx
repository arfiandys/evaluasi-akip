import { currentUser } from "@/lib/auth";
import Header from "./_component/header";
import { PageWrapper } from "./_component/pagewrapper";
import { SideBar } from "./_component/sidebar";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = async ({
    children
}: ProtectedLayoutProps) => {
    const user = await currentUser();
    const asUser = await db.user.findUnique({
        where: {
            id: user?.id,
        },
        include: {
            unitKerjas: {
                orderBy: {
                    unitKerjaId: "asc"
                }
            },
            timEvaluasis: {
                orderBy: {
                    timEvaluasiId: "asc"
                }
            }
        }
    });



    return (
        // <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <div>
            <SideBar asUser={asUser}/>
            <Header></Header>
            <PageWrapper>
                {children}
            </PageWrapper>
        </div>
    );
}

export default ProtectedLayout;