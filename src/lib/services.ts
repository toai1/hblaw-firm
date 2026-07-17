import type { Service } from "@/types";

export const SERVICES: Service[] = [
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

export const TIME_SLOTS: string[] = [
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