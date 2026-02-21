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
      contentType: "myMusic",
      link: "#my-music",
      image: "/images/ap1.jpg",
      accent: "stone",
      portfolioImages: []
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-4 lg:auto-rows-[180px]">
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

              // Bento grid spans for desktop
              const bentoClasses = [
                "lg:col-span-5 lg:row-span-2", // New Single - large left
                "lg:col-span-4 lg:row-span-1", // Studio Sessions - medium top right
                "lg:col-span-3 lg:row-span-2", // Artist Profile - tall right
                "lg:col-span-4 lg:row-span-1", // My Music - medium bottom middle
              ];

              return (
                <button
                  key={index}
                  onClick$={(e) => handleCardClick(index, e, service.link, (service as any).isExternal)}
                  class={`group relative rounded-xl overflow-hidden border-2 lg:border ${style.border} transition-all duration-300 hover:scale-[1.02] lg:hover:scale-[1.01] hover:shadow-2xl lg:hover:shadow-xl text-left w-full cursor-pointer bg-white ${bentoClasses[index]}`}
                >
                  {/* Image - tall on mobile, fills bento cell on desktop */}
                  <div class="aspect-[4/3] md:aspect-[4/5] lg:aspect-auto lg:absolute lg:inset-0 relative overflow-hidden">
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
                      {/* My Music Content - Streaming Links */}
                      {(service as any).contentType === 'myMusic' ? (
                        <>
                          <p class="text-stone-600 leading-relaxed lg:text-sm mb-5 lg:mb-4">
                            {t(locale, "expanded.listenOnPlatforms")}
                          </p>

                          {/* Streaming Links */}
                          <div class="space-y-3 lg:space-y-2">
                            {/* Spotify */}
                            <a
                              href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa?si=gJGmImiyRO-q6Y0bQLmzOg"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-4 w-full px-5 lg:px-4 py-4 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              <svg class="w-7 lg:w-6 h-7 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                              </svg>
                              <span class="text-lg lg:text-base">Spotify</span>
                              <svg class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>

                            {/* Apple Music */}
                            <a
                              href="https://music.apple.com/ca/artist/phineas-stewart/1717275618"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-4 w-full px-5 lg:px-4 py-4 lg:py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              <svg class="w-7 lg:w-6 h-7 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
                              </svg>
                              <span class="text-lg lg:text-base">Apple Music</span>
                              <svg class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>

                            {/* YouTube Music */}
                            <a
                              href="https://music.youtube.com/channel/UCg9YF9SN504fQCvjf0ra_XQ?si=zethm1ZVPTYsRqHU"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-4 w-full px-5 lg:px-4 py-4 lg:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              <svg class="w-7 lg:w-6 h-7 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                              </svg>
                              <span class="text-lg lg:text-base">YouTube Music</span>
                              <svg class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>

                            {/* Amazon Music */}
                            <a
                              href="https://music.amazon.com/artists/B09XX8QJDN/phineas-stewart"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-4 w-full px-5 lg:px-4 py-4 lg:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              <svg class="w-7 lg:w-6 h-7 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 0 1-.753.072c-1.06-.879-1.25-1.286-1.831-2.121-1.748 1.784-2.988 2.318-5.254 2.318-2.683 0-4.77-1.656-4.77-4.968 0-2.586 1.401-4.347 3.403-5.209 1.735-.755 4.159-.891 6.011-1.099v-.411c0-.755.058-1.646-.385-2.298-.385-.58-1.124-.82-1.772-.82-1.205 0-2.276.618-2.539 1.897-.054.284-.262.564-.548.578l-3.068-.332c-.259-.058-.545-.266-.473-.66.71-3.735 4.088-4.863 7.112-4.863 1.547 0 3.568.411 4.786 1.581 1.547 1.437 1.399 3.352 1.399 5.437v4.923c0 1.48.616 2.13 1.196 2.929.203.288.247.63-.011.843-.647.541-1.799 1.545-2.432 2.107l-.072-.067zM21.779 20.332c-1.414 1.104-3.456 1.685-5.209 1.685-2.465 0-4.682-.912-6.359-2.429-.131-.119-.014-.281.144-.189 1.812 1.054 4.056 1.686 6.372 1.686 1.563 0 3.282-.324 4.863-.995.239-.102.439.157.189.242zM22.8 18.999c-.179-.228-1.178-.108-1.629-.054-.136.017-.157-.102-.034-.189.798-.559 2.107-.398 2.26-.211.151.189-.041 1.499-.788 2.125-.114.096-.224.044-.173-.082.168-.421.545-1.36.364-1.589z"/>
                              </svg>
                              <span class="text-lg lg:text-base">Amazon Music</span>
                              <svg class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>

                            {/* Tidal */}
                            <a
                              href="https://tidal.com/artist/43916985/u"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-4 w-full px-5 lg:px-4 py-4 lg:py-3 bg-gradient-to-r from-stone-800 to-stone-900 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                              <svg class="w-7 lg:w-6 h-7 lg:h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zm4.004 4.004l4.004-4.004L24.024 7.996l-4.004 4.004-4.004-4.004z"/>
                              </svg>
                              <span class="text-lg lg:text-base">Tidal</span>
                              <svg class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>
                          </div>
                        </>
                      ) : (service as any).contentType === 'artistProfile' ? (
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

                          {/* CTA - Opens My Music streaming links */}
                          <button
                            onClick$={() => { expandedCard.value = 3; }}
                            class="inline-flex items-center justify-center gap-2 px-6 lg:px-4 py-3 lg:py-2 bg-stone-700 lg:bg-stone-800 hover:bg-stone-800 lg:hover:bg-stone-900 text-white font-semibold lg:font-medium text-base lg:text-sm rounded-lg shadow-lg lg:shadow-none transition-all duration-300 lg:transition-colors hover:scale-105 lg:hover:scale-100"
                          >
                            {t(locale, "expanded.listenToMyMusic")}
                            <svg class="w-4 lg:w-3.5 h-4 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
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
