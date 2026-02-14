import { component$, useSignal, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import { LuPlay, LuPause, LuSkipBack, LuSkipForward, LuX, LuChevronUp, LuChevronDown } from "@qwikest/icons/lucide";

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
}

export default component$(() => {
  const isExpanded = useSignal(false);
  const isPlaying = useSignal(false);
  const currentTrackIndex = useSignal(0);
  const progress = useSignal(0);
  const duration = useSignal(0);
  const hasScrolledPastHero = useSignal(false);
  const hasAutoStarted = useSignal(false);
  const audioRef = useSignal<HTMLAudioElement | undefined>(undefined);

  const store = useStore({
    isVisible: true,
  });

  // Show player after minimal scroll (20px)
  useVisibleTask$(({ cleanup }) => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const wasScrolledPast = hasScrolledPastHero.value;
      hasScrolledPastHero.value = scrollY > 20;

      // Auto-start when player first appears
      if (!wasScrolledPast && hasScrolledPastHero.value && !hasAutoStarted.value && audioRef.value) {
        hasAutoStarted.value = true;
        audioRef.value.play().catch(() => {
          // Browser may block autoplay, that's ok
          isPlaying.value = false;
        });
        isPlaying.value = true;
      }
    };

    handleScroll(); // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true });

    cleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  const tracks: Track[] = [
    {
      id: "1",
      title: "Concert Hall Recording",
      artist: "Classical Performance",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "2",
      title: "Jazz Collaboration",
      artist: "Live Session",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "3",
      title: "Studio Session",
      artist: "Recording Studio",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      id: "4",
      title: "Orchestral Performance",
      artist: "Symphony Hall",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
  ];

  const currentTrack = tracks[currentTrackIndex.value];

  // Update progress from audio element
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      if (audioRef.value && isPlaying.value) {
        const current = audioRef.value.currentTime;
        const total = audioRef.value.duration || 1;
        progress.value = (current / total) * 100;
        duration.value = total;
      }
    }, 100);
    cleanup(() => clearInterval(interval));
  });

  const togglePlay = $(() => {
    if (audioRef.value) {
      if (isPlaying.value) {
        audioRef.value.pause();
      } else {
        audioRef.value.play();
      }
    }
    isPlaying.value = !isPlaying.value;
  });

  const nextTrack = $(() => {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
    progress.value = 0;
    if (audioRef.value) {
      audioRef.value.src = tracks[(currentTrackIndex.value) % tracks.length].audioUrl;
      if (isPlaying.value) {
        audioRef.value.play();
      }
    }
  });

  const prevTrack = $(() => {
    currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.length) % tracks.length;
    progress.value = 0;
    if (audioRef.value) {
      audioRef.value.src = tracks[(currentTrackIndex.value - 1 + tracks.length) % tracks.length].audioUrl;
      if (isPlaying.value) {
        audioRef.value.play();
      }
    }
  });

  const toggleExpanded = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  const closePlayer = $(() => {
    store.isVisible = false;
    isPlaying.value = false;
    if (audioRef.value) {
      audioRef.value.pause();
    }
  });

  if (!store.isVisible) return null;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed player */}
      <div class="h-16 md:h-14" />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded$={() => {
          currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
          if (audioRef.value) {
            audioRef.value.src = tracks[(currentTrackIndex.value + 1) % tracks.length].audioUrl;
            audioRef.value.play();
          }
        }}
      />
      <div
        class={`
          fixed bottom-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${isExpanded.value ? "h-80" : "h-14"}
          ${hasScrolledPastHero.value ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
      >
      {/* Background with blur - grayscale theme */}
      <div class="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-50/98 to-gray-50/95 backdrop-blur-lg border-t border-stone-300/50"></div>

      {/* Expanded View - Video/Image Carousel */}
      {isExpanded.value && (
        <div class="relative h-64 overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center p-3">
            <div class="relative w-full max-w-4xl mx-auto">
              {/* Main Carousel */}
              <div class="flex gap-3 justify-center items-center">
                {/* Previous track preview */}
                <div
                  class="hidden md:block w-28 h-28 rounded-xl overflow-hidden opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
                  onClick$={prevTrack}
                >
                  <img
                    src={tracks[(currentTrackIndex.value - 1 + tracks.length) % tracks.length].image}
                    alt="Previous"
                    class="w-full h-full object-cover"
                  />
                </div>

                {/* Current track */}
                <div class="relative w-44 h-44 md:w-52 md:h-52 rounded-xl overflow-hidden shadow-xl border border-stone-300/50">
                  <img
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    class={`w-full h-full object-cover transition-transform duration-300 ${isPlaying.value ? "scale-105" : "scale-100"}`}
                  />
                  {/* Play overlay */}
                  <div class="absolute inset-0 flex items-center justify-center bg-stone-900/20">
                    <button
                      onClick$={togglePlay}
                      class="w-14 h-14 rounded-full bg-white/70 backdrop-blur-sm border border-stone-400 flex items-center justify-center hover:bg-white/90 transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying.value ? (
                        <LuPause class="w-7 h-7 text-stone-700" />
                      ) : (
                        <LuPlay class="w-7 h-7 text-stone-700 ml-0.5" />
                      )}
                    </button>
                  </div>
                  {/* Gradient overlay */}
                  <div class="absolute inset-0 bg-gradient-to-t from-stone-100/50 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Next track preview */}
                <div
                  class="hidden md:block w-28 h-28 rounded-xl overflow-hidden opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
                  onClick$={nextTrack}
                >
                  <img
                    src={tracks[(currentTrackIndex.value + 1) % tracks.length].image}
                    alt="Next"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Track info */}
              <div class="text-center mt-3">
                <h3 class="text-base font-semibold text-stone-800">{currentTrack.title}</h3>
                <p class="text-stone-500 text-sm">{currentTrack.artist}</p>

                {/* Streaming Buttons */}
                <div class="flex justify-center gap-3 mt-4">
                  <a
                    href="https://open.spotify.com/artist/6XYvaoDGE0VmRt83Jss9Sn"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-base shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Spotify
                  </a>
                  <a
                    href="https://music.apple.com/artist/phineas-stewart"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-base shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
                    </svg>
                    Apple Music
                  </a>
                </div>
              </div>

              {/* Track indicators */}
              <div class="flex justify-center gap-1.5 mt-3">
                {tracks.map((_, index) => (
                  <button
                    key={index}
                    onClick$={() => {
                      currentTrackIndex.value = index;
                      progress.value = 0;
                    }}
                    class={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentTrackIndex.value
                        ? "w-6 bg-gradient-to-r from-stone-600 to-stone-500"
                        : "w-1.5 bg-stone-400/40 hover:bg-stone-400/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Player Bar - more compact */}
      <div class="relative h-14 px-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Track info */}
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <div class="relative w-9 h-9 rounded-md overflow-hidden flex-shrink-0 border border-stone-300/50">
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              class={`w-full h-full object-cover ${isPlaying.value ? "animate-pulse" : ""}`}
            />
          </div>
          <div class="min-w-0">
            <h4 class="text-stone-800 font-medium truncate text-xs md:text-sm">{currentTrack.title}</h4>
            <p class="text-stone-500 text-[10px] md:text-xs truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div class="flex items-center gap-1 md:gap-2">
          <button
            onClick$={prevTrack}
            class="p-1.5 md:p-2 rounded-full bg-stone-200/70 border border-stone-300/60 hover:bg-stone-300 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300"
          >
            <LuSkipBack class="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick$={togglePlay}
            class="p-2 md:p-2.5 rounded-full bg-gradient-to-r from-stone-600 to-stone-700 border border-stone-400/60 hover:from-stone-500 hover:to-stone-600 hover:border-stone-300/60 flex items-center justify-center text-white shadow-md shadow-stone-900/20 transition-all duration-300 hover:scale-110"
          >
            {isPlaying.value ? (
              <LuPause class="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <LuPlay class="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
            )}
          </button>
          <button
            onClick$={nextTrack}
            class="p-1.5 md:p-2 rounded-full bg-stone-200/70 border border-stone-300/60 hover:bg-stone-300 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300"
          >
            <LuSkipForward class="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Right: Additional controls */}
        <div class="flex items-center gap-1.5 flex-1 justify-end">
          {/* Progress bar - hidden on mobile */}
          <div class="hidden md:flex items-center gap-1.5 flex-1 max-w-xs">
            <span class="text-[10px] text-stone-500">
              {Math.floor((progress.value / 100) * duration.value / 60)}:{Math.floor((progress.value / 100) * duration.value % 60).toString().padStart(2, '0')}
            </span>
            <div class="flex-1 h-1 bg-stone-300/50 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-stone-600 to-stone-500 transition-all duration-100"
                style={{ width: `${progress.value}%` }}
              ></div>
            </div>
            <span class="text-[10px] text-stone-500">
              {Math.floor(duration.value / 60)}:{Math.floor(duration.value % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Spotify Button */}
          <a
            href="https://open.spotify.com/artist/6XYvaoDGE0VmRt83Jss9Sn"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1.5 md:p-2 rounded-full bg-stone-200/70 border border-stone-300/60 text-green-600 hover:bg-green-50 hover:border-green-300 hover:scale-110 flex items-center justify-center transition-all duration-300"
            title="Listen on Spotify"
          >
            <svg class="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>

          {/* Apple Music Button */}
          <a
            href="https://music.apple.com/artist/phineas-stewart"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1.5 md:p-2 rounded-full bg-stone-200/70 border border-stone-300/60 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-110 flex items-center justify-center transition-all duration-300"
            title="Listen on Apple Music"
          >
            <svg class="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
            </svg>
          </a>

          <button
            onClick$={toggleExpanded}
            class="p-1.5 rounded-full bg-stone-200/70 border border-stone-300/60 hover:bg-stone-300 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300"
          >
            {isExpanded.value ? (
              <LuChevronDown class="w-3 h-3" />
            ) : (
              <LuChevronUp class="w-3 h-3" />
            )}
          </button>

          <button
            onClick$={closePlayer}
            class="p-1.5 rounded-full bg-stone-200/70 border border-stone-300/60 hover:bg-stone-300 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300"
          >
            <LuX class="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mobile progress bar */}
      <div class="md:hidden absolute top-0 left-0 right-0 h-0.5 bg-stone-300/50">
        <div
          class="h-full bg-gradient-to-r from-stone-600 to-stone-500 transition-all duration-100"
          style={{ width: `${progress.value}%` }}
        ></div>
      </div>
      </div>
    </>
  );
});
