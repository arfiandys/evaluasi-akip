import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Overview } from "./_components//overview"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

const DashboardPage = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return redirect("/")
  }
  const evaluasi = await db.evaluasi.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      variabelsLKE: {
        orderBy: {
          kode: "asc"
        }
      },
      variabelsKKE: {
        orderBy: {
          kode: "asc"
        }
      },
      permindoks: true,
      IKUs: true,
    }
  });

  const evaluasiFilteredBerjalan = evaluasi.filter((item) => item.status !== "selesai");

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
            <div className="grid gap-4 md:grid-cols-2 lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total evaluasi selesai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evaluasi.length - evaluasiFilteredBerjalan.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Evaluasi yang sedang berjalan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evaluasiFilteredBerjalan.length}</div>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Rata-rata nilai</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Evaluasi terbaru</CardTitle>
                <CardDescription>
                  Kamu punya {evaluasi.length} evaluasi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {evaluasi.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.tahun}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {item.status === "publish" ? (
                          <Badge className=" bg-sky-500">Tahap pengerjaan</Badge>
                        ) : (item.status === "finish" ? (
                          <Badge className=" bg-emerald-500">Selesai</Badge>
                        ) : (item.status === "draft" ? (
                          <Badge className=" bg-red-500">Rancangan</Badge>
                        ) : (item.status === "check" ? (
                          <Badge className=" bg-yellow-500">Tahap pengecekan</Badge>
                        ) : (<></>))))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage;