import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { EmailForm } from "./_components/email-form";
import { PasswordForm } from "./_components/password-form";
import { RoleForm } from "./_components/role-form";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
                <div className=" mt-20 grid gap-6 grid-cols-4">
                    <Card className="shadow-lg col-span-4 sm:col-span-1 xl:col-span-1 2xl:col-span-1 rounded-3xl h-fit">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Activity} />
                                <CardTitle>Rincian dasar</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <NameForm
                                initialData={user}
                                userId={user.id}
                            />
                            <Separator orientation="horizontal" />
                            <RoleForm
                                initialData={user}
                                userId={user.id}
                            />
                            <Separator orientation="horizontal" />
                            {!user.accounts.length && (
                                <EmailForm
                                    initialData={user}
                                    userId={user.id}
                                />
                            )}
                            <Separator orientation="horizontal" />
                            {!user.accounts.length && (
                                <PasswordForm
                                    initialData={user}
                                    userId={user.id}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default UserIdPage;