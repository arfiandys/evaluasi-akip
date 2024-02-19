import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_component/generate-form";


const GenerateLKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaLKE: true,
            subKriteriaLKE: true,
        }
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <GeneratePage variabelLKE={variabelLKE} unitKerja={unitKerja}/>
        </div>
    );
}

export default GenerateLKEPage;