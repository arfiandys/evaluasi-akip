import Image from "next/image";
import Link from "next/link";
import { Building2, ClipboardPen, FilePen, FolderOpen, MoreVertical } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { EvaluasiProgress } from "./evaluasi-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LHE, UnitKerja } from "@prisma/client";


interface EvaluasiCardProps {
  id: string;
  title: string;
  imageUrl: string;
  KKELength: number;
  PermindokLength: number;
  UnitKerjaLength: number;
  progress: number | null;
  description: string;
  tahun: string;
  status: string;
  daftarLHE: (LHE & { unitKerja: UnitKerja })[]
};

export const EvaluasiCard = ({
  id,
  title,
  imageUrl,
  KKELength,
  PermindokLength,
  UnitKerjaLength,
  progress,
  description,
  tahun,
  status,
  daftarLHE,
}: EvaluasiCardProps) => {
  return (
    <Card className="shadow-lg rounded-3xl">
      <CardHeader>
        <div className="w-full rounded-md flex justify-between">
          <Image
            height={50}
            width={50}
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-[50px] h-[50px] rounded-full">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={`/pimpinan/evaluasi/${id}/permindok/list`}>
                  <span>Lihat Permindok</span>
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/pimpinan/evaluasi/${id}/kke/list`}>
                  <span>Lihat KKE</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Lihat LHE</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuLabel>Unit Kerja</DropdownMenuLabel>
                    {daftarLHE.map((item) => (
                      <DropdownMenuItem key={item.unitKerjaId} disabled={!item.url}>
                        <Link href={item.url || ""} legacyBehavior>
                          <a target="_blank">
                            <span>{item.unitKerja.name}</span>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        <div className="flex flex-col pt-2">
          <div className="mt-2 text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {tahun}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-x-2 text-sm md:text-xs">
            {status === "publish" ? (
              <Badge className=" bg-sky-500">Tahap pengerjaan</Badge>
            ) : (status === "finish" ? (
              <Badge className=" bg-emerald-500">Selesai</Badge>
            ) : (status === "draft" ? (
              <Badge className=" bg-red-500">Rancangan</Badge>
            ) : (status === "check" ? (
              <Badge className=" bg-yellow-500">Tahap pengecekan</Badge>
            ) : (<></>))))}
          </div>
        </div>
      </CardHeader>
      <Separator orientation="horizontal" />
      <CardContent>
        <div className="grid grid-cols-2">
          <div className="mt-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={FolderOpen} />
              <span>
                {PermindokLength} {"Permindok"}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={ClipboardPen} />
              <span>
                {KKELength} {"Isian KKE"}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={Building2} />
              <span>
                {UnitKerjaLength} {"Unit Kerja"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator orientation="horizontal" />
      <CardFooter>
        <div className="w-full mt-3">
          <EvaluasiProgress
            variant={progress === 100 ? "success" : "default"}
            size="sm"
            value={progress || 0}
          />
        </div>
      </CardFooter>
    </Card >
  )
}