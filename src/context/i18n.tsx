import { useSignal, useVisibleTask$, type Signal } from "@builder.io/qwik";

export type Language = "en" | "fr";

export interface I18nStore {
  locale: Signal<Language>;
}

// Create a hook that manages locale state locally
// Since Qwik's signals are reactive, this works across components
export const useI18n = (): I18nStore => {
  const locale = useSignal<Language>("en");

  // Load saved preference on client
  useVisibleTask$(() => {
    const saved = localStorage.getItem("locale") as Language;
    if (saved && (saved === "en" || saved === "fr")) {
      locale.value = saved;
    }

    // Listen for changes from other components
    const handler = (e: StorageEvent) => {
      if (e.key === "locale" && e.newValue) {
        locale.value = e.newValue as Language;
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  });

  return { locale };
};

// Function to change language and persist
export const setLanguage = (lang: Language) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("locale", lang);
    // Dispatch storage event for other tabs/components
    window.dispatchEvent(new StorageEvent("storage", {
      key: "locale",
      newValue: lang,
    }));
  }
};

export const translations = {
  en: {
    // Navigation
    "nav.thisIsUs": "This Is Us",
    "nav.facilitators": "Facilitators",
    "nav.ourLogo": "Our Logo",
    "nav.about": "About",
    "nav.ourSpace": "Our Space",
    "nav.whatToExpect": "What To Expect",
    "nav.benefitsOfClay": "Benefits Of Clay",
    "nav.newsletter": "Newsletter",
    "nav.gallery": "Gallery",
    "nav.faq": "FAQ",
    "nav.ourOfferings": "Our Offerings",
    "nav.classesWorkshops": "Classes & Workshops",
    "nav.corporateEvents": "Corporate Events",
    "nav.privateEvents": "Private Events",
    "nav.giftCards": "Gift Cards",
    "nav.reviews": "Reviews",
    "nav.inTheNews": "In The News",
    "nav.community": "Community",
    "nav.contact": "Contact",
    "nav.bookAClass": "Book a Class",

    // Hero
    "hero.studioSessions": "Studio Sessions",
    "hero.polishing": "Polishing",
    "hero.every": "Every",
    "hero.recording": "Recording",
    "hero.studioDescription": "Professional recording services with attention to detail and musical excellence.",
    "hero.sessionViolinist": "Session Violinist",
    "hero.crafting": "Crafting",
    "hero.musical": "Musical",
    "hero.moments": "Moments",
    "hero.sessionDescription": "Bringing soul and precision to every recording session and live performance we create.",
    "hero.livePerformances": "Live Performances",
    "hero.creating": "Creating",
    "hero.unforgettable": "Unforgettable",
    "hero.experiences": "Experiences",
    "hero.liveDescription": "From intimate venues to grand stages, delivering performances that truly resonate.",
    "hero.viewPortfolio": "View Portfolio",
    "hero.bookSession": "Book Session",
    "hero.tracks": "Tracks",
    "hero.artists": "Artists",
    "hero.genres": "Genres",
    "hero.concerts": "Concerts",
    "hero.venues": "Venues",
    "hero.cities": "Cities",
    "hero.sessions": "Sessions",
    "hero.albums": "Albums",
    "hero.years": "Years",

    // Sections
    "section.featuredPerformances": "Featured Performances",
    "section.recentSessions": "Recent sessions, collaborations, and live performances",
    "section.bookingOptions": "Booking Options",
    "section.bookingDescription": "Whether it's a live event or a studio session, let's make music together",
    "section.whatIDo": "What I Do",
    "section.whatIDoDescription": "From intimate studio sessions to grand live performances, I bring versatility and passion to every project.",
    "section.recentPerformances": "Recent Performances",
    "section.recentPerformancesDescription": "Watch highlights from recent studio sessions and live performances.",

    // Services
    "service.studioSessions": "Studio Sessions",
    "service.studioSessionsDesc": "Professional violin recording for albums, singles, and soundtracks.",
    "service.studioSessionsFullDesc": "Transform your music with professional violin recordings. From classical to contemporary, I bring soul and precision to every track. Whether you're producing an album, single, or soundtrack, my studio sessions deliver the rich, emotive sound that elevates your project.",
    "service.livePerformance": "Live Performance",
    "service.livePerformanceDesc": "Bringing elegance and emotion to weddings, events, and concerts.",
    "service.livePerformanceFullDesc": "Create unforgettable moments with live violin performances. Specializing in weddings, corporate events, and intimate concerts, I craft musical experiences that resonate with your audience. From classical elegance to modern arrangements, each performance is tailored to your vision.",
    "service.myMusic": "My Music",
    "service.myMusicDesc": "Listen to my original music and arrangements on Spotify.",
    "service.myMusicFullDesc": "Discover unique violin arrangements and original compositions. I create custom transcriptions that breathe new life into beloved pieces and compose original works that showcase the violin's versatility. Each arrangement is crafted with musicality and technical excellence in mind.",
    "service.portfolio": "Portfolio",
    "service.readyToElevate": "Ready to elevate your recording?",
    "service.readyToBook": "Ready to book your performance?",
    "service.studioCTA": "Let's bring your music to life with professional violin recordings. Get in touch to discuss your project and studio session details.",
    "service.liveCTA": "Whether it's a wedding, corporate event, or intimate concert, let's create an unforgettable musical experience together.",
    "service.bookStudioSession": "Book Studio Session",
    "service.bookLivePerformance": "Book Live Performance",
    "service.learnMore": "Learn more",

    // Buttons
    "button.watch": "Watch",
    "button.bookNow": "Book Now",
    "button.learnMore": "Learn more",
    "button.viewFullGallery": "View Full Gallery",
    "button.subscribe": "Subscribe",

    // Footer
    "footer.joinNewsletter": "Stay Updated",
    "footer.copyright": "© 2025 Session Violinist · All rights reserved.",
    "footer.description": "Professional session violinist bringing soul and precision to every recording session and live performance.",
    "footer.services": "Services",
    "footer.connect": "Connect",
    "footer.sessionViolinist": "Session Violinist",
    "footer.livePerformances": "Live Performances",
    "footer.myMusic": "My Music",
    "footer.portfolio": "Portfolio",

    // Language
    "language": "Language",
    "language.en": "English",
    "language.fr": "Français",
  },
  fr: {
    // Navigation
    "nav.thisIsUs": "Qui Sommes-Nous",
    "nav.facilitators": "Animateurs",
    "nav.ourLogo": "Notre Logo",
    "nav.about": "À Propos",
    "nav.ourSpace": "Notre Espace",
    "nav.whatToExpect": "À Quoi S'attendre",
    "nav.benefitsOfClay": "Bienfaits de l'Argile",
    "nav.newsletter": "Infolettre",
    "nav.gallery": "Galerie",
    "nav.faq": "FAQ",
    "nav.ourOfferings": "Nos Services",
    "nav.classesWorkshops": "Cours et Ateliers",
    "nav.corporateEvents": "Événements Corporatifs",
    "nav.privateEvents": "Événements Privés",
    "nav.giftCards": "Cartes Cadeaux",
    "nav.reviews": "Avis",
    "nav.inTheNews": "Dans les Médias",
    "nav.community": "Communauté",
    "nav.contact": "Contact",
    "nav.bookAClass": "Réserver un Cours",

    // Hero
    "hero.studioSessions": "Sessions Studio",
    "hero.polishing": "Perfectionner",
    "hero.every": "Chaque",
    "hero.recording": "Enregistrement",
    "hero.studioDescription": "Services d'enregistrement professionnels avec attention aux détails et excellence musicale.",
    "hero.sessionViolinist": "Violoniste de Session",
    "hero.crafting": "Créer",
    "hero.musical": "des Moments",
    "hero.moments": "Musicaux",
    "hero.sessionDescription": "Apporter âme et précision à chaque session d'enregistrement et performance live.",
    "hero.livePerformances": "Performances Live",
    "hero.creating": "Créer",
    "hero.unforgettable": "des Expériences",
    "hero.experiences": "Inoubliables",
    "hero.liveDescription": "Des salles intimes aux grandes scènes, offrant des performances qui résonnent vraiment.",
    "hero.viewPortfolio": "Voir Portfolio",
    "hero.bookSession": "Réserver",
    "hero.tracks": "Pistes",
    "hero.artists": "Artistes",
    "hero.genres": "Genres",
    "hero.concerts": "Concerts",
    "hero.venues": "Salles",
    "hero.cities": "Villes",
    "hero.sessions": "Sessions",
    "hero.albums": "Albums",
    "hero.years": "Années",

    // Sections
    "section.featuredPerformances": "Performances en Vedette",
    "section.recentSessions": "Sessions récentes, collaborations et performances live",
    "section.bookingOptions": "Options de Réservation",
    "section.bookingDescription": "Que ce soit pour un événement live ou une session studio, créons de la musique ensemble",
    "section.whatIDo": "Ce Que Je Fais",
    "section.whatIDoDescription": "Des sessions studio intimes aux grandes performances live, j'apporte polyvalence et passion à chaque projet.",
    "section.recentPerformances": "Performances Récentes",
    "section.recentPerformancesDescription": "Regardez les temps forts des sessions studio et performances live récentes.",

    // Services
    "service.studioSessions": "Sessions Studio",
    "service.studioSessionsDesc": "Enregistrement professionnel de violon pour albums, singles et bandes sonores.",
    "service.studioSessionsFullDesc": "Transformez votre musique avec des enregistrements professionnels de violon. Du classique au contemporain, j'apporte âme et précision à chaque piste. Que vous produisiez un album, un single ou une bande sonore, mes sessions studio offrent le son riche et émotif qui élève votre projet.",
    "service.livePerformance": "Performance Live",
    "service.livePerformanceDesc": "Apporter élégance et émotion aux mariages, événements et concerts.",
    "service.livePerformanceFullDesc": "Créez des moments inoubliables avec des performances live de violon. Spécialisé dans les mariages, événements corporatifs et concerts intimes, je crée des expériences musicales qui résonnent avec votre public. De l'élégance classique aux arrangements modernes, chaque performance est adaptée à votre vision.",
    "service.myMusic": "Ma Musique",
    "service.myMusicDesc": "Écoutez ma musique originale et mes arrangements sur Spotify.",
    "service.myMusicFullDesc": "Découvrez des arrangements uniques de violon et des compositions originales. Je crée des transcriptions personnalisées qui donnent une nouvelle vie à des pièces bien-aimées et compose des œuvres originales qui mettent en valeur la polyvalence du violon. Chaque arrangement est créé avec musicalité et excellence technique.",
    "service.portfolio": "Portfolio",
    "service.readyToElevate": "Prêt à élever votre enregistrement?",
    "service.readyToBook": "Prêt à réserver votre performance?",
    "service.studioCTA": "Donnons vie à votre musique avec des enregistrements professionnels de violon. Contactez-moi pour discuter de votre projet et des détails de la session studio.",
    "service.liveCTA": "Qu'il s'agisse d'un mariage, d'un événement corporatif ou d'un concert intime, créons ensemble une expérience musicale inoubliable.",
    "service.bookStudioSession": "Réserver Session Studio",
    "service.bookLivePerformance": "Réserver Performance Live",
    "service.learnMore": "En savoir plus",

    // Buttons
    "button.watch": "Regarder",
    "button.bookNow": "Réserver",
    "button.learnMore": "En savoir plus",
    "button.viewFullGallery": "Voir la Galerie Complète",
    "button.subscribe": "S'abonner",

    // Footer
    "footer.joinNewsletter": "Rejoignez Notre Infolettre",
    "footer.copyright": "© 2025 Session Violinist · Tous droits réservés.",
    "footer.description": "Violoniste de session professionnel apportant âme et précision à chaque enregistrement et performance live.",
    "footer.services": "Services",
    "footer.connect": "Connecter",
    "footer.sessionViolinist": "Violoniste de Session",
    "footer.livePerformances": "Performances Live",
    "footer.myMusic": "Ma Musique",
    "footer.portfolio": "Portfolio",

    // Language
    "language": "Langue",
    "language.en": "English",
    "language.fr": "Français",
  },
};

export type TranslationKey = keyof typeof translations.en;

export function t(locale: Language, key: TranslationKey): string {
  return translations[locale][key] || key;
}
