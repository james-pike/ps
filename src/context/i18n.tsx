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
    "hero.artistProfile": "Artist Profile",
    "hero.polishing": "Session",
    "hero.every": "Violinist",
    "hero.recording": "",
    "hero.studioDescription": "Professional violinist bringing soul and precision to every occasion.",
    "hero.sessionViolinist": "Phineas Stewart",
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
    "service.bookSessionViolinist": "Book Session Violinist",
    "service.bookLivePerformance": "Book Live Performance",
    "service.learnMore": "Learn more",

    // Session Violinist Expanded
    "expanded.sessionViolinist": "Session Violinist",
    "expanded.sessionViolinistTagline": "Elevate your moment with live violin.",
    "expanded.sessionViolinistDesc": "Whether it's the walk down the aisle, a corporate gala, or laying down tracks in the studio, I tailor each performance to fit your vision. Classical training meets versatile style.",
    "expanded.services": "Available For",
    "expanded.weddings": "Weddings",
    "expanded.events": "Events",
    "expanded.funerals": "Funerals",
    "expanded.studioSessions": "Studio Sessions",
    "expanded.customArrangements": "Custom Arrangements",
    "expanded.portfolio": "Portfolio",

    // Artist Profile Expanded
    "expanded.artistProfile": "Artist Profile",
    "expanded.artistTagline": "Singer-songwriter and violinist from Nova Scotia.",
    "expanded.artistDesc": "I blend East Coast roots with urban inspiration to create music that tells stories and connects with listeners.",
    "expanded.artistJourney": "Growing up on the East Coast shaped my sound—folk traditions, ocean air, and tight-knit communities. Now based in Montreal, I write and perform original music that bridges that heritage with city life.",
    "expanded.artistStyle": "My style blends indie folk with classical violin, creating something intimate yet dynamic. Every song starts with a story worth telling.",
    "expanded.background": "Background",
    "expanded.fromNovaScotia": "Nova Scotia roots",
    "expanded.basedInMontreal": "Montreal based",
    "expanded.gallery": "Gallery",
    "expanded.listenOnSpotify": "Listen on Spotify",
    "expanded.listenToMyMusic": "Listen to My Music",

    // Artist Profile Card
    "hero.singer": "Singer",
    "hero.songwriter": "Songwriter",
    "hero.violinist": "Violinist",
    "hero.artistCardDesc": "Born and raised in Nova Scotia, now creating music in Montreal.",
    "hero.roots": "Roots",
    "hero.based": "Based",
    "hero.sessionAvailable": "Available for weddings, events, funerals, studio sessions, and custom arrangements.",
    "hero.artistRoots": "East Coast roots meet urban inspiration.",

    // Newsletter
    "newsletter.stayUpdated": "Stay Updated",
    "newsletter.description": "Get the latest news and updates delivered to your inbox.",
    "newsletter.placeholder": "Enter your email",
    "newsletter.subscribe": "Subscribe",

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
    "footer.about": "About",
    "footer.services": "Services",
    "footer.connect": "Connect",
    "footer.sessionViolinist": "Session Violinist",
    "footer.artistProfile": "Artist Profile",
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
    "nav.bookAClass": "Réserver",

    // Hero
    "hero.artistProfile": "Profil d'Artiste",
    "hero.polishing": "Session",
    "hero.every": "Violoniste",
    "hero.recording": "",
    "hero.studioDescription": "Violoniste apportant âme et précision à chaque occasion.",
    "hero.sessionViolinist": "Phineas Stewart",
    "hero.crafting": "Créer",
    "hero.musical": "des Moments",
    "hero.moments": "Musicaux",
    "hero.sessionDescription": "Âme et précision pour chaque session et performance live.",
    "hero.livePerformances": "Performances Live",
    "hero.creating": "Créer",
    "hero.unforgettable": "des Expériences",
    "hero.experiences": "Inoubliables",
    "hero.liveDescription": "Des salles intimes aux grandes scènes, des performances qui résonnent.",
    "hero.viewPortfolio": "Portfolio",
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
    "section.featuredPerformances": "Performances",
    "section.recentSessions": "Sessions, collaborations et performances récentes",
    "section.bookingOptions": "Réservation",
    "section.bookingDescription": "Événement live ou session studio, créons ensemble",
    "section.whatIDo": "Ce Que Je Fais",
    "section.whatIDoDescription": "Sessions studio et performances live avec polyvalence et passion.",
    "section.recentPerformances": "Performances Récentes",
    "section.recentPerformancesDescription": "Temps forts des sessions et performances récentes.",

    // Services
    "service.studioSessions": "Sessions Studio",
    "service.studioSessionsDesc": "Enregistrement de violon pour albums, singles et bandes sonores.",
    "service.studioSessionsFullDesc": "Transformez votre musique avec le violon. Du classique au contemporain, âme et précision à chaque piste. Album, single ou bande sonore, un son riche qui élève votre projet.",
    "service.livePerformance": "Performance Live",
    "service.livePerformanceDesc": "Élégance et émotion pour mariages, événements et concerts.",
    "service.livePerformanceFullDesc": "Moments inoubliables avec le violon live. Mariages, événements corporatifs, concerts intimes—des expériences qui résonnent. Classique ou moderne, adapté à votre vision.",
    "service.myMusic": "Ma Musique",
    "service.myMusicDesc": "Ma musique originale et arrangements sur Spotify.",
    "service.myMusicFullDesc": "Arrangements uniques et compositions originales. Transcriptions qui donnent vie aux classiques et œuvres originales montrant la polyvalence du violon.",
    "service.portfolio": "Portfolio",
    "service.readyToElevate": "Prêt à élever votre projet?",
    "service.readyToBook": "Prêt à réserver?",
    "service.studioCTA": "Donnons vie à votre musique. Contactez-moi pour discuter de votre projet.",
    "service.liveCTA": "Mariage, événement ou concert intime, créons une expérience inoubliable.",
    "service.bookSessionViolinist": "Réserver",
    "service.bookLivePerformance": "Réserver",
    "service.learnMore": "En savoir plus",

    // Session Violinist Expanded
    "expanded.sessionViolinist": "Violoniste de Session",
    "expanded.sessionViolinistTagline": "Sublimez votre moment avec le violon.",
    "expanded.sessionViolinistDesc": "Marche nuptiale, gala ou studio—chaque performance adaptée à votre vision. Formation classique, style polyvalent.",
    "expanded.services": "Disponible Pour",
    "expanded.weddings": "Mariages",
    "expanded.events": "Événements",
    "expanded.funerals": "Funérailles",
    "expanded.studioSessions": "Studio",
    "expanded.customArrangements": "Arrangements",
    "expanded.portfolio": "Portfolio",

    // Artist Profile Expanded
    "expanded.artistProfile": "Profil d'Artiste",
    "expanded.artistTagline": "Auteur-compositeur et violoniste de Nouvelle-Écosse.",
    "expanded.artistDesc": "Racines côte Est et inspiration urbaine pour une musique qui raconte des histoires.",
    "expanded.artistJourney": "La côte Est a façonné mon son—traditions folk, air marin, communautés soudées. Basé à Montréal, j'écris une musique qui relie cet héritage à la vie urbaine.",
    "expanded.artistStyle": "Folk indie et violon classique, intime et dynamique. Chaque chanson raconte une histoire.",
    "expanded.background": "Parcours",
    "expanded.fromNovaScotia": "Nouvelle-Écosse",
    "expanded.basedInMontreal": "Montréal",
    "expanded.gallery": "Galerie",
    "expanded.listenOnSpotify": "Écouter sur Spotify",
    "expanded.listenToMyMusic": "Écouter",

    // Artist Profile Card
    "hero.singer": "Chanteur",
    "hero.songwriter": "Auteur",
    "hero.violinist": "Violoniste",
    "hero.artistCardDesc": "Né en Nouvelle-Écosse, créant maintenant à Montréal.",
    "hero.roots": "Racines",
    "hero.based": "Basé",
    "hero.sessionAvailable": "Mariages, événements, funérailles, studio et arrangements.",
    "hero.artistRoots": "Racines côte Est, inspiration urbaine.",

    // Newsletter
    "newsletter.stayUpdated": "Restez Informé",
    "newsletter.description": "Recevez les dernières nouvelles dans votre boîte mail.",
    "newsletter.placeholder": "Votre courriel",
    "newsletter.subscribe": "S'abonner",

    // Buttons
    "button.watch": "Voir",
    "button.bookNow": "Réserver",
    "button.learnMore": "En savoir plus",
    "button.viewFullGallery": "Voir la Galerie",
    "button.subscribe": "S'abonner",

    // Footer
    "footer.joinNewsletter": "Restez Informé",
    "footer.copyright": "© 2025 Session Violinist · Tous droits réservés.",
    "footer.description": "Violoniste apportant âme et précision à chaque enregistrement et performance.",
    "footer.about": "À Propos",
    "footer.services": "Services",
    "footer.connect": "Contact",
    "footer.sessionViolinist": "Violoniste de Session",
    "footer.artistProfile": "Profil d'Artiste",
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
  const value = translations[locale][key];
  return value !== undefined ? value : key;
}
