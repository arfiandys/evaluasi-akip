"use client"
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
    const user = useCurrentUser();
    return (
        <div className="h-full flex justify-center items-center">
                <UserInfo
                    label="Client component"
                    user={user}
                />
        </div>
    );
}

export default ClientPage;