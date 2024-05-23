import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

interface LayoutKetuaProps {
    children: React.ReactNode
}

const LayoutKetua = async ({
    children
}: LayoutKetuaProps) => {
    return (
        <RoleGate allowedRole={UserRole.KETUA}>
            {children}
        </RoleGate>
    );
}

export default LayoutKetua;