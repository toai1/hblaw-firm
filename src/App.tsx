import { useState, useEffect, useSyncExternalStore } from "react";
import emailjs from "@emailjs/browser";
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
  CalendarDays,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";

// ── cn utility ─────────────────────────────────────────────────────────────

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Types ──────────────────────────────────────────────────────────────────

type Lang = "en" | "fr" | "ar";

type ServiceId =
  | "public-procurement"
  | "business-law"
  | "corporate-law"
  | "arbitration-mediation"
  | "tax-law"
  | "criminal-law"
  | "land-real-estate"
  | "labor-family"
  | "intellectual-property";

interface Localized {
  en: string;
  fr: string;
  ar: string;
}

interface Service {
  id: ServiceId;
  title: Localized;
  blurb: Localized;
  rate: string;
  icon: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: ServiceId;
  date: string;
  slot: string;
  notes: string;
  createdAt: number;
}

type AttorneyRole = "founder" | "partner" | "attorney";

interface Attorney {
  name: string;
  role: AttorneyRole;
  desc: Localized;
}

// ── i18n ───────────────────────────────────────────────────────────────────

const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "fr", label: "Français", dir: "ltr" },
  { id: "ar", label: "العربية", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.practice": "Practice",
  "nav.team": "Team",
  "nav.consult": "Consult",
  "nav.location": "Location",
  "cta.book": "Book Now",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.tagline": "Legal excellence at the service of your ambitions.",
  "hero.subtitle": "Legal excellence at the service of your ambitions.",
  "hero.cta.book": "Reserve a consultation",
  "hero.cta.team": "Meet the team",
  "hero.stat.years": "Years practice",
  "hero.stat.attorneys": "Attorneys at Law",
  "hero.stat.clients": "Major Clients",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Algiers, Algeria",
  "services.badge": "Practice Areas",
  "pres.badge": "About Us",
  "pres.title": "Maître Hanifi & Associés",
  "pres.p1": "The firm supports businesses, institutions, and individuals in legal risk prevention, strategic counseling, negotiation, and the defense of their interests.",
  "pres.p2": "Our team combines complementary skills to offer comprehensive support across the main areas of law. We prioritize an approach built on active listening, legal rigor, confidentiality, and the pursuit of solutions tailored to each client's objectives.",
  "pres.p3": "With over forty years of experience, the firm has developed recognized expertise in business law, public procurement, arbitration, taxation, and litigation, while expanding its capabilities to meet the emerging challenges of digital law and artificial intelligence.",
  "pres.p4": "Our mission is to transform legal complexity into clear, strategic solutions tailored to our clients' needs.",
  "services.title": "Areas of Expertise",
  "services.desc": "From contract negotiation to international arbitration, we provide comprehensive legal support for your most complex projects.",
  "services.rate": "Initial consult",
  "services.onrequest": "On request",
  "team.badge": "Our Team",
  "team.title": "Meet the Attorneys",
  "team.desc": "A dedicated team of legal professionals accredited by the highest courts.",
  "team.founder": "Founding Partner",
  "team.partner": "Partner",
  "team.attorney": "Attorney",
  "team.cred1": "Attorney at the Court, accredited by the Supreme Court and the Council of State",
  "team.cred2": "Member of the World Order of International Experts (OMEI – Geneva)",
  "book.badge": "Consultation",
  "book.title": "Reserve your appointment",
  "book.desc": "Choose a practice area, pick a time that suits you, and your email client will open to send the request to our attorneys.",
  "form.title": "Reserve a Consultation",
  "form.subtitle": "Book a private appointment with our team. Fields marked * are required.",
  "form.name": "Full name",
  "form.phone": "Phone",
  "form.email": "Email",
  "form.service": "Practice area",
  "form.date": "Preferred date",
  "form.slot": "Time slot",
  "form.notes": "Case notes (optional)",
  "form.notes.ph": "Briefly describe your situation. Anything you share is privileged.",
  "form.disclaimer": "By submitting, your email client will open to send the request to our attorneys.",
  "form.submit": "Confirm Reservation",
  "form.sending": "Processing...",
  "form.select.service": "Select a practice area",
  "form.select.slot": "Choose a time",
  "form.success": "Consultation reserved. Your email client will open to confirm.",
  "form.error": "Please complete all required fields.",
  "form.error.email": "Booking saved, but email could not be sent. Our team will contact you.",
  "res.title": "Your Reservations",
  "res.subtitle": "Review or cancel your upcoming consultations.",
  "res.count": "booked",
  "res.empty.title": "No reservations yet",
  "res.empty.desc": "Use the form to reserve your first consultation.",
  "res.cancel": "Cancel",
  "res.cancelled": "Reservation cancelled",
  "res.notes": "Notes:",
  "location.badge": "Our Location",
  "location.title": "Visit Our Office",
  "location.desc": "Located in Algiers, Algeria. We welcome clients for in-person consultations.",
  "footer.about": "Société Civile Professionnelle d'Avocats. Providing expert legal counsel in Algeria and internationally since 1985.",
  "footer.contact": "Contact",
  "footer.fax": "Fax: 028170900",
  "footer.languages": "Languages",
  "footer.rights": "© {year} H&B Law Firm. All rights reserved.",
};

