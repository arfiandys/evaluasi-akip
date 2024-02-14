import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { SalaryForm } from "./_components/salary-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChapterForm } from "./_components/chapter-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import Link from "next/link";

const TimEvaluasiIdPage = async ({
    params
}: {
    params: { teamId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const team = await db.team.findUnique({
        where: {
            id: params.teamId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!team) {
        return redirect("/");
    }

    const requiredFields = [
        team.name,
        team.description,
        team.imageUrl,
        team.price,
        team.categoryId,
        team.chapters.some(chapter => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!team.isPublished && (
                <Banner
                    label="This team is unpublished. It will not be visible to the user."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/koordinator/teamId`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to team list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Team setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                teamId={params.teamId}
                                isPublished={team.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your team
                            </h2>
                        </div>
                        <NameForm
                            initialData={team}
                            teamId={team.id}
                        />
                        <DescriptionForm
                            initialData={team}
                            teamId={team.id}
                        />
                        <ImageForm
                            initialData={team}
                            teamId={team.id}
                        />
                        <CategoryForm
                            initialData={team}
                            teamId={team.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Team members
                                </h2>
                            </div>
                            <ChapterForm
                                initialData={team}
                                teamId={team.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">
                                    Team salary
                                </h2>
                            </div>
                            <SalaryForm
                                initialData={team}
                                teamId={team.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resources & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={team}
                                teamId={team.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TimEvaluasiIdPage;