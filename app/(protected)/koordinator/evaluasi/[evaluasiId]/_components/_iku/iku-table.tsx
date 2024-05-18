import { DataTable } from "../_iku/_components/data-table";
import { columns } from "../_iku/_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ChevronRight, PlusCircle, Settings } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Evaluasi, IKU } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";

interface IKUViewPageProps {
    evaluasiId: string;
    iku: (IKU)[];
};

export const IKUViewPage = ({ evaluasiId, iku }: IKUViewPageProps) => {

    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-start items-center gap-x-4">
                <div>
                    <IconBadge icon={Activity} />
                </div>
                <div >
                    <CardDescription>IKU</CardDescription>
                    <CardTitle>{iku.length}</CardTitle>
                </div>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-4 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/iku`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default IKUViewPage;