const fr: Dict = {
  "nav.practice": "Pratique",
  "nav.team": "Équipe",
  "nav.consult": "Consultation",
  "nav.location": "Emplacement",
  "cta.book": "Réserver",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.tagline": "L'excellence juridique au service de vos ambitions.",
  "hero.subtitle": "L'excellence juridique au service de vos ambitions.",
  "hero.cta.book": "Réserver une consultation",
  "hero.cta.team": "Rencontrer l'équipe",
  "hero.stat.years": "Ans de pratique",
  "hero.stat.attorneys": "Avocats experts",
  "hero.stat.clients": "Grands clients",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Alger, Algérie",
  "services.badge": "Domaines de pratique",
  "pres.badge": "À propos",
  "pres.title": "Maître Hanifi & Associés",
  "pres.p1": "Le cabinet accompagne les entreprises, les institutions et les particuliers dans la prévention des risques juridiques, le conseil stratégique, la négociation et la défense de leurs intérêts.",
  "pres.p2": "Notre équipe allie des compétences complémentaires pour offrir un accompagnement global dans les principaux domaines du droit. Nous privilégions une approche fondée sur l'écoute active, la rigueur juridique, la confidentialité et la recherche de solutions adaptées aux objectifs de chaque client.",
  "pres.p3": "Avec plus de quarante ans d'expérience, le cabinet a développé une expertise reconnue en droit des affaires, marchés publics, arbitrage, fiscalité et contentieux, tout en élargissant ses compétences pour répondre aux défis émergents du droit du numérique et de l'intelligence artificielle.",
  "pres.p4": "Notre mission est de transformer la complexité juridique en solutions claires et stratégiques adaptées aux besoins de nos clients.",
  "services.title": "Domaines de Compétence",
  "services.desc": "De la négociation de contrats à l'arbitrage international, nous offrons un soutien juridique complet pour vos projets les plus complexes.",
  "services.rate": "Consultation initiale",
  "services.onrequest": "Sur demande",
  "team.badge": "Notre Équipe",
  "team.title": "Rencontrez les Avocats",
  "team.desc": "Une équipe dévouée de professionnels du droit accrédités par les plus hautes juridictions.",
  "team.founder": "Associé Fondateur",
  "team.partner": "Associée",
  "team.attorney": "Avocat",
  "team.cred1": "Avocat à la Cour, agréé près du Tribunal Suprême et du Conseil d'État",
  "team.cred2": "Membre de l'Ordre Mondial des Experts Internationaux (OMEI – Genève)",
  "book.badge": "Consultation",
  "book.title": "Réservez votre rendez-vous",
  "book.desc": "Choisissez un domaine de pratique, sélectionnez une heure qui vous convient, et votre client de messagerie s'ouvrira pour envoyer la demande à nos avocats.",
  "form.title": "Réserver une Consultation",
  "form.subtitle": "Prenez un rendez-vous privé avec notre équipe. Les champs marqués * sont obligatoires.",
  "form.name": "Nom complet",
  "form.phone": "Téléphone",
  "form.email": "E-mail",
  "form.service": "Domaine de pratique",
  "form.date": "Date préférée",
  "form.slot": "Créneau horaire",
  "form.notes": "Notes sur le dossier (optionnel)",
  "form.notes.ph": "Décrivez brièvement votre situation. Tout ce que vous partagez est confidentiel.",
  "form.disclaimer": "En soumettant, votre client de messagerie s'ouvrira pour envoyer la demande à nos avocats.",
  "form.submit": "Confirmer la réservation",
  "form.sending": "Traitement...",
  "form.select.service": "Sélectionner un domaine",
  "form.select.slot": "Choisir une heure",
  "form.success": "Consultation réservée. Votre client de messagerie va s'ouvrir pour confirmer.",
  "form.error": "Veuillez remplir tous les champs obligatoires.",
  "form.error.email": "Réservation enregistrée, mais l'e-mail n'a pas pu être envoyé. Notre équipe vous contactera.",
  "res.title": "Vos Réservations",
  "res.subtitle": "Consultez ou annulez vos rendez-vous à venir.",
  "res.count": "réservées",
  "res.empty.title": "Aucune réservation",
  "res.empty.desc": "Utilisez le formulaire pour réserver votre première consultation.",
  "res.cancel": "Annuler",
  "res.cancelled": "Réservation annulée",
  "res.notes": "Notes :",
  "footer.about": "Société Civile Professionnelle d'Avocats. Offrant un conseil juridique expert en Algérie et à l'international depuis 1985.",
  "location.badge": "Notre Emplacement",
  "location.title": "Visitez Notre Bureau",
  "location.desc": "Situé à Alger, Algérie. Nous accueillons les clients pour des consultations en personne.",
  "footer.contact": "Contact",
  "footer.fax": "Fax : 028170900",
  "footer.languages": "Langues",
  "footer.rights": "© {year} Cabinet H&B. Tous droits réservés.",
};

