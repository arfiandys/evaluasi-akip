import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

const HelpPage = () => {
    return (
        <div className="flex justify-center items-center h-[80vh] w-full">
            <Link href="/Guide_AKIP-Evaluasi_1.0.pdf" legacyBehavior>
                <a target="_blank">
                    <Button variant="default">
                        <span>Buku panduan</span>
                        <MessageCircleQuestion className="h-4 w-4 ml-2" />
                    </Button>
                </a>
            </Link>
        </div>
    );
}

export default HelpPage;