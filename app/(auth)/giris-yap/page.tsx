import { LoginForm } from "@/components/auth/LoginForm";
import { GoBackBTN } from "@/components/shared/GoBackBTN";

export default function LoginPage() {
  return (
    <>
      <section className="border-l-4 md:w-1/2 border-violet-700 w-full flex flex-col items-center justify-between">
        <header className="flex items-center justify-end gap-2 w-full p-4">
          <GoBackBTN />
        </header>
        <LoginForm />
        <footer className="w-full pb-4 flex items-center justify-center border-violet-700">
          <p className="text-xs text-muted-foreground">
            © 2026 Maresans. Tüm Hakları Saklıdır.
          </p>
        </footer>
      </section>
      <section className="hidden md:flex items-center justify-center md:w-1/2 bg-violet-700">
        <h2 className="text-background text-[3rem]">MARESANS</h2>
      </section>
    </>
  );
}