const ar: Dict = {
  "nav.practice": "الممارسة",
  "nav.team": "الفريق",
  "nav.consult": "استشارة",
  "nav.location": "الموقع",
  "cta.book": "احجز الآن",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.tagline": "التميز القانوني في خدمة طموحاتك.",
  "hero.subtitle": "التميز القانوني في خدمة طموحاتك.",
  "hero.cta.book": "احجز استشارة",
  "hero.cta.team": "تعرف على الفريق",
  "hero.stat.years": "سنوات الممارسة",
  "hero.stat.attorneys": "محامون خبراء",
  "hero.stat.clients": "عملاء كبار",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "الجزائر العاصمة، الجزائر",
  "services.badge": "مجالات الممارسة",
  "pres.badge": "من نحن",
  "pres.title": "مكتب الأستاذ حنيفي وشركاه",
  "pres.p1": "يرافق المكتب الشركات والمؤسسات والأفراد في الوقاية من المخاطر القانونية والاستشارات الاستراتيجية والتفاوض والدفاع عن مصالحهم.",
  "pres.p2": "يجمع فريقنا بين مهارات مكملة لتقديم دعم شامل عبر المجالات الرئيسية للقانون. نحن نعطي الأولوية لنهج يرتكز على الاستماع الفعال والدقة القانونية والسرية والسعي نحو حلول مصممة وفق أهداف كل عميل.",
  "pres.p3": "بخبرة تمتد لأكثر من أربعين عامًا، طوّر المكتب خبرة معترف بها في قانون الأعمال والمناقصات العامة والتحكيم والضرائب والDUCTIEUX، ووسع قدراته لmeet تحديات قانوني الرقمي والذكاء الاصطناعي الناشئة.",
  "pres.p4": "مهمتنا هي تحويل التعقيد القانوني إلى حلول واضحة واستراتيجية مصممة وفق احتياجات عملائنا.",
  "services.title": "مجالات الخبرة",
  "services.desc": "من التفاوض على العقود إلى التحكيم الدولي، نقدم دعماً قانونياً شاملاً لمشاريعك الأكثر تعقيداً.",
  "services.rate": "استشارة أولية",
  "services.onrequest": "عند الطلب",
  "team.badge": "فريقنا",
  "team.title": "تعرف على المحامين",
  "team.desc": "فريق مكرس من المهنيين القانونيين المعتمدين من أعلى المحاكم.",
  "team.founder": "الشريك المؤسس",
  "team.partner": "شريك",
  "team.attorney": "محامٍ",
  "team.cred1": "محامٍ في المحكمة، معتمد لدى المحكمة العليا ومجلس الدولة",
  "team.cred2": "عضو في النظام العالمي للخبراء الدوليين (OMEI – جنيف)",
  "book.badge": "استشارة",
  "book.title": "احجز موعدك",
  "book.desc": "اختر مجال الممارسة، واختر الوقت الذي يناسبك، وسيتم فتح برنامج البريد الإلكتروني الخاص بك لإرسال الطلب إلى محامينا.",
  "form.title": "احجز استشارة",
  "form.subtitle": "احجز موعداً خاصاً مع فريقنا. الحقول المميزة بـ * مطلوبة.",
  "form.name": "الاسم الكامل",
  "form.phone": "الهاتف",
  "form.email": "البريد الإلكتروني",
  "form.service": "مجال الممارسة",
  "form.date": "التاريخ المفضل",
  "form.slot": "الفتحة الزمنية",
  "form.notes": "ملاحظات القضية (اختياري)",
  "form.notes.ph": "صف حالتك بإيجاز. كل ما تشاركه محمي بسرية تامة.",
  "form.disclaimer": "بالإرسال، سيتم فتح برنامج البريد الإلكتروني الخاص بك لإرسال الطلب إلى محامينا.",
  "form.submit": "تأكيد الحجز",
  "form.sending": "جاري المعالجة...",
  "form.select.service": "اختر مجال الممارسة",
  "form.select.slot": "اختر وقتًا",
  "form.success": "تم حجز الاستشارة. سيتم فتح برنامج البريد الإلكتروني الخاص بك للتأكيد.",
  "form.error": "يرجى إكمال جميع الحقول المطلوبة.",
  "form.error.email": "تم حجز الموعد، لكن لم يتم إرسال البريد الإلكتروني. سيتواصل فريقنا معك.",
  "res.title": "حجوزاتك",
  "res.subtitle": "راجع أو ألغِ مواعيدك القادمة.",
  "res.count": "محجوز",
  "res.empty.title": "لا توجد حجوزات بعد",
  "res.empty.desc": "استخدم النموذج لحجز استشارتك الأولى.",
  "res.cancel": "إلغاء",
  "res.cancelled": "تم إلغاء الحجز",
  "res.notes": "ملاحظات:",
  "location.badge": "موقعنا",
  "location.title": "زور مكتبنا",
  "location.desc": "يقع مكتبنا في الجزائر العاصمة، الجزائر. نرحب بالعملاء للاستشارات الشخصية.",
  "footer.about": "شركة مدنية مهنية للمحامين. نقدم استشارات قانونية متخصصة في الجزائر ودولياً منذ 1985.",
  "footer.contact": "اتصل بنا",
  "footer.fax": "فاكس: 028170900",
  "footer.languages": "اللغات",
  "footer.rights": "© {year} مكتب H&B. جميع الحقوق محفوظة.",
};

