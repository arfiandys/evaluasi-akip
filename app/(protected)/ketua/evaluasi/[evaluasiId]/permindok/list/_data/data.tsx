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
