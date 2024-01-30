"use client"

import { settings } from "@/action/settings";
import { Button } from "@/components/ui/button";
import { 
    Card,
    CardHeader,
    CardContent
 } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useTransition } from "react";


const SettingPage = () => {
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const onClick = () => {
        startTransition(() => {
            settings({
                name: "New Name!"
            })
            .then(() => {
                update();
            })
        })
    }
    return ( 
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Button disabled={isPending} onClick={onClick}>
                    Update name
                </Button>
            </CardContent>
        </Card>
     );
}
 
export default SettingPage;