import { useState, useEffect, useSyncExternalStore } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Clock,
  Globe,
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

// â”€â”€ cn utility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  | "intellectual-property"
  | "other";

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

// â”€â”€ i18n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "fr", label: "FranÃ§ais", dir: "ltr" },
  { id: "ar", label: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.practice": "Practice",
  "nav.team": "Team",
  "nav.consult": "Consult",
  "nav.location": "Location",
  "cta.book": "Book Now",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.firm": "Firm: 028 17 09 00",
  "topbar.email": "hb.legalcontact@gmail.com",
  "topbar.languages": "FranÃ§ais Â· Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Â· English",
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
  "pres.title": "MaÃ®tre Hanifi & AssociÃ©s",
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
  "team.cred2": "Member of the World Order of International Experts (OMEI â€“ Geneva)",
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
  "footer.about": "SociÃ©tÃ© Civile Professionnelle d'Avocats. Providing expert legal counsel in Algeria and internationally since 1985.",
  "footer.contact": "Contact",
  "footer.email": "hb.legalcontact@gmail.com",
  "footer.fax": "Fax: 028170900",
  "footer.languages": "Languages",
  "footer.rights": "Â© {year} H&B Law Firm. All rights reserved.",
};

const fr: Dict = {
  "nav.practice": "Pratique",
  "nav.team": "Ã‰quipe",
  "nav.consult": "Consultation",
  "nav.location": "Emplacement",
  "cta.book": "RÃ©server",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.firm": "Firm: 028 17 09 00",
  "topbar.email": "hb.legalcontact@gmail.com",
  "topbar.languages": "FranÃ§ais Â· Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Â· English",
  "hero.tagline": "L'excellence juridique au service de vos ambitions.",
  "hero.subtitle": "L'excellence juridique au service de vos ambitions.",
  "hero.cta.book": "RÃ©server une consultation",
  "hero.cta.team": "Rencontrer l'Ã©quipe",
  "hero.stat.years": "Ans de pratique",
  "hero.stat.attorneys": "Avocats experts",
  "hero.stat.clients": "Grands clients",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Alger, AlgÃ©rie",
  "services.badge": "Domaines de pratique",
  "pres.badge": "Ã€ propos",
  "pres.title": "MaÃ®tre Hanifi & AssociÃ©s",
  "pres.p1": "Le cabinet accompagne les entreprises, les institutions et les particuliers dans la prÃ©vention des risques juridiques, le conseil stratÃ©gique, la nÃ©gociation et la dÃ©fense de leurs intÃ©rÃªts.",
  "pres.p2": "Notre Ã©quipe allie des compÃ©tences complÃ©mentaires pour offrir un accompagnement global dans les principaux domaines du droit. Nous privilÃ©gions une approche fondÃ©e sur l'Ã©coute active, la rigueur juridique, la confidentialitÃ© et la recherche de solutions adaptÃ©es aux objectifs de chaque client.",
  "pres.p3": "Avec plus de quarante ans d'expÃ©rience, le cabinet a dÃ©veloppÃ© une expertise reconnue en droit des affaires, marchÃ©s publics, arbitrage, fiscalitÃ© et contentieux, tout en Ã©largissant ses compÃ©tences pour rÃ©pondre aux dÃ©fis Ã©mergents du droit du numÃ©rique et de l'intelligence artificielle.",
  "pres.p4": "Notre mission est de transformer la complexitÃ© juridique en solutions claires et stratÃ©giques adaptÃ©es aux besoins de nos clients.",
  "services.title": "Domaines de CompÃ©tence",
  "services.desc": "De la nÃ©gociation de contrats Ã  l'arbitrage international, nous offrons un soutien juridique complet pour vos projets les plus complexes.",
  "services.rate": "Consultation initiale",
  "services.onrequest": "Sur demande",
  "team.badge": "Notre Ã‰quipe",
  "team.title": "Rencontrez les Avocats",
  "team.desc": "Une Ã©quipe dÃ©vouÃ©e de professionnels du droit accrÃ©ditÃ©s par les plus hautes juridictions.",
  "team.founder": "AssociÃ© Fondateur",
  "team.partner": "AssociÃ©e",
  "team.attorney": "Avocat",
  "team.cred1": "Avocat Ã  la Cour, agrÃ©Ã© prÃ¨s du Tribunal SuprÃªme et du Conseil d'Ã‰tat",
  "team.cred2": "Membre de l'Ordre Mondial des Experts Internationaux (OMEI â€“ GenÃ¨ve)",
  "book.badge": "Consultation",
  "book.title": "RÃ©servez votre rendez-vous",
  "book.desc": "Choisissez un domaine de pratique, sÃ©lectionnez une heure qui vous convient, et votre client de messagerie s'ouvrira pour envoyer la demande Ã  nos avocats.",
  "form.title": "RÃ©server une Consultation",
  "form.subtitle": "Prenez un rendez-vous privÃ© avec notre Ã©quipe. Les champs marquÃ©s * sont obligatoires.",
  "form.name": "Nom complet",
  "form.phone": "TÃ©lÃ©phone",
  "form.email": "E-mail",
  "form.service": "Domaine de pratique",
  "form.date": "Date prÃ©fÃ©rÃ©e",
  "form.slot": "CrÃ©neau horaire",
  "form.notes": "Notes sur le dossier (optionnel)",
  "form.notes.ph": "DÃ©crivez briÃ¨vement votre situation. Tout ce que vous partagez est confidentiel.",
  "form.disclaimer": "En soumettant, votre client de messagerie s'ouvrira pour envoyer la demande Ã  nos avocats.",
  "form.submit": "Confirmer la rÃ©servation",
  "form.sending": "Traitement...",
  "form.select.service": "SÃ©lectionner un domaine",
  "form.select.slot": "Choisir une heure",
  "form.success": "Consultation rÃ©servÃ©e. Votre client de messagerie va s'ouvrir pour confirmer.",
  "form.error": "Veuillez remplir tous les champs obligatoires.",
  "form.error.email": "RÃ©servation enregistrÃ©e, mais l'e-mail n'a pas pu Ãªtre envoyÃ©. Notre Ã©quipe vous contactera.",
  "res.title": "Vos RÃ©servations",
  "res.subtitle": "Consultez ou annulez vos rendez-vous Ã  venir.",
  "res.count": "rÃ©servÃ©es",
  "res.empty.title": "Aucune rÃ©servation",
  "res.empty.desc": "Utilisez le formulaire pour rÃ©server votre premiÃ¨re consultation.",
  "res.cancel": "Annuler",
  "res.cancelled": "RÃ©servation annulÃ©e",
  "res.notes": "Notes :",
  "footer.about": "SociÃ©tÃ© Civile Professionnelle d'Avocats. Offrant un conseil juridique expert en AlgÃ©rie et Ã  l'international depuis 1985.",
  "location.badge": "Notre Emplacement",
  "location.title": "Visitez Notre Bureau",
  "location.desc": "SituÃ© Ã  Alger, AlgÃ©rie. Nous accueillons les clients pour des consultations en personne.",
  "footer.contact": "Contact",
  "footer.email": "hb.legalcontact@gmail.com",
  "footer.fax": "Fax : 028170900",
  "footer.languages": "Langues",
  "footer.rights": "Â© {year} Cabinet H&B. Tous droits rÃ©servÃ©s.",
};

