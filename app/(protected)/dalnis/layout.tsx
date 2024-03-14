import { RoleGate } from "@/components/auth/role-gate";
import { AccountRole } from "@prisma/client";

interface LayoutDalnisProps {
    children: React.ReactNode
}

const LayoutDalnis = async ({
    children
}: LayoutDalnisProps) => {
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutDalnis;