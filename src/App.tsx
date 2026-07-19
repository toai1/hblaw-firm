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
  | "contract-drafting"
  | "contract-management"
  | "dispute-resolution"
  | "infrastructure-projects"
  | "international-arbitration"
  | "corporate-law";

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
  "nav.references": "Track Record",
  "nav.consult": "Consult",
  "nav.location": "Location",
  "cta.book": "Book Now",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.badge": "Est. 1985 · 40+ years of counsel",
  "hero.title": "Expert legal counsel for infrastructure, corporate, and international disputes.",
  "hero.desc": "H&B Law Firm is a Civil Professional Company of Lawyers led by Maître HANIFI Boubkeur, providing rigorous representation in public projects, contract law, and international arbitration.",
  "hero.cta.book": "Reserve a consultation",
  "hero.cta.team": "Meet the team",
  "hero.stat.years": "Years practice",
  "hero.stat.attorneys": "Expert Attorneys",
  "hero.stat.clients": "Major Clients",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Algiers, Algeria",
  "services.badge": "Practice Areas",
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
  "refs.badge": "Track Record",
  "refs.title": "Four Decades of Landmark Projects",
  "refs.desc": "We have guided major national and international public and mixed companies through complex infrastructure and construction mandates.",
  "refs.stat1.value": "40+",
  "refs.stat1.label": "Years of Practice",
  "refs.stat2.value": "11+",
  "refs.stat2.label": "Major Clients Assisted",
  "refs.stat3.value": "3",
  "refs.stat3.label": "International Arbitrations",
  "refs.expertise.title": "Selected Expertise",
  "refs.expertise.1": "Drafting all types of contracts, dispute resolution, and legal support for highway, industrial, and port projects.",
  "refs.expertise.2": "Support in international arbitration, mediation, and judicial expertise procedures.",
  "refs.expertise.3": "Assistance to public and private project owners, engineering firms, and project management teams.",
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
  "footer.fax": "Fax: +213 28 17 09 00",
  "footer.languages": "Languages",
  "footer.rights": "© {year} H&B Law Firm. All rights reserved.",
};

const fr: Dict = {
  "nav.practice": "Pratique",
  "nav.team": "Équipe",
  "nav.references": "Réalisations",
  "nav.consult": "Consultation",
  "nav.location": "Emplacement",
  "cta.book": "Réserver",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.badge": "Depuis 1985 · 40+ ans d'expérience",
  "hero.title": "Conseil juridique expert en infrastructure, droit des sociétés et litiges internationaux.",
  "hero.desc": "Le Cabinet H&B est une Société Civile Professionnelle d'Avocats dirigée par Maître HANIFI Boubkeur, offrant une représentation rigoureuse dans les projets publics, le droit des contrats et l'arbitrage international.",
  "hero.cta.book": "Réserver une consultation",
  "hero.cta.team": "Rencontrer l'équipe",
  "hero.stat.years": "Ans de pratique",
  "hero.stat.attorneys": "Avocats experts",
  "hero.stat.clients": "Grands clients",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Alger, Algérie",
  "services.badge": "Domaines de pratique",
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
  "refs.badge": "Réalisations",
  "refs.title": "Quatre Décennies de Projets Majeurs",
  "refs.desc": "Nous avons accompagné de grandes sociétés publiques et mixtes, nationales et internationales, dans des mandats complexes d'infrastructure et de construction.",
  "refs.stat1.value": "40+",
  "refs.stat1.label": "Ans de Pratique",
  "refs.stat2.value": "11+",
  "refs.stat2.label": "Grands Clients Assistés",
  "refs.stat3.value": "3",
  "refs.stat3.label": "Arbitrages Internationaux",
  "refs.expertise.title": "Expertise Sélectionnée",
  "refs.expertise.1": "Élaboration de tous types de marchés, traitement des litiges, appui juridique en projets autoroutiers, industriels et portuaires.",
  "refs.expertise.2": "Accompagnement en arbitrage international, médiation et procédures d'expertise judiciaire.",
  "refs.expertise.3": "Assistance aux maîtres d'ouvrages publics et privés, bureaux d'études et directions de projets.",
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
  "footer.fax": "Fax : +213 28 17 09 00",
  "footer.languages": "Langues",
  "footer.rights": "© {year} Cabinet H&B. Tous droits réservés.",
};

