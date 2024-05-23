"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight, PlusCircle, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Permindok, LHE, UnitKerja, } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface LHEUnitKerjaProps {
    evaluasiId: string;
    LHE: (LHE & { unitKerja: UnitKerja })[];
};

export const LHEUnitKerjaPage = ({ evaluasiId, LHE }: LHEUnitKerjaProps) => {
    function createCategorizedArray(data: (LHE & { unitKerja: UnitKerja })[]): { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } {
        const categorizedArray: { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } = {};

        data.forEach(item => {
            const { unitKerjaId } = item;
            if (!categorizedArray[unitKerjaId]) {
                categorizedArray[unitKerjaId] = [];
            }
            categorizedArray[unitKerjaId].push(item);
        });

        return categorizedArray;
    }

    const categorizedData: { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } = createCategorizedArray(LHE);

    const arrayOfArrayObject: { unitKerjaId: string; items: (LHE & { unitKerja: UnitKerja })[] }[] = Object.entries(categorizedData).map(([unitKerjaId, items]) => ({
        unitKerjaId,
        items
    }));

    const dataArray: {
        UnitKerja: string,
        Dokumen: boolean,

    }[] = arrayOfArrayObject.map((objek) => {
        let url = false;
        let unit = "";

        objek.items.forEach(obj => {
            if (obj["url"] !== undefined && obj["url"] !== null && obj["url"] !== '') {
                url = true;
            }
            if (obj.unitKerja.name) {
                unit = obj.unitKerja.name
            }
        });
        return {
            UnitKerja: unit,
            Dokumen: url,
        };
    });
    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>LHE Unit Kerja</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-6 overflow-auto">
                <div className="h-[350px] space-y-6">
                    {dataArray.map((item) => (
                        <div key={item.UnitKerja} className="space-y-8">
                            <div className="flex items-center">
                                <Building2 />
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.UnitKerja}</p>
                                </div>
                                <div className="ml-auto font-medium">
                                    {item.Dokumen ? (
                                        <Badge variant="default">Terkirim</Badge>
                                    ) : (
                                        <Badge variant="secondary">Tidak terkirim</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-6 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lhe`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LHEUnitKerjaPage;