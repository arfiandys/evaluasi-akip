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
        userId: userId,
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
          userId
        },
        data: {
          userUnitKerja: {
            update: {
              where: {
                id: values.data.picUnitKerjaId
              },
              data: {
                role: UserRole.USER,
              }
            },
            disconnect: {
              id: values.data.picUnitKerjaId
            },
          },
        },
        include: {
          userUnitKerja: {
            orderBy: {
              name: "asc"
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
          userId
        },
        data: {
          userUnitKerja: {
            update: {
              where: {
                id: values.data.pimpinanUnitKerjaId
              },
              data: {
                role: UserRole.USER,
              }
            },
            disconnect: {
              id: values.data.pimpinanUnitKerjaId
            },
          },
        },
        include: {
          userUnitKerja: {
            orderBy: {
              name: "asc"
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
          userId
        },
        data: {
          userUnitKerja: {
            updateMany: {
              where: {
                role: UserRole.PIMPINAN
              },
              data: {
                role: UserRole.USER
              }
            },
            disconnect: {
              id: values.pimpinanPassUnitKerjaId
            },
            connect: {
              id: values.pimpinanUnitKerjaId
            },
            update: {
              where: {
                id: values.pimpinanUnitKerjaId,
                timUser: {
                  none: {}
                },
              },
              data: {
                role: UserRole.PIMPINAN,
              },
            },

          },
        },
        include: {
          userUnitKerja: {
            orderBy: {
              name: "asc"
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
          userId
        },
        data: {
          userUnitKerja: {
            connect: {
              id: values.picUnitKerjaId
            },
            update: {
              where: {
                id: values.picUnitKerjaId,
                timUser: {
                  none: {}
                },
              },
              data: {
                role: UserRole.PIC,
              },
            },

          },
        },
        include: {
          userUnitKerja: {
            orderBy: {
              name: "asc"
            }
          }
        }
      });

      return NextResponse.json(unitKerja);
    }

    const unitKerja = await db.unitKerja.update({
      where: {
        id: unitKerjaId,
        userId
      },
      data: {
        ...values,
      },
      include: {
        userUnitKerja: {
          orderBy: {
            name: "asc"
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