"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, User, User2, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UnitKerja, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { PimpinanForm } from "./pimpinan-form";
import { PICForm } from "./pic-form";

interface PimpinanFormProps {
    initialData: UnitKerja & { users: UserOnUnitKerja[] };
    unitKerjaId: string;
    options: { label: string; value: string; }[];
};


export const StepForm = ({
    initialData,
    unitKerjaId,
    options,
}: PimpinanFormProps) => {
    const [step, setStep] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const existingPimpinan = initialData.users.some((item)=> item.assignedRole === UserRole.PIMPINAN)
    const existingPIC = initialData.users.some((item)=> item.assignedRole === UserRole.PIC)



    return (
        <div className="p-4">
            <ol className="flex items-center w-full mb-4 sm:mb-5">
                <li className={`flex w-full items-center ${existingPimpinan ? ("text-sky-700 dark:text-sky-600") : ("")} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${step||existingPIC?("after:border-sky-200 dark:after:border-sky-900"):("after:border-gray-100 dark:after:border-gray-700")}`}>
                    <div className={`flex items-center justify-center px-2 w-fit h-10 ${existingPimpinan?("bg-sky-200 dark:bg-sky-900"):("bg-gray-100 dark:bg-gray-700")} rounded-lg lg:h-12 lg:w-fit shrink-0`}>
                        <UserCheck className="mr-2" />
                        Pimpinan
                    </div>
                </li>
                <li className={`flex w-full items-center ${existingPIC ? ("text-sky-700 dark:text-sky-600") : ("")}`}>
                    <div className={`flex items-center justify-center px-2 w-fit h-10 ${existingPIC?("bg-sky-200 dark:bg-sky-900"):("bg-gray-100 dark:bg-gray-700")}  rounded-xl lg:h-12 lg:w-fit shrink-0`}>
                        <User className="mr-2" />
                        PIC
                    </div>
                </li>
            </ol>
            <div >
                {step ? (
                    <div className="space-y-4">
                        <PICForm
                            initialData={initialData}
                            unitKerjaId={unitKerjaId}
                            options={options}
                        />
                        <Button onClick={()=>{setStep(false)}}>
                            Kembali
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <PimpinanForm
                            initialData={initialData}
                            unitKerjaId={unitKerjaId}
                            options={options}
                        />
                        <Button onClick={()=>{setStep(true)}} disabled={!existingPimpinan}>
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}