const ar: Dict = {
  "nav.practice": "Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©",
  "nav.team": "Ø§Ù„ÙØ±ÙŠÙ‚",
  "nav.consult": "Ø§Ø³ØªØ´Ø§Ø±Ø©",
  "nav.location": "Ø§Ù„Ù…ÙˆÙ‚Ø¹",
  "cta.book": "Ø§Ø­Ø¬Ø² Ø§Ù„Ø¢Ù†",
  "topbar.phone": "+213 661 53 18 65",
  "topbar.firm": "Firm: 028 17 09 00",
  "topbar.email": "hb.legalcontact@gmail.com",
  "topbar.languages": "FranÃ§ais Â· Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Â· English",
  "hero.tagline": "Ø§Ù„ØªÙ…ÙŠØ² Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ ÙÙŠ Ø®Ø¯Ù…Ø© Ø·Ù…ÙˆØ­Ø§ØªÙƒ.",
  "hero.subtitle": "Ø§Ù„ØªÙ…ÙŠØ² Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ ÙÙŠ Ø®Ø¯Ù…Ø© Ø·Ù…ÙˆØ­Ø§ØªÙƒ.",
  "hero.cta.book": "Ø§Ø­Ø¬Ø² Ø§Ø³ØªØ´Ø§Ø±Ø©",
  "hero.cta.team": "ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„ÙØ±ÙŠÙ‚",
  "hero.stat.years": "Ø³Ù†ÙˆØ§Øª Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©",
  "hero.stat.attorneys": "Ù…Ø­Ø§Ù…ÙˆÙ† Ø®Ø¨Ø±Ø§Ø¡",
  "hero.stat.clients": "Ø¹Ù…Ù„Ø§Ø¡ ÙƒØ¨Ø§Ø±",
  "hero.card.title": "S.C.P.A",
  "hero.card.loc": "Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©ØŒ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±",
  "services.badge": "Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©",
  "pres.badge": "Ù…Ù† Ù†Ø­Ù†",
  "pres.title": "Ù…ÙƒØªØ¨ Ø§Ù„Ø£Ø³ØªØ§Ø° Ø­Ù†ÙŠÙÙŠ ÙˆØ´Ø±ÙƒØ§Ù‡",
  "pres.p1": "ÙŠØ±Ø§ÙÙ‚ Ø§Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù…Ø¤Ø³Ø³Ø§Øª ÙˆØ§Ù„Ø£ÙØ±Ø§Ø¯ ÙÙŠ Ø§Ù„ÙˆÙ‚Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ù…Ø®Ø§Ø·Ø± Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ© ÙˆØ§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© ÙˆØ§Ù„ØªÙØ§ÙˆØ¶ ÙˆØ§Ù„Ø¯ÙØ§Ø¹ Ø¹Ù† Ù…ØµØ§Ù„Ø­Ù‡Ù….",
  "pres.p2": "ÙŠØ¬Ù…Ø¹ ÙØ±ÙŠÙ‚Ù†Ø§ Ø¨ÙŠÙ† Ù…Ù‡Ø§Ø±Ø§Øª Ù…ÙƒÙ…Ù„Ø© Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¯Ø¹Ù… Ø´Ø§Ù…Ù„ Ø¹Ø¨Ø± Ø§Ù„Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ù„Ù„Ù‚Ø§Ù†ÙˆÙ†. Ù†Ø­Ù† Ù†Ø¹Ø·ÙŠ Ø§Ù„Ø£ÙˆÙ„ÙˆÙŠØ© Ù„Ù†Ù‡Ø¬ ÙŠØ±ØªÙƒØ² Ø¹Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹ Ø§Ù„ÙØ¹Ø§Ù„ ÙˆØ§Ù„Ø¯Ù‚Ø© Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ© ÙˆØ§Ù„Ø³Ø±ÙŠØ© ÙˆØ§Ù„Ø³Ø¹ÙŠ Ù†Ø­Ùˆ Ø­Ù„ÙˆÙ„ Ù…ØµÙ…Ù…Ø© ÙˆÙÙ‚ Ø£Ù‡Ø¯Ø§Ù ÙƒÙ„ Ø¹Ù…ÙŠÙ„.",
  "pres.p3": "Ø¨Ø®Ø¨Ø±Ø© ØªÙ…ØªØ¯ Ù„Ø£ÙƒØ«Ø± Ù…Ù† Ø£Ø±Ø¨Ø¹ÙŠÙ† Ø¹Ø§Ù…Ù‹Ø§ØŒ Ø·ÙˆÙ‘Ø± Ø§Ù„Ù…ÙƒØªØ¨ Ø®Ø¨Ø±Ø© Ù…Ø¹ØªØ±Ù Ø¨Ù‡Ø§ ÙÙŠ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ ÙˆØ§Ù„Ù…Ù†Ø§Ù‚ØµØ§Øª Ø§Ù„Ø¹Ø§Ù…Ø© ÙˆØ§Ù„ØªØ­ÙƒÙŠÙ… ÙˆØ§Ù„Ø¶Ø±Ø§Ø¦Ø¨ ÙˆØ§Ù„DUCTIEUXØŒ ÙˆÙˆØ³Ø¹ Ù‚Ø¯Ø±Ø§ØªÙ‡ Ù„meet ØªØ­Ø¯ÙŠØ§Øª Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø§Ù„Ø±Ù‚Ù…ÙŠ ÙˆØ§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„Ù†Ø§Ø´Ø¦Ø©.",
  "pres.p4": "Ù…Ù‡Ù…ØªÙ†Ø§ Ù‡ÙŠ ØªØ­ÙˆÙŠÙ„ Ø§Ù„ØªØ¹Ù‚ÙŠØ¯ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø¥Ù„Ù‰ Ø­Ù„ÙˆÙ„ ÙˆØ§Ø¶Ø­Ø© ÙˆØ§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ù…ØµÙ…Ù…Ø© ÙˆÙÙ‚ Ø§Ø­ØªÙŠØ§Ø¬Ø§Øª Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§.",
  "services.title": "Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„Ø®Ø¨Ø±Ø©",
  "services.desc": "Ù…Ù† Ø§Ù„ØªÙØ§ÙˆØ¶ Ø¹Ù„Ù‰ Ø§Ù„Ø¹Ù‚ÙˆØ¯ Ø¥Ù„Ù‰ Ø§Ù„ØªØ­ÙƒÙŠÙ… Ø§Ù„Ø¯ÙˆÙ„ÙŠØŒ Ù†Ù‚Ø¯Ù… Ø¯Ø¹Ù…Ø§Ù‹ Ù‚Ø§Ù†ÙˆÙ†ÙŠØ§Ù‹ Ø´Ø§Ù…Ù„Ø§Ù‹ Ù„Ù…Ø´Ø§Ø±ÙŠØ¹Ùƒ Ø§Ù„Ø£ÙƒØ«Ø± ØªØ¹Ù‚ÙŠØ¯Ø§Ù‹.",
  "services.rate": "Ø§Ø³ØªØ´Ø§Ø±Ø© Ø£ÙˆÙ„ÙŠØ©",
  "services.onrequest": "Ø¹Ù†Ø¯ Ø§Ù„Ø·Ù„Ø¨",
  "team.badge": "ÙØ±ÙŠÙ‚Ù†Ø§",
  "team.title": "ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø­Ø§Ù…ÙŠÙ†",
  "team.desc": "ÙØ±ÙŠÙ‚ Ù…ÙƒØ±Ø³ Ù…Ù† Ø§Ù„Ù…Ù‡Ù†ÙŠÙŠÙ† Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠÙŠÙ† Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙŠÙ† Ù…Ù† Ø£Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø­Ø§ÙƒÙ….",
  "team.founder": "Ø§Ù„Ø´Ø±ÙŠÙƒ Ø§Ù„Ù…Ø¤Ø³Ø³",
  "team.partner": "Ø´Ø±ÙŠÙƒ",
  "team.attorney": "Ù…Ø­Ø§Ù…Ù",
  "team.cred1": "Ù…Ø­Ø§Ù…Ù ÙÙŠ Ø§Ù„Ù…Ø­ÙƒÙ…Ø©ØŒ Ù…Ø¹ØªÙ…Ø¯ Ù„Ø¯Ù‰ Ø§Ù„Ù…Ø­ÙƒÙ…Ø© Ø§Ù„Ø¹Ù„ÙŠØ§ ÙˆÙ…Ø¬Ù„Ø³ Ø§Ù„Ø¯ÙˆÙ„Ø©",
  "team.cred2": "Ø¹Ø¶Ùˆ ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù… Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠ Ù„Ù„Ø®Ø¨Ø±Ø§Ø¡ Ø§Ù„Ø¯ÙˆÙ„ÙŠÙŠÙ† (OMEI â€“ Ø¬Ù†ÙŠÙ)",
  "book.badge": "Ø§Ø³ØªØ´Ø§Ø±Ø©",
  "book.title": "Ø§Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯Ùƒ",
  "book.desc": "Ø§Ø®ØªØ± Ù…Ø¬Ø§Ù„ Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©ØŒ ÙˆØ§Ø®ØªØ± Ø§Ù„ÙˆÙ‚Øª Ø§Ù„Ø°ÙŠ ÙŠÙ†Ø§Ø³Ø¨ÙƒØŒ ÙˆØ³ÙŠØªÙ… ÙØªØ­ Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¥Ù„Ù‰ Ù…Ø­Ø§Ù…ÙŠÙ†Ø§.",
  "form.title": "Ø§Ø­Ø¬Ø² Ø§Ø³ØªØ´Ø§Ø±Ø©",
  "form.subtitle": "Ø§Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯Ø§Ù‹ Ø®Ø§ØµØ§Ù‹ Ù…Ø¹ ÙØ±ÙŠÙ‚Ù†Ø§. Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ù…ÙŠØ²Ø© Ø¨Ù€ * Ù…Ø·Ù„ÙˆØ¨Ø©.",
  "form.name": "Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„",
  "form.phone": "Ø§Ù„Ù‡Ø§ØªÙ",
  "form.email": "Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
  "form.service": "Ù…Ø¬Ø§Ù„ Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©",
  "form.date": "Ø§Ù„ØªØ§Ø±ÙŠØ® Ø§Ù„Ù…ÙØ¶Ù„",
  "form.slot": "Ø§Ù„ÙØªØ­Ø© Ø§Ù„Ø²Ù…Ù†ÙŠØ©",
  "form.notes": "Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ù‚Ø¶ÙŠØ© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)",
  "form.notes.ph": "ØµÙ Ø­Ø§Ù„ØªÙƒ Ø¨Ø¥ÙŠØ¬Ø§Ø². ÙƒÙ„ Ù…Ø§ ØªØ´Ø§Ø±ÙƒÙ‡ Ù…Ø­Ù…ÙŠ Ø¨Ø³Ø±ÙŠØ© ØªØ§Ù…Ø©.",
  "form.disclaimer": "Ø¨Ø§Ù„Ø¥Ø±Ø³Ø§Ù„ØŒ Ø³ÙŠØªÙ… ÙØªØ­ Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¥Ù„Ù‰ Ù…Ø­Ø§Ù…ÙŠÙ†Ø§.",
  "form.submit": "ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø²",
  "form.sending": "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©...",
  "form.select.service": "Ø§Ø®ØªØ± Ù…Ø¬Ø§Ù„ Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©",
  "form.select.slot": "Ø§Ø®ØªØ± ÙˆÙ‚ØªÙ‹Ø§",
  "form.success": "ØªÙ… Ø­Ø¬Ø² Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©. Ø³ÙŠØªÙ… ÙØªØ­ Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ù„ØªØ£ÙƒÙŠØ¯.",
  "form.error": "ÙŠØ±Ø¬Ù‰ Ø¥ÙƒÙ…Ø§Ù„ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©.",
  "form.error.email": "ØªÙ… Ø­Ø¬Ø² Ø§Ù„Ù…ÙˆØ¹Ø¯ØŒ Ù„ÙƒÙ† Ù„Ù… ÙŠØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ. Ø³ÙŠØªÙˆØ§ØµÙ„ ÙØ±ÙŠÙ‚Ù†Ø§ Ù…Ø¹Ùƒ.",
  "res.title": "Ø­Ø¬ÙˆØ²Ø§ØªÙƒ",
  "res.subtitle": "Ø±Ø§Ø¬Ø¹ Ø£Ùˆ Ø£Ù„ØºÙ Ù…ÙˆØ§Ø¹ÙŠØ¯Ùƒ Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©.",
  "res.count": "Ù…Ø­Ø¬ÙˆØ²",
  "res.empty.title": "Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­Ø¬ÙˆØ²Ø§Øª Ø¨Ø¹Ø¯",
  "res.empty.desc": "Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ Ù„Ø­Ø¬Ø² Ø§Ø³ØªØ´Ø§Ø±ØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰.",
  "res.cancel": "Ø¥Ù„ØºØ§Ø¡",
  "res.cancelled": "ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø­Ø¬Ø²",
  "res.notes": "Ù…Ù„Ø§Ø­Ø¸Ø§Øª:",
  "location.badge": "Ù…ÙˆÙ‚Ø¹Ù†Ø§",
  "location.title": "Ø²ÙˆØ± Ù…ÙƒØªØ¨Ù†Ø§",
  "location.desc": "ÙŠÙ‚Ø¹ Ù…ÙƒØªØ¨Ù†Ø§ ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©ØŒ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±. Ù†Ø±Ø­Ø¨ Ø¨Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ù„Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ©.",
  "footer.about": "Ø´Ø±ÙƒØ© Ù…Ø¯Ù†ÙŠØ© Ù…Ù‡Ù†ÙŠØ© Ù„Ù„Ù…Ø­Ø§Ù…ÙŠÙ†. Ù†Ù‚Ø¯Ù… Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ù‚Ø§Ù†ÙˆÙ†ÙŠØ© Ù…ØªØ®ØµØµØ© ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± ÙˆØ¯ÙˆÙ„ÙŠØ§Ù‹ Ù…Ù†Ø° 1985.",
  "footer.contact": "Ø§ØªØµÙ„ Ø¨Ù†Ø§",
  "footer.email": "hb.legalcontact@gmail.com",
  "footer.fax": "ÙØ§ÙƒØ³: 028170900",
  "footer.languages": "Ø§Ù„Ù„ØºØ§Øª",
  "footer.rights": "Â© {year} Ù…ÙƒØªØ¨ H&B. Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©.",
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

// â”€â”€ Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SERVICES: Service[] = [
  {
    id: "public-procurement",
    title: { en: "ðŸ›ï¸ Public Procurement", fr: "ðŸ›ï¸ MarchÃ©s Publics", ar: "ðŸ›ï¸ Ø§Ù„Ù…Ù†Ø§Ù‚ØµØ§Øª Ø§Ù„Ø¹Ø§Ù…Ø©" },
    blurb: {
      en: "Public procurement is one of the firm's core areas of excellence. With several decades of experience, we support businesses, public entities, and investors through every stage of their operations, from the preparation of bids to the resolution of disputes.",
      fr: "Les marchÃ©s publics constituent l'un des domaines d'excellence du cabinet. Avec plusieurs dÃ©cennies d'expÃ©rience, nous accompagnons les entreprises, les entitÃ©s publiques et les investisseurs Ã  chaque Ã©tape de leurs opÃ©rations, de la prÃ©paration des offres Ã  la rÃ©solution des litiges.",
      ar: "Ø§Ù„Ù…Ù†Ø§Ù‚ØµØ§Øª Ø§Ù„Ø¹Ø§Ù…Ø© Ù‡ÙŠ Ø¥Ø­Ø¯Ù‰ Ù…Ø¬Ø§Ù„Ø§Øª Ø§Ù„ØªÙ…ÙŠØ² Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ù„Ù„Ù…ÙƒØªØ¨. Ù…Ø¹ Ø¹Ù‚ÙˆØ¯ Ù…Ù† Ø§Ù„Ø®Ø¨Ø±Ø©ØŒ Ù†Ø±Ø§ÙÙ‚ Ø§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„ÙƒÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø© ÙˆØ§Ù„Ù…Ø³ØªØ«Ù…Ø±ÙŠÙ† ÙÙŠ ÙƒÙ„ Ù…Ø±Ø­Ù„Ø© Ù…Ù† Ù…Ø±Ø§Ø­Ù„ Ø¹Ù…Ù„ÙŠØ§ØªÙ‡Ù…ØŒ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø¥Ù„Ù‰ Ø­Ù„ Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª.",
    },
    rate: "onrequest",
    icon: "Building2",
  },
  {
    id: "business-law",
    title: { en: "ðŸ’¼ Business Law", fr: "ðŸ’¼ Droit des Affaires", ar: "ðŸ’¼ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø¹Ù…Ø§Ù„" },
    blurb: {
      en: "The firm supports businesses, executives, and investors in their day-to-day operations as well as their growth strategies. Our approach aims to secure economic transactions, mitigate legal risks, and deliver solutions tailored to each client's specific commercial challenges.",
      fr: "Le cabinet accompagne les entreprises, les dirigeants et les investisseurs dans leurs activitÃ©s quotidiennes ainsi que dans leurs stratÃ©gies de croissance. Notre approche vise Ã  sÃ©curiser les transactions Ã©conomiques, attÃ©nuer les risques juridiques et offrir des solutions adaptÃ©es aux dÃ©fis commerciaux spÃ©cifiques de chaque client.",
      ar: "ÙŠØ±Ø§ÙÙ‚ Ø§Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù…Ø¯ÙŠØ±ÙŠÙ† ÙˆØ§Ù„Ù…Ø³ØªØ«Ù…Ø±ÙŠÙ† ÙÙŠ Ø£Ù†Ø´Ø·ØªÙ‡Ù… Ø§Ù„ÙŠÙˆÙ…ÙŠØ© ÙˆÙƒØ°Ù„Ùƒ ÙÙŠ Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ§Øª Ù†Ù…ÙˆÙ‡Ù…. ÙŠÙ‡Ø¯Ù Ù†Ù‡Ø¬Ù†Ø§ Ø¥Ù„Ù‰ ØªØ£Ù…ÙŠÙ† Ø§Ù„Ù…Ø¹Ø§Ù…Ù„Ø§Øª Ø§Ù„Ø§Ù‚ØªØµØ§Ø¯ÙŠØ©ØŒ ÙˆØ§Ù„ØªØ®ÙÙŠÙ Ù…Ù† Ø§Ù„Ù…Ø®Ø§Ø·Ø± Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©ØŒ ÙˆØªÙ‚Ø¯ÙŠÙ… Ø­Ù„ÙˆÙ„ Ù…ØµÙ…Ù…Ø© ÙˆÙÙ‚ Ø§Ù„ØªØ­Ø¯ÙŠØ§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© Ø§Ù„Ø®Ø§ØµØ© Ù„ÙƒÙ„ Ø¹Ù…ÙŠÙ„.",
    },
    rate: "onrequest",
    icon: "Briefcase",
  },
  {
    id: "corporate-law",
    title: { en: "ðŸ¢ Corporate Law", fr: "ðŸ¢ Droit des SociÃ©tÃ©s", ar: "ðŸ¢ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø´Ø±ÙƒØ§Øª" },
    blurb: {
      en: "We assist companies at every stage of their development, from creation to restructuring, ensuring the legal compliance of their corporate structure and protecting the interests of shareholders and executives.",
      fr: "Nous assistons les entreprises Ã  chaque Ã©tape de leur dÃ©veloppement, de la crÃ©ation Ã  la restructuration, en assurant la conformitÃ© juridique de leur structure et en protÃ©geant les intÃ©rÃªts des actionnaires et des dirigeants.",
      ar: "Ù†Ø³Ø§Ø¹Ø¯ Ø§Ù„Ø´Ø±ÙƒØ§Øª ÙÙŠ ÙƒÙ„ Ù…Ø±Ø­Ù„Ø© Ù…Ù† Ù…Ø±Ø§Ø­Ù„ ØªØ·ÙˆØ±Ù‡Ø§ØŒ Ù…Ù† Ø§Ù„ØªØ£Ø³ÙŠØ³ Ø¥Ù„Ù‰ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù‡ÙŠÙƒÙ„Ø©ØŒ Ù…Ø¹ Ø¶Ù…Ø§Ù† Ø§Ù„Ø§Ù…ØªØ«Ø§Ù„ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ù„Ù‡ÙŠÙƒÙ„Ù‡Ø§ corporate ÙˆØ­Ù…Ø§ÙŠØ© Ù…ØµØ§Ù„Ø­ Ø§Ù„Ù…Ø³Ø§Ù‡Ù…ÙŠÙ† ÙˆØ§Ù„Ù…Ø¯ÙŠØ±ÙŠÙ†.",
    },
    rate: "onrequest",
    icon: "Building",
  },
  {
    id: "arbitration-mediation",
    title: { en: "ðŸ¤ Arbitration & Mediation", fr: "ðŸ¤ Arbitrage & MÃ©diation", ar: "ðŸ¤ Ø§Ù„ØªØ­ÙƒÙŠÙ… ÙˆØ§Ù„ÙˆØ³Ø§Ø·Ø©" },
    blurb: {
      en: "The firm prioritizes dispute resolution methods that are efficient, confidential, and tailored to the stakes of each case. We guide our clients through arbitration and mediation procedures to facilitate swift and sustainable solutions.",
      fr: "Le cabinet privilÃ©gie des mÃ©thodes de rÃ©solution des litiges efficaces, confidentielles et adaptÃ©es aux enjeux de chaque affaire. Nous guidons nos clients Ã  travers les procÃ©dures d'arbitrage et de mÃ©diation pour faciliter des solutions rapides et durables.",
      ar: "ÙŠØ­Ø±Øµ Ø§Ù„Ù…ÙƒØªØ¨ Ø¹Ù„Ù‰ Ø·Ø±Ù‚ ØªØ³ÙˆÙŠØ© Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª Ø§Ù„ÙØ¹Ø§Ù„Ø© ÙˆØ§Ù„Ø³Ø±ÙŠØ© ÙˆØ§Ù„Ù…ØµÙ…Ù…Ø© ÙˆÙÙ‚ Ø£Ù‡Ù…ÙŠØ© ÙƒÙ„ Ù‚Ø¶ÙŠØ©. Ù†Ø±Ø§ÙÙ‚ Ø¹Ù…Ù„Ø§Ø¡Ù†Ø§ ÙÙŠ Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„ØªØ­ÙƒÙŠÙ… ÙˆØ§Ù„ÙˆØ³Ø§Ø·Ø© Ù„ØªØ³Ù‡ÙŠÙ„ Ø­Ù„ÙˆÙ„ Ø³Ø±ÙŠØ¹Ø© ÙˆÙ…Ø³ØªØ¯Ø§Ù…Ø©.",
    },
    rate: "onrequest",
    icon: "Scale",
  },
  {
    id: "tax-law",
    title: { en: "ðŸ“Š Tax Law", fr: "ðŸ“Š Droit Fiscal", ar: "ðŸ“Š Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¶Ø±ÙŠØ¨ÙŠ" },
    blurb: {
      en: "Taxation is a strategic priority for businesses and individuals alike. Our firm provides rigorous support in advisory services, compliance, and tax litigation management, with the ultimate goal of securing our clients' decisions and effectively defending their interests before the relevant tax authorities.",
      fr: "La fiscalitÃ© est une prioritÃ© stratÃ©gique pour les entreprises et les particuliers. Notre cabinet offre un accompagnement rigoureux en conseil, conformitÃ© et gestion du contentieux fiscal, avec l'objectif final de sÃ©curiser les dÃ©cisions de nos clients et dÃ©fendre efficacement leurs intÃ©rÃªts devant les autoritÃ©s fiscales compÃ©tentes.",
      ar: "Ø§Ù„Ø¶Ø±Ø§Ø¦Ø¨ Ù‡ÙŠ Ø£ÙˆÙ„ÙˆÙŠØ© Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ù„Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ø£ÙØ±Ø§Ø¯ Ø¹Ù„Ù‰ Ø­Ø¯ Ø³ÙˆØ§Ø¡. ÙŠÙˆÙØ± Ù…ÙƒØªØ¨Ù†Ø§ Ø¯Ø¹Ù…Ù‹Ø§ ØµØ§Ø±Ù…Ù‹Ø§ ÙÙŠ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø§Ù…ØªØ«Ø§Ù„ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª Ø§Ù„Ø¶Ø±ÙŠØ¨ÙŠØ©ØŒ Ø¨Ù‡Ø¯Ù ØªØ£Ù…ÙŠÙ† Ù‚Ø±Ø§Ø±Ø§Øª Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ ÙˆØ§Ù„Ø¯ÙØ§Ø¹ Ø¨ÙØ¹Ø§Ù„ÙŠØ© Ø¹Ù† Ù…ØµØ§Ù„Ø­Ù‡Ù… Ø£Ù…Ø§Ù… Ø§Ù„Ø¬Ù‡Ø§Øª Ø§Ù„Ø¶Ø±ÙŠØ¨ÙŠØ© Ø§Ù„Ù…Ø®ØªØµØ©.",
    },
    rate: "onrequest",
    icon: "FileText",
  },
  {
    id: "criminal-law",
    title: { en: "âš–ï¸ Criminal Law", fr: "âš–ï¸ Droit PÃ©nal", ar: "âš–ï¸ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¬Ù†Ø§Ø¦ÙŠ" },
    blurb: {
      en: "We provide defense and legal assistance to our clients at every stage of criminal proceedings, with particular emphasis on upholding their rights, maintaining confidentiality, and implementing a defense strategy tailored to each situation.",
      fr: "Nous assurons la dÃ©fense et l'assistance juridique de nos clients Ã  chaque Ã©tape de la procÃ©dure pÃ©nale, en insistant particuliÃ¨rement sur le respect de leurs droits, le maintien de la confidentialitÃ© et la mise en Å“uvre d'une stratÃ©gie de dÃ©fense adaptÃ©e Ã  chaque situation.",
      ar: "Ù†Ù‚Ø¯Ù… Ø§Ù„Ø¯ÙØ§Ø¹ ÙˆØ§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ© Ù„Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ ÙÙŠ ÙƒÙ„ Ù…Ø±Ø­Ù„Ø© Ù…Ù† Ù…Ø±Ø§Ø­Ù„ Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„Ø¬Ù†Ø§Ø¦ÙŠØ©ØŒ Ù…Ø¹ Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø¹Ù„Ù‰ Ø­ÙØ¸ Ø­Ù‚ÙˆÙ‚Ù‡Ù… ÙˆØ§Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø±ÙŠØ© ÙˆØªØ·Ø¨ÙŠÙ‚ Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ø¯ÙØ§Ø¹ Ù…ØµÙ…Ù…Ø© Ù„ÙƒÙ„ Ù…ÙˆÙ‚Ù.",
    },
    rate: "onrequest",
    icon: "Gavel",
  },
  {
    id: "land-real-estate",
    title: { en: "ðŸ  Land & Real Estate Law", fr: "ðŸ  Droit Foncier et Immobilier", ar: "ðŸ  Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø£Ø±Ø§Ø¶ÙŠ" },
    blurb: {
      en: "The firm supports individuals, companies, and investors in their real estate transactions and property matters. We leverage our expertise to secure projects and resolve disputes related to property ownership and real estate.",
      fr: "Le cabinet accompagne les particuliers, les entreprises et les investisseurs dans leurs transactions immobiliÃ¨res et leurs questions fonciÃ¨res. Nous exploitons notre expertise pour sÃ©curiser les projets et rÃ©soudre les litiges liÃ©s Ã  la propriÃ©tÃ© immobiliÃ¨re.",
      ar: "ÙŠØ±Ø§ÙÙ‚ Ø§Ù„Ù…ÙƒØªØ¨ Ø§Ù„Ø£ÙØ±Ø§Ø¯ ÙˆØ§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù…Ø³ØªØ«Ù…Ø±ÙŠÙ† ÙÙŠ ØµÙÙ‚Ø§ØªÙ‡Ù… Ø§Ù„Ø¹Ù‚Ø§Ø±ÙŠØ© ÙˆØ´Ø¤ÙˆÙ† Ù…Ù„ÙƒÙŠØªÙ‡Ù…. Ù†Ø³ØªÙÙŠØ¯ Ù…Ù† Ø®Ø¨Ø±ØªÙ†Ø§ Ù„ØªØ£Ù…ÙŠÙ† Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ ÙˆØ­Ù„ Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª Ø§Ù„Ù…ØªØ¹Ù„Ù‚Ø© Ø¨Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ø§Ù„Ø¹Ù‚Ø§Ø±ÙŠØ©.",
    },
    rate: "onrequest",
    icon: "HardHat",
  },
  {
    id: "labor-family",
    title: { en: "ðŸ‘¥ Labor & Family Law", fr: "ðŸ‘¥ Droit du Travail et de la Famille", ar: "ðŸ‘¥ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¹Ù…Ù„ ÙˆØ§Ù„Ø£Ø³Ø±Ø©" },
    blurb: {
      en: "We handle both individual and collective employment relations, as well as family law matters. Our firm emphasizes an approach that is simultaneously empathetic, rigorous, and pragmatic, supporting our clients through what are often defining moments in their personal or professional lives.",
      fr: "Nous gÃ©rons les relations individuelles et collectives de travail, ainsi que les questions de droit de la famille. Notre cabinet met l'accent sur une approche Ã  la fois empathique, rigoureuse et pragmatique, accompagnant nos clients Ã  travers ce qui sont souvent des moments dÃ©terminants de leur vie personnelle ou professionnelle.",
      ar: "Ù†ØªØ¹Ø§Ù…Ù„ Ù…Ø¹ Ø¹Ù„Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„ÙØ±Ø¯ÙŠØ© ÙˆØ§Ù„Ø¬Ù…Ø§Ø¹ÙŠØ©ØŒ ÙØ¶Ù„Ø§Ù‹ Ø¹Ù† Ù‚Ø¶Ø§ÙŠØ§ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø³Ø±Ø©. ÙŠØ¤ÙƒØ¯ Ù…ÙƒØªØ¨Ù†Ø§ Ø¹Ù„Ù‰ Ù†Ù‡Ø¬ Ù…ØªØ²Ø§Ù…Ù† Ø¨ÙŠÙ† Ø§Ù„ØªØ¹Ø§Ø·Ù ÙˆØ§Ù„ØµØ±Ø§Ù…Ø© ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ©ØŒ Ù…Ø³Ø§Ù†Ø¯ÙŠÙ† Ø¹Ù…Ù„Ø§Ø¡Ù†Ø§ Ø®Ù„Ø§Ù„ Ù…Ø§ Ù‡ÙŠ ÙÙŠ ÙƒØ«ÙŠØ± Ù…Ù† Ø§Ù„Ø£Ø­ÙŠØ§Ù† Ù„Ø­Ø¸Ø§Øª Ù…Ø­ÙˆØ±ÙŠØ© ÙÙŠ Ø­ÙŠØ§ØªÙ‡Ù… Ø§Ù„Ø´Ø®ØµÙŠØ© Ø£Ùˆ Ø§Ù„Ù…Ù‡Ù†ÙŠØ©.",
    },
    rate: "onrequest",
    icon: "User",
  },
  {
    id: "intellectual-property",
    title: { en: "ðŸ’¡ Intellectual Property", fr: "ðŸ’¡ PropriÃ©tÃ© Intellectuelle", ar: "ðŸ’¡ Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ø§Ù„ÙÙƒØ±ÙŠØ©" },
    blurb: {
      en: "The firm assists clients in protecting and maximizing the value of their intellectual property rightsâ€”particularly regarding trademarks, copyright, designs, and modelsâ€”as well as in preventing and resolving disputes related to these intangible assets.",
      fr: "Le cabinet assiste les clients dans la protection et la valorisation de leurs droits de propriÃ©tÃ© intellectuelleâ€”notamment marques, droits d'auteur, dessins et modÃ¨lesâ€”ainsi que dans la prÃ©vention et la rÃ©solution des litiges liÃ©s Ã  ces actifs immatÃ©riels.",
      ar: "ÙŠØ³Ø§Ø¹Ø¯ Ø§Ù„Ù…ÙƒØªØ¨ Ø¹Ù…Ù„Ø§Ø¡Ù‡Ù… ÙÙŠ Ø­Ù…Ø§ÙŠØ© ÙˆØªØ¹Ø¸ÙŠÙ… Ù‚ÙŠÙ…Ø© Ø­Ù‚ÙˆÙ‚ Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ø§Ù„ÙÙƒØ±ÙŠØ© Ù„Ø¯ÙŠÙ‡Ù… â€” Ù„Ø§ Ø³ÙŠÙ…Ø§ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© ÙˆØ­Ù‚ÙˆÙ‚ Ø§Ù„Ù†Ù…Ø· ÙˆØ§Ù„ØªØµØ§Ù…ÙŠÙ… ÙˆØ§Ù„Ù†Ù…Ø§Ø°Ø¬ â€” ÙˆÙƒØ°Ù„Ùƒ ÙÙŠ Ø§Ù„ÙˆÙ‚Ø§ÙŠØ© ÙˆØ­Ù„ Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª Ø§Ù„Ù…ØªØ¹Ù„Ù‚Ø© Ø¨Ù‡Ø°Ù‡ Ø§Ù„Ø£ØµÙˆÙ„ ØºÙŠØ± Ø§Ù„Ù…Ø§Ø¯ÙŠØ©.",
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

// â”€â”€ Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ UI Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ LangSwitcher â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LangSwitcher() {
  const [lang, setLangFn] = useLang();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-amber-400" />
      <select
        value={lang}
        onChange={(e) => setLangFn(e.target.value as Lang)}
        className="border-0 bg-transparent text-sm text-blue-100/80 focus:outline-none focus:ring-0"
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

// â”€â”€ BookingForm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FORM_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

function BookingForm() {
  const [lang] = useLang();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !service || (service === "other" && !customService.trim()) || !date || !slot) {
      setError(t("form.error"));
      setSuccess(false);
      return;
    }
    setError("");
    setLoading(true);

    const svc = SERVICES.find((s) => s.id === service);
    const svcTitle = service === "other" ? customService.trim() : svc ? svc.title[lang] : service;

    addBooking({
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      service: service === "other" ? "other" as ServiceId : service as ServiceId,
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
      setCustomService("");
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
    <Card className="border-blue-100 bg-white shadow-xl shadow-blue-900/5 rounded-3xl">
      <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-amber-50/30 rounded-t-3xl">
        <CardTitle className="font-serif text-2xl text-[#061826]">
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
              <option value="other">{lang === "en" ? "Other" : lang === "fr" ? "Autre" : "Ø£Ø®Ø±Ù‰"}</option>
            </select>
            {service === "other" && (
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder={lang === "en" ? "Describe your legal concern..." : lang === "fr" ? "DÃ©crivez votre problÃ¨me juridique..." : "ØµÙ Ù…Ø´ÙƒÙ„ØªÙƒ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©..."}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              />
            )}
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
            className="w-full bg-gradient-to-r from-[#0a1628] to-[#1e40af] text-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all font-semibold"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? t("form.sending") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// â”€â”€ Reservations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    <Card className="border-blue-100 bg-white/90 shadow-xl shadow-blue-900/5 rounded-3xl">
      <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-amber-50/30 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-2xl text-[#061826]">
            {t("res.title")}
          </CardTitle>
          <Badge className="bg-amber-50 text-amber-700 ring-1 ring-amber-200/60">
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
                        description: `${b.name} â€¢ ${b.date} at ${b.slot}`,
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

// â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ATTORNEYS: Attorney[] = [
  {
    name: "Hanifi Boubkeur",
    role: "founder",
    desc: {
      en: "Approved by the International Order of Experts. Focuses primarily on public procurement, business law, corporate law, and taxation.",
      fr: "AgrÃ©Ã© par l'Ordre International des Experts. SpÃ©cialisÃ© principalement en marchÃ©s publics, droit des affaires, droit des sociÃ©tÃ©s et fiscalitÃ©.",
      ar: "Ù…Ø¹ØªÙ…Ø¯ Ù…Ù† Ø§Ù„Ù†Ø¸Ø§Ù… Ø§Ù„Ø¯ÙˆÙ„ÙŠ Ù„Ù„Ø®Ø¨Ø±Ø§Ø¡. Ù…ØªØ®ØµØµ Ø¨Ø´ÙƒÙ„ Ø£Ø³Ø§Ø³ÙŠ ÙÙŠ Ø§Ù„Ù…Ù†Ø§Ù‚ØµØ§Øª Ø§Ù„Ø¹Ø§Ù…Ø© ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ø¶Ø±Ø§Ø¦Ø¨.",
    },
  },
  {
    name: "Benaicha Houria",
    role: "partner",
    desc: {
      en: "Specializes in family law, and estate law.",
      fr: "SpÃ©cialisÃ©e en droit de la famille et droit des successions.",
      ar: "Ù…ØªØ®ØµØµØ© ÙÙŠ Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø³Ø±Ø© ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¥Ø±Ø«.",
    },
  },
  {
    name: "Bensadoun Mohamed",
    role: "attorney",
    desc: {
      en: "Property and real estate law.",
      fr: "Droit de la propriÃ©tÃ© et droit immobilier.",
      ar: "Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø£Ø±Ø§Ø¶ÙŠ.",
    },
  },
  {
    name: "Hanifi Zakaria",
    role: "attorney",
    desc: {
      en: "Criminal law, contact law and liability, and business law.",
      fr: "Droit pÃ©nal, droit des contacts et responsabilitÃ©, et droit des affaires.",
      ar: "Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¬Ù†Ø§Ø¦ÙŠ ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø§ØªØµØ§Ù„ ÙˆØ§Ù„Ù…Ø³Ø¤ÙˆÙ„ÙŠØ© ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø¹Ù…Ø§Ù„.",
    },
  },
  {
    name: "Bouzid Noureddine",
    role: "attorney",
    desc: {
      en: "Labor law, cybercriminality, and intellectual property law.",
      fr: "Droit du travail, cybercriminalitÃ© et droit de la propriÃ©tÃ© intellectuelle.",
      ar: "Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø¹Ù…Ù„ ÙˆØ§Ù„Ø¬Ø±Ø§Ø¦Ù… Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ© ÙˆÙ‚Ø§Ù†ÙˆÙ† Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ø§Ù„ÙÙƒØ±ÙŠØ©.",
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
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      {/* Top contact bar */}
      <div className="bg-[#061826] text-blue-100/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              {t("topbar.phone")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              {t("topbar.firm")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              {t("topbar.email")}
            </span>
          </div>
          <LangSwitcher />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/90 backdrop-blur-xl shadow-lg shadow-blue-900/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="H&B Law Firm" className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="font-serif text-xl text-[#061826]">
                H&amp;B <span className="italic">Law Firm</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">
                Attorneys at Law Â· Algeria
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <a href="#services" className="transition hover:text-[#1e40af]">
              {t("nav.practice")}
            </a>
            <a href="#team" className="transition hover:text-[#1e40af]">
              {t("nav.team")}
            </a>
            <a href="#book" className="transition hover:text-[#1e40af]">
              {t("nav.consult")}
            </a>
            <a href="#location" className="transition hover:text-[#1e40af]">
              {t("nav.location")}
            </a>
          </nav>
          <Button
            asChild
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-[#061826] font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:from-amber-400 hover:to-yellow-300 transition-all"
          >
            <a href="#book">{t("cta.book")}</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#061826] text-white">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 50%), linear-gradient(225deg, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="H&B Law Firm" className="h-44 w-auto md:h-60" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-3 font-serif text-2xl italic text-amber-300 md:text-3xl"
          >
            {lang === "en" ? "Legal excellence at the service of your ambitions." : lang === "fr" ? "L'excellence juridique au service de vos ambitions." : "Ø§Ù„ØªÙ…ÙŠØ² Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ ÙÙŠ Ø®Ø¯Ù…Ø© Ø·Ù…ÙˆØ­Ø§ØªÙƒ."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-amber-500 text-[#061826] font-semibold shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-all"
            >
              <a href="#book">{t("hero.cta.book")}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <a href="#team">{t("hero.cta.team")}</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Presentation */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.3fr]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-amber-500/10 z-10" />
              <img
                src="/presentation.jpg"
                alt="H&B Law Firm"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {t("pres.badge")}
              </div>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
                <p>{t("pres.p1")}</p>
                <p>{t("pres.p2")}</p>
                <p>{t("pres.p3")}</p>
                <p className="font-medium text-[#061826]">{t("pres.p4")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking + Reservations */}
      <section id="book" className="bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#061826] px-4 py-1.5 text-sm font-semibold text-white">
              {t("book.badge")}
            </div>
            <h2 className="mt-4 font-serif text-3xl text-[#061826] sm:text-4xl">
              {t("book.title")}
            </h2>
            <p className="mt-3 text-slate-500">
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
      <section id="services" className="bg-[#061826] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-amber-300">
                {t("services.badge")}
              </div>
              <ul className="mt-5 space-y-2">
                {SERVICES.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="rounded-xl bg-white/10 p-3 transition-all hover:bg-white/15"
                  >
                    <p className="text-sm font-semibold text-white">{s.title[lang]}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-blue-200">{s.blurb[lang]}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              id="team"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-[#061826]">
                {t("team.badge")}
              </div>
              <div className="mt-5 space-y-2">
                {ATTORNEYS.map((att, i) => (
                  <motion.div
                    key={att.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="rounded-xl bg-white/10 p-3 transition-all hover:bg-white/15"
                  >
                    <p className="text-sm font-semibold text-white">{att.name}</p>
                    <p className="text-xs font-medium text-amber-300">{t(`team.${att.role}`)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-blue-200">{att.desc[lang]}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section id="location" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
              {t("location.badge")}
            </div>
            <h2 className="mt-4 font-serif text-3xl text-[#061826] sm:text-4xl">
              {t("location.title")}
            </h2>
            <p className="mt-3 text-slate-500">
              {t("location.desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5"
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
      <footer className="bg-[#061826] text-blue-100/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="H&B Law Firm" className="h-10 w-auto" />
              <p className="font-serif text-xl text-white">
                H&amp;B <span className="italic">Law Firm</span>
              </p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-blue-200/60">
              {t("footer.about")}
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-amber-400 font-semibold">
              {t("footer.contact")}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                {t("footer.email")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400" />
                {t("topbar.phone")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400" />
                {t("topbar.firm")}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                {t("footer.fax")}
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-amber-400 font-semibold">
              {t("footer.languages")}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>FranÃ§ais</li>
              <li>Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</li>
              <li>English</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 px-4 py-5 text-center text-xs text-blue-200/40">
          {t("footer.rights", { year: String(new Date().getFullYear()) })}
        </div>
      </footer>
    </div>
  );
}
