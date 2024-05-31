import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import { ImportTable } from "./import-table";

const requiredOptions = [
    "nama",
    "kode",
    "bobot",
    "tahun",
];

interface SelectedColumnState {
    [key: string]: string | null;
}

type Props = {
    data: string[][];
    onCancel: () => void
    onSubmit: (data: any) => void;
}
export const ImportCard = ({
    data, onSubmit, onCancel
}: Props) => {
    const headers = data[0];
    const bodynot = data.slice(1);
    const body = bodynot.filter((item) => {
        return item.length === 2
    })

    const handleContinue = () => {
        const arrayOfData = body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = headers[index];
                acc[header] = cell;
                return acc;
            }, {});
        });

        const formattedData = arrayOfData.map((item) => ({
            ...item,
        }));
        
        onSubmit(formattedData)
    }
    return (
        <Card className="border-0 shadow-none w-full">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle>Import permindok</CardTitle>
                <div className="flex flex-row gap-x-4">
                    <Button onClick={handleContinue}>
                        Lanjutkan
                    </Button>
                    <Button onClick={onCancel}>
                        Batal
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ImportTable
                    headers={headers}
                    body={body}
                />
            </CardContent>
        </Card>
    )
}