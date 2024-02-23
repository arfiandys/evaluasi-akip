import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

interface LayoutAnggotaProps {
    children: React.ReactNode
}

const LayoutAnggota = async ({
    children
}: LayoutAnggotaProps) => {
    return (
        <RoleGate allowedRole={UserRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutAnggota;