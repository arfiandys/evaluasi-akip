import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { AccountRole } from "@prisma/client";

interface LayoutServerProps {
    children: React.ReactNode
}

const LayoutServer = async ({
    children
}: LayoutServerProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutServer;