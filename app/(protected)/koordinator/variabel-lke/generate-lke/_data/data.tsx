import { db } from "@/lib/db";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  GlobeIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

//=================mencoba yang gagal====//

const variabel = async () => {
  try {
    const variabelLKE = await db.variabelLKE.findMany({
      orderBy: {
        kode: "asc",
      },
    });
    const variabel_tahun = variabelLKE.filter(function (variabel) {
      return variabel.tahun;
    }).map(function (variabel) { return variabel.tahun })
  
    const tahun = variabel_tahun.filter(function (v, i, self) {
      return i == self.indexOf(v);
    }).map(function (variabel) { return {value: variabel, label: variabel }})

    return tahun
  } catch (error) {
    console.error(`ERROR:${error}`)
  }  
}
// Inisialisasi objek array konstan
const tahun = [];

// Function untuk mengambil data dan menyimpannya dalam objek array
const fetchDataAndStore = async () => {
  try {
    // Memanggil async function getData
    const result = await variabel();

    // Menyimpan hasil dalam objek array konstan
    if (result) {
      result.forEach(element => {
        tahun.push(element);
      });
    }
    

    // Lakukan operasi lain di sini jika diperlukan
  } catch (error) {
    console.error('Error:', error);
  }
};

// Memanggil function fetchDataAndStore
fetchDataAndStore();

//=================mencoba yang gagal====//



export const jenises = [
  {
    value: "dropdown",
    label: "Dropdown A/B/C",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "select",
    label: "Select Yes/No",
  },
]

export const kodeWilayahs = [
  {
    value: "31",
    label: "31",
    icon: GlobeIcon,
  },
  {
    value: "32",
    label: "32",
    icon: GlobeIcon,
  },
  {
    value: "33",
    label: "33",
    icon: GlobeIcon,
  },
  {
    value: "34",
    label: "34",
    icon: GlobeIcon,
  },
  {
    value: "35",
    label: "35",
    icon: GlobeIcon,
  },
]

export const statuses = [
  {
    label: "Incomplete",
    value: "incomplete",
    icon: CrossCircledIcon,
  },
  {
    label: "Complete",
    value: "complete",
    icon: CheckCircledIcon,
  },
]

export const tahuns = [
  {
    label: "2021",
    value: "2021",
  },
  {
    label: "2022",
    value: "2022",
  },
  {
    label: "2023",
    value: "2023",
  },
  {
    label: "2024",
    value: "2024",
  },
]
