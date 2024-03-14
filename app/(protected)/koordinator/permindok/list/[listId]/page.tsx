import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { KodeForm } from "./_components/kode-form";
import { TahunForm } from "./_components/tahun-form";

const PermindokIdPage = async ({
    params
}: {
    params: { listId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const permindok = await db.permindok.findUnique({
        where: {
            id: params.listId,
        },
    });


    if (!permindok) {
        return redirect("/");
    }

    const requiredFields = [
        permindok.name,
        permindok.kode,
        permindok.tahun,
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
                            href={`/koordinator/permindok/list`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to permindok list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail permintaan dokumen
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                permindokId={params.listId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Edit detail permintaan dokumen
                            </h2>
                        </div>
                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <NameForm
                                initialData={permindok}
                                permindokId={params.listId}
                            />
                            <KodeForm
                                initialData={permindok}
                                permindokId={params.listId}
                            />
                            <TahunForm
                                initialData={permindok}
                                permindokId={params.listId}
                            />  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PermindokIdPage;