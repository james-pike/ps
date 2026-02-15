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

        {/* Newsletter Section */}
        <section class="relative py-16 px-5 overflow-hidden bg-stone-100">
          <div class="relative max-w-xl mx-auto">
            {/* Card container with darker background */}
            <div class="relative bg-stone-200/90 rounded-2xl p-8 border border-stone-300/60 shadow-lg">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold mb-2">
                  <span class="bg-gradient-to-r from-stone-700 via-amber-700 to-stone-700 bg-clip-text text-transparent">
                    Stay Updated
                  </span>
                </h2>
                <p class="text-sm text-stone-600">
                  Get the latest news and updates delivered to your inbox.
                </p>
              </div>
              <div id="mc_embed_shell_mobile">
                <div id="mc_embed_signup_mobile">
                  <form
                    action="#"
                    method="post"
                    class="validate flex w-full"
                    target="_self"
                    noValidate
                  >
                    <div class="flex w-full">
                      <input
                        type="email"
                        name="EMAIL"
                        class="required email flex-1 px-4 py-3 text-sm border border-stone-300 rounded-l-xl bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter your email"
                        aria-label="Enter email for newsletter"
                        required
                        value=""
                      />
                      <input
                        type="submit"
                        name="subscribe"
                        class="px-6 py-3 bg-gradient-to-r from-stone-500 to-stone-600 text-white text-base font-medium rounded-r-xl hover:from-stone-400 hover:to-stone-500 transition-all duration-200"
                        value="Subscribe"
                        role="button"
                        aria-label="Subscribe to newsletter"
                      />
                    </div>
                  </form>
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