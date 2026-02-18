// app/(auth)/layout.tsx

import AuthHeader from "./_components/auth-header";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthHeader />
      <main className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-6xl items-start justify-center px-4 -py-10">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a className="hover:text-slate-700" href="#">
            Security Standards
          </a>
          <a className="hover:text-slate-700" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-slate-700" href="#">
            Contact Support
          </a>
        </div>
        <div className="mt-2">© {new Date().getFullYear()} Medical Portal</div>
      </footer>
    </div>
  );
}
