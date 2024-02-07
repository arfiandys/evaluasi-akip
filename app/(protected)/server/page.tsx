import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
    const user = await currentUser();
    return (
        <div className="h-full flex justify-center">
                <UserInfo
                    label="Server component"
                    user={user}
                />
        </div>
    );
}

export default ServerPage;