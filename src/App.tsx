import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  ScrollText,
  Building2,
  FileSignature,
  Globe,
  Briefcase,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Landmark,
  Gavel,
  HardHat,
  Building,
  MapPin,
} from "lucide-react";
import { Badge, Button, Card, CardContent, Separator } from "@/components/ui";
import { BookingForm } from "@/components/BookingForm";
import { Reservations } from "@/components/Reservations";
import { LangSwitcher } from "@/components/LangSwitcher";
import { SERVICES } from "@/lib/services";
import { t, useLang, dir } from "@/lib/i18n";
import type { Attorney } from "@/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileSignature,
  ScrollText,
  Scale,
  Building2,
  Globe,
  Briefcase,
};

const ATTORNEYS: Attorney[] = [
  { name: "Maître HANIFI Boubkeur", role: "founder", cred: 1 },
  { name: "Maître BENAICHA Houria", role: "partner", cred: 1 },
  { name: "Maître BENSADOUN Mohamed", role: "partner", cred: 1 },
  { name: "Maître HANIFI Zakaria", role: "attorney", cred: 2 },
  { name: "Maître BOUZID Noureddine", role: "attorney", cred: 2 },
];

const EXPERTISE_ICONS = [HardHat, Gavel, Building];

export default function App() {
  const [lang] = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir();
  }, [lang]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      {/* Top contact bar */}
      <div className="bg-emerald-950 text-amber-50/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-300" />
              {t("topbar.phone")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-300" />
              {t("topbar.email")}
            </span>
          </div>
          <LangSwitcher />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-amber-300 shadow-sm">
              <Scale className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-xl text-emerald-950">
                H&amp;B Law Firm
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                Attorneys at Law · Algeria
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
            <a href="#services" className="transition hover:text-emerald-900">
              {t("nav.practice")}
            </a>
            <a href="#team" className="transition hover:text-emerald-900">
              {t("nav.team")}
            </a>
            <a href="#references" className="transition hover:text-emerald-900">
              {t("nav.references")}
            </a>
            <a href="#book" className="transition hover:text-emerald-900">
              {t("nav.consult")}
            </a>
            <a href="#location" className="transition hover:text-emerald-900">
              {t("nav.location")}
            </a>
          </nav>
          <Button
            asChild
            className="bg-amber-500 text-emerald-950 shadow-sm hover:bg-amber-400"
          >
            <a href="#book">{t("cta.book")}</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-amber-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fbbf24 0, transparent 40%), radial-gradient(circle at 80% 60%, #34d399 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div>
            <Badge className="mb-5 border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/10">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {t("hero.badge")}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-4xl leading-tight text-amber-50 sm:text-5xl md:text-6xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-xl text-lg text-amber-100/80"
            >
              {t("hero.desc")}
            </motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-emerald-950 shadow hover:bg-amber-400"
              >
                <a href="#book">{t("hero.cta.book")}</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-amber-200/40 bg-transparent text-amber-50 hover:bg-amber-50/10 hover:text-amber-50"
              >
                <a href="#team">{t("hero.cta.team")}</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-amber-100/80">
              <div>
                <p className="font-serif text-2xl text-amber-50">40+</p>
                <p className="uppercase tracking-wide text-xs">{t("hero.stat.years")}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 bg-amber-200/30 sm:block"
              />
              <div>
                <p className="font-serif text-2xl text-amber-50">5</p>
                <p className="uppercase tracking-wide text-xs">{t("hero.stat.attorneys")}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 bg-amber-200/30 sm:block"
              />
              <div>
                <p className="font-serif text-2xl text-amber-50">11+</p>
                <p className="uppercase tracking-wide text-xs">{t("hero.stat.clients")}</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-amber-200/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                alt="Law library"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-stone-200 bg-stone-50 p-4 text-emerald-950 shadow-lg sm:block">
              <p className="font-serif text-lg">{t("hero.card.title")}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                {t("hero.card.loc")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Badge className="mb-3 bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
            {t("services.badge")}
          </Badge>
          <h2 className="font-serif text-3xl text-emerald-950 sm:text-4xl">
            {t("services.title")}
          </h2>
          <p className="mt-3 text-stone-600">
            {t("services.desc")}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? ScrollText;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card className="group h-full border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 transition group-hover:bg-emerald-900 group-hover:text-amber-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl text-emerald-950">
                      {s.title[lang]}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">{s.blurb[lang]}</p>
                    <Separator className="my-4 bg-stone-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-stone-500">
                        {t("services.rate")}
                      </span>
                      <span className="font-semibold text-amber-700">
                        {t("services.onrequest")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <Badge className="mb-3 bg-amber-100 text-amber-900 hover:bg-amber-100">
              {t("team.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-emerald-950 sm:text-4xl">
              {t("team.title")}
            </h2>
            <p className="mt-3 text-stone-600">
              {t("team.desc")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ATTORNEYS.map((att, i) => (
              <motion.div
                key={att.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card className="h-full border-stone-200 bg-white shadow-sm transition hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900 text-amber-300">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl text-emerald-950">
                      {att.name}
                    </h3>
                    <p className="text-sm font-medium text-amber-700">
                      {t(`team.${att.role}`)}
                    </p>
                    <Separator className="my-3 bg-stone-200" />
                    <p className="text-sm text-stone-600">
                      {t(`team.cred${att.cred}`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* References / Track Record */}
      <section id="references" className="relative overflow-hidden bg-emerald-950 text-amber-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, #fbbf24 0, transparent 30%), radial-gradient(circle at 90% 80%, #34d399 0, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-12 max-w-2xl">
            <Badge className="mb-3 border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/10">
              {t("refs.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-amber-50 sm:text-4xl">
              {t("refs.title")}
            </h2>
            <p className="mt-3 text-amber-100/80">
              {t("refs.desc")}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-14 grid grid-cols-1 gap-6 rounded-2xl border border-amber-200/20 bg-emerald-900/40 p-6 backdrop-blur sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="text-center">
                <p className="font-serif text-4xl text-amber-300">
                  {t(`refs.stat${n}.value`)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-100/70">
                  {t(`refs.stat${n}.label`)}
                </p>
              </div>
            ))}
          </div>

          {/* Expertise List */}
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-center font-serif text-2xl text-amber-50">
              {t("refs.expertise.title")}
            </h3>
            <ul className="space-y-4">
              {[1, 2, 3].map((n) => {
                const Icon = EXPERTISE_ICONS[n - 1];
                return (
                  <motion.li
                    key={n}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: n * 0.1 }}
                    className="flex items-start gap-4 rounded-xl border border-amber-200/10 bg-emerald-900/30 p-4"
                  >
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-amber-100/90">
                      {t(`refs.expertise.${n}`)}
                    </p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Booking + Reservations */}
      <section id="book" className="bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <Badge className="mb-3 bg-amber-100 text-amber-900 hover:bg-amber-100">
              {t("book.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-emerald-950 sm:text-4xl">
              {t("book.title")}
            </h2>
            <p className="mt-3 text-stone-600">
              {t("book.desc")}
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <BookingForm />
            <Reservations />
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section id="location" className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <Badge className="mb-3 bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
              <MapPin className="mr-1 h-3 w-3" />
              {t("location.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-emerald-950 sm:text-4xl">
              {t("location.title")}
            </h2>
            <p className="mt-3 text-stone-600">
              {t("location.desc")}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.0!2d3.0576111!3d36.7785553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb30059bee70f%3A0xb887aa1b8ffc3b92!2sSoci%C3%A9t%C3%A9%20D%27avocats%20HANIFI%20%26%20BENAICHA!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="H&B Law Firm Location"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-emerald-950 text-amber-50/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-emerald-950">
                <Scale className="h-5 w-5" />
              </div>
              <p className="font-serif text-xl text-amber-50">
                H&amp;B Law Firm
              </p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-amber-100/70">
              {t("footer.about")}
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-amber-300">
              {t("footer.contact")}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-300" />
                {t("topbar.email")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-300" />
                {t("topbar.phone")}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-300" />
                {t("footer.fax")}
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-amber-300">
              {t("footer.languages")}
            </p>
            <ul className="space-y-2 text-sm">
              <li>Français</li>
              <li>العربية</li>
              <li>English</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-amber-50/10 px-4 py-5 text-center text-xs text-amber-100/60">
          {t("footer.rights", { year: String(new Date().getFullYear()) })}
        </div>
      </footer>
    </div>
  );
}