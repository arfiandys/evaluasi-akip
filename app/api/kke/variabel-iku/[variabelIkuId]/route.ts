import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { variabelIkuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.findUnique({
      where: {
        id: params.variabelIkuId,
      },
    });

    if (!tujuanSasaranIndikatorIKUVariabelKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.delete({
      where: {
        id: params.variabelIkuId,
      },
    });

    return NextResponse.json(deletedTujuanSasaranIndikatorIKUVariabelKKE);
  } catch (error) {
    console.log("[VARIABEL_IKU_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { variabelIkuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { variabelIkuId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if ((values.unitKerjaId!) && (values.variabelKKEId!) && (values.input! === "input")) {

      //IKU UNITKERJA
      if (values.role === "at") {
        const IKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.update({
          where: {
            TujuanSasaranIndikatorIKUVariabelKKEUnitKerjaId: {
              tujuanSasaranIndikatorIKUVariabelKKEId: variabelIkuId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianAt: values.values.isian,
          },
        });
      } else if (values.role === "kt") {
        const IKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.update({
          where: {
            TujuanSasaranIndikatorIKUVariabelKKEUnitKerjaId: {
              tujuanSasaranIndikatorIKUVariabelKKEId: variabelIkuId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianKt: values.values.isian,
          },
        });
      } else if (values.role === "dalnis") {
        const IKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.update({
          where: {
            TujuanSasaranIndikatorIKUVariabelKKEUnitKerjaId: {
              tujuanSasaranIndikatorIKUVariabelKKEId: variabelIkuId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianDalnis: values.values.isian,
          },
        });
      } else if (values.role === "pic") {
        const IKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.update({
          where: {
            TujuanSasaranIndikatorIKUVariabelKKEUnitKerjaId: {
              tujuanSasaranIndikatorIKUVariabelKKEId: variabelIkuId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianPIC: values.values.isian
          },
        });
      }

      // VARIABEL KKE UNITKERJA

      const isianIKUKKIndikatorUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
          AND: [
            {
              tujuanSasaranIndikatorIKUVariabelKKE: {
                variabelKKEId: values.variabelKKEId
              }
            },
            {
              unitKerjaId: values.unitKerjaId
            }
          ]
        }
      })

      let jumlah: number = 0;
      let banyak: number = 0;

      if (values.role === "at") {
        isianIKUKKIndikatorUnitKerja.forEach((data) => {
          jumlah += (data.isianAt === "ya") ? (1) : (0);
          banyak += 1;
        })
        const variabelKKEUnitKerja = await db.variabelKKEUnitKerja.update({
          where: {
            VariabelKKEUnitKerjaId: {
              variabelKKEId: values.variabelKKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianAt: ((jumlah * 100) / banyak).toString(),
          },
        });
      } else if (values.role === "kt") {
        isianIKUKKIndikatorUnitKerja.forEach((data) => {
          jumlah += (data.isianKt === "ya") ? (1) : (0);
          banyak += 1;
        })
        const variabelKKEUnitKerja = await db.variabelKKEUnitKerja.update({
          where: {
            VariabelKKEUnitKerjaId: {
              variabelKKEId: values.variabelKKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianKt: ((jumlah * 100) / banyak).toString(),
          },
        });
      } else if (values.role === "dalnis") {
        isianIKUKKIndikatorUnitKerja.forEach((data) => {
          jumlah += (data.isianDalnis === "ya") ? (1) : (0);
          banyak += 1;
        })
        const variabelKKEUnitKerja = await db.variabelKKEUnitKerja.update({
          where: {
            VariabelKKEUnitKerjaId: {
              variabelKKEId: values.variabelKKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianDalnis: ((jumlah * 100) / banyak).toString(),
          },
        });
      } else if (values.role === "pic") {
        isianIKUKKIndikatorUnitKerja.forEach((data) => {
          jumlah += (data.isianPIC === "ya") ? (1) : (0);
          banyak += 1;
        })
        const variabelKKEUnitKerja = await db.variabelKKEUnitKerja.update({
          where: {
            VariabelKKEUnitKerjaId: {
              variabelKKEId: values.variabelKKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianPIC: ((jumlah * 100) / banyak).toString(),
          },
        });
      }

      // VARIABEL LKE UNITKERJA

      const variabelLKE = await db.variabelLKE.findUnique({
        where: {
          id: values.variabelLKEId
        },
        include: {
          kriteriaLKE: true,
          subKriteriaLKE: true,
        }
      })

      let nilai = ""
      if (((jumlah * 100) / banyak).toString()) {
        if (variabelLKE?.kriteriaLKE?.bobot) {
          nilai = (variabelLKE?.kriteriaLKE?.bobot * Number(((jumlah * 100) / banyak).toString())).toString();
        }
        if (variabelLKE?.subKriteriaLKE?.bobot) {
          nilai = (variabelLKE?.subKriteriaLKE?.bobot * Number(((jumlah * 100) / banyak).toString())).toString();
        }

      }

      if (values.role === "at") {
        const LKEUnitKerja = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: values.variabelLKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianAt: ((jumlah * 100) / banyak).toString(),
            nilaiAt: nilai
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

        ////////////////////////////////////////////////////////////////////////////////////////////

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

        }

        return NextResponse.json(LKEUnitKerja);

      } else if (values.role === "kt") {
        const LKEUnitKerja = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: values.variabelLKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianKt: ((jumlah * 100) / banyak).toString(),
            nilaiKt: nilai
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

        ///////////////////////////////////////////////////////////////////////      

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

        }

        return NextResponse.json(LKEUnitKerja);

      } else if (values.role === "dalnis") {
        const LKEUnitKerja = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: values.variabelLKEId,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianDalnis: ((jumlah * 100) / banyak).toString(),
            nilaiDalnis: nilai
          },
          include: {
            variabelLKE: {
              include: {
                komponenLKE: true,
                subKomponenLKE: true,
                kriteriaLKE: true,
                subKriteriaLKE: true
              }
            }
          }
        });

        ///////////////////////////////////////////////////////////////////////    

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

        return NextResponse.json(LKEUnitKerja);
      }

      return NextResponse.json(variabelLKE);
    }

    // TODO: edit variabelKKEIKU

    // if ((values.kriteriaKKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
    //   const variabelKKE = await db.variabelKKE.update({
    //     where: {
    //       id: variabelIkuId,
    //     },
    //     data: {        
    //       kriteriaKKEId: values.kriteriaLKEId,
    //       kode: values.kode,
    //       tahun: values.tahun
    //     },
    //   });

    //   return NextResponse.json(variabelKKE);
    // }

    // LKE DETAIL EDIT

    const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.update({
      where: {
        id: variabelIkuId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tujuanSasaranIndikatorIKUVariabelKKE);
  } catch (error) {
    console.log("[VARIABEL_IKU_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}