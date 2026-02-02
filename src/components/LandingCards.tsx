import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const services = [
    {
      title: "Studio Sessions",
      description: "Professional violin recording for albums, singles, and soundtracks.",
      link: "/offerings#studio",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
      accent: "stone"
    },
    {
      title: "Live Performance",
      description: "Bringing elegance and emotion to weddings, events, and concerts.",
      link: "/offerings#live",
      image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
      accent: "orange"
    },
    {
      title: "Collaboration",
      description: "Creative partnerships with producers, composers, and artists.",
      link: "/contact",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
      accent: "amber"
    },
    {
      title: "Sheet Music",
      description: "Custom arrangements and transcriptions for violin.",
      link: "/offerings#arrangements",
      image: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800&q=80",
      accent: "stone"
    }
  ];

  return (
    <section class="relative overflow-hidden pb-7 md:py-28">
      {/* Background decorations */}
      <div class="absolute top-1/4 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-10 w-64 h-64 bg-stone-300/20 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-5 md:px-12">
        {/* Section Header */}
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span class="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 bg-clip-text text-transparent">
              What I Do
            </span>
          </h2>
          <p class="text-xl text-stone-600 max-w-3xl mx-auto">
            From intimate studio sessions to grand live performances, I bring versatility and passion to every project.
          </p>
        </div>

        {/* Services Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
              <a
                key={index}
                href={service.link}
                class={`group relative rounded-2xl overflow-hidden border-2 ${style.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
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
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
});