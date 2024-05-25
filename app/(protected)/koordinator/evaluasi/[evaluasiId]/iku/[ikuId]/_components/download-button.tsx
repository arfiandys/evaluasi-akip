"use client"
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCSVDownloader } from "react-papaparse";

export const DownloadButton = () => {
    const { CSVDownloader } = useCSVDownloader();
    return (
        <Button
            asChild
            size="sm"
            className="w-full lg:w-auto cursor-pointer"
        >
            <CSVDownloader
                filename={'template_IKU'}
                bom={true}
                config={
                    {
                        delimiter: ',',
                    }
                }
                data={[
                    {
                        "jenis": "tujuan",
                        "nama": "Nama tujuan",
                        "kode": 1
                    },
                    {
                        "jenis": "sasaran",
                        "nama": "Nama sasaran",
                        "kode": 1.1
                    },
                    {
                        "jenis": "indikator",
                        "nama": "Nama indikator",
                        "kode": "1.1.1"
                    },
                    {
                        "jenis": "",
                        "nama": "",
                        "kode": ""
                    },
                    {
                        "jenis": "",
                        "nama": "",
                        "kode": ""
                    },
                    {
                        "jenis": "",
                        "nama": "",
                        "kode": ""
                    },
                    {
                        "jenis": "~Notes: lengkapi kolom di atas sebagaimana mestinya, kosongi cell apabila tidak diperlukan.",
                        "nama": "",
                        "kode": ""
                    },
                    {
                        "jenis": "~Pengisian jenis harus sama yaitu lowercase \"tujuan, sasaran, dan indikator\".",
                        "nama": "",
                        "kode": ""
                    },
                    {
                        "jenis": "~Kode isikan seperti pada contoh.",
                        "nama": "",
                        "kode": ""
                    }
                ]}
            >

                <Download className="size-4 mr-2" />
                Download template
            </CSVDownloader>
        </Button>
    );
};