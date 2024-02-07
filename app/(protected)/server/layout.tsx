import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

interface LayoutServerProps {
    children: React.ReactNode
}

const LayoutServer = async ({
    children
}: LayoutServerProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={UserRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutServer;