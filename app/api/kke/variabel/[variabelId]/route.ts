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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiAt)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianAt === "a" && dropdownLKE[1].isianAt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && (dropdownLKE[0].isianAt === "" || dropdownLKE[1].isianAt === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && (dropdownLKE[0].isianAt = "c" || dropdownLKE[1].isianAt === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianAt === "b" || dropdownLKE[1].isianAt === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianAt === "a" || dropdownLKE[1].isianAt === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianAt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianAt === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianAt === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianAt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && dropdownLKE[0].isianAt === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && dropdownLKE[0].isianAt === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////
        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianAt: jumlah.toString(),
            nilaiAt: nilai.toString()
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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiAt)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianAt === "a" && dropdownLKE[1].isianAt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && (dropdownLKE[0].isianAt === "" || dropdownLKE[1].isianAt === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && (dropdownLKE[0].isianAt = "c" || dropdownLKE[1].isianAt === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianAt === "b" || dropdownLKE[1].isianAt === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianAt === "a" || dropdownLKE[1].isianAt === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianAt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianAt === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianAt === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianAt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && dropdownLKE[0].isianAt === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianAt === "ya" && dropdownLKE[0].isianAt === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////

        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianAt: jumlah.toString(),
            nilaiAt: nilai.toString()
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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiKt)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianKt === "a" && dropdownLKE[1].isianKt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && (dropdownLKE[0].isianKt === "" || dropdownLKE[1].isianKt === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && (dropdownLKE[0].isianKt = "c" || dropdownLKE[1].isianKt === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianKt === "b" || dropdownLKE[1].isianKt === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianKt === "a" || dropdownLKE[1].isianKt === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianKt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianKt === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianKt === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianKt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && dropdownLKE[0].isianKt === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && dropdownLKE[0].isianKt === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////

        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianKt: jumlah.toString(),
            nilaiKt: nilai.toString()
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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiKt)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianKt === "a" && dropdownLKE[1].isianKt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && (dropdownLKE[0].isianKt === "" || dropdownLKE[1].isianKt === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && (dropdownLKE[0].isianKt = "c" || dropdownLKE[1].isianKt === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianKt === "b" || dropdownLKE[1].isianKt === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianKt === "a" || dropdownLKE[1].isianKt === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianKt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianKt === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianKt === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianKt === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && dropdownLKE[0].isianKt === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianKt === "ya" && dropdownLKE[0].isianKt === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////

        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianKt: jumlah.toString(),
            nilaiKt: nilai.toString()
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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerjaKriteria.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiDalnis)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianDalnis === "a" && dropdownLKE[1].isianDalnis === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && (dropdownLKE[0].isianDalnis === "" || dropdownLKE[1].isianDalnis === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && (dropdownLKE[0].isianDalnis = "c" || dropdownLKE[1].isianDalnis === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianDalnis === "b" || dropdownLKE[1].isianDalnis === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianDalnis === "a" || dropdownLKE[1].isianDalnis === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianDalnis === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianDalnis === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianDalnis === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianDalnis === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && dropdownLKE[0].isianDalnis === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && dropdownLKE[0].isianDalnis === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////

        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianDalnis: jumlah.toString(),
            nilaiDalnis: nilai.toString()
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

        const variabelLKEPembobot = await db.variabelLKE.findMany({
          where: {
            AND: [
              {
                kriteriaLKE: {
                  subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                }
              },
              {
                isPembobot: true
              }
            ]
          },
          orderBy: {
            kode: "asc"
          },
          include: {
            kriteriaLKE: true,
            subKomponenLKE: true,
          }
        })

        const LKEKriteriaPembobot = await db.lKEUnitKerja.findMany({
          where: {
            AND: [
              {
                variabelLKE: {
                  AND: [
                    {
                      kriteriaLKE: {
                        subKomponenLKEId: LKEUnitKerja.variabelLKE.kriteriaLKE?.subKomponenLKEId!
                      }
                    },
                    {
                      isPembobot: true
                    }
                  ]
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



        const select = variabelLKEPembobot.filter((item) => item.jenisIsian === "select")
        const dropdown = variabelLKEPembobot.filter((item) => item.jenisIsian === "dropdown")
        const selectLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "select")
        const dropdownLKE = LKEKriteriaPembobot.filter((item) => item.variabelLKE.jenisIsian === "dropdown")

        let jumlah: number = 0;
        let nilai: number = 0;

        LKEKriteria.forEach((data) => {
          jumlah += Number(data.nilaiDalnis)
        })

        //////////////////////////////////////////////////////////////////////
        //////////////////////// LOGIKA UNTUK PEMBOBOTAN /////////////////////
        //////////////////////////////////////////////////////////////////////

        if (select.length === 1 && dropdown.length === 2) {
          if (jumlah === 100 && dropdownLKE[0].isianDalnis === "a" && dropdownLKE[1].isianDalnis === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && (dropdownLKE[0].isianDalnis === "" || dropdownLKE[1].isianDalnis === "")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && (dropdownLKE[0].isianDalnis = "c" || dropdownLKE[1].isianDalnis === "c")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && (dropdownLKE[0].isianDalnis === "b" || dropdownLKE[1].isianDalnis === "b")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && (dropdownLKE[0].isianDalnis === "a" || dropdownLKE[1].isianDalnis === "a")) {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          }
        } else if (select.length === 2 && dropdown.length === 0) {
          if (jumlah === 100 && selectLKE[1].isianDalnis === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && selectLKE[1].isianDalnis === "tidak") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        } else if (select.length === 1 && dropdown.length === 1) {
          if (jumlah === 100 && dropdownLKE[0].isianDalnis === "a") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100
          } else if (jumlah === 100 && dropdownLKE[0].isianDalnis === "b") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.9
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && dropdownLKE[0].isianDalnis === "") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          } else if (jumlah === 100 && selectLKE[0].isianDalnis === "ya" && dropdownLKE[0].isianDalnis === "c") {
            nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.8
          }
        }
        /////////// TAMBAHKAN LOGIKA DISINI /////////////
        else {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * jumlah
        }

        if (jumlah < 100 && jumlah > 75) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.7
        } else if (jumlah <= 75 && jumlah >= 50) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.6
        } else if (jumlah < 50 && jumlah >= 25) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.5
        } else if (jumlah < 25 && jumlah > 0) {
          nilai = variabelLKESubKomponen?.subKomponenLKE?.bobot! * 100 * 0.3
        } else if (jumlah === 0) {
          nilai = 0
        }

        /////////////////////////////////////////////////////////////////////////
        
        const LKEUnitKerjaSubKomponen = await db.lKEUnitKerja.update({
          where: {
            LKEUnitKerjaId: {
              variabelLKEId: variabelLKESubKomponen?.id!,
              unitKerjaId: values.unitKerjaId
            }
          },
          data: {
            isianDalnis: jumlah.toString(),
            nilaiDalnis: nilai.toString()
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