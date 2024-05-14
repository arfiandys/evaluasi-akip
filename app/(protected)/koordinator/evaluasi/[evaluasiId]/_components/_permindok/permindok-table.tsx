import { DataTable } from "../_permindok/_components/data-table";
import { columns } from "../_permindok/_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings } from "lucide-react";

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
import { Evaluasi, Permindok } from "@prisma/client";

interface PermindokPageProps {
    evaluasiId: string;
    permindok: (Permindok & {
        evaluasi: Evaluasi,
    })[];
};

export const PermindokPage = ({ evaluasiId, permindok }: PermindokPageProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Permindok</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={permindok} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/permindok`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PermindokPage;