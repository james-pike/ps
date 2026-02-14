import { component$, useSignal, $ } from "@builder.io/qwik";
import { LuX } from "@qwikest/icons/lucide";

export default component$(() => {
  const expandedCard = useSignal<number | null>(null);

  const services = [
    {
      title: "Studio Sessions",
      description: "Professional violin recording for albums, singles, and soundtracks.",
      fullDescription: "Transform your music with professional violin recordings. From classical to contemporary, I bring soul and precision to every track. Whether you're producing an album, single, or soundtrack, my studio sessions deliver the rich, emotive sound that elevates your project.",
      link: "/offerings#studio",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
      accent: "stone",
      portfolioImages: [
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
        "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80"
      ]
    },
    {
      title: "Live Performance",
      description: "Bringing elegance and emotion to weddings, events, and concerts.",
      fullDescription: "Create unforgettable moments with live violin performances. Specializing in weddings, corporate events, and intimate concerts, I craft musical experiences that resonate with your audience. From classical elegance to modern arrangements, each performance is tailored to your vision.",
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
      title: "My Music",
      description: "Listen to my original music and arrangements on Spotify.",
      fullDescription: "Discover unique violin arrangements and original compositions. I create custom transcriptions that breathe new life into beloved pieces and compose original works that showcase the violin's versatility. Each arrangement is crafted with musicality and technical excellence in mind.",
      link: "https://open.spotify.com/artist/6XYvaoDGE0VmRt83Jss9Sn",
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
      <section class="relative overflow-hidden pb-7 pt-4 md:pt-6 md:pb-28">
        {/* Background decorations */}
        <div class="absolute top-1/4 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-10 w-64 h-64 bg-stone-300/20 rounded-full blur-3xl"></div>

        <div class="relative max-w-7xl mx-auto px-5 md:px-12">
          {/* Services Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                  class={`group relative rounded-2xl overflow-hidden border-2 ${style.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-left w-full cursor-pointer`}
                >
                  {/* Image */}
                  <div class="aspect-[4/3] md:aspect-[4/5] relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div class={`absolute inset-0 bg-gradient-to-t ${style.overlay}`}></div>

                    {/* Content overlay */}
                    <div class="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {service.title}
                      </h3>
                      <p class="text-white/90 text-sm leading-relaxed mb-4 drop-shadow">
                        {service.description}
                      </p>

                      {/* Button */}
                      <div class={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${style.button} font-medium text-sm transition-all duration-300 w-fit`}>
                        <span>Learn more</span>
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
      </section>

      {/* Expanded Modal View */}
      {expandedCard.value !== null && (
        <div class="fixed inset-x-0 top-[8vh] bottom-[8vh] z-[100] bg-stone-50 overflow-y-auto animate-fade-in rounded-t-3xl shadow-2xl">
          {/* Close Button */}
          <button
            onClick$={handleClose}
            class="fixed top-[8vh] right-4 z-10 mt-4 p-3 rounded-full bg-stone-200 hover:bg-stone-300 transition-colors shadow-lg"
          >
            <LuX class="w-6 h-6 text-stone-700" />
          </button>

          {/* Content */}
          <div class="max-w-7xl mx-auto px-5 md:px-12 py-12 md:py-20">
            {(() => {
              const service = services[expandedCard.value];
              return (
                <>
                  {/* Header Section */}
                  <div class="mb-12">
                    <h1 class="text-4xl md:text-6xl font-bold text-stone-800 mb-4">
                      {service.title}
                    </h1>
                    <p class="text-xl md:text-2xl text-stone-600 mb-6">
                      {service.description}
                    </p>
                    <p class="text-lg text-stone-600 leading-relaxed max-w-3xl">
                      {service.fullDescription}
                    </p>
                  </div>

                  {/* Portfolio Grid */}
                  <div class="mb-12">
                    <h2 class="text-3xl font-bold text-stone-800 mb-6">Portfolio</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {service.portfolioImages.map((img, idx) => (
                        <div key={idx} class="aspect-video rounded-xl overflow-hidden border-2 border-stone-300 shadow-lg">
                          <img
                            src={img}
                            alt={`${service.title} - Portfolio ${idx + 1}`}
                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div class="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-8 md:p-12 text-center">
                    <h3 class="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                      Ready to work together?
                    </h3>
                    <p class="text-lg text-stone-600 mb-6 max-w-2xl mx-auto">
                      Let's create something beautiful. Get in touch to discuss your project.
                    </p>
                    <a
                      href="mailto:hi@phineasstewart.com"
                      class="inline-flex items-center gap-2 px-8 py-4 bg-stone-700 hover:bg-stone-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Contact Me
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