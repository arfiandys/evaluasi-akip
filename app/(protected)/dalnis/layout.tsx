import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

interface LayoutDalnisProps {
    children: React.ReactNode
}

const LayoutDalnis = async ({
    children
}: LayoutDalnisProps) => {
    return (
        <RoleGate allowedRole={UserRole.DALNIS}>
            {children}
        </RoleGate>
    );
}

export default LayoutDalnis;