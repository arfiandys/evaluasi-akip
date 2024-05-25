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

export const jenises = [
  {
    value: "pusat",
    label: "Pusat",
  },
  {
    value: "provinsi",
    label: "Provinsi",
  },
  {
    value: "kab/kota",
    label: "Kabupaten/Kota",
  },
]

export const statuses = [
  {
    label: "Tidak lengkap",
    value: "incomplete",
    icon: CrossCircledIcon,
  },
  {
    label: "Lengkap",
    value: "complete",
    icon: CheckCircledIcon,
  },
]