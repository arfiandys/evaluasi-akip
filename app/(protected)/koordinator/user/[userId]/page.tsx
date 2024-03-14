import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { EmailForm } from "./_components/email-form";
import { PasswordForm } from "./_components/password-form";
import { RoleForm } from "./_components/role-form";

const UserIdPage = async ({
    params
}: {
    params: { userId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const user = await db.user.findUnique({
        where: {
            id: params.userId,
        },
        include: {
            accounts: true
        }
    });


    if (!user) {
        return redirect("/");
    }

    const requiredFields = [
        user.name,
        user.email,
        user.password,
        user.role,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/koordinator/user`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to user list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail pengguna
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                userId={params.userId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Edit detail pengguna
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">

                            <NameForm
                                initialData={user}
                                userId={user.id}
                            />
                            <RoleForm
                                initialData={user}
                                userId={user.id}
                            />
                            {!user.accounts.length && (
                                <EmailForm
                                    initialData={user}
                                    userId={user.id}
                                />
                            )}
                            {!user.accounts.length && (
                                <PasswordForm
                                    initialData={user}
                                    userId={user.id}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserIdPage;