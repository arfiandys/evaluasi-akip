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

    const variabelKKE = await db.variabelKKE.findUnique({
      where: {
        id: params.variabelId,
      },
    });

    if (!variabelKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedVariabelKKE = await db.variabelKKE.delete({
      where: {
        id: params.variabelId,
      },
    });

    return NextResponse.json(deletedVariabelKKE);
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

    if ((values.unitKerjaId!) && (values.input! === "input") && (values.role! === "pic")) {
      const KKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: variabelId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianPIC: values.values.isian,
        },
      });

      return NextResponse.json(KKEUnitKerja);
    }

    if ((values.unitKerjaId!) && (values.variabelLKEId!) && (values.input! === "input") && (values.role! === "at")) {
      const KKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: variabelId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianAt: values.values.isian,
        },
      });

      const variabelLKE = await db.variabelLKE.findUnique({
        where: {
          id: values.variabelLKEId
        },
        include: {
          kriteriaLKE: true,
          subKriteriaLKE: true,
        }
      })

      let catatan: string = ""
      let nilai: string = ""

      if (values.jenis === "select") {
        if (values.values.isian === "ya") {
          catatan = variabelLKE?.catatanPositif || "";
          if (variabelLKE?.kriteriaLKE?.bobot) {
            nilai = (variabelLKE?.kriteriaLKE?.bobot * 100).toString();
          }
          if (variabelLKE?.subKriteriaLKE?.bobot) {
            nilai = (variabelLKE?.subKriteriaLKE?.bobot * 100).toString();
          }
        } else if (values.values.isian === "tidak") {
          catatan = variabelLKE?.catatanNegatif || "";
          nilai = "0";
        }
      } else if (values.jenis === "dropdown") {
        if (values.values.isian === "a") {
          catatan = variabelLKE?.catatanA || "";
        } else if (values.values.isian === "b") {
          catatan = variabelLKE?.catatanB || "";
        } else if (values.values.isian === "c") {
          catatan = variabelLKE?.catatanC || "";
        }
      } else if (values.jenis === "number") {
        if (variabelLKE?.kriteriaLKE?.bobot) {
          nilai = (variabelLKE?.kriteriaLKE?.bobot * Number(values.isian)).toString();
        }
        if (variabelLKE?.subKriteriaLKE?.bobot) {
          nilai = (variabelLKE?.subKriteriaLKE?.bobot * Number(values.isian)).toString();
        }
      }

      const LKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: values.variabelLKEId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianAt: values.values.isian,
          nilaiAt: nilai,
          catatanAt: catatan,
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

      return NextResponse.json(KKEUnitKerja);
    }

    if ((values.unitKerjaId!) && (values.variabelLKEId!) && (values.input! === "input") && (values.role! === "kt")) {
      const KKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: variabelId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianKt: values.values.isian,
        },
      });

      const variabelLKE = await db.variabelLKE.findUnique({
        where: {
          id: values.variabelLKEId
        },
        include: {
          kriteriaLKE: true,
          subKriteriaLKE: true,
        }
      })

      let catatan: string = ""
      let nilai: string = ""

      if (values.jenis === "select") {
        if (values.values.isian === "ya") {
          catatan = variabelLKE?.catatanPositif || "";
          if (variabelLKE?.kriteriaLKE?.bobot) {
            nilai = (variabelLKE?.kriteriaLKE?.bobot * 100).toString();
          }
          if (variabelLKE?.subKriteriaLKE?.bobot) {
            nilai = (variabelLKE?.subKriteriaLKE?.bobot * 100).toString();
          }
        } else if (values.values.isian === "tidak") {
          catatan = variabelLKE?.catatanNegatif || "";
          nilai = "0";
        }
      } else if (values.jenis === "dropdown") {
        if (values.values.isian === "a") {
          catatan = variabelLKE?.catatanA || "";
        } else if (values.values.isian === "b") {
          catatan = variabelLKE?.catatanB || "";
        } else if (values.values.isian === "c") {
          catatan = variabelLKE?.catatanC || "";
        }
      } else if (values.jenis === "number") {
        if (variabelLKE?.kriteriaLKE?.bobot) {
          nilai = (variabelLKE?.kriteriaLKE?.bobot * Number(values.isian)).toString();
        }
        if (variabelLKE?.subKriteriaLKE?.bobot) {
          nilai = (variabelLKE?.subKriteriaLKE?.bobot * Number(values.isian)).toString();
        }
      }

      const LKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: values.variabelLKEId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianKt: values.values.isian,
          nilaiKt: nilai,
          catatanKt: catatan,
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
      //////////////////////////////////////////////////////////////////////

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

      return NextResponse.json(KKEUnitKerja);
    }

    if ((values.unitKerjaId!) && (values.variabelLKEId!) && (values.input! === "input") && (values.role! === "dalnis")) {
      const KKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: variabelId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianDalnis: values.values.isian,
        },
      });

      const variabelLKE = await db.variabelLKE.findUnique({
        where: {
          id: values.variabelLKEId
        },
        include: {
          kriteriaLKE: true,
          subKriteriaLKE: true,
        }
      })

      let catatan: string = ""
      let nilai: string = ""

      if (values.jenis === "select") {
        if (values.values.isian === "ya") {
          catatan = variabelLKE?.catatanPositif || "";
          if (variabelLKE?.kriteriaLKE?.bobot) {
            nilai = (variabelLKE?.kriteriaLKE?.bobot * 100).toString();
          }
          if (variabelLKE?.subKriteriaLKE?.bobot) {
            nilai = (variabelLKE?.subKriteriaLKE?.bobot * 100).toString();
          }
        } else if (values.values.isian === "tidak") {
          catatan = variabelLKE?.catatanNegatif || "";
          nilai = "0";
        }
      } else if (values.jenis === "dropdown") {
        if (values.values.isian === "a") {
          catatan = variabelLKE?.catatanA || "";
        } else if (values.values.isian === "b") {
          catatan = variabelLKE?.catatanB || "";
        } else if (values.values.isian === "c") {
          catatan = variabelLKE?.catatanC || "";
        }
      } else if (values.jenis === "number") {
        if (variabelLKE?.kriteriaLKE?.bobot) {
          nilai = (variabelLKE?.kriteriaLKE?.bobot * Number(values.isian)).toString();
        }
        if (variabelLKE?.subKriteriaLKE?.bobot) {
          nilai = (variabelLKE?.subKriteriaLKE?.bobot * Number(values.isian)).toString();
        }
      }

      const LKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: values.variabelLKEId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianDalnis: values.values.isian,
          nilaiDalnis: nilai,
          catatanDalnis: catatan,
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
      //////////////////////////////////////////////////////////////////////

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

      return NextResponse.json(KKEUnitKerja);
    }

    if ((values.kriteriaKKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelKKE = await db.variabelKKE.update({
        where: {
          id: variabelId,
        },
        data: {
          kriteriaKKEId: values.kriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });

      return NextResponse.json(variabelKKE);
    }

    // LKE DETAIL EDIT

    const variabelKKE = await db.variabelKKE.update({
      where: {
        id: variabelId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(variabelKKE);
  } catch (error) {
    console.log("[VARIABEL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}