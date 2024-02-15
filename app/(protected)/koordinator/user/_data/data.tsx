import { UserRole } from "@prisma/client"
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
    value: UserRole.ADMIN,
    label: "Admin",
    icon: UserCog,
  },
  {
    value: UserRole.USER,
    label: "User",
    icon: User,
  },
]


