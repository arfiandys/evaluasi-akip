import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { timEvalId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const timEvaluasi = await db.timEvaluasi.findUnique({
      where: {
        id: params.timEvalId,
        userId: userId,
      },
    });

    if (!timEvaluasi) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTimEvaluasi = await db.timEvaluasi.delete({
      where: {
        id: params.timEvalId,
      },
    });

    return NextResponse.json(deletedTimEvaluasi);
  } catch (error) {
    console.log("[TIM_EVALUASI_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { timEvalId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { timEvalId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (values?.data?.anggotaTimEvaluasiId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvalId,
          userId
        },
        data: {
          userTim: {
            update: {
              where: {
                id: values.data.anggotaTimEvaluasiId
              },
              data: {
                role: UserRole.USER,
              }
            },
            disconnect: {
              id: values.data.anggotaTimEvaluasiId
            },
          },
        },
        include: {
          userTim: {
            orderBy: {
              name: "asc"
            }
          }
        }
      });

      return NextResponse.json(timEvaluasi);
    }

    if (values?.data?.ketuaTimEvaluasiId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvalId,
          userId
        },
        data: {
          userTim: {
            update: {
              where: {
                id: values.data.ketuaTimEvaluasiId
              },
              data: {
                role: UserRole.USER,
              }
            },
            disconnect: {
              id: values.data.ketuaTimEvaluasiId
            },
          },
        },
        include: {
          userTim: {
            orderBy: {
              name: "asc"
            }
          }
        }
      });

      return NextResponse.json(timEvaluasi);
    }

    if (values.ketuaTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvalId,
          userId
        },
        data: {
          userTim: {
            updateMany: {
              where: {
                role: UserRole.KETUA,
              },
              data: {
                role: UserRole.USER,
              }
            },
            disconnect: {
              id: values.ketuaPassTimEvaluasiId
            },
            connect: {
              id: values.ketuaTimEvaluasiId
            },
            update: {
              where: {
                id: values.ketuaTimEvaluasiId,
                unitKerjaUser: {
                  none: {}
                },
              },
              data: {
                role: UserRole.KETUA,
              },
            },

          },
        },
        include: {
          userTim: {
            orderBy: {
              name: "asc"
            }
          }, 
        },
      });

      return NextResponse.json(timEvaluasi);
    }

    if (values.anggotaTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvalId,
          userId
        },
        data: {
          userTim: {
            connect: {
              id: values.anggotaTimEvaluasiId
            },
            update: {
              where: {
                id: values.anggotaTimEvaluasiId,
                unitKerjaUser: {
                  none: {}
                },
              },
              data: {
                role: UserRole.ANGGOTA,
              },
            },

          },
        },
        include: {
          userTim: {
            orderBy: {
              name: "asc"
            }
          }
        }
      });

      return NextResponse.json(timEvaluasi);
    }

    const timEvaluasi = await db.timEvaluasi.update({
      where: {
        id: timEvalId,
        userId
      },
      data: {
        ...values,
      },
      include: {
        userTim: {
          orderBy: {
            name: "asc"
          }
        }
      }
    });

    return NextResponse.json(timEvaluasi);
  } catch (error) {
    console.log("[TIM_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}