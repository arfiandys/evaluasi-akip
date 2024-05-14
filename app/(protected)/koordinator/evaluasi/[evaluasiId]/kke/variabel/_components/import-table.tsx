import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange,
}: Props) => {
    return (
        <div className="rounded-md border max-h-[60vh] overflow-auto overflow-x-scroll max-w-[90vw]">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((item, index) => (
                            <TableHead key={index}>{item}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (

                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index} className="font-medium">{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}