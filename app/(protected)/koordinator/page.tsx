import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

const KoordinatorPage = () => {
    return (
        <div className="h-full flex justify-center items-center">
            <RoleGate allowedRole={UserRole.ADMIN}>
                Koordinator Page
            </RoleGate>
        </div>
    );
}

export default KoordinatorPage;