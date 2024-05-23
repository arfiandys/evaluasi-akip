import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

interface LayoutKetuaProps {
    children: React.ReactNode
}

const LayoutPIC = async ({
    children
}: LayoutKetuaProps) => {
    return (
        <RoleGate allowedRole={UserRole.PIMPINAN}>
            {children}
        </RoleGate>
    );
}

export default LayoutPIC;