const DICTS: Record<Lang, Dict> = { en, fr, ar };

const KEY = "hblaw.lang.v1";
const langListeners = new Set<() => void>();

function getStored(): Lang {
  try {
    const v = localStorage.getItem(KEY) as Lang | null;
    if (v && DICTS[v]) return v;
  } catch {}
  return "en";
}

let current: Lang = getStored();

function emitLang() {
  langListeners.forEach((l) => l());
}

function setLang(l: Lang) {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  emitLang();
}

function subscribeLang(cb: () => void) {
  langListeners.add(cb);
  return () => langListeners.delete(cb);
}

function getLangSnapshot() {
  return current;
}

function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangSnapshot);
  return [lang, setLang];
}

function t(key: string, vars?: Record<string, string>): string {
  const dict = DICTS[current] || en;
  let str = dict[key] || en[key] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
  }
  return str;
}

function dir(): "ltr" | "rtl" {
  return current === "ar" ? "rtl" : "ltr";
}

// ── Services ───────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: "public-procurement",
    title: { en: "🏛️ Public Procurement", fr: "🏛️ Marchés Publics", ar: "🏛️ المناقصات العامة" },
    blurb: {
      en: "Public procurement is one of the firm's core areas of excellence. With several decades of experience, we support businesses, public entities, and investors through every stage of their operations, from the preparation of bids to the resolution of disputes.",
      fr: "Les marchés publics constituent l'un des domaines d'excellence du cabinet. Avec plusieurs décennies d'expérience, nous accompagnons les entreprises, les entités publiques et les investisseurs à chaque étape de leurs opérations, de la préparation des offres à la résolution des litiges.",
      ar: "المناقصات العامة هي إحدى مجالات التميز الأساسية للمكتب. مع عقود من الخبرة، نرافق الشركات والكيانات العامة والمستثمرين في كل مرحلة من مراحل عملياتهم، من إعداد العروض إلى حل النزاعات.",
    },
    rate: "onrequest",
    icon: "Building2",
  },
  {
    id: "business-law",
    title: { en: "💼 Business Law", fr: "💼 Droit des Affaires", ar: "💼 قانون الأعمال" },
    blurb: {
      en: "The firm supports businesses, executives, and investors in their day-to-day operations as well as their growth strategies. Our approach aims to secure economic transactions, mitigate legal risks, and deliver solutions tailored to each client's specific commercial challenges.",
      fr: "Le cabinet accompagne les entreprises, les dirigeants et les investisseurs dans leurs activités quotidiennes ainsi que dans leurs stratégies de croissance. Notre approche vise à sécuriser les transactions économiques, atténuer les risques juridiques et offrir des solutions adaptées aux défis commerciaux spécifiques de chaque client.",
      ar: "يرافق المكتب الشركات والمديرين والمستثمرين في أنشطتهم اليومية وكذلك في استراتيجيات نموهم. يهدف نهجنا إلى تأمين المعاملات الاقتصادية، والتخفيف من المخاطر القانونية، وتقديم حلول مصممة وفق التحديات التجارية الخاصة لكل عميل.",
    },
    rate: "onrequest",
    icon: "Briefcase",
  },
  {
    id: "corporate-law",
    title: { en: "🏢 Corporate Law", fr: "🏢 Droit des Sociétés", ar: "🏢 قانون الشركات" },
    blurb: {
      en: "We assist companies at every stage of their development, from creation to restructuring, ensuring the legal compliance of their corporate structure and protecting the interests of shareholders and executives.",
      fr: "Nous assistons les entreprises à chaque étape de leur développement, de la création à la restructuration, en assurant la conformité juridique de leur structure et en protégeant les intérêts des actionnaires et des dirigeants.",
      ar: "نساعد الشركات في كل مرحلة من مراحل تطورها، من التأسيس إلى إعادة الهيكلة، مع ضمان الامتثال القانوني لهيكلها corporate وحماية مصالح المساهمين والمديرين.",
    },
    rate: "onrequest",
    icon: "Building",
  },
  {
    id: "arbitration-mediation",
    title: { en: "🤝 Arbitration & Mediation", fr: "🤝 Arbitrage & Médiation", ar: "🤝 التحكيم والوساطة" },
    blurb: {
      en: "The firm prioritizes dispute resolution methods that are efficient, confidential, and tailored to the stakes of each case. We guide our clients through arbitration and mediation procedures to facilitate swift and sustainable solutions.",
      fr: "Le cabinet privilégie des méthodes de résolution des litiges efficaces, confidentielles et adaptées aux enjeux de chaque affaire. Nous guidons nos clients à travers les procédures d'arbitrage et de médiation pour faciliter des solutions rapides et durables.",
      ar: "يحرص المكتب على طرق تسوية النزاعات الفعالة والسرية والمصممة وفق أهمية كل قضية. نرافق عملاءنا في إجراءات التحكيم والوساطة لتسهيل حلول سريعة ومستدامة.",
    },
    rate: "onrequest",
    icon: "Scale",
  },
  {
    id: "tax-law",
    title: { en: "📊 Tax Law", fr: "📊 Droit Fiscal", ar: "📊 القانون الضريبي" },
    blurb: {
      en: "Taxation is a strategic priority for businesses and individuals alike. Our firm provides rigorous support in advisory services, compliance, and tax litigation management, with the ultimate goal of securing our clients' decisions and effectively defending their interests before the relevant tax authorities.",
      fr: "La fiscalité est une priorité stratégique pour les entreprises et les particuliers. Notre cabinet offre un accompagnement rigoureux en conseil, conformité et gestion du contentieux fiscal, avec l'objectif final de sécuriser les décisions de nos clients et défendre efficacement leurs intérêts devant les autorités fiscales compétentes.",
      ar: "الضرائب هي أولوية استراتيجية للشركات والأفراد على حد سواء. يوفر مكتبنا دعمًا صارمًا في الاستشارات والامتثال وإدارة النزاعات الضريبية، بهدف تأمين قرارات عملائنا والدفاع بفعالية عن مصالحهم أمام الجهات الضريبية المختصة.",
    },
    rate: "onrequest",
    icon: "FileText",
  },
  {
    id: "criminal-law",
    title: { en: "⚖️ Criminal Law", fr: "⚖️ Droit Pénal", ar: "⚖️ القانون الجنائي" },
    blurb: {
      en: "We provide defense and legal assistance to our clients at every stage of criminal proceedings, with particular emphasis on upholding their rights, maintaining confidentiality, and implementing a defense strategy tailored to each situation.",
      fr: "Nous assurons la défense et l'assistance juridique de nos clients à chaque étape de la procédure pénale, en insistant particulièrement sur le respect de leurs droits, le maintien de la confidentialité et la mise en œuvre d'une stratégie de défense adaptée à chaque situation.",
      ar: "نقدم الدفاع والمساعدة القانونية لعملائنا في كل مرحلة من مراحل الإجراءات الجنائية، مع التأكيد على حفظ حقوقهم والحفاظ على السرية وتطبيق استراتيجية دفاع مصممة لكل موقف.",
    },
    rate: "onrequest",
    icon: "Gavel",
  },
  {
    id: "land-real-estate",
    title: { en: "🏠 Land & Real Estate Law", fr: "🏠 Droit Foncier et Immobilier", ar: "🏠 قانون العقارات والأراضي" },
    blurb: {
      en: "The firm supports individuals, companies, and investors in their real estate transactions and property matters. We leverage our expertise to secure projects and resolve disputes related to property ownership and real estate.",
      fr: "Le cabinet accompagne les particuliers, les entreprises et les investisseurs dans leurs transactions immobilières et leurs questions foncières. Nous exploitons notre expertise pour sécuriser les projets et résoudre les litiges liés à la propriété immobilière.",
      ar: "يرافق المكتب الأفراد والشركات والمستثمرين في صفقاتهم العقارية وشؤون ملكيتهم. نستفيد من خبرتنا لتأمين المشاريع وحل النزاعات المتعلقة بالملكية العقارية.",
    },
    rate: "onrequest",
    icon: "HardHat",
  },
  {
    id: "labor-family",
    title: { en: "👥 Labor & Family Law", fr: "👥 Droit du Travail et de la Famille", ar: "👥 قانون العمل والأسرة" },
    blurb: {
      en: "We handle both individual and collective employment relations, as well as family law matters. Our firm emphasizes an approach that is simultaneously empathetic, rigorous, and pragmatic, supporting our clients through what are often defining moments in their personal or professional lives.",
      fr: "Nous gérons les relations individuelles et collectives de travail, ainsi que les questions de droit de la famille. Notre cabinet met l'accent sur une approche à la fois empathique, rigoureuse et pragmatique, accompagnant nos clients à travers ce qui sont souvent des moments déterminants de leur vie personnelle ou professionnelle.",
      ar: "نتعامل مع علاقات العمل الفردية والجماعية، فضلاً عن قضايا قانون الأسرة. يؤكد مكتبنا على نهج متزامن بين التعاطف والصرامة والعملية، مساندين عملاءنا خلال ما هي في كثير من الأحيان لحظات محورية في حياتهم الشخصية أو المهنية.",
    },
    rate: "onrequest",
    icon: "User",
  },
  {
    id: "intellectual-property",
    title: { en: "💡 Intellectual Property", fr: "💡 Propriété Intellectuelle", ar: "💡 الملكية الفكرية" },
    blurb: {
      en: "The firm assists clients in protecting and maximizing the value of their intellectual property rights—particularly regarding trademarks, copyright, designs, and models—as well as in preventing and resolving disputes related to these intangible assets.",
      fr: "Le cabinet assiste les clients dans la protection et la valorisation de leurs droits de propriété intellectuelle—notamment marques, droits d'auteur, dessins et modèles—ainsi que dans la prévention et la résolution des litiges liés à ces actifs immatériels.",
      ar: "يساعد المكتب عملاءهم في حماية وتعظيم قيمة حقوق الملكية الفكرية لديهم — لا سيما العلامات التجارية وحقوق النمط والتصاميم والنماذج — وكذلك في الوقاية وحل النزاعات المتعلقة بهذه الأصول غير المادية.",
    },
    rate: "onrequest",
    icon: "Globe",
  },
];

const TIME_SLOTS: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:30",
  "14:30",
  "15:30",
  "16:30",
  "17:00",
];

// ── Store ──────────────────────────────────────────────────────────────────

const BOOKING_KEY = "hblaw.bookings.v1";
const bookingListeners = new Set<() => void>();

let bookings: Booking[] = loadBookings();

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKING_KEY);
    if (raw) return JSON.parse(raw) as Booking[];
  } catch {}
  return [];
}

function persistBookings() {
  try {
    localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
  } catch {}
}

function emitBookings() {
  bookingListeners.forEach((l) => l());
}

function subscribeBookings(cb: () => void) {
  bookingListeners.add(cb);
  return () => {
    bookingListeners.delete(cb);
  };
}

function getBookingsSnapshot() {
  return bookings;
}

function useBookings() {
  return useSyncExternalStore(subscribeBookings, getBookingsSnapshot, getBookingsSnapshot);
}

function addBooking(b: Booking) {
  bookings = [b, ...bookings];
  persistBookings();
  emitBookings();
}

function cancelBooking(id: string) {
  bookings = bookings.filter((b) => b.id !== id);
  persistBookings();
  emitBookings();
}

// ── UI Components ──────────────────────────────────────────────────────────

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// ── LangSwitcher ───────────────────────────────────────────────────────────

