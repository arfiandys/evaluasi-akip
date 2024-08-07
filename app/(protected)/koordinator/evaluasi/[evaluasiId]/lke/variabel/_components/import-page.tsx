"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { ImportCard } from "./import-card";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { Evaluasi } from "@prisma/client";
import { DownloadButton } from "./download-button";
import { useCSVDownloader } from "react-papaparse";
import { Download } from "lucide-react";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULT = {
    data: [],
    errors: [],
    meta: {},
};

interface ImportProps {
    evaluasi: Evaluasi | null;
}


const ImportPage = ({ evaluasi }: ImportProps) => {
    const router = useRouter();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULT);
    const [loading, setLoading] = useState(false)

    const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
        const bodynot: string[][] = results.data.slice(1);
        const body = bodynot.filter((item) => {
            return item.length === 14
        })
        if (!body.length) {
            toast.error("Format isian tidak sesuai template, anda bisa download template terlabih dahulu")
        } else {
            setImportResult(results);
            setVariant(VARIANTS.IMPORT);
        }
    };

    const onCancelImport = () => {
        setImportResult(INITIAL_IMPORT_RESULT);
        setVariant(VARIANTS.LIST);
    };

    const { CSVDownloader } = useCSVDownloader();

    const onSubmit = async (values: any[]) => {
        setLoading(true)
        const dataSorted = values.sort((a, b) => {
            const levelOrder: any = { "komponen": 0, "subKomponen": 1, "kriteria": 2, "subKriteria": 3 };
            return levelOrder[a.level] - levelOrder[b.level];
        });
        const dataFiltered = dataSorted.filter((item) => {
            if ((item.level === "komponen") || (item.level === "subKomponen") || (item.level === "kriteria") || (item.level === "subKriteria")) {
                return item
            }
        })
        const value = {
            data: dataFiltered,
            evaluasiId: evaluasi?.id
        }
        console.log(dataFiltered)
        try {
            const response = await axios.post("/api/lke/variabel/import", value);
            if (response.data.return.length) {
                toast("Terdapat beberapa kesalahan dalam melakukan import", {
                    description: (
                        <Button
                            asChild
                            size="sm"
                            className="w-auto cursor-pointer mt-2"
                        >
                            <CSVDownloader
                                filename={'error_variabel_LKE'}
                                bom={true}
                                config={
                                    {
                                        delimiter: ',',
                                    }
                                }
                                data={response.data.return}
                            >

                                <Download className="size-4 mr-2" />
                                Download kesalahan
                            </CSVDownloader>
                        </Button>)
                })
                router.refresh()
            } else {
                toast.success("Variabel LKE berhasil dibuat!")
                router.refresh()
            }
        } catch {
            toast.error("Terdapat kesalahan!");
        } finally {
            setLoading(false)
        }
        setImportResult(INITIAL_IMPORT_RESULT);
        setVariant(VARIANTS.LIST);
    }

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 z-[100] w-screen h-screen items-center block bg-primary/50">
                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Import variabel LKE</Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-xl mx-auto flex justify-center">
                    {(variant === VARIANTS.IMPORT) ? (
                        <ImportCard
                            data={importResult.data}
                            onCancel={onCancelImport}
                            onSubmit={onSubmit}
                        />
                    ) : (
                        <Card className="border-0 shadow-none w-full">
                            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                                <CardTitle>Import variabel LKE</CardTitle>
                                <div className="flex flex-row gap-x-4">
                                    <UploadButton onUpload={onUpload} />
                                    <DownloadButton />
                                </div>
                            </CardHeader>
                        </Card>
                    )}

                </DialogContent>
            </Dialog>
        </>
    );
}

export default ImportPage;