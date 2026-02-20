import { component$, useSignal, useVisibleTask$, useStyles$, $ } from "@builder.io/qwik";
import { menuItems } from "./MenuModal";
import IconHamburger from "../icons/IconHamburger";
import IconChevronDown from "../icons/IconChevronDown";
import { LuX, LuChevronRight, LuMapPin, LuMail, LuClock, LuInstagram, LuYoutube, LuCalendar } from "@qwikest/icons/lucide";
import { useI18n, setLanguage as setLang, type Language, t } from "~/context/i18n";
import LandingCards from "../LandingCards";

type FlipTarget = 'none' | 'menu' | 'portfolio' | 'booking' | 'session-violinist' | 'live-performance' | 'my-music';

export default component$(() => {
  const carouselIndex = useSignal(0);
  const isAutoPlaying = useSignal(true);
  const currentSlideIndex = useSignal(0);
  const hasCycledOnce = useSignal(false);
  const slideTickCount = useSignal(0);
  const rightColumnImageIndex = useSignal(0);
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  // 3D Flip card state
  const isFlipped = useSignal<boolean>(false);
  const flipTarget = useSignal<FlipTarget>('none');
  const flipTouchStartX = useSignal<number>(0);
  const flipTouchStartY = useSignal<number>(0);

  // Menu accordion state for flip card
  const menuOpenIndex = useSignal<number | null>(null);

  // Video play state for thumbnail click-to-play
  const videoPlaying = useSignal<boolean>(false);

  // Expanded gallery item state: { cardIndex, itemIndex } or null
  const expandedGalleryItem = useSignal<{ card: number; item: number } | null>(null);

  // Desktop bento card expanded state: 'none' | 'studio' | 'artist' | 'music'
  const desktopBentoExpanded = useSignal<'none' | 'studio' | 'artist' | 'music'>('none');

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
      perspective: 1000px;
      touch-action: pan-y;
      user-select: none;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      will-change: transform;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .carousel-card-wrapper {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center center;
      visibility: hidden;
      will-change: transform, opacity;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .carousel-card-wrapper.active {
      position: relative;
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
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      will-change: transform;
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
      flipTarget.value = 'my-music';
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
    <section class="relative flex items-center justify-center overflow-clip pt-0 pb-0 lg:pb-4">
      {/* Floating decorations */}
      <div class="absolute top-20 left-10 w-32 h-32 bg-stone-400/15 rounded-full blur-2xl animate-float" aria-hidden="true"></div>
      <div class="absolute top-40 right-20 w-48 h-48 bg-gray-300/15 rounded-full blur-3xl animate-floatx" aria-hidden="true"></div>
      <div class="absolute bottom-20 left-1/3 w-40 h-40 bg-stone-300/15 rounded-full blur-2xl animate-float" aria-hidden="true"></div>

      <div class="relative z-10 w-full mx-auto px-2.5 pt-2 pb-1 lg:px-4 lg:pt-0 lg:pb-8">
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
                        ? 'border-slate-400 bg-slate-200/40 hover:bg-slate-300/50'
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
                      ? 'border-slate-400 bg-slate-200/40 hover:bg-slate-300/50'
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
                  bg: "from-stone-200 to-stone-100",
                  innerBg: "bg-stone-100",
                  border: "border-stone-500/60",
                  badge: "bg-stone-200/70 border-stone-400/50 text-stone-700",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-stone-300 to-stone-400 hover:from-stone-400 hover:to-stone-500 shadow-stone-300/20 text-stone-800",
                  buttonOutline: "border-stone-400 text-stone-700 hover:bg-stone-300/30",
                  statValue: "text-stone-700",
                  statLabel: "text-stone-600/70",
                  divider: "border-stone-300/50",
                  description: "text-stone-700",
                  textureColor: "#2c2825",
                  // Back of card styles
                  backBg: "bg-stone-200",
                  backBorder: "border-stone-500/60",
                  backCloseBtn: "bg-stone-100/90 border-stone-500/60",
                  backCloseIcon: "text-stone-700",
                  backText: "text-stone-700",
                  backTextMuted: "text-stone-600/70",
                  backMenuHover: "hover:bg-stone-300/50",
                  backSocialBg: "bg-stone-300/70 border-stone-400/60"
                },
                // Card 2: Navy blue - with black headline (Artist Profile)
                {
                  bg: "from-slate-300 to-slate-200",
                  innerBg: "bg-slate-200",
                  border: "border-slate-500/60",
                  badge: "bg-slate-300/70 border-slate-400/50 text-slate-800",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 shadow-slate-300/20 text-slate-900",
                  buttonOutline: "border-slate-500 text-slate-800 hover:bg-slate-300/30",
                  statValue: "text-slate-800",
                  statLabel: "text-slate-700/70",
                  divider: "border-slate-400/50",
                  description: "text-slate-800",
                  textureColor: "#1e293b",
                  // Back of card styles
                  backBg: "bg-slate-300",
                  backBorder: "border-slate-500/60",
                  backCloseBtn: "bg-slate-200/90 border-slate-500/60",
                  backCloseIcon: "text-slate-800",
                  backText: "text-slate-800",
                  backTextMuted: "text-slate-700/70",
                  backMenuHover: "hover:bg-slate-400/50",
                  backSocialBg: "bg-slate-400/70 border-slate-500/60"
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
                        <div class={`relative bg-gradient-to-br ${style.bg} backdrop-blur-sm p-4 md:p-5 rounded-2xl border ${style.border} shadow-2xl`}>
                          {/* Texture overlay */}
                          <div
                            class="absolute inset-0 rounded-2xl pointer-events-none z-0"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='${encodeURIComponent(style.textureColor)}' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                            }}
                          ></div>
                          {/* Text content container with semi-transparent background */}
                          <div class={`relative z-10 ${index === 0 ? 'bg-stone-100/50' : 'bg-slate-200/50'} backdrop-blur-[2px] rounded-xl px-4 py-3 mb-2 -mx-1`}>
                            <div class="inline-block mb-3 -mt-1">
                              <span class={`px-3 py-1 rounded-full ${style.badge} text-xs font-medium tracking-wider uppercase`}>
                                {card.badge}
                              </span>
                            </div>
                            <h1 class="text-[2.625rem] md:text-5xl font-bold tracking-tight leading-tight mb-3">
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
                              <p class={`text-xl ${style.description}`}>
                                {card.description} {t(locale, "hero.sessionAvailable")}
                              </p>
                            ) : (
                              <p class={`text-xl ${style.description}`}>
                                {card.description} {t(locale, "hero.artistRoots")}
                              </p>
                            )}
                          </div>
                          {/* Card 1: Session Violinist / Card 2: Songwriter */}
                          {index === 0 ? (
                            <>

                              {/* Portfolio Grid */}
                              <div class={`relative z-10 mb-4 pt-2 border-t ${style.divider}`}>
                                <div class="relative">
                                  {/* Expanded View */}
                                  {expandedGalleryItem.value?.card === 0 && (
                                    <div class="absolute inset-0 z-20 rounded-lg overflow-hidden animate-in fade-in duration-200">
                                      <button
                                        onClick$={() => {
                                          const wasVideo = expandedGalleryItem.value?.item === 2 || expandedGalleryItem.value?.item === 3;
                                          expandedGalleryItem.value = null;
                                          if (wasVideo) videoPlaying.value = false;
                                        }}
                                        class="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                      >
                                        <LuX class="w-4 h-4 text-white" />
                                      </button>
                                      {expandedGalleryItem.value.item === 0 && (
                                        <img src="/images/sv3.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 1 && (
                                        <img src="/images/sv2.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 2 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/rFRBV-bvkTI?autoplay=1"
                                          title="Session violinist video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                      {expandedGalleryItem.value.item === 3 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/dl6sZEikzz0?autoplay=1"
                                          title="Session violinist video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                    </div>
                                  )}
                                  {/* Grid */}
                                  <div class={`grid grid-cols-2 gap-2 ${expandedGalleryItem.value?.card === 0 ? 'invisible' : ''}`}>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 0, item: 0 }}
                                    >
                                      <img src="/images/sv3.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 0, item: 1 }}
                                    >
                                      <img src="/images/sv2.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 0, item: 2 }}
                                    >
                                      <img src="https://img.youtube.com/vi/rFRBV-bvkTI/hqdefault.jpg" alt="Session violinist video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 0, item: 3 }}
                                    >
                                      <img src="https://img.youtube.com/vi/dl6sZEikzz0/hqdefault.jpg" alt="Session violinist video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
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
                              {/* Portfolio Grid */}
                              <div class={`relative z-10 mb-4 pt-2 border-t ${style.divider}`}>
                                <div class="relative">
                                  {/* Expanded View */}
                                  {expandedGalleryItem.value?.card === 1 && (
                                    <div class="absolute inset-0 z-20 rounded-lg overflow-hidden animate-in fade-in duration-200">
                                      <button
                                        onClick$={() => expandedGalleryItem.value = null}
                                        class="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                      >
                                        <LuX class="w-4 h-4 text-white" />
                                      </button>
                                      {expandedGalleryItem.value.item === 0 && (
                                        <img src="/images/ap1.jpg" alt="Performance" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 1 && (
                                        <img src="/images/ap2.jpg" alt="Studio" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 2 && (
                                        <img src="/images/ap3.JPEG" alt="Concert" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 3 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/06YplsNk_ro?autoplay=1"
                                          title="Artist profile video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                    </div>
                                  )}
                                  {/* Grid */}
                                  <div class={`grid grid-cols-2 gap-2 ${expandedGalleryItem.value?.card === 1 ? 'invisible' : ''}`}>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 1, item: 0 }}
                                    >
                                      <img src="/images/ap1.jpg" alt="Performance" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 1, item: 1 }}
                                    >
                                      <img src="/images/ap2.jpg" alt="Studio" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 1, item: 2 }}
                                    >
                                      <img src="/images/ap3.JPEG" alt="Concert" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${style.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 1, item: 3 }}
                                    >
                                      <img src="https://img.youtube.com/vi/06YplsNk_ro/hqdefault.jpg" alt="Artist profile video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Listen to My Music Button */}
                              <a
                                href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`relative z-10 flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "expanded.listenToMyMusic")}
                                <span class="inline-block transition-transform group-hover:translate-x-1">→</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* BACK OF CARD - Always stone theme for menu, card theme for others */}
                      <div
                        class="flip-card-back"
                        onTouchStart$={handleBackTouchStart}
                        onTouchEnd$={handleBackTouchEnd}
                      >
                        {/* Use stone styles for menu/session-violinist, slate for artist profile, card styles for others */}
                        {(() => {
                          const isStoneTheme = flipTarget.value === 'menu' || flipTarget.value === 'session-violinist';
                          const isSlateTheme = flipTarget.value === 'live-performance';
                          const backStyle = isStoneTheme ? {
                            bg: "bg-stone-200",
                            border: "border-stone-500/60",
                            closeBtn: "bg-stone-100/90 border-stone-500/60",
                            closeIcon: "text-stone-700",
                            text: "text-stone-700",
                            textMuted: "text-stone-600/70",
                            menuHover: "hover:bg-stone-300/50",
                            socialBg: "bg-stone-300/70 border-stone-400/60",
                            textureColor: "#2c2825",
                            divider: "border-stone-300/50",
                            button: "from-stone-300 to-stone-400 hover:from-stone-400 hover:to-stone-500 shadow-stone-300/20 text-stone-800"
                          } : isSlateTheme ? {
                            bg: "bg-slate-300",
                            border: "border-slate-500/60",
                            closeBtn: "bg-slate-200/90 border-slate-500/60",
                            closeIcon: "text-slate-800",
                            text: "text-slate-800",
                            textMuted: "text-slate-700/70",
                            menuHover: "hover:bg-slate-400/50",
                            socialBg: "bg-slate-400/70 border-slate-500/60",
                            textureColor: "#1e293b",
                            divider: "border-slate-400/50",
                            button: "from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 shadow-slate-400/20 text-white"
                          } : {
                            bg: style.backBg,
                            border: style.backBorder,
                            closeBtn: style.backCloseBtn,
                            closeIcon: style.backCloseIcon,
                            text: style.backText,
                            textMuted: style.backTextMuted,
                            menuHover: style.backMenuHover,
                            socialBg: style.backSocialBg,
                            textureColor: style.textureColor,
                            divider: style.divider,
                            button: style.button
                          };
                          return (
                        <div
                          class={`relative backdrop-blur-sm pt-2 pb-3 px-3 md:pt-3 md:pb-4 md:px-4 rounded-2xl shadow-2xl h-full ${backStyle.bg} border ${backStyle.border}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='${encodeURIComponent(backStyle.textureColor)}' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                          }}
                        >
                          {/* Close button */}
                          <button
                            onClick$={handleFlipBack}
                            class={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110 ${backStyle.closeBtn}`}
                          >
                            <LuX class={`w-5 h-5 ${backStyle.closeIcon}`} />
                          </button>


                          {/* Menu Back Content */}
                          {flipTarget.value === 'menu' && (
                            <div class="pt-2">
                              {/* Logo and Navigation container */}
                              <div class="bg-stone-100/50 backdrop-blur-[2px] rounded-xl p-2 mb-2">
                                {/* Logo */}
                                <div class="mb-4">
                                  <a href="/" class="focus:outline-none">
                                    <span class="inline-block px-4 py-1.5 rounded-full bg-stone-300/70 border-stone-400/60 text-stone-700 text-lg font-medium tracking-wide">
                                      Phineas Stewart
                                    </span>
                                  </a>
                                </div>

                                {/* Navigation */}
                                <nav class="space-y-1 max-h-[45vh] overflow-y-auto pr-2">
                                  {menuItems.filter(item => item.title !== "Updates").map((item, menuIdx) => (
                                    <div key={menuIdx}>
                                      <button
                                        onClick$={(e) => handleMenuItemClick(item.title, e)}
                                        class="w-full text-left block px-3 py-2.5 rounded-lg text-lg font-medium text-stone-700 hover:bg-stone-300/50 transition-colors"
                                      >
                                        {item.title}
                                      </button>
                                    </div>
                                  ))}
                                </nav>

                                {/* Action Button */}
                                <div class="mt-4 pt-4 border-t border-stone-300/50">
                                  <a
                                    href="mailto:book@phineasstewart.com"
                                    class="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-stone-300 to-stone-400 hover:from-stone-400 hover:to-stone-500 text-stone-800 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02]"
                                  >
                                    <LuCalendar class="w-4 h-4" />
                                    <span>Book Session Violinist</span>
                                  </a>
                                </div>

                                {/* Social Links */}
                                <div class="mt-3 pt-3 border-t border-stone-300/50">
                                  <div class="flex justify-center gap-4">
                                    <a
                                      href="https://www.youtube.com/channel/UCeX217HOtpviekPVlEO8jJQ"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="p-3 rounded-full bg-stone-300/70 border-stone-400/60 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all duration-300"
                                    >
                                      <LuYoutube class="w-6 h-6" />
                                    </a>
                                    <a
                                      href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="p-3 rounded-full bg-stone-300/70 border-stone-400/60 text-green-600 hover:bg-green-50 hover:border-green-300 hover:scale-110 transition-all duration-300"
                                    >
                                      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                      </svg>
                                    </a>
                                    <a
                                      href="https://www.tiktok.com/@phineasstewart"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="p-3 rounded-full bg-stone-300/70 border-stone-400/60 text-stone-700 hover:scale-110 transition-all duration-300"
                                    >
                                      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                      </svg>
                                    </a>
                                    <a
                                      href="https://www.instagram.com/phineasstewart"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="p-3 rounded-full bg-stone-300/70 border-stone-400/60 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-110 transition-all duration-300"
                                    >
                                      <LuInstagram class="w-6 h-6" />
                                    </a>
                                  </div>
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
                              {/* Text container - always stone for session violinist */}
                              <div class="bg-stone-100/50 backdrop-blur-[2px] rounded-xl px-3 py-2.5 mb-2">
                                <h3 class={`text-2xl font-bold ${backStyle.text} mb-2`}>{t(locale, "expanded.sessionViolinist")}</h3>
                                <p class={`text-lg ${backStyle.text} mb-2`}>
                                  {t(locale, "expanded.sessionViolinistTagline")}
                                </p>
                                <p class={`text-base ${backStyle.textMuted} leading-relaxed mb-3`}>
                                  {t(locale, "expanded.sessionViolinistDesc")}
                                </p>

                                {/* Services Tags */}
                                <div>
                                  <p class={`text-xs uppercase tracking-wide ${backStyle.textMuted} mb-2`}>{t(locale, "expanded.services")}</p>
                                  <div class="flex flex-wrap gap-2">
                                    <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>{t(locale, "expanded.weddings")}</span>
                                    <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>{t(locale, "expanded.events")}</span>
                                    <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>{t(locale, "expanded.funerals")}</span>
                                    <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>{t(locale, "expanded.studioSessions")}</span>
                                    <span class={`px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>{t(locale, "expanded.customArrangements")}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Portfolio Grid */}
                              <div class="mb-4">
                                <div class="relative">
                                  {/* Expanded View */}
                                  {expandedGalleryItem.value?.card === 2 && (
                                    <div class="absolute inset-0 z-20 rounded-lg overflow-hidden animate-in fade-in duration-200">
                                      <button
                                        onClick$={() => expandedGalleryItem.value = null}
                                        class="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                      >
                                        <LuX class="w-4 h-4 text-white" />
                                      </button>
                                      {expandedGalleryItem.value.item === 0 && (
                                        <img src="/images/sv3.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 1 && (
                                        <img src="/images/sv2.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 2 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/rFRBV-bvkTI?autoplay=1"
                                          title="Session violinist video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                      {expandedGalleryItem.value.item === 3 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/dl6sZEikzz0?autoplay=1"
                                          title="Session violinist video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                    </div>
                                  )}
                                  {/* Grid */}
                                  <div class={`grid grid-cols-2 gap-2 ${expandedGalleryItem.value?.card === 2 ? 'invisible' : ''}`}>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 2, item: 0 }}
                                    >
                                      <img src="/images/sv3.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 2, item: 1 }}
                                    >
                                      <img src="/images/sv2.JPG" alt="Session violinist" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 2, item: 2 }}
                                    >
                                      <img src="https://img.youtube.com/vi/rFRBV-bvkTI/hqdefault.jpg" alt="Session violinist video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 2, item: 3 }}
                                    >
                                      <img src="https://img.youtube.com/vi/dl6sZEikzz0/hqdefault.jpg" alt="Session violinist video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* CTA */}
                              <a
                                href="mailto:book@phineasstewart.com"
                                class={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${backStyle.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "service.bookSessionViolinist")}
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* Artist Profile Expanded Content */}
                          {flipTarget.value === 'live-performance' && (
                            <div class="pt-2">
                              {/* Text container - always slate for artist profile */}
                              <div class="bg-slate-100/50 backdrop-blur-[2px] rounded-xl px-3 py-2 mb-2">
                                <h3 class={`text-xl font-bold ${backStyle.text} mb-1.5`}>{t(locale, "expanded.artistProfile")}</h3>

                                <p class={`text-sm ${backStyle.textMuted} leading-snug mb-1`}>
                                  {t(locale, "expanded.artistJourney")}
                                </p>
                                <p class={`text-sm ${backStyle.textMuted} leading-snug`}>
                                  {t(locale, "expanded.artistStyle")}
                                </p>
                              </div>

                              {/* Location Tags */}
                              <div class="flex flex-wrap gap-2 mb-4">
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>
                                  <LuMapPin class="w-3.5 h-3.5" />
                                  {t(locale, "expanded.fromNovaScotia")}
                                </span>
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${backStyle.socialBg} ${backStyle.text}`}>
                                  <LuMapPin class="w-3.5 h-3.5" />
                                  {t(locale, "expanded.basedInMontreal")}
                                </span>
                              </div>

                              {/* Portfolio Grid */}
                              <div class="mb-4">
                                <div class="relative">
                                  {/* Expanded View */}
                                  {expandedGalleryItem.value?.card === 3 && (
                                    <div class="absolute inset-0 z-20 rounded-lg overflow-hidden animate-in fade-in duration-200">
                                      <button
                                        onClick$={() => expandedGalleryItem.value = null}
                                        class="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                      >
                                        <LuX class="w-4 h-4 text-white" />
                                      </button>
                                      {expandedGalleryItem.value.item === 0 && (
                                        <img src="/images/ap1.jpg" alt="Performance" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 1 && (
                                        <img src="/images/ap2.jpg" alt="Studio" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 2 && (
                                        <img src="/images/ap3.JPEG" alt="Concert" class="w-full h-full object-cover" />
                                      )}
                                      {expandedGalleryItem.value.item === 3 && (
                                        <iframe
                                          src="https://www.youtube.com/embed/06YplsNk_ro?autoplay=1"
                                          title="Artist profile video"
                                          class="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullscreen
                                        ></iframe>
                                      )}
                                    </div>
                                  )}
                                  {/* Grid */}
                                  <div class={`grid grid-cols-2 gap-2 ${expandedGalleryItem.value?.card === 3 ? 'invisible' : ''}`}>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 3, item: 0 }}
                                    >
                                      <img src="/images/ap1.jpg" alt="Performance" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 3, item: 1 }}
                                    >
                                      <img src="/images/ap2.jpg" alt="Studio" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity`}
                                      onClick$={() => expandedGalleryItem.value = { card: 3, item: 2 }}
                                    >
                                      <img src="/images/ap3.JPEG" alt="Concert" class="w-full h-full object-cover" />
                                    </div>
                                    <div
                                      class={`aspect-video rounded-lg overflow-hidden border ${backStyle.border} cursor-pointer hover:opacity-90 transition-opacity relative`}
                                      onClick$={() => expandedGalleryItem.value = { card: 3, item: 3 }}
                                    >
                                      <img src="https://img.youtube.com/vi/06YplsNk_ro/hqdefault.jpg" alt="Artist profile video" class="w-full h-full object-cover" />
                                      <div class="absolute bottom-1.5 left-1.5 bg-black/70 rounded-full p-1 z-10">
                                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* CTA */}
                              <a
                                href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r ${backStyle.button} font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105`}
                              >
                                {t(locale, "expanded.listenToMyMusic")}
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* My Music - Streaming Links */}
                          {flipTarget.value === 'my-music' && (
                            <div class="pt-2">
                              {/* Header */}
                              <div class="bg-stone-100/50 backdrop-blur-[2px] rounded-xl px-3 py-2.5 mb-3">
                                <h3 class={`text-xl font-bold ${backStyle.text} mb-1`}>{t(locale, "service.myMusic")}</h3>
                                <p class={`text-sm ${backStyle.textMuted}`}>
                                  {t(locale, "expanded.listenOnPlatforms")}
                                </p>
                              </div>

                              {/* Streaming Links */}
                              <div class="space-y-2">
                                {/* Spotify */}
                                <a
                                  href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa?si=gJGmImiyRO-q6Y0bQLmzOg"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                  </svg>
                                  <span>Spotify</span>
                                  <LuChevronRight class="w-5 h-5 ml-auto" />
                                </a>

                                {/* Apple Music */}
                                <a
                                  href="https://music.apple.com/ca/artist/phineas-stewart/1717275618"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
                                  </svg>
                                  <span>Apple Music</span>
                                  <LuChevronRight class="w-5 h-5 ml-auto" />
                                </a>

                                {/* YouTube Music */}
                                <a
                                  href="https://music.youtube.com/channel/UCg9YF9SN504fQCvjf0ra_XQ?si=zethm1ZVPTYsRqHU"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                                  </svg>
                                  <span>YouTube Music</span>
                                  <LuChevronRight class="w-5 h-5 ml-auto" />
                                </a>

                                {/* Amazon Music */}
                                <a
                                  href="https://music.amazon.com/artists/B09XX8QJDN/phineas-stewart"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 0 1-.753.072c-1.06-.879-1.25-1.286-1.831-2.121-1.748 1.784-2.988 2.318-5.254 2.318-2.683 0-4.77-1.656-4.77-4.968 0-2.586 1.401-4.347 3.403-5.209 1.735-.755 4.159-.891 6.011-1.099v-.411c0-.755.058-1.646-.385-2.298-.385-.58-1.124-.82-1.772-.82-1.205 0-2.276.618-2.539 1.897-.054.284-.262.564-.548.578l-3.068-.332c-.259-.058-.545-.266-.473-.66.71-3.735 4.088-4.863 7.112-4.863 1.547 0 3.568.411 4.786 1.581 1.547 1.437 1.399 3.352 1.399 5.437v4.923c0 1.48.616 2.13 1.196 2.929.203.288.247.63-.011.843-.647.541-1.799 1.545-2.432 2.107l-.072-.067zM21.779 20.332c-1.414 1.104-3.456 1.685-5.209 1.685-2.465 0-4.682-.912-6.359-2.429-.131-.119-.014-.281.144-.189 1.812 1.054 4.056 1.686 6.372 1.686 1.563 0 3.282-.324 4.863-.995.239-.102.439.157.189.242zM22.8 18.999c-.179-.228-1.178-.108-1.629-.054-.136.017-.157-.102-.034-.189.798-.559 2.107-.398 2.26-.211.151.189-.041 1.499-.788 2.125-.114.096-.224.044-.173-.082.168-.421.545-1.36.364-1.589z"/>
                                  </svg>
                                  <span>Amazon Music</span>
                                  <LuChevronRight class="w-5 h-5 ml-auto" />
                                </a>

                                {/* Tidal */}
                                <a
                                  href="https://tidal.com/artist/43916985/u"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-stone-800 to-stone-900 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zm4.004 4.004l4.004-4.004L24.024 7.996l-4.004 4.004-4.004-4.004z"/>
                                  </svg>
                                  <span>Tidal</span>
                                  <LuChevronRight class="w-5 h-5 ml-auto" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* LandingCards directly under mobile hero stack */}
          <div class="-mt-8">
            <LandingCards />
          </div>

        </div>

        {/* Desktop Layout - Stacked Cards + Landing Cards + Actions */}
        <div class="hidden lg:block w-full max-w-7xl mx-auto px-4 py-8">
          <div class="grid grid-cols-12 gap-4">
            {/* Left: Stacked Hero Cards */}
            <div class="col-span-5">
              <div class="relative" style="min-height: 580px;">
                {/* Card Stack */}
                {heroCards.map((card, index) => {
                  const cardStyles = [
                    {
                      bg: "from-stone-200 to-stone-100",
                      innerBg: "bg-stone-50/90",
                      border: "border-stone-400/60",
                      badge: "bg-stone-200/70 border-stone-400/50 text-stone-700",
                      title: "from-gray-900 via-gray-800 to-gray-900",
                      description: "text-stone-700",
                      button: "from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800",
                      divider: "border-stone-300/40",
                      textureColor: "#2c2825",
                      statText: "text-stone-800",
                      statLabel: "text-stone-500",
                      heroImage: "/images/sv3.JPG",
                      thumbImages: ["/images/sv2.JPG", "https://img.youtube.com/vi/rFRBV-bvkTI/hqdefault.jpg", "https://img.youtube.com/vi/dl6sZEikzz0/hqdefault.jpg"],
                      videoIndexes: [1, 2],
                      ctaText: "service.bookSessionViolinist",
                      ctaLink: "mailto:book@phineasstewart.com",
                      gradientFrom: "from-stone-200",
                      isExternal: false
                    },
                    {
                      bg: "from-slate-300 to-slate-200",
                      innerBg: "bg-slate-50/90",
                      border: "border-slate-400/60",
                      badge: "bg-slate-300/70 border-slate-400/50 text-slate-800",
                      title: "from-gray-900 via-gray-800 to-gray-900",
                      description: "text-slate-800",
                      button: "from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800",
                      divider: "border-slate-300/40",
                      textureColor: "#1e293b",
                      statText: "text-slate-800",
                      statLabel: "text-slate-500",
                      heroImage: "/images/ap1.jpg",
                      thumbImages: ["/images/ap2.jpg", "/images/ap3.JPEG", "https://img.youtube.com/vi/06YplsNk_ro/hqdefault.jpg"],
                      videoIndexes: [2],
                      ctaText: "expanded.listenToMyMusic",
                      ctaLink: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa",
                      gradientFrom: "from-slate-200",
                      isExternal: true
                    }
                  ];
                  const style = cardStyles[index];

                  const getDesktopStackClass = () => {
                    const current = currentSlideIndex.value;
                    if (index === current) return 'z-30 opacity-100 translate-y-0 scale-100 rotate-0';
                    if (index === (current + 1) % heroCards.length) return 'z-20 opacity-80 -translate-y-3 scale-[0.97] rotate-1 pointer-events-none';
                    return 'z-10 opacity-60 -translate-y-6 scale-[0.94] -rotate-1 pointer-events-none';
                  };

                  return (
                    <div
                      key={index}
                      class={`absolute inset-x-0 top-0 transition-all duration-500 ease-out ${getDesktopStackClass()}`}
                    >
                      <div
                        class={`relative bg-gradient-to-br ${style.bg} backdrop-blur-sm rounded-2xl border ${style.border} shadow-xl overflow-hidden`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='${encodeURIComponent(style.textureColor)}' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                        }}
                      >
                        {/* Hero Image */}
                        <div class="relative h-56 overflow-hidden">
                          <img src={style.heroImage} alt={card.badge} class="w-full h-full object-cover" loading="eager" />
                          <div class={`absolute inset-0 bg-gradient-to-t ${style.gradientFrom} via-transparent to-transparent`} />
                        </div>

                        {/* Content */}
                        <div class="p-5 -mt-14 relative z-10">
                          <div class={`${style.innerBg} backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/30`}>
                            <span class={`inline-block px-2.5 py-1 rounded-full ${style.badge} text-xs font-medium tracking-wider uppercase mb-3`}>
                              {card.badge}
                            </span>

                            <h2 class="text-2xl font-bold tracking-tight leading-tight mb-3">
                              <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>{card.title[0]}</span>
                              <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>{card.title[1]}</span>
                            </h2>

                            <p class={`text-sm ${style.description} mb-4 line-clamp-3`}>{card.description}</p>

                            <a
                              href={style.ctaLink}
                              target={style.isExternal ? "_blank" : undefined}
                              rel={style.isExternal ? "noopener noreferrer" : undefined}
                              class={`group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${style.button} text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                            >
                              {t(locale, style.ctaText as any)}
                              <span class="transition-transform group-hover/btn:translate-x-1">→</span>
                            </a>
                          </div>
                        </div>

                        {/* Thumbnails */}
                        <div class="px-5 pb-5">
                          <div class="grid grid-cols-3 gap-2">
                            {style.thumbImages.map((img, imgIdx) => (
                              <div key={imgIdx} class="aspect-video rounded-lg overflow-hidden border border-white/20 shadow-sm relative group/thumb">
                                <img src={img} alt="" class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" loading="eager" />
                                {style.videoIndexes.includes(imgIdx) && (
                                  <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                                      <svg class="w-2.5 h-2.5 text-stone-700 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div class="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick$={() => { currentSlideIndex.value = (currentSlideIndex.value - 1 + heroCards.length) % heroCards.length; }}
                  class="p-1.5 rounded-full bg-stone-200/80 border border-stone-300 hover:bg-stone-300 transition-all duration-300 hover:scale-110"
                >
                  <svg class="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div class="flex items-center gap-1.5">
                  {heroCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick$={() => { currentSlideIndex.value = idx; }}
                      class={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlideIndex.value ? "w-5 bg-stone-700" : "w-1.5 bg-stone-400/50 hover:bg-stone-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick$={() => { currentSlideIndex.value = (currentSlideIndex.value + 1) % heroCards.length; }}
                  class="p-1.5 rounded-full bg-stone-200/80 border border-stone-300 hover:bg-stone-300 transition-all duration-300 hover:scale-110"
                >
                  <svg class="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Middle: Landing Cards Bento */}
            <div class="col-span-5">
              {/* Grid View */}
              {desktopBentoExpanded.value === 'none' ? (
                <div class="grid grid-cols-2 grid-rows-3 gap-3 h-full">
                  {/* New Single - Large */}
                  <a href="https://distrokid.com/hyperfollow/phineasstewart/seagulls-in-the-city" target="_blank" rel="noopener noreferrer"
                    class="col-span-2 row-span-1 group relative rounded-2xl overflow-hidden border border-stone-300/60 shadow-lg hover:shadow-xl transition-all duration-300">
                    <img src="/images/ap2.jpg" alt="New Single" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
                    <div class="absolute inset-0 flex flex-col justify-end p-4">
                      <span class="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">New Release</span>
                      <h3 class="text-white text-lg font-bold mb-0.5">Seagulls in the City</h3>
                      <span class="text-white/80 text-sm">Pre-save now →</span>
                    </div>
                  </a>

                  {/* Studio Sessions */}
                  <button
                    onClick$={() => { desktopBentoExpanded.value = 'studio'; }}
                    class="col-span-1 row-span-1 group relative rounded-2xl overflow-hidden border border-stone-300/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                  >
                    <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80" alt="Studio" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
                    <div class="absolute inset-0 flex flex-col justify-end p-3">
                      <h3 class="text-white text-base font-bold mb-0.5">{t(locale, "service.studioSessions")}</h3>
                      <span class="text-white/70 text-xs">{t(locale, "service.learnMore")} →</span>
                    </div>
                  </button>

                  {/* Artist Profile */}
                  <button
                    onClick$={() => { desktopBentoExpanded.value = 'artist'; }}
                    class="col-span-1 row-span-1 group relative rounded-2xl overflow-hidden border border-stone-300/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                  >
                    <img src="/images/sv2.JPG" alt="Artist" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
                    <div class="absolute inset-0 flex flex-col justify-end p-3">
                      <h3 class="text-white text-base font-bold mb-0.5">{t(locale, "expanded.artistProfile")}</h3>
                      <span class="text-white/70 text-xs">{t(locale, "service.learnMore")} →</span>
                    </div>
                  </button>

                  {/* My Music */}
                  <button
                    onClick$={() => { desktopBentoExpanded.value = 'music'; }}
                    class="col-span-2 row-span-1 group relative rounded-2xl overflow-hidden border border-stone-300/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                  >
                    <img src="/images/ap1.jpg" alt="My Music" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
                    <div class="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 class="text-white text-lg font-bold">{t(locale, "service.myMusic")}</h3>
                      <span class="text-white/70 text-sm">{t(locale, "service.myMusicDesc")}</span>
                    </div>
                  </button>
                </div>
              ) : (
                /* Expanded View */
                <div class="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden h-full flex flex-col">
                  {/* Expanded: Studio Sessions */}
                  {desktopBentoExpanded.value === 'studio' && (
                    <>
                      <div class="relative h-32 overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80" alt="Studio" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
                        <button
                          onClick$={() => { desktopBentoExpanded.value = 'none'; }}
                          class="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          <LuX class="w-4 h-4 text-white" />
                        </button>
                        <div class="absolute bottom-3 left-4">
                          <h3 class="text-white text-xl font-bold">{t(locale, "service.studioSessions")}</h3>
                        </div>
                      </div>
                      <div class="p-4 flex-1 overflow-auto">
                        <p class="text-stone-600 text-sm leading-relaxed mb-4">
                          {t(locale, "service.studioSessionsFullDesc")}
                        </p>
                        <div class="grid grid-cols-3 gap-2 mb-4">
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src="/images/sv2.JPG" alt="Studio" class="w-full h-full object-cover" />
                          </div>
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src="/images/sv3.JPG" alt="Studio" class="w-full h-full object-cover" />
                          </div>
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200 relative">
                            <img src="https://img.youtube.com/vi/dl6sZEikzz0/hqdefault.jpg" alt="Video" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                <svg class="w-3 h-3 text-stone-700 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a
                          href="mailto:book@phineasstewart.com"
                          class="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {t(locale, "service.bookSessionViolinist")}
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </a>
                      </div>
                    </>
                  )}

                  {/* Expanded: Artist Profile */}
                  {desktopBentoExpanded.value === 'artist' && (
                    <>
                      <div class="relative h-32 overflow-hidden flex-shrink-0">
                        <img src="/images/sv2.JPG" alt="Artist" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
                        <button
                          onClick$={() => { desktopBentoExpanded.value = 'none'; }}
                          class="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          <LuX class="w-4 h-4 text-white" />
                        </button>
                        <div class="absolute bottom-3 left-4">
                          <h3 class="text-white text-xl font-bold">{t(locale, "expanded.artistProfile")}</h3>
                        </div>
                      </div>
                      <div class="p-4 flex-1 overflow-auto">
                        <p class="text-stone-600 text-sm leading-relaxed mb-2">
                          {t(locale, "expanded.artistJourney")}
                        </p>
                        <p class="text-stone-600 text-sm leading-relaxed mb-3">
                          {t(locale, "expanded.artistStyle")}
                        </p>
                        <div class="flex flex-wrap gap-2 mb-4">
                          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-600">
                            <LuMapPin class="w-3 h-3" />
                            {t(locale, "expanded.fromNovaScotia")}
                          </span>
                          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-600">
                            <LuMapPin class="w-3 h-3" />
                            {t(locale, "expanded.basedInMontreal")}
                          </span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 mb-4">
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src="/images/ap1.jpg" alt="Artist" class="w-full h-full object-cover" />
                          </div>
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src="/images/ap2.jpg" alt="Artist" class="w-full h-full object-cover" />
                          </div>
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200">
                            <img src="/images/ap3.JPEG" alt="Artist" class="w-full h-full object-cover" />
                          </div>
                          <div class="aspect-video rounded-lg overflow-hidden border border-stone-200 relative">
                            <img src="https://img.youtube.com/vi/06YplsNk_ro/hqdefault.jpg" alt="Video" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                <svg class="w-3 h-3 text-stone-700 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a
                          href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {t(locale, "expanded.listenToMyMusic")}
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </a>
                      </div>
                    </>
                  )}

                  {/* Expanded: My Music - Streaming Links */}
                  {desktopBentoExpanded.value === 'music' && (
                    <>
                      <div class="relative h-32 overflow-hidden flex-shrink-0">
                        <img src="/images/ap1.jpg" alt="My Music" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
                        <button
                          onClick$={() => { desktopBentoExpanded.value = 'none'; }}
                          class="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          <LuX class="w-4 h-4 text-white" />
                        </button>
                        <div class="absolute bottom-3 left-4">
                          <h3 class="text-white text-xl font-bold">{t(locale, "service.myMusic")}</h3>
                        </div>
                      </div>
                      <div class="p-4 flex-1 overflow-auto">
                        <p class="text-stone-600 text-sm leading-relaxed mb-4">
                          {t(locale, "expanded.listenOnPlatforms")}
                        </p>
                        <div class="grid grid-cols-2 gap-2">
                          <a href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa?si=gJGmImiyRO-q6Y0bQLmzOg" target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm rounded-lg hover:scale-[1.02] transition-transform">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            Spotify
                          </a>
                          <a href="https://music.apple.com/ca/artist/phineas-stewart/1717275618" target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium text-sm rounded-lg hover:scale-[1.02] transition-transform">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124z"/>
                            </svg>
                            Apple Music
                          </a>
                          <a href="https://music.youtube.com/channel/UCg9YF9SN504fQCvjf0ra_XQ?si=zethm1ZVPTYsRqHU" target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm rounded-lg hover:scale-[1.02] transition-transform">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                            </svg>
                            YouTube Music
                          </a>
                          <a href="https://music.amazon.com/artists/B09XX8QJDN/phineas-stewart" target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm rounded-lg hover:scale-[1.02] transition-transform">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685z"/>
                            </svg>
                            Amazon Music
                          </a>
                          <a href="https://tidal.com/artist/43916985/u" target="_blank" rel="noopener noreferrer"
                            class="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 text-white font-medium text-sm rounded-lg hover:scale-[1.02] transition-transform">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zm4.004 4.004l4.004-4.004L24.024 7.996l-4.004 4.004-4.004-4.004z"/>
                            </svg>
                            Tidal
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Streaming Services */}
            <div class="col-span-2 flex flex-col gap-1.5">
              {/* Spotify */}
              <a href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa?si=gJGmImiyRO-q6Y0bQLmzOg" target="_blank" rel="noopener noreferrer"
                class="group flex-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <svg class="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span class="font-bold text-xs relative z-10">Spotify</span>
              </a>

              {/* Apple Music */}
              <a href="https://music.apple.com/ca/artist/phineas-stewart/1717275618" target="_blank" rel="noopener noreferrer"
                class="group flex-1 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-2 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <svg class="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
                </svg>
                <span class="font-bold text-xs relative z-10">Apple</span>
              </a>

              {/* YouTube Music */}
              <a href="https://music.youtube.com/channel/UCg9YF9SN504fQCvjf0ra_XQ?si=zethm1ZVPTYsRqHU" target="_blank" rel="noopener noreferrer"
                class="group flex-1 bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-2 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <svg class="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                </svg>
                <span class="font-bold text-xs relative z-10">YouTube</span>
              </a>

              {/* Amazon Music */}
              <a href="https://music.amazon.com/artists/B09XX8QJDN/phineas-stewart" target="_blank" rel="noopener noreferrer"
                class="group flex-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-2 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <svg class="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 0 1-.753.072c-1.06-.879-1.25-1.286-1.831-2.121-1.748 1.784-2.988 2.318-5.254 2.318-2.683 0-4.77-1.656-4.77-4.968 0-2.586 1.401-4.347 3.403-5.209 1.735-.755 4.159-.891 6.011-1.099v-.411c0-.755.058-1.646-.385-2.298-.385-.58-1.124-.82-1.772-.82-1.205 0-2.276.618-2.539 1.897-.054.284-.262.564-.548.578l-3.068-.332c-.259-.058-.545-.266-.473-.66.71-3.735 4.088-4.863 7.112-4.863 1.547 0 3.568.411 4.786 1.581 1.547 1.437 1.399 3.352 1.399 5.437v4.923c0 1.48.616 2.13 1.196 2.929.203.288.247.63-.011.843-.647.541-1.799 1.545-2.432 2.107l-.072-.067zM21.779 20.332c-1.414 1.104-3.456 1.685-5.209 1.685-2.465 0-4.682-.912-6.359-2.429-.131-.119-.014-.281.144-.189 1.812 1.054 4.056 1.686 6.372 1.686 1.563 0 3.282-.324 4.863-.995.239-.102.439.157.189.242zM22.8 18.999c-.179-.228-1.178-.108-1.629-.054-.136.017-.157-.102-.034-.189.798-.559 2.107-.398 2.26-.211.151.189-.041 1.499-.788 2.125-.114.096-.224.044-.173-.082.168-.421.545-1.36.364-1.589z"/>
                </svg>
                <span class="font-bold text-xs relative z-10">Amazon</span>
              </a>

              {/* Tidal */}
              <a href="https://tidal.com/artist/43916985/u" target="_blank" rel="noopener noreferrer"
                class="group flex-1 bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-2 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
                <svg class="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zm4.004 4.004l4.004-4.004L24.024 7.996l-4.004 4.004-4.004-4.004z"/>
                </svg>
                <span class="font-bold text-xs relative z-10">Tidal</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
});