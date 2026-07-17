import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, Mail, Phone, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@/components/ui";
import { useBookings, cancelBooking } from "@/lib/store";
import { SERVICES } from "@/lib/services";
import { toast } from "sonner";
import { t, useLang } from "@/lib/i18n";

export function Reservations() {
  const [lang] = useLang();
  const bookings = useBookings();
  const sorted = [...bookings].sort(
    (a, b) =>
      (a.date + a.slot).localeCompare(b.date + b.slot) ||
      a.createdAt - b.createdAt,
  );

  const serviceTitle = (id: string) =>
    SERVICES.find((s) => s.id === id)?.title[lang] ?? id;

  return (
    <Card className="border-stone-200 bg-white/90 shadow-md">
      <CardHeader className="border-b border-stone-100">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-2xl text-emerald-950">
            {t("res.title")}
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
            {bookings.length} {t("res.count")}
          </Badge>
        </div>
        <p className="text-sm text-stone-500">
          {t("res.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
            <CalendarDays className="mx-auto mb-3 h-8 w-8 text-stone-400" />
            <p className="font-medium text-stone-700">{t("res.empty.title")}</p>
            <p className="text-sm text-stone-500">
              {t("res.empty.desc")}
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {sorted.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg text-emerald-950">
                        {b.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-emerald-300 text-emerald-800"
                      >
                        {serviceTitle(b.service)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-amber-700" />
                        {format(parseISO(b.date), "EEEE, MMM d, yyyy")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-amber-700" />
                        {b.slot}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        {b.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {b.phone}
                      </span>
                    </div>
                    {b.notes ? (
                      <>
                        <Separator className="my-3 bg-stone-200" />
                        <p className="text-sm text-stone-600">
                          <span className="font-medium text-stone-700">
                            {t("res.notes")}
                          </span>{" "}
                          {b.notes}
                        </p>
                      </>
                    ) : null}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      cancelBooking(b.id);
                      toast(t("res.cancelled"), {
                        description: `${b.name} • ${b.date} at ${b.slot}`,
                      });
                    }}
                    className="border-stone-300 text-stone-600 hover:border-rose-300 hover:text-rose-700"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    {t("res.cancel")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}