const ar: Dict = {
  "nav.practice": "الممارسة",
  "nav.team": "الفريق",
  "nav.references": "سجل الإنجازات",
  "nav.consult": "استشارة",
  "nav.location": "الموقع",
  "cta.book": "احجز الآن",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.email": "avocat.hanifi@gmail.com",
  "topbar.languages": "Français · العربية · English",
  "hero.badge": "تأسست 1985 · أكثر من 40 عامًا من الخبرة",
  "hero.title": "استشارات قانونية متخصصة في البنية التحتية والشركات والنزاعات الدولية.",
  "hero.desc": "مكتب H&B هو شركة مدنية مهنية للمحامين يديرها الأستاذ حنيفي بوبكر، يقدم تمثيلاً قانونياً دقيقاً في المشاريع العامة وقانون العقود والتحكيم الدولي.",
  "hero.cta.book": "احجز استشارة",
  "hero.cta.team": "تعرف على الفريق",
  "hero.stat.years": "سنوات الممارسة",
  "hero.stat.attorneys": "محامون خبراء",
  "hero.stat.clients": "عملاء كبار",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "الجزائر العاصمة، الجزائر",
  "services.badge": "مجالات الممارسة",
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
  "refs.badge": "سجل الإنجازات",
  "refs.title": "أربعة عقود من المشاريع البارزة",
  "refs.desc": "لقد قمنا بتوجيه كبرى الشركات العامة والمختلطة الوطنية والدولية خلال تكليفات البنية التحتية والإنشاءات المعقدة.",
  "refs.stat1.value": "+40",
  "refs.stat1.label": "سنوات من الممارسة",
  "refs.stat2.value": "+11",
  "refs.stat2.label": "عملاء كبار تمت مساعدتهم",
  "refs.stat3.value": "3",
  "refs.stat3.label": "تحكيمات دولية",
  "refs.expertise.title": "خبرة مختارة",
  "refs.expertise.1": "صياغة جميع أنواع العقود، وتسوية النزاعات، والدعم القانوني لمشاريع الطرق السريعة والصناعية والموانئ.",
  "refs.expertise.2": "الدعم في التحكيم الدولي، والوساطة، وإجراءات الخبرة القضائية.",
  "refs.expertise.3": "المساعدة لأصحاب المشاريع العامة والخاصة، ومكاتب الهندسة، وفرق إدارة المشاريع.",
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
  "footer.fax": "فاكس: +213 28 17 09 00",
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
    id: "contract-drafting",
    title: { en: "Contract Drafting & Negotiation", fr: "Rédaction et Négociation de Contrats", ar: "صياغة وتفاوض العقود" },
    blurb: {
      en: "Drafting and negotiation of administrative and legal specifications, analysis of bids, and execution of contracts.",
      fr: "Élaboration et négociation de cahiers des charges administratifs et juridiques, analyse des offres et exécution des contrats.",
      ar: "صياغة وتفاوض دفاتر الشروط الإدارية والقانونية، وتحليل العطاءات، وتنفيذ العقود.",
    },
    rate: "onrequest",
    icon: "FileSignature",
  },
  {
    id: "contract-management",
    title: { en: "Contract Management & Claims", fr: "Gestion des Contrats et Réclamations", ar: "إدارة العقود والمطالبات" },
    blurb: {
      en: "Contract management monitoring, contractual administration, handling claims and amendments for major projects.",
      fr: "Suivi de gestion contractuelle, administration contractuelle, traitement des réclamations et avenants pour les grands projets.",
      ar: "متابعة إدارة العقود، والإدارة التعاقدية، والتعامل مع المطالبات والتعديلات للمشاريع الكبرى.",
    },
    rate: "onrequest",
    icon: "ScrollText",
  },
  {
    id: "dispute-resolution",
    title: { en: "Dispute Resolution & Mediation", fr: "Règlement des Litiges et Médiation", ar: "تسوية النزاعات والوساطة" },
    blurb: {
      en: "Amicable dispute resolution, extrajudicial mediation, and legal support for litigation of all types of contracts.",
      fr: "Règlement amiable des litiges, médiation extrajudiciaire et appui juridique pour les litiges de tous types de contrats.",
      ar: "تسوية النزاعات ودياً، والوساطة خارج المحكمة، والدعم القانوني للنزاعات لجميع أنواع العقود.",
    },
    rate: "onrequest",
    icon: "Scale",
  },
  {
    id: "infrastructure-projects",
    title: { en: "Infrastructure & Public Projects", fr: "Infrastructure et Projets Publics", ar: "البنية التحتية والمشاريع العامة" },
    blurb: {
      en: "Expertise in public projects, highways, and infrastructure. Legal support for industrial and port projects.",
      fr: "Expertise dans les projets publics, autoroutiers et d'infrastructure. Appui juridique pour les projets industriels et portuaires.",
      ar: "خبرة في المشاريع العامة والطرق السريعة والبنية التحتية. دعم قانوني للمشاريع الصناعية والموانئ.",
    },
    rate: "onrequest",
    icon: "Building2",
  },
  {
    id: "international-arbitration",
    title: { en: "International Arbitration", fr: "Arbitrage International", ar: "التحكيم الدولي" },
    blurb: {
      en: "Support and accompaniment in international arbitration proceedings for cross-border disputes.",
      fr: "Accompagnement dans les procédures d'arbitrage international pour les litiges transfrontaliers.",
      ar: "دعم ومرافقة في إجراءات التحكيم الدولي للنزاعات العابرة للحدود.",
    },
    rate: "onrequest",
    icon: "Globe",
  },
  {
    id: "corporate-law",
    title: { en: "Corporate & Employment Law", fr: "Droit des Sociétés et du Travail", ar: "قانون الشركات والعمل" },
    blurb: {
      en: "Drafting statutes for Algerian companies, internal regulations, collective agreements, and employment contracts.",
      fr: "Élaboration des statuts des sociétés algériennes, règlements intérieurs, conventions collectives et contrats de travail.",
      ar: "صياغة أنظمة الشركات الجزائرية، واللوائح الداخلية، والاتفاقيات الجماعية، وعقود العمل.",
    },
    rate: "onrequest",
    icon: "Briefcase",
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
              {t("form.email")} <span className="text-yellow-700">*</span>
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
};

const ATTORNEYS: Attorney[] = [
  {
    name: "Maître HANIFI Boubkeur",
    role: "founder",
    desc: {
      en: "Expert in public procurement law, tax procedures, and contract drafting.",
      fr: "Spécialiste en droit des marchés publics, procédures fiscales et rédaction de contrats.",
      ar: "متخصص في قانون المناقصات العامة، والإجراءات الضريبية، وصياغة العقود.",
    },
  },
  {
    name: "Maître BENAICHA Houria",
    role: "partner",
    desc: {
      en: "Specializing in family law and criminal procedure.",
      fr: "Spécialisée en droit de la famille et procédure pénale.",
      ar: "متخصصة في قانون الأسرة والإجراءات الجنائية.",
    },
  },
  {
    name: "Maître BENSADOUN Mohamed",
    role: "attorney",
    desc: {
      en: "Experienced in property law and real estate transactions.",
      fr: "Expérimenté en droit de la propriété et transactions immobilières.",
      ar: "ذو خبرة في قانون العقارات وصفقات العقارات.",
    },
  },
  {
    name: "Maître HANIFI Zakaria",
    role: "attorney",
    desc: {
      en: "Penalist specializing in criminal law, contracts, and liability.",
      fr: "Pénaliste spécialisé en droit pénal, contrats et responsabilité.",
      ar: "متخصص في القانون الجنائي، والعقود، والمسؤولية.",
    },
  },
  {
    name: "Maître BOUZID Noureddine",
    role: "attorney",
    desc: {
      en: "Experienced in civil law and cyber & electronic crimes law.",
      fr: "Expérimenté en droit civil et droit de la cybercriminalité et des crimes électroniques.",
      ar: "ذو خبرة في القانون المدني وقانون الجرائم الإلكترونية وال virtuelle.",
    },
  },
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
      <div className="bg-slate-900 text-yellow-50/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-yellow-300" />
              {t("topbar.phone")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-yellow-300" />
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
            <img src="/logo.png" alt="H&B Law Firm" className="h-11 w-auto" />
            <div className="leading-tight">
              <p className="font-serif text-xl text-slate-900">
                H&amp;B Law Firm
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                Attorneys at Law · Algeria
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
            <a href="#services" className="transition hover:text-slate-800">
              {t("nav.practice")}
            </a>
            <a href="#team" className="transition hover:text-slate-800">
              {t("nav.team")}
            </a>
            <a href="#references" className="transition hover:text-slate-800">
              {t("nav.references")}
            </a>
            <a href="#book" className="transition hover:text-slate-800">
              {t("nav.consult")}
            </a>
            <a href="#location" className="transition hover:text-slate-800">
              {t("nav.location")}
            </a>
          </nav>
          <Button
            asChild
            className="bg-yellow-500 text-slate-900 shadow-sm hover:bg-yellow-400"
          >
            <a href="#book">{t("cta.book")}</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-yellow-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fbbf24 0, transparent 40%), radial-gradient(circle at 80% 60%, #34d399 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div>
            <Badge className="mb-5 border-yellow-300/40 bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/10">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {t("hero.badge")}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-4xl leading-tight text-yellow-50 sm:text-5xl md:text-6xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-xl text-lg text-yellow-100/80"
            >
              {t("hero.desc")}
            </motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 text-slate-900 shadow hover:bg-yellow-400"
              >
                <a href="#book">{t("hero.cta.book")}</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-yellow-200/40 bg-transparent text-yellow-50 hover:bg-yellow-50/10 hover:text-yellow-50"
              >
                <a href="#team">{t("hero.cta.team")}</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-yellow-100/80">
              <div>
                <p className="font-serif text-2xl text-yellow-50">40+</p>
                <p className="uppercase tracking-wide text-xs">{t("hero.stat.years")}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 bg-yellow-200/30 sm:block"
              />
              <div>
                <p className="font-serif text-2xl text-yellow-50">5</p>
                <p className="uppercase tracking-wide text-xs">{t("hero.stat.attorneys")}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 bg-yellow-200/30 sm:block"
              />
              <div>
                <p className="font-serif text-2xl text-yellow-50">11+</p>
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
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-yellow-200/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                alt="Law library"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-stone-200 bg-stone-50 p-4 text-slate-900 shadow-lg sm:block">
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
          <Badge className="mb-3 bg-slate-100 text-slate-800 hover:bg-slate-100">
            {t("services.badge")}
          </Badge>
          <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
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
                <Card className="group h-full border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-100 transition group-hover:bg-slate-800 group-hover:text-yellow-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl text-slate-900">
                      {s.title[lang]}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">{s.blurb[lang]}</p>
                    <Separator className="my-4 bg-stone-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-stone-500">
                        {t("services.rate")}
                      </span>
                      <span className="font-semibold text-yellow-700">
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
            <Badge className="mb-3 bg-yellow-100 text-yellow-900 hover:bg-yellow-100">
              {t("team.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
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
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-yellow-300">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl text-slate-900">
                      {att.name}
                    </h3>
                    <p className="text-sm font-medium text-yellow-700">
                      {t(`team.${att.role}`)}
                    </p>
                    <Separator className="my-3 bg-stone-200" />
                    <p className="text-sm text-stone-600">
                      {att.desc[lang]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* References / Track Record */}
      <section id="references" className="relative overflow-hidden bg-slate-900 text-yellow-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, #fbbf24 0, transparent 30%), radial-gradient(circle at 90% 80%, #34d399 0, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-12 max-w-2xl">
            <Badge className="mb-3 border-yellow-300/40 bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/10">
              {t("refs.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-yellow-50 sm:text-4xl">
              {t("refs.title")}
            </h2>
            <p className="mt-3 text-yellow-100/80">
              {t("refs.desc")}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-14 grid grid-cols-1 gap-6 rounded-2xl border border-yellow-200/20 bg-slate-800/40 p-6 backdrop-blur sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="text-center">
                <p className="font-serif text-4xl text-yellow-300">
                  {t(`refs.stat${n}.value`)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                  {t(`refs.stat${n}.label`)}
                </p>
              </div>
            ))}
          </div>

          {/* Expertise List */}
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-center font-serif text-2xl text-yellow-50">
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
                    className="flex items-start gap-4 rounded-xl border border-yellow-200/10 bg-slate-800/30 p-4"
                  >
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-yellow-100/90">
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
            <Badge className="mb-3 bg-yellow-100 text-yellow-900 hover:bg-yellow-100">
              {t("book.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
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
            <Badge className="mb-3 bg-slate-100 text-slate-800 hover:bg-slate-100">
              <MapPin className="mr-1 h-3 w-3" />
              {t("location.badge")}
            </Badge>
            <h2 className="font-serif text-3xl text-slate-900 sm:text-4xl">
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
      <footer className="border-t border-stone-200 bg-slate-900 text-yellow-50/80">
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
