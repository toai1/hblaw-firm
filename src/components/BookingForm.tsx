import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Mail, User, Phone, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label, Textarea, Separator } from "@/components/ui";
import { SERVICES } from "@/lib/services";
import { addBooking } from "@/lib/store";
import { t, useLang } from "@/lib/i18n";

const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export function BookingForm() {
  const [lang] = useLang();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !service || !date || !slot) {
      setError(t("form.error"));
      setSuccess(false);
      return;
    }
    setError("");
    setLoading(true);

    const svc = SERVICES.find((s) => s.id === service);
    const svcTitle = svc ? svc.title[lang] : service;

    addBooking({
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      service: service as import("@/types").ServiceId,
      date,
      slot,
      notes,
      createdAt: Date.now(),
    });

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, service: svcTitle, date, slot, notes }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setService("");
      setDate("");
      setSlot("");
      setNotes("");
    } catch {
      setError(t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-stone-200 bg-white shadow-lg">
      <CardHeader className="border-b border-stone-200 bg-stone-50/50">
        <CardTitle className="font-serif text-2xl text-emerald-950">
          {t("form.title")}
        </CardTitle>
        <CardDescription className="text-stone-600">
          {t("form.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1.5 text-stone-700">
                <User className="h-3.5 w-3.5 text-emerald-700" />
                {t("form.name")} <span className="text-amber-700">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-stone-700">
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                {t("form.phone")} <span className="text-amber-700">*</span>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213..."
                className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-stone-700">
              <Mail className="h-3.5 w-3.5 text-emerald-700" />
              {t("form.email")} <span className="text-amber-700">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="flex items-center gap-1.5 text-stone-700">
              <FileText className="h-3.5 w-3.5 text-emerald-700" />
              {t("form.service")} <span className="text-amber-700">*</span>
            </Label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">{t("form.select.service")}</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title[lang]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1.5 text-stone-700">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-700" />
                {t("form.date")} <span className="text-amber-700">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot" className="flex items-center gap-1.5 text-stone-700">
                <Clock className="h-3.5 w-3.5 text-emerald-700" />
                {t("form.slot")} <span className="text-amber-700">*</span>
              </Label>
              <select
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{t("form.select.slot")}</option>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-stone-700">
              {t("form.notes")}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("form.notes.ph")}
              className="min-h-[100px] border-stone-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <Separator className="bg-stone-200" />

          <p className="text-xs text-stone-500 italic">
            {t("form.disclaimer")}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("form.success")}
            </motion.div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full bg-emerald-900 text-amber-50 shadow hover:bg-emerald-800"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? t("form.sending") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
