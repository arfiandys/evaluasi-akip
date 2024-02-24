import { RoleGate } from "@/components/auth/role-gate";
import { currentUser } from "@/lib/auth";
import { AccountRole } from "@prisma/client";

interface LayoutPICKabKotaProps {
    children: React.ReactNode
}

const LayoutPICKabKota = async ({
    children
}: LayoutPICKabKotaProps) => {
    const user = await currentUser();
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutPICKabKota;