import { DataTable } from "../_variabelKKE/_components/data-table";
import { columns } from "../_variabelKKE/_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings, Table2 } from "lucide-react";

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
import { KomponenLKE, KriteriaKKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelKKE, VariabelKKEUnitKerja, VariabelLKE } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";

interface VariabelKKEProps {
    evaluasiId: string;
    variabelKKE: (VariabelKKE & {
        kriteriaKKE: KriteriaKKE | null,
        variabelLKE: VariabelLKE | null,
        variabelUnitKerja: VariabelKKEUnitKerja[],
    })[];
};

export const VariabelKKEPage = ({ evaluasiId, variabelKKE }: VariabelKKEProps) => {

    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-start items-center gap-x-4">
                <div>
                    <IconBadge icon={Table2} />
                </div>
                <div >
                    <CardDescription>Variabel KKE</CardDescription>
                    <CardTitle>{variabelKKE.length}</CardTitle>
                </div>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-4 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/kke/variabel`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default VariabelKKEPage;