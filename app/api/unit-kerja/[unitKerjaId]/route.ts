import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { unitKerjaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unitKerja = await db.unitKerja.findUnique({
      where: {
        id: params.unitKerjaId,
      },
    });

    if (!unitKerja) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedUnitKerja = await db.unitKerja.delete({
      where: {
        id: params.unitKerjaId,
      },
    });

    return NextResponse.json(deletedUnitKerja);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { unitKerjaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { unitKerjaId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (values?.data?.picUnitKerjaId! && values?.data?.action! === "disconnect") {
      const unitKerja = await db.unitKerja.update({
        where: {
          id: unitKerjaId,
        },
        data: {
          users: {
            deleteMany: [
              {
                AND: {
                  assignedRole: UserRole.PIC,
                  userId: values.data.picUnitKerjaId
                }
              }
            ]
          },
        },
        include: {
          users: {
            orderBy: {
              userId: "asc"
            }
          }
        }
      });

      return NextResponse.json(unitKerja);
    }

    if (values?.data?.pimpinanUnitKerjaId! && values?.data?.action! === "disconnect") {
      const unitKerja = await db.unitKerja.update({
        where: {
          id: unitKerjaId,
        },
        data: {
          users: {
            deleteMany: [
              {
                AND: {
                  assignedRole: UserRole.PIMPINAN,
                  userId: values.data.pimpinanUnitKerjaId
                }
              }
            ]
          },
        },
        include: {
          users: {
            orderBy: {
              userId: "asc"
            }
          }
        }
      });

      return NextResponse.json(unitKerja);
    }

    if (values.pimpinanUnitKerjaId!) {
      const unitKerja = await db.unitKerja.update({
        where: {
          id: unitKerjaId,
        },
        data: {
          users: {
            deleteMany: [
              {
                assignedRole: UserRole.PIMPINAN,
              }
            ],
            create: [
              {
                assignedRole: UserRole.PIMPINAN,
                user: {
                  connect: {
                    id: values.pimpinanUnitKerjaId
                  }
                }

              }
            ],
          }
        },
        include: {
          users: {
            orderBy: {
              userId: "asc"
            }
          }
        }
      });

      return NextResponse.json(unitKerja);
    }

    if (values.picUnitKerjaId!) {
      const unitKerja = await db.unitKerja.update({
        where: {
          id: unitKerjaId,
        },
        data: {
          users: {
            create: [
              {
                assignedRole: UserRole.PIC,
                user: {
                  connect: {
                    id: values.picUnitKerjaId
                  }
                }

              }
            ]
          },
        },
        include: {
          users: {
            orderBy: {
              userId: "asc"
            }
          }
        }
      });

      return NextResponse.json(unitKerja);
    }

    const unitKerja = await db.unitKerja.update({
      where: {
        id: unitKerjaId,
      },
      data: {
        ...values,
      },
      include: {
        users: {
          orderBy: {
            userId: "asc"
          }
        }
      }
    });

    return NextResponse.json(unitKerja);
  } catch (error) {
    console.log("[UNIT_KERJA_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}