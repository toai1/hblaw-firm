import { Globe } from "lucide-react";
import { LANGS, useLang, type Lang } from "@/lib/i18n";

export function LangSwitcher() {
  const [lang, setLang] = useLang();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-amber-300" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="border-0 bg-transparent text-sm text-amber-50 focus:outline-none focus:ring-0"
      >
        {LANGS.map((l) => (
          <option key={l.id} value={l.id} className="text-stone-800">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
