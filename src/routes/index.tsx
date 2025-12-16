import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import Hero from "~/components/widgets/Hero";
import LandingCards from "~/components/LandingCards";
import ClassesCarousel from "~/components/widgets/ClassesCarousel";

export default component$(() => {
  return (
    <>
      <div class="bg-black">
        <Hero />

        {/* Featured Performances Carousel */}
        <ClassesCarousel />

        {/* Services Section */}
        <LandingCards />

        {/* Video Showcase Section */}
        <section class="relative py-20 md:py-28 bg-gradient-to-b from-black to-tertiary-950 overflow-hidden">
          <div class="max-w-7xl mx-auto px-5 md:px-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
                  Recent Performances
                </span>
              </h2>
              <p class="text-xl text-tertiary-300 max-w-3xl mx-auto">
                Watch highlights from recent studio sessions and live performances.
              </p>
            </div>

            {/* Video Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Card 1 */}
              <div class="group relative bg-gradient-to-br from-tertiary-900/50 to-black border border-tertiary-800/50 rounded-2xl overflow-hidden hover:border-primary-600/50 transition-all duration-300">
                <div class="aspect-video relative bg-tertiary-900">
                  {/* Placeholder for video - replace with actual video embed */}
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-20 h-20 mx-auto rounded-full bg-primary-600/20 border-2 border-primary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                        <svg class="w-8 h-8 text-primary-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                      <p class="text-tertiary-400">Studio Session Highlight</p>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold text-white mb-2">Concert Hall Recording</h3>
                  <p class="text-tertiary-400">Classical performance at the Grand Theater</p>
                </div>
              </div>

              {/* Video Card 2 */}
              <div class="group relative bg-gradient-to-br from-tertiary-900/50 to-black border border-tertiary-800/50 rounded-2xl overflow-hidden hover:border-primary-600/50 transition-all duration-300">
                <div class="aspect-video relative bg-tertiary-900">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-20 h-20 mx-auto rounded-full bg-primary-600/20 border-2 border-primary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                        <svg class="w-8 h-8 text-primary-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                      <p class="text-tertiary-400">Live Performance</p>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold text-white mb-2">Jazz Collaboration</h3>
                  <p class="text-tertiary-400">Improvisation session with local jazz quartet</p>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div class="text-center mt-12">
              <a
                href="/gallery"
                class="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-900/50 transition-all duration-300 hover:scale-105"
              >
                View Full Gallery
              </a>
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