function LangSwitcher() {
  const [lang, setLangFn] = useLang();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-yellow-300" />
      <select
        value={lang}
        onChange={(e) => setLangFn(e.target.value as Lang)}
        className="border-0 bg-transparent text-sm text-yellow-50 focus:outline-none focus:ring-0"
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

// ── BookingForm ────────────────────────────────────────────────────────────

const FORM_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

function BookingForm() {
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
    if (!name || !phone || !service || !date || !slot) {
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
      service: service as ServiceId,
      date,
      slot,
      notes,
      createdAt: Date.now(),
    });

    try {
      await emailjs.send(
        "service_m1sz2lv",
        "template_t3a96hj",
        { name, phone, email, service: svcTitle, date, slot, notes },
        { publicKey: "r9QEFpwAe98oTMnmt" },
      );

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setService("");
      setDate("");
      setSlot("");
      setNotes("");
    } catch {
      setError(t("form.error.email"));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-stone-200 bg-white shadow-lg">
      <CardHeader className="border-b border-stone-200 bg-stone-50/50">
        <CardTitle className="font-serif text-2xl text-slate-900">
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
                <User className="h-3.5 w-3.5 text-slate-600" />
                {t("form.name")} <span className="text-yellow-700">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="border-stone-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-stone-700">
                <Phone className="h-3.5 w-3.5 text-slate-600" />
                {t("form.phone")} <span className="text-yellow-700">*</span>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213..."
                className="border-stone-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-stone-700">
              <Mail className="h-3.5 w-3.5 text-slate-600" />
              {t("form.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-stone-300 focus:border-slate-500 focus:ring-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service" className="flex items-center gap-1.5 text-stone-700">
              <FileText className="h-3.5 w-3.5 text-slate-600" />
              {t("form.service")} <span className="text-yellow-700">*</span>
            </Label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:outline-none"
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
                <CalendarDays className="h-3.5 w-3.5 text-slate-600" />
                {t("form.date")} <span className="text-yellow-700">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-stone-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot" className="flex items-center gap-1.5 text-stone-700">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                {t("form.slot")} <span className="text-yellow-700">*</span>
              </Label>
              <select
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              >
                <option value="">{t("form.select.slot")}</option>
                {FORM_SLOTS.map((s) => (
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
              className="min-h-[100px] border-stone-300 focus:border-slate-500 focus:ring-slate-500"
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
              className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 border border-slate-200"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("form.success")}
            </motion.div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full bg-slate-800 text-yellow-50 shadow hover:bg-slate-700"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? t("form.sending") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Reservations ───────────────────────────────────────────────────────────

function Reservations() {
  const [lang] = useLang();
  const allBookings = useBookings();
  const sorted = [...allBookings].sort(
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
          <CardTitle className="font-serif text-2xl text-slate-900">
            {t("res.title")}
          </CardTitle>
          <Badge className="bg-yellow-100 text-yellow-900 hover:bg-yellow-100">
            {allBookings.length} {t("res.count")}
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
                      <span className="font-serif text-lg text-slate-900">
                        {b.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-700"
                      >
                        {serviceTitle(b.service)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-yellow-700" />
                        {format(parseISO(b.date), "EEEE, MMM d, yyyy")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-yellow-700" />
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

// ── App ────────────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileSignature,
  ScrollText,
  Scale,
  Building2,
  Globe,
  Briefcase,
  Building,
  Gavel,
  HardHat,
  User,
  FileText,
};

const ATTORNEYS: Attorney[] = [
  {
    name: "Hanifi Boubkeur",
    role: "founder",
    desc: {
      en: "Approved by the International Order of Experts. Focuses primarily on public procurement, business law, corporate law, and taxation.",
      fr: "Agréé par l'Ordre International des Experts. Spécialisé principalement en marchés publics, droit des affaires, droit des sociétés et fiscalité.",
      ar: "معتمد من النظام الدولي للخبراء. متخصص بشكل أساسي في المناقصات العامة وقانون الأعمال وقانون الشركات والضرائب.",
    },
  },
  {
    name: "Benaicha Houria",
    role: "partner",
    desc: {
      en: "Specializes in family law, successions/inheritance, and estate law.",
      fr: "Spécialisée en droit de la famille, successions et droit des successions.",
      ar: "متخصصة في قانون الأسرة والوراثة وقانون الإرث.",
    },
  },
  {
    name: "Bensadoun Mohamed",
    role: "attorney",
    desc: {
      en: "Property and real estate law.",
      fr: "Droit de la propriété et droit immobilier.",
      ar: "قانون العقارات والأراضي.",
    },
  },
  {
    name: "Hanifi Zakaria",
    role: "attorney",
    desc: {
      en: "Contract law, liability, criminal law, and business law.",
      fr: "Droit des contrats, responsabilité, droit pénal et droit des affaires.",
      ar: "قانون العقود والمسؤولية والقانون الجنائي وقانون الأعمال.",
    },
  },
  {
    name: "Bouzid Noureddine",
    role: "attorney",
    desc: {
      en: "Labor/social law, cybercriminality, and intellectual property law.",
      fr: "Droit du travail/social, cybercriminalité et droit de la propriété intellectuelle.",
      ar: "قانون العمل الاجتماعي والجرائم الإلكترونية وقانون الملكية الفكرية.",
    },
  },
];

export default function App() {
  const [lang] = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir();
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Top contact bar */}
      <div className="bg-gradient-to-r from-[#0c1929] via-[#132743] to-[#0c1929] text-yellow-50/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-yellow-400" />
              {t("topbar.phone")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-yellow-400" />
              {t("topbar.email")}
            </span>
          </div>
          <LangSwitcher />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-200/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="H&B Law Firm" className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="font-serif text-xl text-slate-900">
                H&amp;B <span className="italic">Law Firm</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Attorneys at Law · Algeria
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <a href="#services" className="transition hover:text-blue-800">
              {t("nav.practice")}
            </a>
            <a href="#team" className="transition hover:text-blue-800">
              {t("nav.team")}
            </a>
            <a href="#book" className="transition hover:text-blue-800">
              {t("nav.consult")}
            </a>
            <a href="#location" className="transition hover:text-blue-800">
              {t("nav.location")}
            </a>
          </nav>
          <Button
            asChild
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 shadow-sm shadow-yellow-500/20 hover:from-yellow-400 hover:to-amber-400 hover:shadow-md hover:shadow-yellow-500/25"
          >
            <a href="#book">{t("cta.book")}</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1929] via-[#132743] to-[#0f1f3a] text-yellow-50">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 15% 15%, rgba(251,191,36,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 70%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(251,191,36,0.03) 0%, transparent 50%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center md:py-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="mb-6 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="H&B Law Firm"
                className="h-44 w-auto md:h-60"
              />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4 font-serif text-xl italic text-yellow-300/80 md:text-2xl"
          >
            {lang === "en" ? "Legal excellence at the service of your ambitions." : lang === "fr" ? "L'excellence juridique au service de vos ambitions." : "التميز القانوني في خدمة طموحاتك."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl text-lg text-blue-100/70 md:text-xl"
          >
            {t("hero.tagline")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 shadow-lg shadow-yellow-500/20 transition-all hover:shadow-xl hover:shadow-yellow-500/30 hover:from-yellow-400 hover:to-amber-400"
            >
              <a href="#book">{t("hero.cta.book")}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-yellow-200/30 bg-white/5 text-yellow-50 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-yellow-200/50 hover:text-yellow-50"
            >
              <a href="#team">{t("hero.cta.team")}</a>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      </section>

      {/* Presentation */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/80">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(/leaves-pattern.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
            >
              <img
                src="/presentation.jpg"
                alt="H&B Law Firm"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge className="mb-3 bg-blue-50 text-blue-800 ring-1 ring-blue-100 hover:bg-blue-50">
                {t("pres.badge")}
              </Badge>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
                <p>{t("pres.p1")}</p>
                <p>{t("pres.p2")}</p>
                <p>{t("pres.p3")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking + Reservations */}
      <section id="book" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(/leaves-pattern.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-2xl"
          >
            <Badge className="mb-3 bg-gradient-to-r from-yellow-100 to-amber-50 text-yellow-800 ring-1 ring-yellow-200/50 hover:bg-yellow-100">
              {t("book.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
              {t("book.title")}
            </h2>
            <p className="mt-3 text-stone-500">
              {t("book.desc")}
            </p>
          </motion.div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <BookingForm />
            <Reservations />
          </div>
        </div>
      </section>

      {/* Practice Areas + Our Team (compact) */}
      <section id="services" className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/80">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(/leaves-pattern.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge className="mb-2 bg-blue-50 text-blue-800 ring-1 ring-blue-100 hover:bg-blue-50">
                {t("services.badge")}
              </Badge>
              <ul className="mt-3 space-y-2">
                {SERVICES.map((s, i) => {
                  const Icon = ICONS[s.icon] ?? ScrollText;
                  return (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm ring-1 ring-slate-50 transition-all hover:shadow-md hover:border-blue-100 hover:ring-blue-50"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-yellow-300 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{s.title[lang]}</p>
                        <p className="text-xs text-stone-500">{s.blurb[lang]}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              id="team"
            >
              <Badge className="mb-2 bg-gradient-to-r from-yellow-100 to-amber-50 text-yellow-800 ring-1 ring-yellow-200/50 hover:bg-yellow-100">
                {t("team.badge")}
              </Badge>
              <div className="mt-3 space-y-2">
                {ATTORNEYS.map((att, i) => (
                  <motion.div
                    key={att.name}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm ring-1 ring-slate-50 transition-all hover:shadow-md hover:border-yellow-200 hover:ring-yellow-50"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-yellow-300 shadow-sm">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{att.name}</p>
                      <p className="text-xs text-yellow-700">{t(`team.${att.role}`)}</p>
                      <p className="text-xs text-stone-500">{att.desc[lang]}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section id="location" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(/leaves-pattern.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-2xl"
          >
            <Badge className="mb-3 bg-blue-50 text-blue-800 ring-1 ring-blue-100 hover:bg-blue-50">
              <MapPin className="mr-1 h-3 w-3" />
              {t("location.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
              {t("location.title")}
            </h2>
            <p className="mt-3 text-stone-500">
              {t("location.desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 ring-1 ring-slate-100"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-gradient-to-br from-[#0c1929] via-[#132743] to-[#0f1f3a] text-yellow-50/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="H&B Law Firm" className="h-10 w-auto" />
              <p className="font-serif text-xl text-yellow-50">
                H&amp;B Law Firm
              </p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-yellow-100/70">
              {t("footer.about")}
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-yellow-300">
              {t("footer.contact")}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-yellow-300" />
                {t("topbar.email")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-yellow-300" />
                {t("topbar.phone")}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-300" />
                {t("footer.fax")}
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-yellow-300">
              {t("footer.languages")}
            </p>
            <ul className="space-y-2 text-sm">
              <li>Français</li>
              <li>العربية</li>
              <li>English</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-yellow-50/10 px-4 py-5 text-center text-xs text-yellow-100/60">
          {t("footer.rights", { year: String(new Date().getFullYear()) })}
        </div>
      </footer>
    </div>
  );
}
