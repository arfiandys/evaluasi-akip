"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
};

export const RoleGate = ({
    children,
    allowedRole
}: RoleGateProps ) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message="Anda tidak memiliki izin untuk melihat konten ini!" />
        )
    }

    return (
        <>
        {children}
        </>
    )
}
