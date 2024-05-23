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

    if (values?.userId! && values?.unitKerjaId! && values.dalnisId! && values.ketuaId! && (values.action! === "addUnitKerja")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId
        },
        data: {
          users: {
            update: [
              {
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
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values.ketuaId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          create: [
                            {
                              assignedRole: UserRole.KETUA,
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
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values.dalnisId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          create: [
                            {
                              assignedRole: UserRole.DALNIS,
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

    // UNIT KERJA ON TIM EVALUASI DISCONNECT

    if (values?.data?.unitKerjaId! && values?.data?.action! === "disconnect-unitkerja") {
      const userOnUnitKerja = await db.userOnUnitKerja.deleteMany({
        where: {
          AND: [
            {
              timEvaluasiId: timEvaluasiId,
            },
            {
              unitKerjaId: values.data.unitKerjaId,
            }
          ]
        },
      });

      return NextResponse.json(userOnUnitKerja);
    }

    // ======================== TIM EVALUASI DISCONNECT
    if (values?.data?.action! === "disconnect-anggota-unitkerja") {
      const userOnUnitKerja = await db.userOnUnitKerja.deleteMany({
        where: {
          // AND: [
          //   {
          //     timEvaluasiId: timEvaluasiId,
          //   },
          //   {
          //     unitKerjaId: { in: values.data.unitKerja_arr }
          //   }
          // ]
          // TODO: MASIH ADA BUG DALAM MENGHAPUS ANGGOTA MENJADIKAN UNIT KERJA DI ANGGOTA LAIN TERHAPUS

          timEvaluasiId: timEvaluasiId,
        },
      });

      return NextResponse.json(userOnUnitKerja);
    }

    if (values?.data?.anggotaTimEvaluasiId && values?.data?.action! === "disconnect-anggota") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
        },
        data: {
          users: {
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

    if (values?.data?.ketuaTimEvaluasiId! && values?.data?.action! === "disconnect-ketua") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
        },
        data: {
          users: {
            update: [
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values?.data?.ketuaTimEvaluasiId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          deleteMany: {
                            assignedRole: UserRole.KETUA,
                          }
                        }
                      }
                    }
                  }
                },
              },
            ],
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

    if (values?.data?.dalnisTimEvaluasiId! && values?.data?.action! === "disconnect-dalnis") {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
        },
        data: {
          users: {
            update: [
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values?.data?.dalnisTimEvaluasiId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          deleteMany: {
                            assignedRole: UserRole.DALNIS,
                          }
                        }
                      }
                    }
                  }
                },
              },
            ],
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
    // ===================== DALNIS TIM EVALUASI UPDATE UNIT KERJA

    if (values.dalnisTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "dalnisUpdateUnitKerja")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
        },
        data: {
          users: {
            update: [
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values.dalnisTimEvaluasiId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          create:
                            values.unitKerjaIdArray
                          ,
                        }
                      }
                    }
                  },
                },
              },
            ]
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


    // ===================== DALNIS TIM EVALUASI UPDATE
    if (values.dalnisTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "dalnisUpdate")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
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
    // ===================== DALNIS TIM EVALUASI DISCONNECT UNIT KERJA
    if (values.dalnisTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "dalnisUpdateDisconnectUnitKerja")) {
      const userOnUnitKerja = await db.userOnUnitKerja.deleteMany({
        where: {
          AND: [
            {
              timEvaluasiId: timEvaluasiId,
            },
            {
              assignedRole: UserRole.DALNIS,
            },
          ]

        },
      });

      return NextResponse.json(userOnUnitKerja);
    }

    // ===================== DALNIS TIM EVALUASI ADD
    if (values.dalnisTimEvaluasiId! && !values.unitKerjaIdArray?.length! && (values.action === "dalnisUpdate")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
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


    // ===================== KETUA TIM EVALUASI UPDATE UNIT KERJA

    if (values.ketuaTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "ketuaUpdateUnitKerja")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
        },
        data: {
          users: {
            update: [
              {
                where: {
                  userTimEvaluasiId: {
                    timEvaluasiId: timEvaluasiId,
                    userId: values.ketuaTimEvaluasiId
                  }
                },
                data: {
                  user: {
                    update: {
                      data: {
                        unitKerjas: {
                          create:
                            values.unitKerjaIdArray
                          ,
                        }
                      }
                    }
                  },
                },
              },
            ]
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


    // ===================== KETUA TIM EVALUASI UPDATE
    if (values.ketuaTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "ketuaUpdate")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
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
    // ===================== KETUA TIM EVALUASI DISCONNECT UNIT KERJA
    if (values.ketuaTimEvaluasiId! && !!values.unitKerjaIdArray?.length && (values.action === "ketuaUpdateDisconnectUnitKerja")) {
      const userOnUnitKerja = await db.userOnUnitKerja.deleteMany({
        where: {
          AND: [
            {
              timEvaluasiId: timEvaluasiId,
            },
            {
              assignedRole: UserRole.KETUA,
            },
          ]

        },
      });

      return NextResponse.json(userOnUnitKerja);
    }

    // ===================== KETUA TIM EVALUASI ADD
    if (values.ketuaTimEvaluasiId! && !values.unitKerjaIdArray?.length! && (values.action === "ketuaUpdate")) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
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


    // ===================== ANGGOTA TIM EVALUASI ADD


    if (values.anggotaTimEvaluasiId!) {
      const timEvaluasi = await db.timEvaluasi.update({
        where: {
          id: timEvaluasiId,
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

    const existingTimEvaluasi = await db.timEvaluasi.findUnique({
      where: {
        name: values.name
      }
    })

    if (existingTimEvaluasi) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

    const timEvaluasi = await db.timEvaluasi.update({
      where: {
        id: timEvaluasiId,
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