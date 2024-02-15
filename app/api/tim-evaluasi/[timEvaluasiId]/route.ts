import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { timEvaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const timEvaluasi = await db.timEvaluasi.findUnique({
      where: {
        id: params.timEvaluasiId,
        userId: userId,
      },
    });

    if (!timEvaluasi) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTimEvaluasi = await db.timEvaluasi.delete({
      where: {
        id: params.timEvaluasiId,
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
  { params }: { params: { timEvaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { timEvaluasiId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // UNIT KERJA ON TIM EVALUASI ADD

    if (values?.userId! && values?.unitKerjaId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            update: {
              where: {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values.userId
                }
              },
              data: {
                user: {
                  update: {
                    data: {
                      unitKerjas: {
                        create: [
                          {
                            assignedRole: UserRole.ANGGOTA,
                            timEvaluasiId: timEvaluasiId,
                            unitKerja: {
                              connect: {
                                id: values.unitKerjaId,
                              },
                            },
                          },
                        ],
                      }
                    }
                  }
                },
              },
            },
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

      return NextResponse.json(timEvaluasi);
    }

    // UNIT KERJA ON TIM EVALUASI DISCONNECT

    if (values?.data?.anggotaTimEvaluasiId && values?.data?.unitKerjaId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            update: {
              where: {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values?.data?.anggotaTimEvaluasiId
                }
              },
              data: {
                user: {
                  update: {
                    data: {
                      unitKerjas: {
                        delete:{
                          userUnitKerjaId: {
                            unitKerjaId: values?.data?.unitKerjaId,
                            userId: values?.data?.anggotaTimEvaluasiId
                          },
                        }
                      }
                    }
                  }
                }
              },
            },
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

      return NextResponse.json(timEvaluasi);
    }

    // ======================== TIM EVALUASI DISCONNECT

    if (values?.data?.anggotaTimEvaluasiId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            update: {
              where: {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values?.data?.anggotaTimEvaluasiId
                }
              },
              data: {
                user: {
                  update: {
                    data: {
                      unitKerjas: {
                        deleteMany:{
                          assignedRole: UserRole.ANGGOTA,
                        }
                      }
                    }
                  }
                }
              },
            },
            delete: [
              {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values?.data?.anggotaTimEvaluasiId
                }
              }
            ],
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

      return NextResponse.json(timEvaluasi);
    }

    if (values?.data?.ketuaTimEvaluasiId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            delete: [
              {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values?.data?.ketuaTimEvaluasiId
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

      return NextResponse.json(timEvaluasi);
    }

    if (values?.data?.dalnisTimEvaluasiId! && values?.data?.action! === "disconnect") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            delete: [
              {
                userTimEvaluasiId: {
                  timEvaluasiId: timEvaluasiId,
                  userId: values?.data?.dalnisTimEvaluasiId
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

      return NextResponse.json(timEvaluasi);
    }

    // ===================== TIM EVALUASI ADD

    if (values.dalnisTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            deleteMany: [
              {
                assignedRole: UserRole.DALNIS,
              }
            ],
            create: [
              {
                assignedRole: UserRole.DALNIS,
                user: {
                  connect: {
                    id: values.dalnisTimEvaluasiId
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

      return NextResponse.json(timEvaluasi);
    }

    if (values.ketuaTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            deleteMany: [
              {
                assignedRole: UserRole.KETUA,
              }
            ],
            create: [
              {
                assignedRole: UserRole.KETUA,
                user: {
                  connect: {
                    id: values.ketuaTimEvaluasiId
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

      return NextResponse.json(timEvaluasi);
    }

    if (values.anggotaTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          users: {
            create: [
              {
                assignedRole: UserRole.ANGGOTA,
                user: {
                  connect: {
                    id: values.anggotaTimEvaluasiId
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

      return NextResponse.json(timEvaluasi);
    }

    // TIM EVALUASI DETAIL EDIT

    const timEvaluasi = await db.timEvaluasi.update({
      where: {
        id: timEvaluasiId,
        userId
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

    return NextResponse.json(timEvaluasi);
  } catch (error) {
    console.log("[TIM_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}