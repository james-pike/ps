import { component$, type JSXOutput, type JSXNode } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  LuInstagram,
  LuYoutube,
} from "@qwikest/icons/lucide";
import type { SVGProps } from "@builder.io/qwik";
import { useI18n, t } from "~/context/i18n";

interface Item {
  title: string | JSXNode | JSXOutput;
  titleKey?: string;
  href: string | null;
  icon?: (props: SVGProps<SVGSVGElement>) => JSXNode<unknown>;
}

interface LinkSection {
  title: string;
  titleKey?: string;
  items: Item[];
}

export default component$(() => {
  const i18n = useI18n();
  const locale = i18n.locale.value;

  const links: LinkSection[] = [
    {
      title: "About",
      titleKey: "footer.about",
      items: [
        { title: "Session Violinist", titleKey: "footer.sessionViolinist", href: "#session-violinist" },
        { title: "Artist Profile", titleKey: "footer.artistProfile", href: "#artist-profile" },
        { title: "My Music", titleKey: "footer.myMusic", href: "https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa" },
      ],
    },
  ];

  return (
    <footer class="relative border-t pl-1 mt-2 pb-8 md:pb-12 border-stone-200/80 overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200">
      <div class="relative max-w-7xl mx-auto px-4 md:mr-4 sm:px-6 md:px-8">
        <div class="grid grid-cols-12 gap-4 gap-y-4 sm:gap-4 py-8 md:pt-12 md:pb-2">
          {/* First Column: Logo, Description, Newsletter */}
          <div class="col-span-12 lg:col-span-5 md:pr-8">
            <div class="mb-4 mt-2 md:mt-0">
              <Link class="inline-block font-bold text-2xl text-stone-700 hover:text-stone-800 transition-colors" href={"/"}>
                Phineas Stewart
              </Link>
            </div>
            <div class="text-sm text-stone-600 leading-relaxed">
              {t(locale, "footer.description")}
            </div>

            {/* Social Icons - Below description, centered on mobile, left-aligned on desktop */}
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
          </div>
          {/* Sitemap Columns */}
          {links.map(({ title, titleKey, items }, index) => (
            <div
              key={index}
              class={`
                col-span-6 sm:col-span-6 md:col-span-3 mt-1
                ${index === 0 ? 'lg:col-span-2'
                  : index === 1 ? 'lg:col-span-2'
                    : index === 2 ? 'lg:col-span-3'
                      : 'lg:col-span-1'}
              `}
            >
              <div class="text-sm font-semibold mb-4 mt-2">
                <span class="bg-gradient-to-r from-stone-700 via-amber-700 to-stone-700 bg-clip-text text-transparent">
                  {titleKey ? t(locale, titleKey as any) : title}
                </span>
              </div>
              {Array.isArray(items) && items.length > 0 && (
                <ul class="text-sm space-y-2">
                  {items.map(({ title, titleKey: itemTitleKey, href, icon: Icon }, index2) => {
                    const isExternal = href?.startsWith('http');
                    return (
                      <li key={index2} class="flex items-start gap-2 transition-colors duration-200">
                        {Icon && <Icon class="w-4 h-4 flex-shrink-0 mt-0.5" />}
                        {href ? (
                          <a
                            href={href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            class="text-stone-600 hover:text-amber-700 transition-colors"
                          >
                            {itemTitleKey ? t(locale, itemTitleKey as any) : title}
                          </a>
                        ) : (
                          <span class="text-stone-600">
                            {itemTitleKey ? t(locale, itemTitleKey as any) : title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
});