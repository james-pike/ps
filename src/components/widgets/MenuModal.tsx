import { component$, useSignal, $, Signal, useVisibleTask$ } from "@builder.io/qwik";
import { LuX, LuChevronDown, LuFacebook, LuInstagram, LuGlobe, LuYoutube, LuMusic, LuCalendar } from "@qwikest/icons/lucide";
import { cn } from "@qwik-ui/utils";
import { useLocation } from "@builder.io/qwik-city";
import { Modal } from "../ui/Modal";
import IconHamburger from "../icons/IconHamburger";
import { buttonVariants } from "../ui/Button";
import { useI18n, setLanguage as setLang, type Language } from "~/context/i18n";

const CustomAccordion = component$(({ items, show }: { items: any[]; show: Signal<boolean> }) => {
  const openIndex = useSignal<number | null>(null);
  const location = useLocation();

  useVisibleTask$(({ track }) => {
    track(() => show.value);
    if (!show.value) {
      openIndex.value = null;
    }
  });

  const closeModal = $(() => (show.value = false));

  // Normalize paths to handle trailing slashes
  const normalizePath = (path: string) => path.replace(/\/$/, "");

  return (
    <div class="border-t border-primary-800/30">
      {items.map((item, index) => {
        // Check if the current route matches the item or any subitem
        const currentPath = normalizePath(location.url.pathname);
        const isActive =
          normalizePath(item.href) === currentPath ||
          (item.hasSubmenu &&
            item.subitems?.some((subitem: any) =>
              normalizePath(subitem.href.split("#")[0]) === currentPath
            ));
        return (
          <div
            key={index}
            class={cn(
              index > 0 && "border-t border-primary-800/30",
              index === items.length - 1 && "border-b-0"
            )}
          >
            {item.hasSubmenu ? (
              <>
                <button
                  class={cn(
                    "!text-xl font-medium text-tertiary-200 flex items-center justify-between w-full p-2.5 px-5",
                    isActive &&
                      "bg-primary-900/50 text-primary-300 font-bold",
                    "hover:bg-primary-900/30 transition-all duration-200"
                  )}
                  onClick$={() => (openIndex.value = openIndex.value === index ? null : index)}
                >
                  <span>{item.title}</span>
                  <LuChevronDown
                    class={cn(
                      "h-6 w-6 text-tertiary-400 transition-transform duration-200",
                      openIndex.value === index && "rotate-180"
                    )}
                  />
                </button>
                <div
                  class={cn(
                    "text-xl text-muted-foreground transition-all duration-500 ease-in-out max-h-0 overflow-hidden",
                    openIndex.value === index && "max-h-96"
                  )}
                >
                  <ul class="flex flex-col gap-0 pl-5">
                    {item.subitems!.map((subitem: any) => {
                      // Updated logic: Compare full href (including hash) with current pathname + hash
                      const isSubitemActive =
                        normalizePath(subitem.href) ===
                        normalizePath(location.url.pathname + (location.url.hash || ""));
                      const isExternalLink = subitem.href?.startsWith('http');
                      const linkProps = {
                        href: subitem.href,
                        ...(isExternalLink && { target: "_blank", rel: "noopener noreferrer" })
                      };
                      return (
                        <li key={subitem.title} class="flex items-center">
                          <span class="text-primary-400 !text-2xs mr-3">✦</span>
                          <a
                            {...linkProps}
                            class={cn(
                              "block text-tertiary-300 !text-xl p-3 pl-1 font-medium transition-all duration-200",
                              isSubitemActive &&
                                "bg-primary-900/50 text-primary-300 font-bold",
                              "hover:bg-primary-900/30"
                            )}
                            onClick$={closeModal}
                          >
                            {subitem.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            ) : (
              (() => {
                const itemLinkProps = {
                  href: item.href,
                  ...(item.href?.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })
                };
                return (
                  <a
                    {...itemLinkProps}
                    class={cn(
                      "block lg text-tertiary-200 !text-xl p-3 px-5 font-medium transition-all duration-200",
                      isActive &&
                        "bg-primary-900/50 text-primary-300 font-bold",
                      "hover:bg-primary-900/30"
                    )}
                    onClick$={closeModal}
                  >
                    <span>{item.title}</span>
                    {item.badge}
                  </a>
                );
              })()
            )}
          </div>
        );
      })}
    </div>
  );
});



// ... CustomAccordion component unchanged ...

// Exported for use in Hero flip cards
export const menuItems = [
  { title: "Session Violinist", href: "/", badge: null },
  { title: "Live Performances", href: "/", badge: null },
  { title: "My Music", href: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa", badge: null },
  { title: "Updates", href: "/#newsletter", badge: null },
];

export default component$(() => {
  const show = useSignal(false);
  const i18n = useI18n();

  const handleSetLanguage = $((lang: Language) => {
    i18n.locale.value = lang;
    setLang(lang);
  });

  const localMenuItems = [
    { title: "Session Violinist", href: "/", badge: null },
    { title: "Live Performances", href: "/", badge: null },
    { title: "My Music", href: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa", badge: null },
    { title: "Updates", href: "/#newsletter", badge: null },
  ];

  return (
    <>
      <Modal.Root bind:show={show}>
        <div class="absolute top-2 right-3 md:static">
          <Modal.Trigger
            class={cn(
              "p-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-300",
              "bg-stone-100/40 mb-1 border-stone-300/50 hover:shadow-xl hover:bg-stone-200/50",
              "[&_svg]:stroke-stone-800"
            )}
          >
            <IconHamburger class="w-6 h-7" />
          </Modal.Trigger>
        </div>

        <Modal.Panel
          position="left"
          class="bg-gradient-to-br from-primary-950 via-black to-tertiary-950 border-r border-primary-600/30 overflow-y-auto max-h-[100vh]"
        >
          <div class="rounded-t-none border-b border-primary-800/30 bg-gradient-to-br from-primary-900/20 to-black/40 backdrop-blur-md p-2">
            <Modal.Title class="pt-3 pb-2 pl-2.5">
              <a href="/" class="focus:outline-none">
                <div style="width: 100px; height: 40px;">
                  <img src="/images/logo2.svg" alt="Logo" />
                </div>
              </a>
            </Modal.Title>
            {/* <Modal.Description class="!text-md !font-bold px-2.5 py-1 pb-2 dark:text-gray-200">
              <span class="bg-gradient-to-r from-primary-600 via-tertiary-600 to-primary-600 bg-clip-text text-transparent">
                Listening, Connecting & Creating
              </span>
            </Modal.Description> */}
          </div>

          <nav class="mt-0 space-y-4 bg-gradient-to-br from-black/40 to-tertiary-900/20">
            <CustomAccordion items={localMenuItems} show={show} />
          </nav>

          <div class="rounded-b-2xl border-t border-primary-800/30 bg-gradient-to-br from-primary-900/20 to-black/40 backdrop-blur-md pb-5">
            {/* Language Selector */}
            <div class="px-5 pt-4 pb-3 border-b border-primary-800/30">
              <div class="flex items-center gap-2 mb-2">
                <LuGlobe class="w-5 h-5 text-tertiary-400" />
                <span class="text-sm font-medium text-tertiary-300">Language</span>
              </div>
              <div class="flex gap-2">
                <button
                  class={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    i18n.locale.value === 'en'
                      ? "bg-primary-600 text-white"
                      : "bg-primary-900/30 text-tertiary-300 hover:bg-primary-900/50"
                  )}
                  onClick$={() => handleSetLanguage('en')}
                >
                  English
                </button>
                <button
                  class={cn(
                    "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    i18n.locale.value === 'fr'
                      ? "bg-primary-600 text-white"
                      : "bg-primary-900/30 text-tertiary-300 hover:bg-primary-900/50"
                  )}
                  onClick$={() => handleSetLanguage('fr')}
                >
                  Français
                </button>
              </div>
            </div>

            {/* Listen On - Streaming Platforms */}
            <div class="px-5 pt-4 pb-3 border-b border-primary-800/30">
              <div class="flex items-center gap-2 mb-3">
                <LuMusic class="w-5 h-5 text-tertiary-400" />
                <span class="text-sm font-medium text-tertiary-300">Listen On</span>
              </div>
              <div class="flex gap-3">
                <a
                  href="https://www.youtube.com/channel/UCeX217HOtpviekPVlEO8jJQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-200"
                >
                  <LuYoutube class="w-5 h-5" />
                  <span class="text-sm font-medium">YouTube</span>
                </a>
                <a
                  href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 hover:text-green-300 transition-all duration-200"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span class="text-sm font-medium">Spotify</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div class="px-5 pt-4 pb-3 border-b border-primary-800/30">
              <div class="flex items-center justify-center gap-6">
                <a
                  href="https://www.instagram.com/phineasstewart"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex flex-col items-center gap-1 text-tertiary-400 hover:text-pink-400 transition-colors"
                >
                  <LuInstagram class="h-7 w-7" />
                  <span class="text-xs">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex flex-col items-center gap-1 text-tertiary-400 hover:text-blue-400 transition-colors"
                >
                  <LuFacebook class="h-7 w-7" />
                  <span class="text-xs">Facebook</span>
                </a>
              </div>
            </div>

            {/* Book Performance CTA */}
            <div class="px-5 pt-4">
              <a
                href="/contact"
                class="group relative flex items-center justify-center gap-3 w-full px-6 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-xl shadow-lg hover:shadow-amber-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                role="button"
                aria-label="Book a performance"
              >
                <LuCalendar class="w-5 h-5" />
                <span class="relative z-10">Book a Performance</span>
                <div class="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-white/20 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </a>
            </div>
          </div>

          <Modal.Close
            class={cn(
              buttonVariants({ size: "icon", look: "link" }),
              "absolute right-8 top-5 text-tertiary-400 hover:text-primary-300 hover:bg-primary-900/30 transition-all duration-200"
            )}
            type="submit"
          >
            <LuX class="h-5 w-5" />
          </Modal.Close>
        </Modal.Panel>
      </Modal.Root>
    </>
  );
});