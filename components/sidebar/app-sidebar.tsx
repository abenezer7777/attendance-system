"use client";
import {
  BuildingIcon,
  Clock,
  Home,
  LayoutDashboard,
  LocateIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainItems = [
  {
    title: "Attendance",
    url: "/attendance",
    icon: Clock,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "attendance2",
  //   url: "/checkIn",
  //   icon: Home,
  // },
  // {
  //   title: "Admin Dashboard",
  //   url: "/admin",
  //   icon: Users, // Using Users icon as a placeholder.  Replace with appropriate icon.
  // },
];

const settingsItems = [
  {
    title: "User",
    url: "/user",
    icon: Users,
    subject: "User",
  },
  {
    title: "Location",
    url: "/location",
    icon: LocateIcon,
    // subject: "User",
  },
  {
    title: "Organization",
    url: "/organization",
    icon: BuildingIcon,

    // subject: "User",
  },
];

export function AppSidebar() {
  const currentRoute = usePathname();
  const { theme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/attendance">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Logo"
                    src={
                      theme === "dark"
                        ? "/et-logo-text-dark.png"
                        : "/et-logo-text.png"
                    }
                    className="h-10 w-auto"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between">
        {/* <div> */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        currentRoute === item.url ? "text-lime-600" : "",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-gray-100 hover:text-lime-500"
                      )}
                    >
                      <item.icon
                        className={cn(
                          currentRoute === item.url ? "text-lime-600" : "",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarGroup className="mb-2">
            <SidebarGroupLabel>Settings & Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          currentRoute === item.url ? "text-lime-600" : "",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-gray-100 hover:text-lime-500"
                        )}
                      >
                        <item.icon
                          className={cn(
                            currentRoute === item.url ? "text-lime-600" : "",
                            "h-6 w-6 shrink-0"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
        {/* </div> */}
      </SidebarContent>

      {/* </SidebarFooter> */}
    </Sidebar>
  );
}
// "use client";

// import * as React from "react";
// import {
//   AudioWaveform,
//   BookOpen,
//   Bot,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react";

// // import { NavMain } from "@/components/nav-main";
// // import { NavProjects } from "@/components/nav-projects";
// // import { NavUser } from "@/components/nav-user";
// // import { TeamSwitcher } from "@/components/team-switcher";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import { NavUser } from "./Nav-user2";

// // This is sample data.
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Models",
//       url: "#",
//       icon: Bot,
//       items: [
//         {
//           title: "Genesis",
//           url: "#",
//         },
//         {
//           title: "Explorer",
//           url: "#",
//         },
//         {
//           title: "Quantum",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Documentation",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         {
//           title: "Introduction",
//           url: "#",
//         },
//         {
//           title: "Get Started",
//           url: "#",
//         },
//         {
//           title: "Tutorials",
//           url: "#",
//         },
//         {
//           title: "Changelog",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Settings",
//       url: "#",
//       icon: Settings2,
//       items: [
//         {
//           title: "General",
//           url: "#",
//         },
//         {
//           title: "Team",
//           url: "#",
//         },
//         {
//           title: "Billing",
//           url: "#",
//         },
//         {
//           title: "Limits",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
// };

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         {/* <TeamSwitcher teams={data.teams} /> */}
//         <h3>Main</h3>
//       </SidebarHeader>
//       <SidebarContent>
//         <h3>Main</h3>
//         <h3>Main</h3>
//         {/* <NavMain items={data.navMain} /> */}
//         {/* <NavProjects projects={data.projects} /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />

//         <h3>Main fotter</h3>
//       </SidebarFooter>

//       <SidebarRail />
//     </Sidebar>
//   );
// }
