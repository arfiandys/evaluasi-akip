import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { AccountRole } from "@prisma/client";

interface LayoutClientProps {
    children: React.ReactNode
}

const LayoutClient = async ({
    children
}: LayoutClientProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutClient;