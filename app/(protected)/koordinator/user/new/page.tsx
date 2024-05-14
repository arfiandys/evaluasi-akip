import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import UserNewCreate from "./create-form";

const UserNewPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Membuat pengguna baru
                            </h1>
                        </div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/user`}>Pengguna</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Pengguna baru</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-16">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h2 className="text-xl font-medium">
                                    Detail
                                </h2>
                                <span className="text-sm text-secondary-foreground">
                                    Nama, email, password...
                                </span>
                            </div>
                        </div>
                    </div>
                    <UserNewCreate />
                </div>
            </div>
        </>
    );
}

export default UserNewPage;