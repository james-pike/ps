import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import Hero from "~/components/widgets/Hero";
import LandingCards from "~/components/LandingCards";

export default component$(() => {
  return (
    <>
      <div>
        <Hero />

        {/* Services Section */}
        <LandingCards />

        {/* Video Showcase Section */}
        <section class="relative py-20 md:py-28 overflow-hidden">
          <div class="relative max-w-7xl mx-auto px-5 md:px-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span class="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 bg-clip-text text-transparent">
                  Recent Performances
                </span>
              </h2>
              <p class="text-xl text-stone-600 max-w-3xl mx-auto">
                Watch highlights from recent studio sessions and live performances.
              </p>
            </div>

            {/* Video Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Card 1 */}
              <div class="group relative bg-gradient-to-br from-white/90 to-stone-100/90 border border-stone-200/80 rounded-2xl overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                <div class="aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80"
                    alt="Concert Hall Recording"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                    <div class="w-20 h-20 mx-auto rounded-full bg-amber-100/80 border-2 border-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                      <svg class="w-8 h-8 text-amber-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold text-stone-800 mb-2">Concert Hall Recording</h3>
                  <p class="text-stone-500">Classical performance at the Grand Theater</p>
                </div>
              </div>

              {/* Video Card 2 */}
              <div class="group relative bg-gradient-to-br from-white/90 to-stone-100/90 border border-stone-200/80 rounded-2xl overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                <div class="aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80"
                    alt="Jazz Collaboration"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                    <div class="w-20 h-20 mx-auto rounded-full bg-amber-100/80 border-2 border-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                      <svg class="w-8 h-8 text-amber-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold text-stone-800 mb-2">Jazz Collaboration</h3>
                  <p class="text-stone-500">Improvisation session with local jazz quartet</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: SITE.title,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};