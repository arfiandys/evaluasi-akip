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
};

export const ImportTable = ({
    headers,
    body,
}: Props) => {
    return (
        <div className="rounded-md border max-h-[60vh] overflow-auto max-w-[90vw]">
            {body.length ? (
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
            ) : (
                <div className="w-full h-full flex justify-center items-center">Format isian tidak sesuai template, anda bisa download template terlabih dahulu</div>
            )}
        </div>
    )
}