import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import Hero from "~/components/widgets/Hero";
import { useI18n, t } from "~/context/i18n";

export default component$(() => {
  const i18n = useI18n();
  const locale = i18n.locale.value;

  return (
    <>
      <div>
        <Hero />

        {/* Newsletter Section - Mobile only, desktop is in footer */}
        <section class="lg:hidden relative pt-2 pb-4 px-2.5 overflow-hidden bg-stone-100">
          <div class="relative max-w-xl mx-auto">
            {/* Outer container with darker textured border */}
            <div
              class="relative bg-gradient-to-r from-stone-200 to-stone-100 rounded-2xl p-3 md:p-4 border border-stone-300/60 shadow-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%2357534e' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              {/* Inner content with lighter semi-transparent background */}
              <div
                class="relative bg-stone-50/80 backdrop-blur-sm rounded-xl p-6"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%2378716c' fill-opacity='0.08'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                <div class="text-center mb-4">
                  <h2 class="text-xl font-bold mb-1">
                    <span class="bg-gradient-to-r from-stone-700 via-amber-700 to-stone-700 bg-clip-text text-transparent">
                      {t(locale, "newsletter.stayUpdated")}
                    </span>
                  </h2>
                  <p class="text-sm text-stone-600">
                    {t(locale, "newsletter.description")}
                  </p>
                </div>
                <div id="mc_embed_shell_mobile">
                  <div id="mc_embed_signup_mobile">
                    <form
                      action="https://phineasstewart.us4.list-manage.com/subscribe/post?u=YOUR_USER_ID&amp;id=c4a46eab58"
                      method="post"
                      class="validate flex w-full"
                      target="_blank"
                      noValidate
                    >
                      <div class="flex w-full">
                        <input
                          type="email"
                          name="EMAIL"
                          class="required email flex-1 px-4 py-2.5 text-sm border border-stone-300 rounded-l-xl bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder={t(locale, "newsletter.placeholder")}
                          aria-label={t(locale, "newsletter.placeholder")}
                          required
                        />
                        <input
                          type="submit"
                          name="subscribe"
                          class="px-5 py-2.5 bg-gradient-to-r from-stone-500 to-stone-600 text-white text-sm font-medium rounded-r-xl hover:from-stone-400 hover:to-stone-500 transition-all duration-200 cursor-pointer"
                          value={t(locale, "newsletter.subscribe")}
                        />
                      </div>
                    </form>
                  </div>
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