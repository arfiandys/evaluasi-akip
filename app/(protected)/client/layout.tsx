import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

interface LayoutClientProps {
    children: React.ReactNode
}

const LayoutClient = async ({
    children
}: LayoutClientProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={UserRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutClient;