import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { LuX, LuMapPin } from "@qwikest/icons/lucide";
import { useI18n, t } from "~/context/i18n";

export default component$(() => {
  const expandedCard = useSignal<number | null>(null);
  const expandedGalleryItem = useSignal<{ card: number; item: number } | null>(null);
  const i18n = useI18n();
  const locale = i18n.locale.value;
  const touchStartY = useSignal<number | null>(null);
  const expandedRef = useSignal<Element | undefined>(undefined);

  // Scroll to expanded content when it opens
  useVisibleTask$(({ track }) => {
    track(() => expandedCard.value);
    if (expandedCard.value !== null && expandedRef.value) {
      // Wait for DOM to update, then scroll to top of expanded content
      setTimeout(() => {
        const element = expandedRef.value;
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = scrollTop + rect.top - 20; // 20px offset from top
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 150);
    }
  });

  const services = [
    {
      title: "New Single",
      description: "Seagulls in the City",
      link: "https://distrokid.com/hyperfollow/phineasstewart/seagulls-in-the-city",
      image: "/images/ap2.jpg",
      accent: "stone",
      portfolioImages: [],
      isExternal: true,
      buttonText: "Pre-save now"
    },
    {
      titleKey: "service.studioSessions",
      descriptionKey: "service.studioSessionsDesc",
      fullDescriptionKey: "service.studioSessionsFullDesc",
      link: "/offerings#studio",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
      accent: "stone",
      portfolioImages: [
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
        "/images/sv2.JPG",
        "/images/sv3.JPG",
        "youtube:dl6sZEikzz0"
      ]
    },
    {
      titleKey: "expanded.artistProfile",
      descriptionKey: "hero.artistCardDesc",
      contentType: "artistProfile",
      link: "/artist",
      image: "/images/sv2.JPG",
      accent: "stone",
      portfolioImages: [
        "/images/ap1.jpg",
        "/images/ap2.jpg",
        "/images/ap3.JPEG",
        "youtube:06YplsNk_ro"
      ]
    },
    {
      titleKey: "service.myMusic",
      descriptionKey: "service.myMusicDesc",
      fullDescriptionKey: "service.myMusicFullDesc",
      link: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa",
      image: "/images/ap1.jpg",
      accent: "stone",
      portfolioImages: [],
      isExternal: true,
      buttonText: "Listen on Spotify"
    }
  ];

  const handleCardClick = $((index: number, e: Event, link: string, isExternal?: boolean) => {
    // If it's an external link card, navigate instead of expanding
    if (isExternal) {
      window.open(link, '_blank');
      return;
    }
    e.preventDefault();
    expandedCard.value = index;
  });

  const handleClose = $(() => {
    expandedCard.value = null;
  });

  // Swipe handling for closing expanded view
  const handleTouchStart = $((e: TouchEvent) => {
    touchStartY.value = e.touches[0].clientY;
  });

  const handleTouchEnd = $((e: TouchEvent) => {
    if (touchStartY.value === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.value;
    // Swipe down to close (threshold of 80px)
    if (deltaY > 80) {
      expandedCard.value = null;
    }
    touchStartY.value = null;
  });

  return (
    <section class="relative overflow-hidden pb-2 pt-14 md:pt-8 md:pb-16">
      {/* Background decorations - mobile only */}
      <div class="lg:hidden absolute top-1/4 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div class="lg:hidden absolute bottom-1/4 right-10 w-64 h-64 bg-stone-300/20 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-0 lg:px-4">
        {/* Mobile: Textured container / Desktop: Clean */}
        <div
          class="relative lg:bg-transparent bg-gradient-to-br from-stone-200 to-stone-100 rounded-2xl p-3 lg:p-0 border border-stone-400/60 lg:border-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%232c2825' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
        {/* Show cards grid when nothing is expanded */}
        {expandedCard.value === null ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-4">
            {services.map((service, index) => {
              const accentStyles: Record<string, { border: string; overlay: string; button: string }> = {
                stone: {
                  border: "border-stone-300/60 hover:border-stone-400",
                  overlay: "from-stone-900/60 via-stone-900/40 to-stone-900/80",
                  button: "bg-stone-100/90 text-stone-700 group-hover:bg-stone-200"
                },
                orange: {
                  border: "border-orange-300/60 hover:border-orange-400",
                  overlay: "from-orange-900/60 via-stone-900/40 to-orange-900/80",
                  button: "bg-orange-100/90 text-orange-700 group-hover:bg-orange-200"
                },
                amber: {
                  border: "border-amber-300/60 hover:border-amber-400",
                  overlay: "from-amber-900/60 via-stone-900/40 to-amber-900/80",
                  button: "bg-amber-100/90 text-amber-700 group-hover:bg-amber-200"
                }
              };

              const style = accentStyles[service.accent];

              return (
                <button
                  key={index}
                  onClick$={(e) => handleCardClick(index, e, service.link, (service as any).isExternal)}
                  class={`group relative rounded-xl overflow-hidden border-2 lg:border ${style.border} transition-all duration-300 hover:scale-[1.02] lg:hover:scale-100 hover:shadow-2xl lg:hover:shadow-lg text-left w-full cursor-pointer bg-white`}
                >
                  {/* Image - tall on mobile, compact on desktop */}
                  <div class="aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3] relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={(service as any).title || t(locale, (service as any).titleKey as any)}
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 lg:group-hover:scale-105"
                      loading="eager"
                      decoding="sync"
                    />

                    {/* Gradient overlay */}
                    <div class={`absolute inset-0 bg-gradient-to-t ${style.overlay} lg:from-stone-900/80 lg:via-stone-900/30 lg:to-transparent`}></div>

                    {/* Content overlay */}
                    <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-4">
                      <h3 class="text-2xl lg:text-lg font-bold text-white mb-2 lg:mb-1 drop-shadow-lg lg:line-clamp-1">
                        {(service as any).title || t(locale, (service as any).titleKey as any)}
                      </h3>
                      <p class="text-white/90 lg:text-white/80 text-sm lg:text-xs leading-relaxed lg:leading-snug mb-4 lg:mb-2 drop-shadow lg:line-clamp-2">
                        {(service as any).description || t(locale, (service as any).descriptionKey as any)}
                      </p>

                      {/* Button */}
                      <div class={`inline-flex items-center gap-2 lg:gap-1.5 px-4 lg:px-2.5 py-2 lg:py-1.5 rounded-lg lg:rounded-md ${style.button} lg:bg-white/90 lg:text-stone-700 lg:group-hover:bg-white font-medium text-sm lg:text-xs transition-all duration-300 w-fit`}>
                        <span>{(service as any).buttonText || t(locale, "service.learnMore")}</span>
                        <svg class="w-4 lg:w-3 h-4 lg:h-3 transform group-hover:translate-x-1 lg:group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
            /* Expanded Content - replaces the cards grid */
            <div
              class="relative"
              ref={expandedRef}
              onTouchStart$={handleTouchStart}
              onTouchEnd$={handleTouchEnd}
            >
              {(() => {
                const service = services[expandedCard.value];
                return (
                  <div class="bg-stone-50 lg:bg-white rounded-xl overflow-hidden lg:border lg:border-stone-200 lg:shadow-lg">
                    {/* Header with image */}
                    <div class="relative aspect-[16/6] lg:aspect-[3/1] overflow-hidden">
                      <img
                        src={service.image}
                        alt={t(locale, service.titleKey as any)}
                        class="w-full h-full object-cover"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 lg:via-stone-900/30 to-stone-900/20 lg:to-transparent"></div>

                      {/* Title overlay */}
                      <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-5">
                        <h3 class="text-3xl md:text-4xl lg:text-2xl font-bold text-white mb-2 lg:mb-1 drop-shadow-lg">
                          {t(locale, service.titleKey as any)}
                        </h3>
                        <p class="text-white/90 text-base lg:text-sm leading-relaxed drop-shadow max-w-2xl">
                          {t(locale, service.descriptionKey as any)}
                        </p>
                      </div>

                      {/* Close button */}
                      <button
                        onClick$={handleClose}
                        class="absolute top-4 lg:top-3 right-4 lg:right-3 z-10 p-2 lg:p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <LuX class="w-6 lg:w-5 h-6 lg:h-5 text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div class="p-5 md:p-8 lg:p-5">
                      {/* Artist Profile Content */}
                      {(service as any).contentType === 'artistProfile' ? (
                        <>
                          {/* Artist Description */}
                          <p class="text-stone-600 leading-relaxed lg:text-sm mb-3 lg:mb-2">
                            {t(locale, "expanded.artistJourney")}
                          </p>
                          <p class="text-stone-600 leading-relaxed lg:text-sm mb-4 lg:mb-3">
                            {t(locale, "expanded.artistStyle")}
                          </p>

                          {/* Location Tags */}
                          <div class="flex flex-wrap gap-2 mb-6 lg:mb-4">
                            <span class="inline-flex items-center gap-1.5 lg:gap-1 px-3 lg:px-2 py-1.5 lg:py-1 rounded-lg lg:rounded-md text-sm lg:text-xs font-medium bg-stone-200/70 lg:bg-stone-100 text-stone-700 lg:text-stone-600">
                              <LuMapPin class="w-3.5 lg:w-3 h-3.5 lg:h-3" />
                              {t(locale, "expanded.fromNovaScotia")}
                            </span>
                            <span class="inline-flex items-center gap-1.5 lg:gap-1 px-3 lg:px-2 py-1.5 lg:py-1 rounded-lg lg:rounded-md text-sm lg:text-xs font-medium bg-stone-200/70 lg:bg-stone-100 text-stone-700 lg:text-stone-600">
                              <LuMapPin class="w-3.5 lg:w-3 h-3.5 lg:h-3" />
                              {t(locale, "expanded.basedInMontreal")}
                            </span>
                          </div>

                          {/* Portfolio Grid */}
                          <div class="mb-6 lg:mb-4">
                            <h4 class="text-lg lg:text-sm font-bold lg:font-semibold text-stone-800 mb-4 lg:mb-2">{t(locale, "service.portfolio")}</h4>
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
                                  {service.portfolioImages.map((img, idx) => {
                                    if (expandedGalleryItem.value?.item !== idx) return null;
                                    const isYouTube = img.startsWith('youtube:');
                                    const videoId = isYouTube ? img.replace('youtube:', '') : null;
                                    return isYouTube && videoId ? (
                                      <iframe
                                        key={idx}
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                        title="Video"
                                        class="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullscreen
                                      ></iframe>
                                    ) : (
                                      <img key={idx} src={img} alt="Gallery" class="w-full h-full object-cover" />
                                    );
                                  })}
                                </div>
                              )}
                              {/* Grid */}
                              <div class={`grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-2 ${expandedGalleryItem.value?.card === 1 ? 'invisible' : ''}`}>
                                {service.portfolioImages.map((img, idx) => {
                                  const isYouTube = img.startsWith('youtube:');
                                  const videoId = isYouTube ? img.replace('youtube:', '') : null;

                                  return (
                                    <div
                                      key={idx}
                                      class="aspect-video rounded-lg lg:rounded-md overflow-hidden border border-stone-300 lg:border-stone-200 shadow-sm lg:shadow-none relative cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick$={() => expandedGalleryItem.value = { card: 1, item: idx }}
                                    >
                                      {isYouTube && videoId ? (
                                        <>
                                          <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt="Video thumbnail"
                                            class="w-full h-full object-cover"
                                          />
                                          <div class="absolute bottom-1.5 lg:bottom-1 left-1.5 lg:left-1 bg-black/70 rounded-full p-1 lg:p-0.5 z-10">
                                            <svg class="w-3 lg:w-2.5 h-3 lg:h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                          </div>
                                        </>
                                      ) : (
                                        <img
                                          src={img}
                                          alt={`${t(locale, service.titleKey as any)} - ${idx + 1}`}
                                          class="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* CTA */}
                          <a
                            href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center justify-center gap-2 px-6 lg:px-4 py-3 lg:py-2 bg-stone-700 lg:bg-stone-800 hover:bg-stone-800 lg:hover:bg-stone-900 text-white font-semibold lg:font-medium text-base lg:text-sm rounded-lg shadow-lg lg:shadow-none transition-all duration-300 lg:transition-colors hover:scale-105 lg:hover:scale-100"
                          >
                            {t(locale, "expanded.listenOnSpotify")}
                            <svg class="w-4 lg:w-3.5 h-4 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </>
                      ) : (
                        <>
                          {/* Full Description */}
                          <p class="text-stone-600 leading-relaxed lg:text-sm mb-6 lg:mb-4">
                            {t(locale, (service as any).fullDescriptionKey as any)}
                          </p>

                          {/* Portfolio Grid */}
                          <div class="mb-6 lg:mb-4">
                            <h4 class="text-lg lg:text-sm font-bold lg:font-semibold text-stone-800 mb-4 lg:mb-2">{t(locale, "service.portfolio")}</h4>
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
                                  {service.portfolioImages.map((img, idx) => {
                                    if (expandedGalleryItem.value?.item !== idx) return null;
                                    const isYouTube = img.startsWith('youtube:');
                                    const videoId = isYouTube ? img.replace('youtube:', '') : null;
                                    return isYouTube && videoId ? (
                                      <iframe
                                        key={idx}
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                        title="Video"
                                        class="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullscreen
                                      ></iframe>
                                    ) : (
                                      <img key={idx} src={img} alt="Gallery" class="w-full h-full object-cover" />
                                    );
                                  })}
                                </div>
                              )}
                              {/* Grid */}
                              <div class={`grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-2 ${expandedGalleryItem.value?.card === 2 ? 'invisible' : ''}`}>
                                {service.portfolioImages.map((img, idx) => {
                                  const isYouTube = img.startsWith('youtube:');
                                  const videoId = isYouTube ? img.replace('youtube:', '') : null;

                                  return (
                                    <div
                                      key={idx}
                                      class="aspect-video rounded-lg lg:rounded-md overflow-hidden border border-stone-300 lg:border-stone-200 shadow-sm lg:shadow-none relative cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick$={() => expandedGalleryItem.value = { card: 2, item: idx }}
                                    >
                                      {isYouTube && videoId ? (
                                        <>
                                          <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt="Video thumbnail"
                                            class="w-full h-full object-cover"
                                          />
                                          <div class="absolute bottom-1.5 lg:bottom-1 left-1.5 lg:left-1 bg-black/70 rounded-full p-1 lg:p-0.5 z-10">
                                            <svg class="w-3 lg:w-2.5 h-3 lg:h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                          </div>
                                        </>
                                      ) : (
                                        <img
                                          src={img}
                                          alt={`${t(locale, service.titleKey as any)} - ${idx + 1}`}
                                          class="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* CTA */}
                          <a
                            href="mailto:book@phineasstewart.com"
                            class="inline-flex items-center justify-center gap-2 px-6 lg:px-4 py-3 lg:py-2 bg-stone-700 lg:bg-stone-800 hover:bg-stone-800 lg:hover:bg-stone-900 text-white font-semibold lg:font-medium text-base lg:text-sm rounded-lg shadow-lg lg:shadow-none transition-all duration-300 lg:transition-colors hover:scale-105 lg:hover:scale-100"
                          >
                            {t(locale, "service.bookSessionViolinist")}
                            <svg class="w-4 lg:w-3.5 h-4 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
