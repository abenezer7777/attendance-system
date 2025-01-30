import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];
export const levels = [
  {
    value: "division",
    label: "Division",
  },
  {
    value: "department",
    label: "Department",
  },
  {
    value: "section",
    label: "Section",
  },
];
export const roleName = [
  {
    value: "ADMIN",
    label: "ADMIN",
  },
  {
    value: "EMPLOYEE",
    label: "EMPLOYEE",
  },
  // {
  //   value: "section",
  //   label: "Section",
  // },
];

export const statuses = [
  {
    value: "draft",
    label: "Draft",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "sent",
    label: "Sent",
    icon: CircleIcon,
  },
  {
    value: "archive",
    label: "Archive",
    icon: StopwatchIcon,
  },
  // {
  //   value: "done",
  //   label: "Done",
  //   icon: CheckCircledIcon,
  // },
  // {
  //   value: "canceled",
  //   label: "Canceled",
  //   icon: CrossCircledIcon,
  // },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
