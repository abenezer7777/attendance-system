// "use client";

// import { Navbar } from "@/components/navbar";
// import { useEffect } from "react";
// import {
//   SidebarProvider,
//   SidebarTrigger,
//   SidebarInset,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/sidebar/app-sidebar";
// import { redirect } from "next/navigation";
// import { Separator } from "@/components/ui/separator";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { UserNav } from "@/components/sidebar/user-nav";
// import { ModeToggle } from "@/components/sidebar/modeToggel";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function AttendancesLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   // const { theme } = useTheme();

//   // if (!session?.user) {
//   //   redirect("/login");
//   // }
//   // Map the paths to breadcrumb hierarchy (Group | Page)
//   const breadcrumbMap: { [key: string]: { group: string; page: string } } = {
//     "/attendance": { group: "Main", page: "Mark Your Attendance" },
//     "/": { group: "Main", page: "Mark Your Attendance" },
//     "/dashboard": { group: "Main", page: "Dashboard" },
//     "/organization": { group: "Settings & Management", page: "Organization" },
//     "/user": { group: "Settings & Management", page: "Users" },
//   };

//   const currentBreadcrumb = breadcrumbMap[pathname] || {
//     group: "Main",
//     page: "Dashboard",
//   };
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         await fetch("/api/attendance/auto-checkout", {
//           method: "POST",
//         });
//       } catch (error) {
//         console.error("Auto-checkout check failed:", error);
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     // <div className="flex flex-col min-h-screen">
//     //   <Navbar />
//     //   <div className="flex-1">{children}</div>
//     // </div>
//     // <SidebarProvider>
//     //   <AppSidebar />
//     //   <SidebarInset>
//     //     {/* Header Section */}
//     //     <header className="sticky top-0  flex h-14 items-center gap-4 bg-sidebar px-6 py-6 shadow-sm">
//     //       <SidebarTrigger />
//     //       <Separator orientation="vertical" className="h-4" />
//     //       <Breadcrumb>
//     //         <BreadcrumbList>
//     //           <BreadcrumbItem className="hidden md:block">
//     //             <BreadcrumbPage>{currentBreadcrumb.group}</BreadcrumbPage>
//     //           </BreadcrumbItem>
//     //           <BreadcrumbSeparator className="hidden md:block" />
//     //           <BreadcrumbItem>
//     //             <BreadcrumbPage>
//     //               <Link href={pathname} passHref>
//     //                 {currentBreadcrumb.page}
//     //               </Link>
//     //             </BreadcrumbPage>
//     //           </BreadcrumbItem>
//     //         </BreadcrumbList>
//     //       </Breadcrumb>
//     //       <div className="ml-auto flex items-center gap-4">
//     //         <UserNav />
//     //         <Separator orientation="vertical" className="h-8" />
//     //         <ModeToggle />
//     //       </div>
//     //     </header>

//     //     {/* Main Content Section */}
//     //     <main className="">{children}</main>
//     //   </SidebarInset>
//     // </SidebarProvider>
//     <main className="bg-muted h-screen w-full ">
//       <SidebarProvider>
//         <AppSidebar />
//         {/* <main className="bg-muted w-full h-full"> */}
//         <SidebarTrigger />
//         {children}
//         {/* </main> */}
//       </SidebarProvider>
//     </main>
//   );
// }
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
export default function AttendancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 sticky top-0 z-50 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar -">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0"> */}
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}
        <main className="container mx-auto">{children}</main>
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
