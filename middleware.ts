// import { NextResponse, NextRequest } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// export async function middleware(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   // Define the paths that require authentication
//   const protectedPaths = ["/attendance", "/dashboard", "/checkIn", "/user"];

//   // Check if the request is for a protected path
//   const isProtectedPath = protectedPaths.some((path) =>
//     req.nextUrl.pathname.startsWith(path)
//   );

//   // If the user is not authenticated and trying to access a protected path
//   if (isProtectedPath && !session) {
//     // Redirect to the login page
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // If the user is authenticated and trying to access the login page, redirect to the dashboard
//   if (session && req.nextUrl.pathname === "/login") {
//     return NextResponse.redirect(new URL("/attendance", req.url));
//   }

//   // Allow the request to continue
//   return NextResponse.next();
// }

// // Specify the paths to apply the middleware to
// export const config = {
//   matcher: ["/((?!api|_next|static|favicon.ico).*)"],
// };
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Check if the user has an authentication token
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  // Define protected routes
  const protectedPaths = [
    "/attendance",
    "/dashboard",
    "/checkIn",
    "/user",
    "/admin",
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from the login page
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/attendance", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to specific paths
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
