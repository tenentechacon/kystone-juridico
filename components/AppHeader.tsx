import Link from "next/link";
import Logo from "@/components/Logo";
import { logout } from "@/app/actions/auth";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Clientes", href: "/clientes" },
  { label: "Configurações", href: "/configuracoes" },
];

export default function AppHeader({ email }: { email?: string | null }) {
  return (
    <header className="bg-navy-900 border-b border-navy-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Logo size={28} />
          <span className="text-white font-bold hidden sm:block">
            Kystone Jurídico
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm px-3 py-2 rounded-lg text-slate-300 hover:text-gold-400 hover:bg-navy-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {email && (
            <span className="text-xs text-slate-500 hidden md:block">
              {email}
            </span>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-lg border border-navy-700 text-slate-400 hover:border-red-500/40 hover:text-red-400 transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
