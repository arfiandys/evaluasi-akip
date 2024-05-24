"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, User2, UserCheck, UserCheck2, X } from "lucide-react";
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
import { TimEvaluasi, UnitKerja, User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { AnggotaForm } from "./anggota-form";
import { KetuaForm } from "./ketua-form";
import { DalnisForm } from "./dalnis-form";

interface PimpinanFormProps {
    initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
    initialData_User: (User & { unitKerjas: UserOnUnitKerja[] })[];
    timEvaluasiId: string;
    options: { label: string; value: string; }[];
    options_unitKerja: { label: string; value: string; }[];
};


export const StepForm = ({
    initialData,
    initialData_User,
    timEvaluasiId,
    options,
    options_unitKerja
}: PimpinanFormProps) => {
    const [step, setStep] = useState(false);
    const [step2, setStep2] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const existingDalnis = initialData.users.some((item) => item.assignedRole === UserRole.DALNIS)
    const existingKetua = initialData.users.some((item) => item.assignedRole === UserRole.KETUA)
    const existingAnggota = initialData.users.some((item) => item.assignedRole === UserRole.ANGGOTA)


    return (
        <div className="p-4">
            <ol className="flex items-center w-full mb-4 sm:mb-5">
                <li className={`flex w-full items-center ${existingDalnis ? ("text-sky-700 dark:text-sky-600") : ("")} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${step2 || existingKetua ? ("after:border-sky-200 dark:after:border-sky-900") : ("after:border-gray-100 dark:after:border-gray-700")}`}>
                    <div className={`flex items-center justify-center px-2 w-fit h-10 ${existingDalnis ? ("bg-sky-200 dark:bg-sky-900") : ("bg-gray-100 dark:bg-gray-700")} rounded-lg lg:h-12 lg:w-fit shrink-0`}>
                        <UserCheck className="mr-2" />
                        Pengendali teknis
                    </div>
                </li>
                <li className={`flex w-full items-center ${existingKetua ? ("text-sky-700 dark:text-sky-600") : ("")} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${step || existingAnggota ? ("after:border-sky-200 dark:after:border-sky-900") : ("after:border-gray-100 dark:after:border-gray-700")}`}>
                    <div className={`flex items-center justify-center px-2 w-fit h-10 ${existingKetua ? ("bg-sky-200 dark:bg-sky-900") : ("bg-gray-100 dark:bg-gray-700")} rounded-lg lg:h-12 lg:w-fit shrink-0`}>
                        <UserCheck2 className="mr-2" />
                        Ketua
                    </div>
                </li>
                <li className={`flex w-full items-center ${existingAnggota ? ("text-sky-700 dark:text-sky-600") : ("")}`}>
                    <div className={`flex items-center justify-center px-2 w-fit h-10 ${existingAnggota ? ("bg-sky-200 dark:bg-sky-900") : ("bg-gray-100 dark:bg-gray-700")}  rounded-xl lg:h-12 lg:w-fit shrink-0`}>
                        <User2 className="mr-2" />
                        Anggota
                    </div>
                </li>
            </ol>
            <div >
                {step ? (
                    <div className="space-y-4">
                        <AnggotaForm
                            initialData={initialData}
                            initialData_User={initialData_User}
                            timEvaluasiId={timEvaluasiId}
                            options={options}
                            options_unitKerja={options_unitKerja}
                        />
                        <Button onClick={() => { setStep(false) }}>
                            Kembali
                        </Button>
                    </div>
                ) : (step2 ? (
                    <div className="space-y-4">
                        <KetuaForm
                            initialData={initialData}
                            timEvaluasiId={timEvaluasiId}
                            options={options}
                        />
                        <Button onClick={() => { setStep2(false) }} className="mr-2">
                            Kembali
                        </Button>
                        <Button onClick={() => { setStep(true) }} disabled={!existingKetua}>
                            Selanjutnya
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <DalnisForm
                            initialData={initialData}
                            timEvaluasiId={timEvaluasiId}
                            options={options}
                        />
                        <Button onClick={() => { setStep2(true) }} disabled={!existingDalnis}>
                            Selanjutnya
                        </Button>
                    </div>
                )
                )}
            </div>
        </div>
    )
}