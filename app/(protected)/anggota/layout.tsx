import { RoleGate } from "@/components/auth/role-gate";
import { AccountRole } from "@prisma/client";

interface LayoutAnggotaProps {
    children: React.ReactNode
}

const LayoutAnggota = async ({
    children
}: LayoutAnggotaProps) => {
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutAnggota;