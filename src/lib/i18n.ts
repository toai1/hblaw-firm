import { useSyncExternalStore } from "react";

export type Lang = "en" | "fr" | "ar";

export const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
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
  "footer.about": "Société Civile Professionnelle d’Avocats. Providing expert legal counsel in Algeria and internationally since 1985.",
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
  "res.title": "Vos Réservations",
  "res.subtitle": "Consultez ou annulez vos rendez-vous à venir.",
  "res.count": "réservées",
  "res.empty.title": "Aucune réservation",
  "res.empty.desc": "Utilisez le formulaire pour réserver votre première consultation.",
  "res.cancel": "Annuler",
  "res.cancelled": "Réservation annulée",
  "res.notes": "Notes :",
  "footer.about": "Société Civile Professionnelle d’Avocats. Offrant un conseil juridique expert en Algérie et à l'international depuis 1985.",
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
const listeners = new Set<() => void>();

function getStored(): Lang {
  try {
    const v = localStorage.getItem(KEY) as Lang | null;
    if (v && DICTS[v]) return v;
  } catch {}
  return "en";
}

let current: Lang = getStored();

function emit() {
  listeners.forEach((l) => l());
}

export function setLang(l: Lang) {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return current;
}

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [lang, setLang];
}

export function t(key: string, vars?: Record<string, string>): string {
  const dict = DICTS[current] || en;
  let str = dict[key] || en[key] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
  }
  return str;
}

export function dir(): "ltr" | "rtl" {
  return current === "ar" ? "rtl" : "ltr";
}