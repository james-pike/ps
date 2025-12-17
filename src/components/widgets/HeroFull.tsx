import { component$, useSignal, useVisibleTask$, useStyles$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

export default component$(() => {
  const currentSlideIndex = useSignal(0);
  const rightColumnImageIndex = useSignal(0);
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  const rightColumnImages = [
    "/images/bowls.jpeg",
    "/images/lanterns.jpg",
    "/images/summer.jpg",
    "/images/space.jpeg",
    "/images/labyrinth.jpeg",
    "/images/welcome.jpeg"
  ];

  const heroCards = [
    {
      badge: "Session Violinist",
      title: ["Session Violinist",],
      description: "Bringing soul and precision to every recording session and live performance.",
      stats: [
        { value: "200+", label: "Sessions" },
        { value: "50+", label: "Albums" },
        { value: "15+", label: "Years" }
      ]
    },
    {
      badge: "Live Performances",
      title: ["Live Performances"],
      description: "From intimate venues to grand stages, delivering captivating performances that resonate.",
      stats: [
        { value: "100+", label: "Concerts" },
        { value: "25+", label: "Festivals" },
        { value: "10+", label: "Countries" }
      ]
    },
    {
      badge: "Studio Sessions",
      title: ["Studio Sessions"],
      description: "Professional recording services with meticulous attention to detail and musical excellence.",
      stats: [
        { value: "300+", label: "Tracks" },
        { value: "75+", label: "Artists" },
        { value: "20+", label: "Genres" }
      ]
    }
  ];

  useStyles$(`
    .hero-full-container {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 600px;
      overflow: hidden;
    }
    .hero-slide-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.6s ease-in-out;
      pointer-events: none;
    }
    .hero-slide-wrapper.active {
      opacity: 1;
      pointer-events: auto;
      z-index: 2;
    }
  `);

  // Auto-advance hero cards carousel
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      currentSlideIndex.value = (currentSlideIndex.value + 1) % heroCards.length;
    }, 5000);
    cleanup(() => clearInterval(interval));
  });

  // Auto-advance right column images
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      rightColumnImageIndex.value = (rightColumnImageIndex.value + 1) % rightColumnImages.length;
    }, 5000);
    cleanup(() => clearInterval(interval));
  });

  return (
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-black to-tertiary-950 -mt-1">
      {/* Animated gradient background */}
      <div class="absolute inset-0 bg-gradient-to-br from-primary-950 via-black to-tertiary-950 opacity-80"></div>

      {/* Floating decorations */}
      <div class="absolute top-20 left-10 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl animate-float" aria-hidden="true"></div>
      <div class="absolute top-40 right-20 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl animate-floatx" aria-hidden="true"></div>
      <div class="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-700/10 rounded-full blur-2xl animate-float" aria-hidden="true"></div>

      {/* Subtle grid overlay */}
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" aria-hidden="true"></div>

      <div class="relative z-10 w-full h-full">
        <div
          class="hero-full-container"
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
          {heroCards.map((card, index) => (
            <div
              key={index}
              class={`hero-slide-wrapper ${currentSlideIndex.value === index ? 'active' : ''}`}
            >
              {/* Full Width Two Columns */}
              <div class="relative lg:grid lg:grid-cols-2 h-full w-full overflow-hidden shadow-2xl bg-black">

                {/* Mobile: Image and text stacked */}
                <div class="relative lg:hidden h-full w-full flex flex-col">
                  {/* Image - takes up defined space */}
                  <div class="relative w-full h-[40vh] flex-shrink-0">
                    <div class="relative w-full h-full">
                      {rightColumnImages.map((img, idx) => (
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
                      {/* Top gradient mask */}
                      <div class="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black via-black/50 to-transparent"></div>
                      {/* Bottom gradient mask */}
                      <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                      {/* Left gradient mask */}
                      <div class="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                      {/* Right gradient mask */}
                      <div class="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-black via-black/50 to-transparent"></div>
                    </div>
                  </div>

                  {/* Text content below image */}
                  <div class="relative z-10 p-6 -mt-28 flex flex-col items-center text-center justify-start flex-grow">
                    <div class="inline-block mb-4">
                      <span class="px-4 py-2 rounded-full bg-primary-900/50 border border-primary-600/30 text-primary-300 text-sm font-medium tracking-wider uppercase">
                        {heroCards[currentSlideIndex.value].badge}
                      </span>
                    </div>

                    <h1 class="text-5xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                      <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
                        {heroCards[currentSlideIndex.value].title[0]}
                      </span>
                      <br />
                      <span class="text-white">{heroCards[currentSlideIndex.value].title[1]}</span>
                      <br />
                      <span class="bg-gradient-to-r from-secondary-400 to-primary-500 bg-clip-text text-transparent">
                        {heroCards[currentSlideIndex.value].title[2]}
                      </span>
                    </h1>

                    <p class="text-xl -mt-12 text-tertiary-300 mb-6">
                      {heroCards[currentSlideIndex.value].description}
                    </p>

                    <div class="flex flex-col-2 gap-3 mb-6">
                      <a
                        href="/gallery"
                        class="group/btn px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-900/50 transition-all duration-300 hover:scale-105 text-center"
                      >
                        View Portfolio
                        <span class="inline-block ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                      </a>
                      <a
                        href="/contact"
                        class="px-6 py-3 bg-transparent border-2 border-secondary-500 text-secondary-400 hover:bg-secondary-500/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-center"
                      >
                        Book Session
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop: Left - Messaging */}
                <div class="hidden lg:flex relative bg-gradient-to-br from-primary-900/20 via-black/40 to-tertiary-900/20 backdrop-blur-md p-8 xl:p-16 flex-col justify-center order-1">
                  <div class="absolute inset-0 bg-black/70 -z-10"></div>

                  <div class="inline-block mb-4">
                    <span class="px-4 py-2 rounded-full bg-primary-900/50 border border-primary-600/30 text-primary-300 text-sm font-medium tracking-wider uppercase">
                      {card.badge}
                    </span>
                  </div>

                  <h1 class="text-5xl xl:text-7xl font-bold tracking-tight leading-tight mb-4">
                    <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
                      {card.title[0]}
                    </span>
                    <br />
                    <span class="text-white">{card.title[1]}</span>
                    <br />
                    <span class="bg-gradient-to-r from-secondary-400 to-primary-500 bg-clip-text text-transparent">
                      {card.title[2]}
                    </span>
                  </h1>

                  <p class="text-lg xl:text-xl text-tertiary-300 mb-6 max-w-lg">
                    {card.description}
                  </p>

                  <div class="flex flex-col sm:flex-row gap-4 mb-4 lg:mb-8">
                    <a
                      href="/gallery"
                      class="group/btn px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-900/50 transition-all duration-300 hover:scale-105 text-center"
                    >
                      View Portfolio
                      <span class="inline-block ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                    </a>
                    <a
                      href="/contact"
                      class="px-8 py-4 bg-transparent border-2 border-secondary-500 text-secondary-400 hover:bg-secondary-500/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-center"
                    >
                      Book Session
                    </a>
                  </div>
<div class="hidden md:block">
                  <div class="grid grid-cols-3 gap-6 pt-6 border-t border-tertiary-800/50">
                    {card.stats.map((stat, idx) => (
                      <div key={idx}>
                        <div class="text-3xl xl:text-4xl font-bold text-secondary-400">{stat.value}</div>
                        <div class="text-sm text-tertiary-400 uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Desktop: Right - Image Carousel */}
                <div class="hidden lg:flex relative bg-gradient-to-br from-primary-900/20 via-black/40 to-tertiary-900/20 backdrop-blur-md p-8 xl:p-16 items-center justify-center order-2">
                  <div class="absolute inset-0 bg-black/70 -z-10"></div>
                  <div class="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
                    {rightColumnImages.map((img, idx) => (
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
                    {/* Top gradient mask */}
                    <div class="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black via-black/50 to-transparent"></div>
                    {/* Bottom gradient mask */}
                    <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    {/* Left gradient mask */}
                    <div class="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                    {/* Right gradient mask */}
                    <div class="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent"></div>
                    {/* Corner gradients */}
                    <div class="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-br from-primary-900/80 via-black/90 to-tertiary-900/80 backdrop-blur-md border-2 border-primary-600/40 shadow-2xl px-8 py-3 rounded-full">
          <div class="flex justify-center gap-3">
            {heroCards.map((_, index) => (
              <button
                key={index}
                onClick$={() => {
                  currentSlideIndex.value = index;
                }}
                class={`transition-all duration-300 rounded-full ${
                  currentSlideIndex.value === index
                    ? 'w-12 h-3 bg-gradient-to-r from-primary-400 to-secondary-400'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-tertiary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
});
