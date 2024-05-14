import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { EvaluasiProgress } from "./evaluasi-progress";

interface EvaluasiCardProps {
  id: string;
  title: string;
  imageUrl: string;
  LKELength: number;
  KKELength: number;
  progress: number | null;
  description: string;
  tahun: string;
};

export const EvaluasiCard = ({
  id,
  title,
  imageUrl,
  LKELength,
  KKELength,
  progress,
  description,
  tahun,
}: EvaluasiCardProps) => {
  return (
    <Link href={`/koordinator/evaluasi/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            height={300}
            width={300}
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">
            {tahun}
          </p>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {LKELength} {"Variabel LKE"}
              </span>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {KKELength} {"Variabel KKE"}
              </span>
            </div>
          </div>
          <EvaluasiProgress
            variant={progress === 100 ? "success" : "default"}
            size="sm"
            value={progress||0}
          />
        </div>
      </div>
    </Link>
  )
}