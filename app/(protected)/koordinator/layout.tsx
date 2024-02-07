import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

interface LayoutKoordinatorProps {
    children: React.ReactNode
}

const LayoutKoordinator = async ({
    children
}: LayoutKoordinatorProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={UserRole.ADMIN}>
            {children}
        </RoleGate>
    );
}

export default LayoutKoordinator;