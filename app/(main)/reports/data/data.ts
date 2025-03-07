import { CircleIcon } from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "CHECKED_IN",
    label: "Checked In",
    icon: CircleIcon,
  },
  {
    value: "EARLY_LEAVE",
    label: "Early Leave",
    icon: CircleIcon,
  },
  {
    value: "PRESENT",
    label: "Present",
    icon: CircleIcon,
  },
  {
    value: "LATE",
    label: "Late",
    icon: CircleIcon,
  },
  {
    value: "ABSENT",
    label: "Absent",
    icon: CircleIcon,
  },
  {
    value: "AUTO_CHECKOUT",
    label: "Auto Checkout",
    icon: CircleIcon,
  },
]

export const roles = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'OFFICER', label: 'Officer' },
  { value: 'EXECUTIVE', label: 'Executive' },
  { value: 'CHIEF_EXECUTIVE', label: 'Chief Executive' },
  { value: 'ADMIN', label: 'Admin' },
]