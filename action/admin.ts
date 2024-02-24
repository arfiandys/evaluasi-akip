"use server";

import { currentRole } from "@/lib/auth";
import { AccountRole } from "@prisma/client";

export const admin = async () => {
    const role = await currentRole();

    if (role === AccountRole.ADMIN) {
        return { success: "Allowed Server Action!" }
    }

    return { error: "Forbidden Server Action!" }
}