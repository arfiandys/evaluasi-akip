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
                filename={'template_Permindok'}
                bom={true}
                config={
                    {
                        delimiter: ',',
                    }
                }
                data={[
                    {
                      "name": "Nama permindok",
                      "kode": 1
                    },
                    {
                      "name": "",
                      "kode": ""
                    },
                    {
                      "name": "",
                      "kode": ""
                    },
                    {
                      "name": "",
                      "kode": ""
                    },
                    {
                      "name": "",
                      "kode": ""
                    },
                    {
                      "name": "~Notes: lengkapi kolom di atas sebagaimana mestinya, kosongi cell apabila tidak diperlukan.",
                      "kode": ""
                    },
                    {
                      "name": "~Kode harus angka",
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