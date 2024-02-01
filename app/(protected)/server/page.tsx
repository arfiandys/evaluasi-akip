import { RoleGate } from "@/components/auth/role-gate";
import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const ServerPage = async () => {
    const user = await currentUser();
    return (
        <div className="h-full flex justify-center items-center">
            <RoleGate allowedRole={UserRole.USER}>
                <UserInfo
                    label="Server component"
                    user={user}
                />
            </RoleGate>
        </div>
    );
}

export default ServerPage;