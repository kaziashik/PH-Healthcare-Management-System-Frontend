import { RegisterForm } from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh items-center justify-center overflow-y-auto bg-[#041318] bg-[radial-gradient(circle_at_top,#0e3a42_0%,#041318_58%)] px-4 py-10">
      <div className="w-full max-w-[440px] rounded-[28px] border border-[#1d4c57] bg-[#0b242c]/95 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8">
        <RegisterForm />
      </div>
    </div>
  );
}
