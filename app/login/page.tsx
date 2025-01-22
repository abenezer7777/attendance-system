// import LoginPage from "@/components/auth/login-form";

// export default function Login() {
//   return <LoginPage />;
// }
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/auth/loginn-form";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 h-screen">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <img
            alt="Your Company"
            src="/et-logo-text.png"
            className="h-10 w-auto"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/banner.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
          // width={}
        />
      </div>
    </div>
  );
}
