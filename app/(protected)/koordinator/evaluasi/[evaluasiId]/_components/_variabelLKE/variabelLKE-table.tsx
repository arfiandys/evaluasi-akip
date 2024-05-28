import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings, TableProperties } from "lucide-react";

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
import { KomponenLKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { IconBadge } from "@/components/icon-badge";

interface VariabelLKEProps {
    evaluasiId: string;
    variabelLKE: (VariabelLKE & {
        komponenLKE: KomponenLKE | null,
        subKomponenLKE: SubKomponenLKE | null,
        kriteriaLKE: KriteriaLKE | null,
        subKriteriaLKE: SubKriteriaLKE | null,
        unitKerjas: LKEUnitKerja[]
    })[];
};

export const VariabelLKEPage = ({ evaluasiId, variabelLKE }: VariabelLKEProps) => {

    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-start items-center gap-x-4">
                <div>
                    <IconBadge icon={TableProperties} />
                </div>
                <div >
                    <CardDescription>Variabel LKE</CardDescription>
                    <CardTitle>{variabelLKE.length}</CardTitle>
                </div>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-4 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lke/variabel`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default VariabelLKEPage;