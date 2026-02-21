import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  LuInstagram,
  LuYoutube,
  LuMail,
  LuGlobe,
} from "@qwikest/icons/lucide";
import { useI18n, setLanguage as setLang, type Language, t } from "~/context/i18n";

export default component$(() => {
  const i18n = useI18n();
  const locale = i18n.locale.value;
  const showLangDropdown = useSignal(false);

  const handleSetLanguage = $((lang: Language) => {
    i18n.locale.value = lang;
    setLang(lang);
    showLangDropdown.value = false;
  });

  return (
    <footer
      class="relative border-t pl-1 mt-2 lg:mt-0 pb-0 md:pb-8 border-stone-200/80 overflow-hidden bg-gradient-to-b from-stone-200 to-stone-100"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%232c2825' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div class="relative max-w-7xl mx-auto px-4 md:mr-4 sm:px-6 md:px-8">
        <div class="grid grid-cols-12 gap-4 gap-y-4 sm:gap-4 py-5 md:pt-6 md:pb-2">
          {/* First Column: Logo, Description */}
          <div class="col-span-12 lg:col-span-5 md:pr-8">
            {/* Text container with semi-transparent background */}
            <div class="bg-stone-100/50 backdrop-blur-[2px] rounded-xl p-4 -ml-2">
              <div class="mb-3">
                <Link class="inline-block font-bold text-2xl text-stone-700 hover:text-stone-800 transition-colors" href={"/"}>
                  Phineas Stewart
                </Link>
              </div>
              <div class="text-base text-stone-600 leading-relaxed">
                {t(locale, "footer.description")}
              </div>

              {/* Social Icons */}
              <div class="flex gap-3 mt-4">
              <a
                href="https://www.youtube.com/channel/UCeX217HOtpviekPVlEO8jJQ"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-full bg-stone-200/70 border border-stone-300/60 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all duration-300"
                title="YouTube"
              >
                <LuYoutube class="w-5 h-5" />
              </a>
              <a
                href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-full bg-stone-200/70 border border-stone-300/60 text-green-600 hover:bg-green-50 hover:border-green-300 hover:scale-110 transition-all duration-300"
                title="Spotify"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@phineasstewart"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-full bg-stone-200/70 border border-stone-300/60 text-stone-800 hover:bg-stone-100 hover:border-stone-400 hover:scale-110 transition-all duration-300"
                title="TikTok"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/phineasstewart"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-full bg-stone-200/70 border border-stone-300/60 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-110 transition-all duration-300"
                title="Instagram"
              >
                <LuInstagram class="w-5 h-5" />
              </a>
            </div>

              {/* Copyright */}
              <p class="text-sm text-stone-500 mt-4 pt-4 border-t border-stone-300/50">&copy; 2026 Phineas Stewart. All rights reserved.</p>
            </div>
          </div>

          {/* Newsletter Section - Desktop only */}
          <div class="hidden lg:block col-span-12 lg:col-span-7">
            <div class="bg-stone-100/50 backdrop-blur-[2px] rounded-xl p-5 h-full flex flex-col justify-center">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-full bg-stone-200/70 border border-stone-300/60">
                  <LuMail class="w-6 h-6 text-stone-600" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-1">
                    <span class="bg-gradient-to-r from-stone-700 via-amber-700 to-stone-700 bg-clip-text text-transparent">
                      {t(locale, "newsletter.stayUpdated")}
                    </span>
                  </h3>
                  <p class="text-sm text-stone-600 mb-3">
                    {t(locale, "newsletter.description")}
                  </p>
                  <div class="flex items-center gap-3">
                    <form
                      action="https://phineasstewart.us4.list-manage.com/subscribe/post?u=YOUR_USER_ID&amp;id=c4a46eab58"
                      method="post"
                      class="flex w-full max-w-md"
                      target="_blank"
                      noValidate
                    >
                      <input
                        type="email"
                        name="EMAIL"
                        class="flex-1 px-4 py-2.5 text-sm border border-stone-300 rounded-l-xl bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    </form>

                    {/* Language Switcher */}
                    <div class="relative">
                      <button
                        class="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 transition-colors"
                        onClick$={() => showLangDropdown.value = !showLangDropdown.value}
                      >
                        <LuGlobe class="w-4 h-4 text-stone-600" />
                        <span class="text-sm font-medium text-stone-700 uppercase">{locale}</span>
                      </button>
                      {showLangDropdown.value && (
                        <div class="absolute bottom-full mb-2 right-0 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                          <button
                            class={`w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 transition-colors ${locale === 'en' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                            onClick$={() => handleSetLanguage('en')}
                          >
                            English
                          </button>
                          <button
                            class={`w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 transition-colors ${locale === 'fr' ? 'text-amber-700 font-semibold bg-amber-50' : 'text-stone-700'}`}
                            onClick$={() => handleSetLanguage('fr')}
                          >
                            Français
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});