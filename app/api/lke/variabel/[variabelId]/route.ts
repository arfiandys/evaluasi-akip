import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { variabelId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const variabelLKE = await db.variabelLKE.findUnique({
      where: {
        id: params.variabelId,
      },
    });

    if (!variabelLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedVariabelLKE = await db.variabelLKE.delete({
      where: {
        id: params.variabelId,
      },
    });

    return NextResponse.json(deletedVariabelLKE);
  } catch (error) {
    console.log("[VARIABEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { variabelId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { variabelId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if ((values.unitKerjaId!) && (values.input! === "input")) {
      const LKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: variabelId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianAt: values.values.isianAt,
          isianKt: values.values.isianKt,
          isianDalnis: values.values.isianDalnis,
          catatanAt: values.values.catatanAt,
          catatanKt: values.values.catatanKt,
          catatanDalnis: values.values.catatanDalnis,
          nilaiAt: values.values.nilaiAt,
          nilaiKt: values.values.nilaiKt,
          nilaiDalnis: values.values.nilaiDalnis,
        },
        include: {
          variabelLKE: {
            include: {
              subKriteriaLKE: true,
              kriteriaLKE: true,
              subKomponenLKE: true,
              komponenLKE: true,
            }
          }
        }
      });

      if (LKEUnitKerja.variabelLKE.levelVariabel === "subKriteria") {
        // SUB KRITERIA
        const LKESubKriteria = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  subKriteriaLKE: {
                    kriteriaLKEId: LKEUnitKerja.variabelLKE.subKriteriaLKE?.kriteriaLKEId!
                  }
                }
              },
              {
                unitKerjaId: values.unitKerjaId
              }
            ],
          },
          include: {
            variabelLKE: true,
          }
        })

        const variabelLKEKriteria = await db.variabelLKE.findUnique({
          where: {
            kriteriaLKEId: LKEUnitKerja.variabelLKE.subKriteriaLKE?.kriteriaLKEId!
          },
          include: {
            kriteriaLKE: true,
            subKriteriaLKE: true,
          }
        })

        let jumlah_subKriteria: number = 0;

        if (values.role === "at") {
          LKESubKriteria.forEach((data) => {
            jumlah_subKriteria += Number(data.nilaiAt)
          })
          const LKEUnitKerjaKriteria = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKriteria?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianAt: jumlah_subKriteria.toString(),
              nilaiAt: (variabelLKEKriteria?.kriteriaLKE?.bobot! * jumlah_subKriteria).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  kriteriaLKE: true
                }
              }
            }
          });

          // KRITERIA
          const LKEKriteria = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    kriteriaLKE: {
                      subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKESubKomponen = await db.variabelLKE.findUnique({
            where: {
              subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
            },
            include: {
              kriteriaLKE: true,
              subKomponenLKE: true,
            }
          })

          let jumlah: number = 0;
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiAt)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianAt: jumlah.toString(),
              nilaiAt: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiAt)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianAt: jumlah_subKomponen.toString(),
              nilaiAt: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });

        } else if (values.role === "kt") {
          LKESubKriteria.forEach((data) => {
            jumlah_subKriteria += Number(data.nilaiKt)
          })
          const LKEUnitKerjaKriteria = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKriteria?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianKt: jumlah_subKriteria.toString(),
              nilaiKt: (variabelLKEKriteria?.kriteriaLKE?.bobot! * jumlah_subKriteria).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  kriteriaLKE: true
                }
              }
            }
          });

          // KRITERIA
          const LKEKriteria = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    kriteriaLKE: {
                      subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKESubKomponen = await db.variabelLKE.findUnique({
            where: {
              subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
            },
            include: {
              kriteriaLKE: true,
              subKomponenLKE: true,
            }
          })

          let jumlah: number = 0;
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiKt)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianKt: jumlah.toString(),
              nilaiKt: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiKt)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianKt: jumlah_subKomponen.toString(),
              nilaiKt: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });
        } else if (values.role === "dalnis") {
          LKESubKriteria.forEach((data) => {
            jumlah_subKriteria += Number(data.nilaiDalnis)
          })
          const LKEUnitKerjaKriteria = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKriteria?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianDalnis: jumlah_subKriteria.toString(),
              nilaiDalnis: (variabelLKEKriteria?.kriteriaLKE?.bobot! * jumlah_subKriteria).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  kriteriaLKE: true
                }
              }
            }
          });

          // KRITERIA
          const LKEKriteria = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    kriteriaLKE: {
                      subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKESubKomponen = await db.variabelLKE.findUnique({
            where: {
              subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
            },
            include: {
              kriteriaLKE: true,
              subKomponenLKE: true,
            }
          })

          let jumlah: number = 0;
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiDalnis)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianDalnis: jumlah.toString(),
              nilaiDalnis: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiDalnis)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianDalnis: jumlah_subKomponen.toString(),
              nilaiDalnis: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });
        }
      }

      if (LKEUnitKerja.variabelLKE.levelVariabel === "kriteria") {
        // KRITERIA
        const LKEKriteria = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  kriteriaLKE: {
                    subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                  }
                }
              },
              {
                unitKerjaId: values.unitKerjaId
              }
            ],
          },
          include: {
            variabelLKE: true,
          }
        })

        const variabelLKESubKomponen = await db.variabelLKE.findUnique({
          where: {
            subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        let jumlah: number = 0;

        if (values.role === "at") {
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiAt)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianAt: jumlah.toString(),
              nilaiAt: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiAt)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianAt: jumlah_subKomponen.toString(),
              nilaiAt: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });

        } else if (values.role === "kt") {
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiKt)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianKt: jumlah.toString(),
              nilaiKt: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiKt)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianKt: jumlah_subKomponen.toString(),
              nilaiKt: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });
        } else if (values.role === "dalnis") {
          LKEKriteria.forEach((data) => {
            jumlah += Number(data.nilaiDalnis)
          })
          const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKESubKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianDalnis: jumlah.toString(),
              nilaiDalnis: (variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah).toString()
            },
            include: {
              variabelLKE: {
                include: {
                  subKomponenLKE: true
                }
              }
            }
          });

          // SUB KOMPONEN
          const LKESubKomponen = await db.lKEUnitKerja.findMany({
            where: {
              AND: [
                {
                  variabelLKE: {
                    subKomponenLKE: {
                      komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
                    }
                  }
                },
                {
                  unitKerjaId: values.unitKerjaId
                }
              ],
            },
            include: {
              variabelLKE: true,
            }
          })

          const variabelLKEKomponen = await db.variabelLKE.findUnique({
            where: {
              komponenLKEId: LKEUnitKerjaSubKomponen.variabelLKE.subKomponenLKE?.komponenLKEId!
            },
            include: {
              subKomponenLKE: true,
              komponenLKE: true
            }
          })

          let jumlah_subKomponen: number = 0
          LKESubKomponen.forEach((data) => {
            jumlah_subKomponen += Number(data.nilaiDalnis)
          })
          const LKEUnitKerjaKomponen = await db.lKEUnitKerja.update({
            where: {
              LKEUnitKerjaId: {
                variabelLKEId: variabelLKEKomponen?.id!,
                unitKerjaId: values.unitKerjaId
              }
            },
            data: {
              isianDalnis: jumlah_subKomponen.toString(),
              nilaiDalnis: (variabelLKEKomponen?.komponenLKE?.bobot! * jumlah_subKomponen).toString()
            },
          });
        }
      }

      return NextResponse.json(LKEUnitKerja);
    }

    if ((values.subKriteriaLKEId!) && (values.variabel! === "subKriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {
          subKriteriaLKEId: values.subKriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });

      return NextResponse.json(variabelLKE);
    }

    if ((values.kriteriaLKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {
          kriteriaLKEId: values.kriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });

      return NextResponse.json(variabelLKE);
    }

    if (values.changeIsSubKriteria! === "change") {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {
          kriteriaLKE: {
            disconnect: true
          },
          subKriteriaLKE: {
            disconnect: true
          },
          levelVariabel: values.levelVariabel,
        },
      });

      return NextResponse.json(variabelLKE);
    }

    // LKE DETAIL EDIT

    const variabelLKE = await db.variabelLKE.update({
      where: {
        id: variabelId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(variabelLKE);
  } catch (error) {
    console.log("[VARIABEL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}