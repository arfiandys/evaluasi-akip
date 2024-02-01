"use client"
import { RoleGate } from "@/components/auth/role-gate";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";

const ClientPage = () => {
    const user = useCurrentUser();
    return (
        <div className="h-full flex justify-center items-center">
            <RoleGate allowedRole={UserRole.USER}>
                <UserInfo
                    label="Client component"
                    user={user}
                />
            </RoleGate>
        </div>
    );
}

export default ClientPage;