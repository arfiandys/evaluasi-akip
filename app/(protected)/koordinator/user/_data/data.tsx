import { AccountRole } from "@prisma/client"
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
import { User, UserCog } from "lucide-react"

export const roles = [
  {
    value: AccountRole.ADMIN,
    label: "Koordinator",
    icon: UserCog,
  },
  {
    value: AccountRole.USER,
    label: "Pengguna",
    icon: User,
  },
]


