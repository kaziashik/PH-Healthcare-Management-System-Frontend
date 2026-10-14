import {
  BookOpen,
  CircleHelp,
  Info,
  Mail,
  ScrollText,
  Shield,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import BrandMark from "@/components/layout/brand-mark";

const links: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "About", href: "/about-us", icon: Info },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Help", href: "/help", icon: CircleHelp },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Privacy", href: "/privacy", icon: Shield },
  { label: "Terms", href: "/terms", icon: ScrollText },
];

export default function Footer() {
  return (
    <footer className="bg-[#06282f] text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="text-white">
            <BrandMark />
          </Link>
          <p className="mt-3 text-sm leading-6">
            Same-day visits with approved doctors.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-1 gap-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-3.5 text-[#5eead4]" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-slate-400">
        PH Healthcare. Consultation fees are paid through bKash.
      </div>
    </footer>
  );
}
