"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
import { AccountRole } from "@prisma/client";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: AccountRole;
};

export const RoleGate = ({
    children,
    allowedRole
}: RoleGateProps ) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message="You do not have permission to view this content!" />
        )
    }

    return (
        <>
        {children}
        </>
    )
}
