import { component$, useSignal, useVisibleTask$, useStyles$, $ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { menuItems } from "./MenuModal";
import IconHamburger from "../icons/IconHamburger";
import IconChevronDown from "../icons/IconChevronDown";
import { LuX, LuChevronRight, LuMapPin, LuMail, LuClock, LuFacebook, LuInstagram, LuGlobe, LuYoutube, LuCalendar } from "@qwikest/icons/lucide";
import { useI18n, setLanguage as setLang, type Language } from "~/context/i18n";

type FlipTarget = 'none' | 'menu' | 'portfolio' | 'booking';

export default component$(() => {
  const carouselIndex = useSignal(0);
  const isAutoPlaying = useSignal(true);
  const currentSlideIndex = useSignal(0);
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
  const location = useLocation();
  const i18n = useI18n();
  const showLangDropdown = useSignal(false);

  const handleSetLanguage = $((lang: Language) => {
    i18n.locale.value = lang;
    setLang(lang);
    showLangDropdown.value = false;
  });

  // Desktop menu items (same as Header)
  const desktopMenu = [
    {
      text: "This Is Us",
      href: "/team",
      items: [
        { text: "Facilitators", href: "/team" },
        { text: "Our Logo", href: "/team#logo" },
      ]
    },
    {
      text: "About",
      href: "/about",
      items: [
        { text: "Our Space", href: "/about" },
        { text: "What To Expect", href: "/about#what-to-expect" },
        { text: "Benefits Of Clay", href: "/about#benefits-of-clay" },
        { text: "Newsletter", href: "/newsletter" },
        { text: "Gallery", href: "/gallery" },
        { text: "FAQ", href: "/faq" },
      ],
    },
    {
      text: "Our Offerings",
      href: "/offerings",
      items: [
        { text: "Classes & Workshops", href: "/offerings" },
        { text: "Corporate Events", href: "/offerings#events" },
        { text: "Private Events", href: "/offerings#events" },
        { text: "Gift Cards", href: "https://bookeo.com/earthenvessels/buyvoucher" },
      ],
    },
    {
      text: "Reviews",
      href: "/reviews/",
      items: [
        { text: "Reviews", href: "/reviews" },
        { text: "In The News", href: "/reviews/#news" },
      ],
    },
    { text: "Community", href: "/community" },
    { text: "Contact", href: "/contact" },
  ];

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
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
      "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80"
    ],
    // Card 2: Live Performances
    [
      "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
    ],
    // Card 3: Session Violinist (Crafting Musical Moments)
    [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80"
    ]
  ];

  const heroCards = [
    {
      badge: "Studio Sessions",
      title: ["Polishing", "Every", "Recording"],
      description: "Professional recording services with attention to detail and musical excellence.",
      stats: [
        { value: "40+", label: "Tracks" },
        { value: "20+", label: "Artists" },
        { value: "10+", label: "Genres" }
      ]
    },
    {
      badge: "Live Performances",
      title: ["Creating", "Unforgettable", "Experiences"],
      description: "From intimate venues to grand stages, delivering performances that truly resonate.",
      stats: [
        { value: "30+", label: "Concerts" },
        { value: "10+", label: "Venues" },
        { value: "5+", label: "Cities" }
      ]
    },
    {
      badge: "Session Violinist",
      title: ["Crafting", "Musical", "Moments"],
      description: "Bringing soul and precision to every recording session and live performance we create.",
      stats: [
        { value: "50+", label: "Sessions" },
        { value: "15+", label: "Albums" },
        { value: "10+", label: "Years" }
      ]
    }
  ];

  useStyles$(`
    .hero-carousel-container {
      position: relative;
      width: 100%;
      min-height: 920px;
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
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      // Pause auto-advance when card is flipped
      if (isFlipped.value) return;

      const videosPerCard = cardVideos[0].length; // All cards have same number of videos
      const nextImageIndex = (rightColumnImageIndex.value + 1) % videosPerCard;
      rightColumnImageIndex.value = nextImageIndex;

      // When video carousel completes a full cycle (returns to 0), advance the hero card
      if (nextImageIndex === 0) {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % heroCards.length;
      }
    }, 3000); // 3 seconds per image, so full cycle = 18 seconds before card changes
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

      <div class="relative z-10 w-full mx-auto px-3.5 pt-3 pb-2 lg:px-4 lg:py-8">
        {/* Mobile Layout - Card Stack */}
        <div class="lg:hidden relative">
          {/* Mobile Menu Button + Language Dropdown - positioned above card stack */}
          {!isFlipped.value && (
            <div class="absolute top-4 right-2 z-50 flex items-center gap-2">
              {/* Language Dropdown */}
              <div class="relative">
                <button
                  class={`flex items-center gap-1 p-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                    currentSlideIndex.value === 0
                      ? 'border-stone-300 bg-stone-100/40 hover:bg-stone-200/50'
                      : currentSlideIndex.value === 1
                        ? 'border-orange-300 bg-orange-100/40 hover:bg-orange-200/50'
                        : 'border-amber-300 bg-amber-100/40 hover:bg-amber-200/50'
                  }`}
                  onClick$={() => showLangDropdown.value = !showLangDropdown.value}
                >
                  <LuGlobe class="w-5 h-5 text-stone-700" />
                  <span class="text-xs font-medium text-stone-700 uppercase">{i18n.locale.value}</span>
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
                      ? 'border-orange-300 bg-orange-100/40 hover:bg-orange-200/50'
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
                  bg: "from-stone-100/95 to-stone-50/95",
                  innerBg: "bg-stone-50/90",
                  border: "border-stone-400/60",
                  badge: "bg-stone-100/70 border-stone-300/50 text-stone-600",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-stone-200 to-stone-300 hover:from-stone-300 hover:to-stone-400 shadow-stone-200/20 text-stone-700",
                  buttonOutline: "border-stone-300 text-stone-600 hover:bg-stone-200/30",
                  statValue: "text-stone-600",
                  statLabel: "text-stone-500/70",
                  divider: "border-stone-200/50",
                  description: "text-stone-600"
                },
                // Card 2: Soft tan/warm beige - with black headline (Live Performances)
                {
                  bg: "from-orange-50/95 to-amber-50/95",
                  innerBg: "bg-orange-50/90",
                  border: "border-orange-400/60",
                  badge: "bg-orange-100/70 border-orange-300/50 text-orange-700",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 shadow-orange-200/20 text-orange-800",
                  buttonOutline: "border-orange-300 text-orange-600 hover:bg-orange-200/30",
                  statValue: "text-orange-600",
                  statLabel: "text-orange-500/70",
                  divider: "border-orange-200/50",
                  description: "text-stone-600"
                },
                // Card 3: Soft cream/yellow - with black headline (Session Violinist)
                {
                  bg: "from-amber-50/90 to-stone-50/90",
                  innerBg: "bg-amber-50/80",
                  border: "border-amber-400/60",
                  badge: "bg-amber-100/50 border-amber-200/40 text-amber-600",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleLast: "text-gray-900",
                  button: "from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-amber-100/20 text-amber-700",
                  buttonOutline: "border-amber-200 text-amber-500 hover:bg-amber-100/30",
                  statValue: "text-amber-500",
                  statLabel: "text-amber-400/70",
                  divider: "border-amber-200/40",
                  description: "text-stone-600"
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
                        <div class={`relative bg-gradient-to-br ${style.bg} backdrop-blur-sm p-6 md:p-8 rounded-2xl border ${style.border} shadow-2xl`}>
                          <div class={`absolute inset-0 ${style.innerBg} -z-10 rounded-2xl`}></div>
                          <div class="inline-block mb-4 mt-1">
                            <span class={`px-3 py-1 rounded-full ${style.badge} text-xs font-medium tracking-wider uppercase`}>
                              {card.badge}
                            </span>
                          </div>
                          <h1 class="text-[2.625rem] md:text-5xl font-bold tracking-tight leading-tight mb-4">
                            <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>
                              {card.title[0]}
                            </span>
                            <span class={`bg-gradient-to-r ${style.title} bg-clip-text text-transparent block`}>
                              {card.title[1]}
                            </span>
                            <span class={`${style.titleLast} block`}>{card.title[2]}</span>
                          </h1>
                          <p class={`text-lg ${style.description} mb-6 min-h-[3.5rem]`}>
                            {card.description}
                          </p>
                          <div class="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick$={() => handleFlip('portfolio')}
                              class={`group px-6 py-3 bg-gradient-to-r ${style.button} font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-center`}
                            >
                              View Portfolio
                              <span class="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                            </button>
                            <button
                              onClick$={() => handleFlip('booking')}
                              class={`px-6 py-3 bg-transparent border-2 ${style.buttonOutline} font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-center`}
                            >
                              Book Session
                            </button>
                          </div>

                          {/* Video Carousel inside card */}
                          <div class={`mt-6 pt-4 border-t ${style.divider}`}>
                          <div
                            class={`rounded-xl overflow-hidden border ${style.border}`}
                            onTouchStart$={(e) => {
                              e.stopPropagation();
                              videoTouchStartX.value = e.touches[0].clientX;
                              videoTouchEndX.value = e.touches[0].clientX;
                            }}
                            onTouchMove$={(e) => {
                              e.stopPropagation();
                              videoTouchEndX.value = e.touches[0].clientX;
                            }}
                            onTouchEnd$={(e) => {
                              e.stopPropagation();
                              const swipeThreshold = 50;
                              const diff = videoTouchStartX.value - videoTouchEndX.value;
                              const videosPerCard = cardVideos[0].length;

                              if (Math.abs(diff) > swipeThreshold) {
                                if (diff > 0) {
                                  rightColumnImageIndex.value = (rightColumnImageIndex.value + 1) % videosPerCard;
                                } else {
                                  rightColumnImageIndex.value = (rightColumnImageIndex.value - 1 + videosPerCard) % videosPerCard;
                                }
                              }

                              videoTouchStartX.value = 0;
                              videoTouchEndX.value = 0;
                            }}
                          >
                            <div class="relative aspect-video">
                              {cardVideos[index].map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  class={`absolute inset-0 transition-all duration-700 ${
                                    imgIdx === rightColumnImageIndex.value
                                      ? 'opacity-100 scale-100'
                                      : 'opacity-0 scale-110'
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`Performance ${imgIdx + 1}`}
                                    class="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              <div class="absolute inset-0 flex items-center justify-center bg-stone-900/20">
                                <button class={`w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border-2 ${style.border} flex items-center justify-center hover:bg-white/90 transition-all duration-300 hover:scale-110`}>
                                  <svg class={`w-5 h-5 ${style.statValue} ml-0.5`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </button>
                              </div>
                              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                {cardVideos[index].map((_, dotIdx) => (
                                  <button
                                    key={dotIdx}
                                    onClick$={() => { rightColumnImageIndex.value = dotIdx; }}
                                    class={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      dotIdx === rightColumnImageIndex.value
                                        ? 'bg-white'
                                        : 'bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>

                      {/* BACK OF CARD - Always stone/grey theme */}
                      <div
                        class="flip-card-back"
                        onTouchStart$={handleBackTouchStart}
                        onTouchEnd$={handleBackTouchEnd}
                      >
                        <div class="relative bg-gradient-to-br from-stone-100/95 to-stone-50/95 backdrop-blur-sm p-6 rounded-2xl border border-stone-400/60 shadow-2xl h-full">
                          <div class="absolute inset-0 bg-stone-50/90 -z-10 rounded-2xl"></div>

                          {/* Close button */}
                          <button
                            onClick$={handleFlipBack}
                            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-50/90 border border-stone-400/60 transition-all duration-200 hover:scale-110"
                          >
                            <LuX class="w-5 h-5 text-stone-600" />
                          </button>


                          {/* Menu Back Content */}
                          {flipTarget.value === 'menu' && (
                            <div class="pt-2">
                              {/* Logo */}
                              <div class="mb-4">
                                <a href="/" class="focus:outline-none">
                                  <img src="/images/logo2.svg" alt="Logo" class="h-10" />
                                </a>
                              </div>

                              {/* Navigation */}
                              <nav class="space-y-1 max-h-[45vh] overflow-y-auto pr-2">
                                {menuItems.map((item, menuIdx) => (
                                  <div key={menuIdx}>
                                    {item.hasSubmenu ? (
                                      <>
                                        <button
                                          onClick$={() => {
                                            menuOpenIndex.value = menuOpenIndex.value === menuIdx ? null : menuIdx;
                                          }}
                                          class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-lg font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                                        >
                                          <span>{item.title}</span>
                                          <LuChevronRight class={`w-5 h-5 transition-transform ${menuOpenIndex.value === menuIdx ? 'rotate-90' : ''}`} />
                                        </button>
                                        {menuOpenIndex.value === menuIdx && (
                                          <div class="pl-4 space-y-1 mt-1">
                                            {item.subitems?.map((subitem: { title: string; href: string }) => (
                                              <a
                                                key={subitem.title}
                                                href={subitem.href}
                                                class="block px-3 py-2 rounded-lg text-base text-stone-500/70 hover:bg-stone-100 transition-colors"
                                              >
                                                {subitem.title}
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <a
                                        href={item.href}
                                        class="block px-3 py-2.5 rounded-lg text-lg font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                                      >
                                        {item.title}
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </nav>

                              {/* Social Links */}
                              <div class="mt-4 pt-4 border-t border-stone-200/50">
                                <p class="text-xs text-stone-500/70 text-center mb-3">Follow on</p>
                                <div class="flex justify-center gap-4">
                                  <a
                                    href="https://youtube.com/@yourchannelname"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-3 rounded-full bg-stone-50/90 border border-stone-400/60 text-stone-600 hover:scale-110 transition-transform"
                                  >
                                    <LuYoutube class="w-6 h-6" />
                                  </a>
                                  <a
                                    href="https://open.spotify.com/artist/yourartistid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-3 rounded-full bg-stone-50/90 border border-stone-400/60 text-stone-600 hover:scale-110 transition-transform"
                                  >
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                    </svg>
                                  </a>
                                  <a
                                    href="https://www.instagram.com/yourhandle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-3 rounded-full bg-stone-50/90 border border-stone-400/60 text-stone-600 hover:scale-110 transition-transform"
                                  >
                                    <LuInstagram class="w-6 h-6" />
                                  </a>
                                  <a
                                    href="https://www.tiktok.com/@yourhandle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-3 rounded-full bg-stone-50/90 border border-stone-400/60 text-stone-600 hover:scale-110 transition-transform"
                                  >
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                    </svg>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/yourpage"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-3 rounded-full bg-stone-50/90 border border-stone-400/60 text-stone-600 hover:scale-110 transition-transform"
                                  >
                                    <LuFacebook class="w-6 h-6" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Portfolio Back Content */}
                          {flipTarget.value === 'portfolio' && (
                            <div class="pt-2">
                              <h3 class="text-xl font-bold text-stone-600 mb-4">Gallery Preview</h3>

                              {/* 2x2 Grid of images */}
                              <div class="grid grid-cols-2 gap-2 mb-4">
                                {cardVideos[index].map((img, imgIdx) => (
                                  <div key={imgIdx} class="aspect-square rounded-lg overflow-hidden border border-stone-400/60">
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
                                class="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-stone-200 to-stone-300 hover:from-stone-300 hover:to-stone-400 text-stone-700 font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105"
                              >
                                View Full Gallery
                                <LuChevronRight class="w-5 h-5" />
                              </a>
                            </div>
                          )}

                          {/* Booking Back Content */}
                          {flipTarget.value === 'booking' && (
                            <div class="pt-2">
                              <h3 class="text-xl font-bold text-stone-600 mb-4">Contact Us</h3>

                              {/* Contact Info Cards */}
                              <div class="space-y-3 mb-4">
                                <div class="flex items-start gap-3 p-3 rounded-lg bg-stone-50/90 border border-stone-400/60">
                                  <LuMapPin class="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p class="font-medium text-stone-600">Address</p>
                                    <p class="text-sm text-stone-500/70">2567 Yonge St, Toronto, ON M4P 2J1</p>
                                  </div>
                                </div>

                                <div class="flex items-start gap-3 p-3 rounded-lg bg-stone-50/90 border border-stone-400/60">
                                  <LuMail class="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p class="font-medium text-stone-600">Email</p>
                                    <a href="mailto:hello@earthenvessels.ca" class="text-sm text-stone-500/70 hover:underline">
                                      hello@earthenvessels.ca
                                    </a>
                                  </div>
                                </div>

                                <div class="flex items-start gap-3 p-3 rounded-lg bg-stone-50/90 border border-stone-400/60">
                                  <LuClock class="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p class="font-medium text-stone-600">Hours</p>
                                    <p class="text-sm text-stone-500/70">Mon-Fri: 10am-8pm</p>
                                    <p class="text-sm text-stone-500/70">Sat-Sun: 10am-6pm</p>
                                  </div>
                                </div>
                              </div>

                              {/* Book CTA */}
                              <a
                                href="/contact"
                                class="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25"
                              >
                                <LuCalendar class="w-5 h-5" />
                                Book a Performance
                              </a>

                              {/* Contact Page Link */}
                              <a
                                href="/contact"
                                class="flex items-center justify-center gap-2 w-full mt-3 px-6 py-3 bg-transparent border-2 border-stone-300 text-stone-600 hover:bg-stone-200/30 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                              >
                                View Contact Page
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

        {/* Desktop Layout - Card Stack */}
        <div class="hidden lg:block w-full">
          <div
            class="hero-carousel-container"
            onTouchStart$={(e) => {
              touchStartX.value = e.touches[0].clientX;
              touchEndX.value = e.touches[0].clientX;
            }}
            onTouchMove$={(e) => {
              touchEndX.value = e.touches[0].clientX;
              const diff = Math.abs(touchStartX.value - touchEndX.value);
              if (diff > 10) {
                e.preventDefault();
              }
            }}
            onTouchEnd$={(e) => {
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

                // Calculate the distance from current card
                const distance = (index - current + total) % total;

                // Cards ahead of current
                if (distance === 1) return 'next';
                if (distance === 2) return 'prev';

                return 'hidden';
              };

              // Different color schemes for each card (desktop) - soft pastel with black headlines
              const desktopStyles = [
                // Card 1: Soft stone/taupe - with black headline (Studio Sessions)
                {
                  cardBg: "bg-stone-50",
                  leftBg: "from-stone-100/95 to-stone-50/95",
                  leftInner: "bg-stone-50/90",
                  leftBorder: "border-stone-400/60",
                  rightBg: "from-stone-50/95 to-stone-100/95",
                  rightInner: "bg-stone-100/90",
                  rightBorder: "border-stone-400/60",
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
                },
                // Card 2: Soft tan/warm beige - with black headline (Live Performances)
                {
                  cardBg: "bg-orange-50",
                  leftBg: "from-orange-50/95 to-amber-50/95",
                  leftInner: "bg-orange-50/90",
                  leftBorder: "border-orange-400/60",
                  rightBg: "from-amber-50/95 to-orange-50/95",
                  rightInner: "bg-amber-50/90",
                  rightBorder: "border-orange-400/60",
                  imageBorder: "border-orange-400/60",
                  badge: "bg-orange-100/70 border-orange-300/50 text-orange-700",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleMiddle: "text-gray-900",
                  titleLast: "text-gray-900",
                  description: "text-stone-600",
                  button: "from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400 shadow-orange-200/20 text-orange-800",
                  buttonOutline: "border-orange-300 text-orange-600 hover:bg-orange-200/30",
                  statValue: "text-orange-600",
                  statLabel: "text-orange-500/70",
                  divider: "border-orange-200/50"
                },
                // Card 3: Soft cream/yellow - with black headline (Session Violinist)
                {
                  cardBg: "bg-amber-50/80",
                  leftBg: "from-amber-50/90 to-stone-50/90",
                  leftInner: "bg-amber-50/80",
                  leftBorder: "border-amber-400/60",
                  rightBg: "from-stone-50/90 to-amber-50/90",
                  rightInner: "bg-amber-50/80",
                  rightBorder: "border-amber-400/60",
                  imageBorder: "border-amber-400/60",
                  badge: "bg-amber-100/50 border-amber-200/40 text-amber-600",
                  title: "from-gray-900 via-gray-800 to-gray-900",
                  titleMiddle: "text-gray-900",
                  titleLast: "text-gray-900",
                  description: "text-stone-600",
                  button: "from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-amber-100/20 text-amber-700",
                  buttonOutline: "border-amber-200 text-amber-500 hover:bg-amber-100/30",
                  statValue: "text-amber-500",
                  statLabel: "text-amber-400/70",
                  divider: "border-amber-200/40"
                }
              ];

              const ds = desktopStyles[index];

              return (
                <div key={index} class={`carousel-card-wrapper ${getCardClass()}`}>
                  {/* Unified Card - Header + Both Columns */}
                  <div class={`rounded-2xl overflow-hidden shadow-2xl ${ds.cardBg} border-2 ${ds.leftBorder}`} style="transform-style: preserve-3d;">

                    {/* Desktop Header - Inside the card */}
                    <header class={`hero-header relative bg-gradient-to-r ${ds.leftBg} backdrop-blur-md py-2 px-4`}>
                      <div class="flex items-center justify-between max-w-full">
                        {/* Logo */}
                        <a class="flex items-center" href="/">
                          <img
                            src="/images/logo22.svg"
                            alt="Logo"
                            class="w-[100px] h-[40px] object-contain"
                          />
                        </a>

                        {/* Navigation */}
                        <nav class="flex items-center" aria-label="Main navigation">
                          <ul class="flex flex-row text-stone-800 text-lg tracking-[0.01rem] font-medium px-2 py-1">
                            {desktopMenu.map(({ text, href, items }, key) => {
                              const isActive = location.url.pathname === href;
                              return (
                                <li key={key} class={items?.length ? "dropdown relative group" : ""}>
                                  {items?.length ? (
                                    <>
                                      <a
                                        href={href}
                                        class={`
                                          hover:text-amber-600
                                          px-3 py-2
                                          flex items-center
                                          transition-all duration-200
                                          relative
                                          rounded-full
                                          text-sm xl:text-base
                                          ${isActive ? "text-amber-700" : ""}
                                        `}
                                      >
                                        {text}
                                        <IconChevronDown class="w-3 h-3 ml-0.5" />
                                      </a>
                                      <ul class="dropdown-menu md:backdrop-blur-md rounded-lg md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-gradient-to-br md:from-amber-50/95 md:via-orange-50/95 md:to-yellow-50/95 md:border md:border-amber-300/50 md:min-w-[200px] drop-shadow-xl py-2 z-50">
                                        {items.map(({ text: text2, href: href2 }, key2) => {
                                          const isExternalLink = href2?.startsWith('http');
                                          return (
                                            <li key={key2}>
                                              <a
                                                class="hover:bg-amber-200/50 hover:text-amber-700 text-stone-700 py-2 px-5 flex items-center whitespace-nowrap transition-all duration-200 text-sm"
                                                href={href2}
                                                {...(isExternalLink && { target: "_blank", rel: "noopener noreferrer" })}
                                              >
                                                {text2}
                                              </a>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </>
                                  ) : (
                                    <a
                                      class={`
                                        hover:text-amber-600
                                        px-3 py-2
                                        flex items-center
                                        transition-all duration-200
                                        rounded-full
                                        text-sm xl:text-base
                                        ${isActive ? "text-amber-700" : ""}
                                      `}
                                      href={href}
                                    >
                                      {text}
                                    </a>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </nav>

                        {/* Right side: Language + Book button */}
                        <div class="flex items-center space-x-2">
                          {/* Language Dropdown */}
                          <div class="relative">
                            <button
                              class="flex items-center gap-1 px-2 py-1.5 text-stone-700 hover:text-amber-700 rounded-lg hover:bg-amber-100/50 transition-all duration-200"
                              onClick$={() => showLangDropdown.value = !showLangDropdown.value}
                              onBlur$={() => setTimeout(() => showLangDropdown.value = false, 150)}
                            >
                              <LuGlobe class="w-4 h-4" />
                              <span class="text-xs font-medium uppercase">{i18n.locale.value}</span>
                              <IconChevronDown class={`w-2.5 h-2.5 transition-transform duration-200 ${showLangDropdown.value ? 'rotate-180' : ''}`} />
                            </button>
                            {showLangDropdown.value && (
                              <div class="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-md border border-stone-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[100px]">
                                <button
                                  class={`w-full px-3 py-1.5 text-left text-xs hover:bg-amber-100/50 transition-colors ${i18n.locale.value === 'en' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                                  onClick$={() => handleSetLanguage('en')}
                                >
                                  English
                                </button>
                                <button
                                  class={`w-full px-3 py-1.5 text-left text-xs hover:bg-amber-100/50 transition-colors ${i18n.locale.value === 'fr' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                                  onClick$={() => handleSetLanguage('fr')}
                                >
                                  Français
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Book Button */}
                          <a
                            href="https://bookeo.com/earthenvessels"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-lg hover:shadow-[0_0_12px_rgba(217,119,6,0.4)] transition-all duration-300 overflow-hidden"
                          >
                            <span class="relative z-10 flex items-center gap-1">
                              Book a Class
                              <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </header>

                    {/* Two-column content */}
                    <div class="grid grid-cols-2 gap-0">
                      {/* Left: Messaging */}
                      <div class={`relative bg-gradient-to-br ${ds.leftBg} backdrop-blur-md p-8 xl:p-12`}>
                        <div class={`absolute inset-0 ${ds.leftInner} -z-10`}></div>
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
                          View Portfolio
                          <span class="inline-block ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                        </a>
                        <a
                          href="/contact"
                          class={`px-6 py-3 bg-transparent border-2 ${ds.buttonOutline} font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-center`}
                        >
                          Book Session
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

                      {/* Progress Bar */}
                      <div class="progress-bar">
                        <div class="progress-fill"></div>
                      </div>
                    </div>

                      {/* Right: Image Carousel Card */}
                      <div class={`relative bg-gradient-to-br ${ds.rightBg} backdrop-blur-md p-8 flex items-center justify-center`}>
                        <div class={`absolute inset-0 ${ds.rightInner} -z-10`}></div>
                        <div class={`relative border-2 ${ds.imageBorder} rounded-xl overflow-hidden w-full aspect-square shadow-2xl`}>
                          {cardVideos[index].map((img, idx) => (
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
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
});