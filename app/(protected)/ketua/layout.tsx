import { RoleGate } from "@/components/auth/role-gate";
import { AccountRole } from "@prisma/client";

interface LayoutKetuaProps {
    children: React.ReactNode
}

const LayoutKetua = async ({
    children
}: LayoutKetuaProps) => {
    return (
        <RoleGate allowedRole={AccountRole.USER}>
            {children}
        </RoleGate>
    );
}

export default LayoutKetua;