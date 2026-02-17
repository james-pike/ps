import { component$, useSignal, useVisibleTask$, useStyles$, $ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { menuItems } from "./MenuModal";
import IconHamburger from "../icons/IconHamburger";
import IconChevronDown from "../icons/IconChevronDown";
import { LuX, LuChevronRight, LuMapPin, LuMail, LuClock, LuInstagram, LuYoutube, LuCalendar } from "@qwikest/icons/lucide";
import { useI18n, setLanguage as setLang, type Language, t } from "~/context/i18n";

type FlipTarget = 'none' | 'menu' | 'portfolio' | 'booking' | 'session-violinist' | 'live-performance';

export default component$(() => {
  const carouselIndex = useSignal(0);
  const isAutoPlaying = useSignal(true);
  const currentSlideIndex = useSignal(0);
  const hasCycledOnce = useSignal(false);
  const slideTickCount = useSignal(0);
  const rightColumnImageIndex = useSignal(0);
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);
  // Separate touch tracking for video carousel
  const videoTouchStartX = useSignal(0);
  const videoTouchEndX = useSignal(0);

  // 3D Flip card state
  const isFlipped = useSignal<boolean>(false);
  const flipTarget = useSignal<FlipTarget>('none');
  const flipTouchStartX = useSignal<number>(0);
  const flipTouchStartY = useSignal<number>(0);

  // Menu accordion state for flip card
  const menuOpenIndex = useSignal<number | null>(null);

  // Desktop header state
  const i18n = useI18n();
  const showLangDropdown = useSignal(false);

  const handleSetLanguage = $((lang: Language) => {
    i18n.locale.value = lang;
    setLang(lang);
    showLangDropdown.value = false;
  });

  const carouselImages = [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
  ];

  // Different videos for each card
  const cardVideos = [
    // Card 1: Studio Sessions (Polishing Every Recording)
    [
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80"
    ],
    // Card 2: Session Violinist (Crafting Musical Moments)
    [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80"
    ]
  ];

  const locale = i18n.locale.value;

  const heroCards = [
    {
      badge: t(locale, "hero.sessionViolinist"),
      title: [t(locale, "hero.polishing"), t(locale, "hero.every"), t(locale, "hero.recording")],
      description: t(locale, "hero.studioDescription"),
      stats: [
        { value: "40+", label: t(locale, "hero.tracks") },
        { value: "20+", label: t(locale, "hero.artists") },
        { value: "10+", label: t(locale, "hero.genres") }
      ]
    },
    {
      badge: t(locale, "hero.artistProfile"),
      title: [t(locale, "hero.singer"), t(locale, "hero.songwriter"), ""],
      description: t(locale, "hero.artistCardDesc"),
      stats: [
        { value: "NS", label: t(locale, "hero.roots") },
        { value: "MTL", label: t(locale, "hero.based") },
        { value: "10+", label: t(locale, "hero.years") }
      ]
    }
  ];

  useStyles$(`
    .hero-carousel-container {
      position: relative;
      width: 100%;
      min-height: 780px;
      perspective: 1000px;
      touch-action: pan-y;
      user-select: none;
    }
    .carousel-card-wrapper {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center center;
      visibility: hidden;
    }
    .carousel-card-wrapper.active {
      z-index: 3;
      transform: translate(0, 0) scale(1) rotate(0deg);
      opacity: 1;
      visibility: visible;
    }
    .carousel-card-wrapper.next {
      z-index: 2;
      transform: translate(8px, -12px) scale(0.97) rotate(1deg);
      opacity: 0.85;
      pointer-events: none;
      visibility: visible;
    }
    .carousel-card-wrapper.prev {
      z-index: 1;
      transform: translate(-6px, -22px) scale(0.94) rotate(-1deg);
      opacity: 0.7;
      pointer-events: none;
      visibility: visible;
    }
    .carousel-card-wrapper.hidden {
      display: none;
    }
    .progress-bar {
      height: 3px;
      background: rgba(120, 113, 108, 0.2);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 1rem;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #57534e, #78716c);
      width: 0%;
      animation: fillProgress 5s linear infinite;
    }
    @keyframes fillProgress {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    /* 3D Flip Card Styles */
    .flip-card-container {
      position: relative;
      width: 100%;
      perspective: 1200px;
      -webkit-perspective: 1200px;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
    }
    .flip-card-inner.flipped {
      transform: rotateY(180deg);
    }
    .flip-card-inner.flipped .flip-card-front {
      visibility: hidden;
      opacity: 0;
      transition: none;
    }
    .flip-card-front, .flip-card-back {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
    }
    .flip-card-front {
      position: relative;
    }
    .flip-card-back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotateY(180deg) translateZ(0);
      -webkit-transform: rotateY(180deg) translateZ(0);
      overflow-y: auto;
    }
    /* Desktop header dropdown styles */
    .dropdown:hover .dropdown-menu {
      display: block !important;
    }
    .dropdown .dropdown-menu {
      display: none;
      top: 100%;
      left: 0;
      z-index: 100;
    }
    .hero-header {
      position: relative;
      z-index: 50;
    }
  `);

  // Auto-advance carousel for images (paused when flipped)
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      if (isAutoPlaying.value && !isFlipped.value) {
        carouselIndex.value = (carouselIndex.value + 1) % carouselImages.length;
      }
    }, 3000);
    cleanup(() => clearInterval(interval));
  });

  // Auto-advance right column images, then advance hero card after full cycle (paused when flipped)
  // Only cycles once through all cards, then stays on the first (stone) card
  // First card and last card stay twice as long
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      // Pause auto-advance when card is flipped or already cycled once
      if (isFlipped.value || hasCycledOnce.value) return;

      const videosPerCard = cardVideos[0].length; // All cards have same number of videos
      const nextImageIndex = (rightColumnImageIndex.value + 1) % videosPerCard;
      rightColumnImageIndex.value = nextImageIndex;

      // When video carousel completes a full cycle (returns to 0), check if we should advance
      if (nextImageIndex === 0) {
        slideTickCount.value += 1;

        const isFirstCard = currentSlideIndex.value === 0 && !hasCycledOnce.value;
        const isLastCard = currentSlideIndex.value === heroCards.length - 1;
        const ticksNeeded = (isFirstCard || isLastCard) ? 2 : 1;

        if (slideTickCount.value >= ticksNeeded) {
          slideTickCount.value = 0;
          const nextSlideIndex = (currentSlideIndex.value + 1) % heroCards.length;
          currentSlideIndex.value = nextSlideIndex;

          // If we've returned to the first card (index 0), mark as cycled once and stop
          if (nextSlideIndex === 0) {
            hasCycledOnce.value = true;
          }
        }
      }
    }, 6000); // 6 seconds per tick
    cleanup(() => clearInterval(interval));
  });

  // Flip card handlers
  const handleFlip = $((target: FlipTarget) => {
    isFlipped.value = true;
    flipTarget.value = target;
    menuOpenIndex.value = null;
  });

  const handleFlipBack = $(() => {
    isFlipped.value = false;
    flipTarget.value = 'none';
    menuOpenIndex.value = null;
  });

  // Handle menu item clicks - flip to expanded content view
  const handleMenuItemClick = $((itemTitle: string, e: Event) => {
    e.preventDefault();
    if (itemTitle === "Session Violinist") {
      flipTarget.value = 'session-violinist';
    } else if (itemTitle === "Artist Profile") {
      flipTarget.value = 'live-performance';
    } else if (itemTitle === "My Music") {
      window.open("https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa", '_blank');
      handleFlipBack();
    } else if (itemTitle === "Updates") {
      window.location.href = "/#newsletter";
    }
  });

  // Swipe handler for back of card (down or horizontal to close)
  const handleBackTouchStart = $((e: TouchEvent) => {
    e.stopPropagation();
    flipTouchStartX.value = e.touches[0].clientX;
    flipTouchStartY.value = e.touches[0].clientY;
  });

  const handleBackTouchEnd = $((e: TouchEvent) => {
    e.stopPropagation();
    const diffX = Math.abs(e.changedTouches[0].clientX - flipTouchStartX.value);
    const diffY = e.changedTouches[0].clientY - flipTouchStartY.value;

    // Swipe down (80px) or horizontal swipe (50px) to close
    if (diffY > 80 || diffX > 50) {
      handleFlipBack();
    }
    flipTouchStartX.value = 0;
    flipTouchStartY.value = 0;
  });

  return (
    <section class="relative min-h-[auto] lg:min-h-screen flex items-center justify-center overflow-hidden pt-0 pb-0 lg:py-0">
      {/* Floating decorations */}
      <div class="absolute top-20 left-10 w-32 h-32 bg-stone-400/15 rounded-full blur-2xl animate-float" aria-hidden="true"></div>
      <div class="absolute top-40 right-20 w-48 h-48 bg-gray-300/15 rounded-full blur-3xl animate-floatx" aria-hidden="true"></div>
      <div class="absolute bottom-20 left-1/3 w-40 h-40 bg-stone-300/15 rounded-full blur-2xl animate-float" aria-hidden="true"></div>

      <div class="relative z-10 w-full mx-auto px-3 pt-3 pb-1 lg:px-4 lg:pt-0 lg:pb-8">
        {/* Mobile Layout - Card Stack */}
        <div class="lg:hidden relative">
          {/* Mobile Menu Button + Language Dropdown - positioned above card stack */}
          {!isFlipped.value && (
            <div class="absolute top-4 right-2 z-50 flex items-center gap-2">
              {/* Language Dropdown */}
              <div class="relative">
                <button
                  class={`flex items-center gap-0.5 px-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                    currentSlideIndex.value === 0
                      ? 'border-stone-300 bg-stone-100/40 hover:bg-stone-200/50'
                      : currentSlideIndex.value === 1
                        ? 'border-green-300 bg-green-100/40 hover:bg-green-200/50'
                        : 'border-amber-300 bg-amber-100/40 hover:bg-amber-200/50'
                  }`}
                  onClick$={() => showLangDropdown.value = !showLangDropdown.value}
                >
                  <span class="text-sm font-medium text-stone-700 uppercase">{i18n.locale.value}</span>
                  <IconChevronDown class="w-4 h-4 text-stone-700" />
                </button>
                {showLangDropdown.value && (
                  <div class="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-md border border-stone-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[100px]">
                    <button
                      class={`w-full px-3 py-2 text-left text-sm hover:bg-amber-100/50 transition-colors ${i18n.locale.value === 'en' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                      onClick$={() => handleSetLanguage('en')}
                    >
                      English
                    </button>
                    <button
                      class={`w-full px-3 py-2 text-left text-sm hover:bg-amber-100/50 transition-colors ${i18n.locale.value === 'fr' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                      onClick$={() => handleSetLanguage('fr')}
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>

              {/* Hamburger Menu Button */}
              <button
                class={`p-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                  currentSlideIndex.value === 0
                    ? 'border-stone-300 bg-stone-100/40 hover:bg-stone-200/50'
                    : currentSlideIndex.value === 1
                      ? 'border-green-300 bg-green-100/40 hover:bg-green-200/50'
                      : 'border-amber-300 bg-amber-100/40 hover:bg-amber-200/50'
                }`}
                onClick$={() => handleFlip('menu')}
              >
                <IconHamburger class="w-6 h-7 stroke-stone-800" />
              </button>
            </div>
          )}
          <div
            class="hero-carousel-container"
            onTouchStart$={(e) => {
              // Disable carousel swipe when flipped
              if (isFlipped.value) return;
              touchStartX.value = e.touches[0].clientX;
              touchEndX.value = e.touches[0].clientX;
            }}
            onTouchMove$={(e) => {
              if (isFlipped.value) return;
              touchEndX.value = e.touches[0].clientX;
              const diff = Math.abs(touchStartX.value - touchEndX.value);
              if (diff > 10) {
                e.preventDefault();
              }
            }}
            onTouchEnd$={(e) => {
              if (isFlipped.value) return;
              const swipeThreshold = 50;
              const diff = touchStartX.value - touchEndX.value;

              if (Math.abs(diff) > swipeThreshold) {
                e.preventDefault();
                if (diff > 0) {
                  // Swipe left - next slide
                  currentSlideIndex.value = (currentSlideIndex.value + 1) % heroCards.length;
                } else {
                  // Swipe right - previous slide
                  currentSlideIndex.value = (currentSlideIndex.value - 1 + heroCards.length) % heroCards.length;
                }
              }

              touchStartX.value = 0;
              touchEndX.value = 0;
            }}
          >
            {heroCards.map((card, index) => {
              const getCardClass = () => {
                const current = currentSlideIndex.value;
                const total = heroCards.length;

                if (index === current) return 'active';

                const distance = (index - current + total) % total;

                if (distance === 1) return 'next';
                if (distance === 2) return 'prev';

                return 'hidden';
              };

              // Different color schemes for each card - soft pastel with black headlines
              const cardStyles = [
                // Card 1: Soft stone/taupe - with black headline (Studio Sessions)
                {
                  bg: "from-stone-100 to-stone-50",
                  innerBg: "bg-stone-50",
                  border: "border-stone-400/60",
                  badge: "bg-stone-100/70 border-stone-300/50 text-stone-600",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-stone-200 to-stone-300 hover:from-stone-300 hover:to-stone-400 shadow-stone-200/20 text-stone-700",
                  buttonOutline: "border-stone-300 text-stone-600 hover:bg-stone-200/30",
                  statValue: "text-stone-600",
                  statLabel: "text-stone-500/70",
                  divider: "border-stone-200/50",
                  description: "text-stone-600",
                  textureColor: "#78716c",
                  // Back of card styles
                  backBg: "bg-stone-100",
                  backBorder: "border-stone-400/60",
                  backCloseBtn: "bg-stone-50/90 border-stone-400/60",
                  backCloseIcon: "text-stone-600",
                  backText: "text-stone-600",
                  backTextMuted: "text-stone-500/70",
                  backMenuHover: "hover:bg-stone-200/50",
                  backSocialBg: "bg-stone-200/70 border-stone-300/60"
                },
                // Card 2: Hunter/Melchers green - with black headline (Artist Profile)
                {
                  bg: "from-green-100 to-stone-100",
                  innerBg: "bg-green-100",
                  border: "border-green-400/60",
                  badge: "bg-green-200/70 border-green-300/50 text-green-800",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 shadow-green-200/20 text-green-900",
                  buttonOutline: "border-green-400 text-green-800 hover:bg-green-200/30",
                  statValue: "text-green-800",
                  statLabel: "text-green-700/70",
                  divider: "border-green-300/50",
                  description: "text-stone-700",
                  textureColor: "#166534",
                  // Back of card styles
                  backBg: "bg-green-100",
                  backBorder: "border-green-400/60",
                  backCloseBtn: "bg-green-200/90 border-green-400/60",
                  backCloseIcon: "text-green-800",
                  backText: "text-green-900",
                  backTextMuted: "text-green-700/70",
                  backMenuHover: "hover:bg-green-200/50",
                  backSocialBg: "bg-green-200/70 border-green-300/60"
                },
                // Card 3: Soft cream/yellow - with black headline (Session Violinist)
                {
                  bg: "from-amber-50 to-stone-50",
                  innerBg: "bg-amber-50",
                  border: "border-amber-400/60",
                  badge: "bg-amber-100/50 border-amber-200/40 text-amber-600",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-amber-100/20 text-amber-700",
                  buttonOutline: "border-amber-200 text-amber-500 hover:bg-amber-100/30",
                  statValue: "text-amber-500",
                  statLabel: "text-amber-400/70",
                  divider: "border-amber-200/40",
                  description: "text-stone-600",
                  textureColor: "#d97706",
                  // Back of card styles
                  backBg: "bg-amber-50",
                  backBorder: "border-amber-400/60",
                  backCloseBtn: "bg-amber-100/90 border-amber-300/60",
                  backCloseIcon: "text-amber-700",
                  backText: "text-amber-700",
                  backTextMuted: "text-amber-500/70",
                  backMenuHover: "hover:bg-amber-100/50",
                  backSocialBg: "bg-amber-100/70 border-amber-200/60"
                }
              ];

              const style = cardStyles[index];
              const isActiveCard = index === currentSlideIndex.value;

              return (
                <div key={index} class={`carousel-card-wrapper ${getCardClass()}`}>
                  {/* 3D Flip Card Container */}
                  <div class="flip-card-container">
                    <div class={`flip-card-inner ${isActiveCard && isFlipped.value ? 'flipped' : ''}`}>
                      {/* FRONT OF CARD */}
                      <div class="flip-card-front">
                        <div class={`relative bg-gradient-to-br ${style.bg} backdrop-blur-sm p-7 md:p-8 rounded-2xl border ${style.border} shadow-2xl`}>
                          {/* Texture overlay */}
                          <div
                            class="absolute inset-0 rounded-2xl pointer-events-none z-0"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='${encodeURIComponent(style.textureColor)}' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                            }}
                          ></div>
                          <div class="relative z-10 inline-block mb-4 -mt-3">
                            <span class={`px-3 py-1 rounded-full ${style.badge} text-xs font-medium tracking-wider uppercase`}>
                              {card.badge}
                            </span>
                          </div>
                          <h1 class="relative z-10 text-[2.625rem] md:text-5xl font-bold tracking-tight leading-tight mb-4">
                            <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>
                              {card.title[0]}
                            </span>
                            <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>
                              {card.title[1]}
                            </span>
                            <span class={`${style.titleLast} block`}>{card.title[2]}</span>
                          </h1>
                          {/* Card 1: Session Violinist / Card 2: Songwriter */}
                          {index === 0 ? (
                            <>
                              <p class={`relative z-10 text-xl ${style.description} mb-4 min-h-[3.5rem]`}>
                                {card.description} {t(locale, "expanded.weddings")}, {t(locale, "expanded.events")}, {t(locale, "expanded.funerals")}, {t(locale, "expanded.studioSessions")}, {t(locale, "expanded.customArrangements")}.
                              </p>

                              {/* Portfolio Grid */}
                              <div class={`relative z-10 mb-4 pt-4 border-t ${style.divider}`}>
                                <div class="grid grid-cols-2 gap-2">
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80"
                                      alt="Studio session"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80"
                                      alt="Wedding performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
                                      alt="Event performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80"
                                      alt="Concert performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Book Button */}
                              <a
                                href="mailto:book@phineasstewart.com"
                                class={`relative z-10 flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "service.bookSessionViolinist")}
                                <span class="inline-block transition-transform group-hover:translate-x-1">→</span>
                              </a>
                            </>
                          ) : (
                            <>
                              {/* Card 2: Songwriter with description and gallery */}
                              <p class={`relative z-10 text-xl ${style.description} mb-4`}>
                                {card.description} {t(locale, "expanded.artistDesc")}
                              </p>

                              {/* Portfolio Grid */}
                              <div class={`relative z-10 mb-4 pt-4 border-t ${style.divider}`}>
                                <div class="grid grid-cols-2 gap-2">
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80"
                                      alt="Performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                                      alt="Studio"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"
                                      alt="Concert"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.border}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
                                      alt="Live performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Listen on Spotify Button */}
                              <a
                                href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`relative z-10 flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "expanded.listenOnSpotify")}
                                <span class="inline-block transition-transform group-hover:translate-x-1">→</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* BACK OF CARD - Uses same color theme as front */}
                      <div
                        class="flip-card-back"
                        onTouchStart$={handleBackTouchStart}
                        onTouchEnd$={handleBackTouchEnd}
                      >
                        <div
                          class={`relative ${style.backBg} backdrop-blur-sm p-6 rounded-2xl border ${style.backBorder} shadow-2xl h-full`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='${encodeURIComponent(style.textureColor)}' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                          }}
                        >

                          {/* Close button */}
                          <button
                            onClick$={handleFlipBack}
                            class={`absolute top-4 right-4 z-10 p-2 rounded-full ${style.backCloseBtn} transition-all duration-200 hover:scale-110`}
                          >
                            <LuX class={`w-5 h-5 ${style.backCloseIcon}`} />
                          </button>


                          {/* Menu Back Content */}
                          {flipTarget.value === 'menu' && (
                            <div class="pt-2">
                              {/* Logo */}
                              <div class="mb-4">
                                <a href="/" class="focus:outline-none">
                                  <span
                                    class="text-4xl font-bold bg-gradient-to-r from-stone-700 via-amber-700 to-stone-700 bg-clip-text text-transparent"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                  >
                                    PS
                                  </span>
                                </a>
                              </div>

                              {/* Navigation */}
                              <nav class="space-y-1 max-h-[45vh] overflow-y-auto pr-2">
                                {menuItems.map((item, menuIdx) => (
                                  <div key={menuIdx}>
                                    <button
                                      onClick$={(e) => handleMenuItemClick(item.title, e)}
                                      class={`w-full text-left block px-3 py-2.5 rounded-lg text-lg font-medium ${style.backText} ${style.backMenuHover} transition-colors`}
                                    >
                                      {item.title}
                                    </button>
                                  </div>
                                ))}
                              </nav>

                              {/* Social Links */}
                              <div class={`mt-4 pt-4 border-t ${style.divider}`}>
                                <p class={`text-xs ${style.backTextMuted} text-center mb-3`}>Follow on</p>
                                <div class="flex justify-center gap-4">
                                  <a
                                    href="https://www.youtube.com/channel/UCeX217HOtpviekPVlEO8jJQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={`p-3 rounded-full ${style.backSocialBg} text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all duration-300`}
                                  >
                                    <LuYoutube class="w-6 h-6" />
                                  </a>
                                  <a
                                    href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={`p-3 rounded-full ${style.backSocialBg} text-green-600 hover:bg-green-50 hover:border-green-300 hover:scale-110 transition-all duration-300`}
                                  >
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                    </svg>
                                  </a>
                                  <a
                                    href="https://www.tiktok.com/@phineasstewart"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={`p-3 rounded-full ${style.backSocialBg} text-stone-800 hover:bg-stone-100 hover:border-stone-400 hover:scale-110 transition-all duration-300`}
                                  >
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                    </svg>
                                  </a>
                                  <a
                                    href="https://www.instagram.com/phineasstewart"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class={`p-3 rounded-full ${style.backSocialBg} text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-110 transition-all duration-300`}
                                  >
                                    <LuInstagram class="w-6 h-6" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Portfolio Back Content */}
                          {flipTarget.value === 'portfolio' && (
                            <div class="pt-2">
                              <h3 class={`text-xl font-bold ${style.backText} mb-4`}>Gallery Preview</h3>

                              {/* 2x2 Grid of images */}
                              <div class="grid grid-cols-2 gap-2 mb-4">
                                {cardVideos[index].map((img, imgIdx) => (
                                  <div key={imgIdx} class={`aspect-square rounded-lg overflow-hidden border ${style.backBorder}`}>
                                    <img
                                      src={img}
                                      alt={`Gallery ${imgIdx + 1}`}
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* View Full Gallery Link */}
                              <a
                                href="/gallery"
                                class={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                View Full Gallery
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* Booking Back Content */}
                          {flipTarget.value === 'booking' && (
                            <div class="pt-2">
                              <h3 class={`text-xl font-bold ${style.backText} mb-4`}>Contact Us</h3>

                              {/* Contact Info Cards */}
                              <div class="space-y-3 mb-4">
                                <div class={`flex items-start gap-3 p-3 rounded-lg ${style.backSocialBg}`}>
                                  <LuMapPin class={`w-5 h-5 ${style.backText} flex-shrink-0 mt-0.5`} />
                                  <div>
                                    <p class={`font-medium ${style.backText}`}>Address</p>
                                    <p class={`text-sm ${style.backTextMuted}`}>2567 Yonge St, Toronto, ON M4P 2J1</p>
                                  </div>
                                </div>

                                <div class={`flex items-start gap-3 p-3 rounded-lg ${style.backSocialBg}`}>
                                  <LuMail class={`w-5 h-5 ${style.backText} flex-shrink-0 mt-0.5`} />
                                  <div>
                                    <p class={`font-medium ${style.backText}`}>Email</p>
                                    <a href="mailto:hello@phineasstewart.com" class={`text-sm ${style.backTextMuted} hover:underline`}>
                                      hello@phineasstewart.com
                                    </a>
                                  </div>
                                </div>

                                <div class={`flex items-start gap-3 p-3 rounded-lg ${style.backSocialBg}`}>
                                  <LuClock class={`w-5 h-5 ${style.backText} flex-shrink-0 mt-0.5`} />
                                  <div>
                                    <p class={`font-medium ${style.backText}`}>Hours</p>
                                    <p class={`text-sm ${style.backTextMuted}`}>Mon-Fri: 10am-8pm</p>
                                    <p class={`text-sm ${style.backTextMuted}`}>Sat-Sun: 10am-6pm</p>
                                  </div>
                                </div>
                              </div>

                              {/* Book CTA */}
                              <a
                                href="mailto:book@phineasstewart.com"
                                class="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25"
                              >
                                <LuCalendar class="w-5 h-5" />
                                Book a Performance
                              </a>

                              {/* Contact Page Link */}
                              <a
                                href="mailto:book@phineasstewart.com"
                                class={`flex items-center justify-center gap-2 w-full mt-3 px-6 py-3 bg-transparent border-2 ${style.buttonOutline} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
                              >
                                View Contact Page
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* Session Violinist Expanded Content */}
                          {flipTarget.value === 'session-violinist' && (
                            <div class="pt-2">
                              <h3 class={`text-2xl font-bold ${style.backText} mb-2`}>{t(locale, "expanded.sessionViolinist")}</h3>
                              <p class={`text-lg ${style.backText} mb-2`}>
                                {t(locale, "expanded.sessionViolinistTagline")}
                              </p>
                              <p class={`text-base ${style.backTextMuted} leading-relaxed mb-4`}>
                                {t(locale, "expanded.sessionViolinistDesc")}
                              </p>

                              {/* Services Tags */}
                              <div class="mb-4">
                                <p class={`text-xs uppercase tracking-wide ${style.backTextMuted} mb-2`}>{t(locale, "expanded.services")}</p>
                                <div class="flex flex-wrap gap-2">
                                  <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>{t(locale, "expanded.weddings")}</span>
                                  <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>{t(locale, "expanded.events")}</span>
                                  <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>{t(locale, "expanded.funerals")}</span>
                                  <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>{t(locale, "expanded.studioSessions")}</span>
                                  <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>{t(locale, "expanded.customArrangements")}</span>
                                </div>
                              </div>

                              {/* Portfolio Grid */}
                              <div class="mb-4">
                                <div class="grid grid-cols-2 gap-2">
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.backBorder}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80"
                                      alt="Studio session"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.backBorder}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80"
                                      alt="Wedding performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* CTA */}
                              <a
                                href="mailto:book@phineasstewart.com"
                                class={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "service.bookSessionViolinist")}
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* Artist Profile Expanded Content */}
                          {flipTarget.value === 'live-performance' && (
                            <div class="pt-2">
                              <h3 class={`text-2xl font-bold ${style.backText} mb-3`}>{t(locale, "expanded.artistProfile")}</h3>

                              <p class={`text-base ${style.backTextMuted} leading-relaxed mb-3`}>
                                {t(locale, "expanded.artistJourney")}
                              </p>
                              <p class={`text-base ${style.backTextMuted} leading-relaxed mb-4`}>
                                {t(locale, "expanded.artistStyle")}
                              </p>

                              {/* Location Tags */}
                              <div class="flex flex-wrap gap-2 mb-4">
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>
                                  <LuMapPin class="w-3.5 h-3.5" />
                                  {t(locale, "expanded.fromNovaScotia")}
                                </span>
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${style.backSocialBg} ${style.backText}`}>
                                  <LuMapPin class="w-3.5 h-3.5" />
                                  {t(locale, "expanded.basedInMontreal")}
                                </span>
                              </div>

                              {/* Portfolio Grid */}
                              <div class="mb-4">
                                <div class="grid grid-cols-2 gap-2">
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.backBorder}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80"
                                      alt="Performance"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div class={`aspect-video rounded-lg overflow-hidden border ${style.backBorder}`}>
                                    <img
                                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                                      alt="Studio"
                                      class="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* CTA */}
                              <a
                                href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "expanded.listenOnSpotify")}
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Desktop Layout - Simple Hero */}
        <div class="hidden lg:block w-full max-w-7xl mx-auto px-4">
          {(() => {
            const card = heroCards[0]; // Show first card
            const ds = {
              leftBg: "from-stone-100/95 to-stone-50/95",
              leftInner: "bg-stone-50/90",
              rightBg: "from-stone-50/95 to-stone-100/95",
              rightInner: "bg-stone-100/90",
              imageBorder: "border-stone-400/60",
              badge: "bg-stone-100/70 border-stone-300/50 text-stone-600",
              title: "from-gray-900 via-gray-800 to-gray-900",
              titleMiddle: "text-gray-900",
              titleLast: "text-gray-900",
              description: "text-stone-600",
              button: "from-stone-200 to-stone-300 hover:from-stone-300 hover:to-stone-400 shadow-stone-200/20 text-stone-700",
              buttonOutline: "border-stone-300 text-stone-600 hover:bg-stone-200/30",
              statValue: "text-stone-600",
              statLabel: "text-stone-500/70",
              divider: "border-stone-200/50"
            };

            return (
              <div class="grid grid-cols-2 gap-8 py-12">
                {/* Left: Messaging */}
                <div class="flex flex-col justify-center">
                  <div class="inline-block mb-4">
                    <span class={`px-4 py-2 rounded-full ${ds.badge} text-sm font-medium tracking-wider uppercase`}>
                      {card.badge}
                    </span>
                  </div>

                  <h1 class="text-4xl xl:text-6xl font-bold tracking-tight leading-tight mb-4">
                    <span class={`bg-gradient-to-r ${ds.title} bg-clip-text text-transparent`}>
                      {card.title[0]}
                    </span>
                    <br />
                    <span class={ds.titleMiddle}>{card.title[1]}</span>
                    <br />
                    <span class={`bg-gradient-to-r ${ds.titleLast} bg-clip-text text-transparent`}>
                      {card.title[2]}
                    </span>
                  </h1>

                  <p class={`text-base xl:text-lg ${ds.description} mb-6 max-w-md`}>
                    {card.description}
                  </p>

                  <div class="flex flex-col gap-3 mb-6">
                    <a
                      href="/gallery"
                      class={`group/btn px-6 py-3 bg-gradient-to-r ${ds.button} font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-center`}
                    >
                      {t(locale, "button.learnMore")}
                      <span class="inline-block ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                    </a>
                    <a
                      href="mailto:book@phineasstewart.com"
                      class={`px-6 py-3 bg-transparent border-2 ${ds.buttonOutline} font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-center`}
                    >
                      {t(locale, "hero.bookSession")}
                    </a>
                  </div>

                  <div class={`grid grid-cols-3 gap-4 pt-4 border-t ${ds.divider}`}>
                    {card.stats.map((stat, idx) => (
                      <div key={idx}>
                        <div class={`text-2xl xl:text-3xl font-bold ${ds.statValue}`}>{stat.value}</div>
                        <div class={`text-xs ${ds.statLabel} uppercase tracking-wide`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Image */}
                <div class="flex items-center justify-center">
                  <div class={`relative border-2 ${ds.imageBorder} rounded-xl overflow-hidden w-full aspect-square shadow-2xl`}>
                    {cardVideos[0].map((img, idx) => (
                      <div
                        key={idx}
                        class={`absolute inset-0 transition-all duration-700 ${
                          idx === rightColumnImageIndex.value
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-110'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          class="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div class="absolute inset-0 bg-gradient-to-br from-stone-950/20 via-transparent to-stone-950/40"></div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

    </section>
  );
});