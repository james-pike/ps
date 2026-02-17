import { component$, useSignal, $ } from "@builder.io/qwik";
import { LuX } from "@qwikest/icons/lucide";
import { useI18n, t } from "~/context/i18n";

export default component$(() => {
  const expandedCard = useSignal<number | null>(null);
  const i18n = useI18n();
  const locale = i18n.locale.value;

  const services = [
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
      titleKey: "service.livePerformance",
      descriptionKey: "service.livePerformanceDesc",
      fullDescriptionKey: "service.livePerformanceFullDesc",
      link: "/offerings#live",
      image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
      accent: "stone",
      portfolioImages: [
        "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
      ]
    },
    {
      titleKey: "service.myMusic",
      descriptionKey: "service.myMusicDesc",
      fullDescriptionKey: "service.myMusicFullDesc",
      link: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa",
      image: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80",
      accent: "stone",
      portfolioImages: [
        "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80"
      ]
    }
  ];

  const handleCardClick = $((index: number, e: Event, link: string) => {
    // If it's "My Music" (index 2), navigate to Spotify instead of expanding
    if (index === 2) {
      window.open(link, '_blank');
      return;
    }
    e.preventDefault();
    expandedCard.value = index;
  });

  const handleClose = $(() => {
    expandedCard.value = null;
  });

  return (
    <>
      <section class="relative overflow-hidden pb-7 pt-2 md:pt-6 md:pb-28">
        {/* Background decorations */}
        <div class="absolute top-1/4 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-10 w-64 h-64 bg-stone-300/20 rounded-full blur-3xl"></div>

        <div class="relative max-w-7xl mx-auto px-3 md:px-4">
          {/* Textured container for all cards */}
          <div
            class="relative bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl p-5 md:p-6 border-2 border-stone-300/60"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%2378716c' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            {/* Services Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                    onClick$={(e) => handleCardClick(index, e, service.link)}
                    class={`group relative rounded-xl overflow-hidden border-2 ${style.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-left w-full cursor-pointer bg-white`}
                  >
                    {/* Image */}
                    <div class="aspect-[4/3] md:aspect-[4/5] relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={t(locale, service.titleKey as any)}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Gradient overlay */}
                      <div class={`absolute inset-0 bg-gradient-to-t ${style.overlay}`}></div>

                      {/* Content overlay */}
                      <div class="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {t(locale, service.titleKey as any)}
                        </h3>
                        <p class="text-white/90 text-sm leading-relaxed mb-4 drop-shadow">
                          {t(locale, service.descriptionKey as any)}
                        </p>

                        {/* Button */}
                        <div class={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${style.button} font-medium text-sm transition-all duration-300 w-fit`}>
                          <span>{t(locale, "service.learnMore")}</span>
                          <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Modal View */}
      {expandedCard.value !== null && (
        <div
          class={`fixed inset-x-0 top-[8vh] bottom-0 z-[100] overflow-y-auto animate-fade-in rounded-t-3xl shadow-2xl ${
            expandedCard.value === 0
              ? 'bg-yellow-50'
              : 'bg-stone-50'
          }`}
          style={expandedCard.value === 0 ? {
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23d4a574' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
          } : undefined}
        >
          {/* Close Button */}
          <button
            onClick$={handleClose}
            class={`fixed top-[8vh] right-4 z-10 mt-4 p-3 rounded-full transition-colors shadow-lg ${
              expandedCard.value === 0
                ? 'bg-yellow-100 hover:bg-yellow-200'
                : 'bg-stone-200 hover:bg-stone-300'
            }`}
          >
            <LuX class={`w-6 h-6 ${expandedCard.value === 0 ? 'text-yellow-800' : 'text-stone-700'}`} />
          </button>

          {/* Content */}
          <div class="max-w-7xl mx-auto px-5 md:px-12 py-12 md:py-20">
            {(() => {
              const service = services[expandedCard.value];
              const isStudio = expandedCard.value === 0;
              return (
                <>
                  {/* Header Section */}
                  <div class="mb-12">
                    <h1 class={`text-4xl md:text-6xl font-bold mb-4 ${isStudio ? 'text-yellow-900' : 'text-stone-800'}`}>
                      {t(locale, service.titleKey as any)}
                    </h1>
                    <p class={`text-xl md:text-2xl mb-6 ${isStudio ? 'text-yellow-800' : 'text-stone-600'}`}>
                      {t(locale, service.descriptionKey as any)}
                    </p>
                    <p class={`text-lg leading-relaxed max-w-3xl ${isStudio ? 'text-yellow-800/80' : 'text-stone-600'}`}>
                      {t(locale, service.fullDescriptionKey as any)}
                    </p>
                  </div>

                  {/* Portfolio Grid */}
                  <div class="mb-12">
                    <h2 class={`text-3xl font-bold mb-6 ${isStudio ? 'text-yellow-900' : 'text-stone-800'}`}>{t(locale, "service.portfolio")}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {service.portfolioImages.map((img, idx) => {
                        const isYouTube = img.startsWith('youtube:');
                        const videoId = isYouTube ? img.replace('youtube:', '') : null;

                        return (
                          <div key={idx} class={`aspect-video rounded-xl overflow-hidden border-2 shadow-lg ${isStudio ? 'border-yellow-300' : 'border-stone-300'}`}>
                            {isYouTube && videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video"
                                class="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullscreen
                              />
                            ) : (
                              <img
                                src={img}
                                alt={`${t(locale, service.titleKey as any)} - ${t(locale, "service.portfolio")} ${idx + 1}`}
                                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div class={`rounded-2xl p-8 md:p-12 text-center ${
                    isStudio
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-100'
                      : 'bg-gradient-to-br from-stone-100 to-stone-200'
                  }`}>
                    <h3 class={`text-2xl md:text-3xl font-bold mb-4 ${isStudio ? 'text-yellow-900' : 'text-stone-800'}`}>
                      {t(locale, expandedCard.value === 0 ? "service.readyToElevate" : expandedCard.value === 1 ? "service.readyToBook" : "service.readyToElevate")}
                    </h3>
                    <p class={`text-lg mb-6 max-w-2xl mx-auto ${isStudio ? 'text-yellow-800' : 'text-stone-600'}`}>
                      {t(locale, expandedCard.value === 0 ? "service.studioCTA" : expandedCard.value === 1 ? "service.liveCTA" : "service.studioCTA")}
                    </p>
                    <a
                      href="mailto:book@phineasstewart.com"
                      class={`inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 ${
                        isStudio
                          ? 'bg-yellow-700 hover:bg-yellow-800 text-white'
                          : 'bg-stone-700 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {t(locale, expandedCard.value === 0 ? "service.bookSessionViolinist" : expandedCard.value === 1 ? "service.bookLivePerformance" : "service.bookSessionViolinist")}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
});