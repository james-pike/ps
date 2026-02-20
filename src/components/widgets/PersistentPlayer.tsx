import { component$, useSignal, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import { LuPlay, LuPause, LuSkipBack, LuSkipForward, LuX } from "@qwikest/icons/lucide";

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
      {/* Hidden audio element - always rendered for preloading */}
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

      {/* Spacer and player - only shown after scrolling */}
      {hasScrolledPastHero.value && (
        <>
          <div class="h-14" />
          <div
            class={`
              fixed bottom-0 left-0 right-0 z-50
              transition-all duration-300 ease-out
              ${isExpanded.value ? "h-80" : "h-14"}
            `}
          >
      {/* Background with blur - grayscale theme */}
      <div class="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-50/98 to-gray-50/95 backdrop-blur-lg border-t border-stone-200 md:border-stone-300/60"></div>

      {/* Expanded View */}
      {isExpanded.value && (
        <div class="relative h-64 overflow-hidden">
          {/* Mobile: Original centered layout */}
          <div class="md:hidden absolute inset-0 flex items-center justify-center p-3">
            <div class="relative w-full max-w-4xl mx-auto">
              <div class="flex gap-3 justify-center items-center">
                <div class="relative w-44 h-44 rounded-xl overflow-hidden shadow-xl border border-stone-300/50">
                  <img
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    class={`w-full h-full object-cover transition-transform duration-300 ${isPlaying.value ? "scale-105" : "scale-100"}`}
                  />
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
                </div>
              </div>
              <div class="text-center mt-3">
                <h3 class="text-base font-semibold text-stone-800">{currentTrack.title}</h3>
                <p class="text-stone-500 text-sm">{currentTrack.artist}</p>
                <div class="flex justify-center gap-3 mt-4">
                  <a
                    href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
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

          {/* Desktop: Bento Grid Layout */}
          <div class="hidden md:block absolute inset-0 p-4 lg:p-6">
            <div class="h-full max-w-5xl mx-auto grid grid-cols-12 gap-3 lg:gap-4">

              {/* Main Artwork - Tall card spanning left side */}
              <div class="col-span-3 row-span-2 relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-stone-200/80 shadow-sm group">
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  class={`w-full h-full object-cover transition-transform duration-500 ${isPlaying.value ? "scale-105" : "scale-100"}`}
                />
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent" />
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick$={togglePlay}
                    class="w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm border border-stone-200 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    {isPlaying.value ? (
                      <LuPause class="w-7 h-7 text-stone-700" />
                    ) : (
                      <LuPlay class="w-7 h-7 text-stone-700 ml-0.5" />
                    )}
                  </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-lg truncate">{currentTrack.title}</h3>
                  <p class="text-white/70 text-sm truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Track List - Grid of small cards */}
              <div class="col-span-6 grid grid-cols-4 gap-2 lg:gap-3">
                {tracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick$={() => {
                      currentTrackIndex.value = index;
                      progress.value = 0;
                      if (audioRef.value) {
                        audioRef.value.src = tracks[index].audioUrl;
                        if (isPlaying.value) {
                          audioRef.value.play();
                        }
                      }
                    }}
                    class={`relative rounded-xl overflow-hidden aspect-square transition-all duration-300 hover:scale-105 ${
                      index === currentTrackIndex.value
                        ? "ring-2 ring-stone-600 ring-offset-2 ring-offset-stone-100/50 shadow-lg"
                        : "border border-stone-200/60 shadow-sm hover:shadow-md hover:border-stone-300"
                    }`}
                  >
                    <img
                      src={track.image}
                      alt={track.title}
                      class="w-full h-full object-cover"
                    />
                    <div class={`absolute inset-0 transition-opacity duration-300 ${
                      index === currentTrackIndex.value
                        ? "bg-stone-900/30"
                        : "bg-stone-900/10 hover:bg-stone-900/20"
                    }`} />
                    {index === currentTrackIndex.value && isPlaying.value && (
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="flex gap-0.5 items-end h-4">
                          <span class="w-1 bg-white rounded-full animate-pulse" style="height: 60%; animation-delay: 0ms" />
                          <span class="w-1 bg-white rounded-full animate-pulse" style="height: 100%; animation-delay: 150ms" />
                          <span class="w-1 bg-white rounded-full animate-pulse" style="height: 40%; animation-delay: 300ms" />
                        </div>
                      </div>
                    )}
                    <div class="absolute bottom-0 left-0 right-0 p-1.5 lg:p-2">
                      <p class="text-white text-[10px] lg:text-xs font-medium truncate drop-shadow-lg">{track.title}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Streaming Services Card */}
              <div class="col-span-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/80 shadow-sm p-4 flex flex-col justify-center gap-3">
                <p class="text-stone-500 text-xs font-medium uppercase tracking-wider">Listen on</p>
                <a
                  href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
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
                  class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
                  </svg>
                  Apple Music
                </a>
              </div>

              {/* Now Playing Info Card */}
              <div class="col-span-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/80 shadow-sm p-4 flex items-center gap-4">
                <div class="flex-1 min-w-0">
                  <p class="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">Now Playing</p>
                  <h4 class="text-stone-800 font-semibold text-base truncate">{currentTrack.title}</h4>
                  <p class="text-stone-500 text-sm truncate">{currentTrack.artist}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    onClick$={prevTrack}
                    class="p-2.5 rounded-xl bg-stone-100 border border-stone-200 hover:bg-stone-200 hover:border-stone-300 flex items-center justify-center text-stone-600 transition-all duration-300 hover:scale-110"
                  >
                    <LuSkipBack class="w-4 h-4" />
                  </button>
                  <button
                    onClick$={togglePlay}
                    class="p-3 rounded-xl bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying.value ? (
                      <LuPause class="w-5 h-5" />
                    ) : (
                      <LuPlay class="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick$={nextTrack}
                    class="p-2.5 rounded-xl bg-stone-100 border border-stone-200 hover:bg-stone-200 hover:border-stone-300 flex items-center justify-center text-stone-600 transition-all duration-300 hover:scale-110"
                  >
                    <LuSkipForward class="w-4 h-4" />
                  </button>
                </div>
                {/* Progress */}
                <div class="flex items-center gap-2 w-48">
                  <span class="text-xs text-stone-500 font-medium tabular-nums">
                    {Math.floor((progress.value / 100) * duration.value / 60)}:{Math.floor((progress.value / 100) * duration.value % 60).toString().padStart(2, '0')}
                  </span>
                  <div class="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-stone-600 transition-all duration-100 rounded-full"
                      style={{ width: `${progress.value}%` }}
                    />
                  </div>
                  <span class="text-xs text-stone-500 font-medium tabular-nums">
                    {Math.floor(duration.value / 60)}:{Math.floor(duration.value % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div class="col-span-3 rounded-2xl bg-stone-800 border border-stone-700 shadow-sm p-4 flex flex-col justify-center">
                <p class="text-stone-400 text-xs font-medium uppercase tracking-wider mb-2">Track {currentTrackIndex.value + 1} of {tracks.length}</p>
                <div class="flex gap-1">
                  {tracks.map((_, index) => (
                    <div
                      key={index}
                      class={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        index === currentTrackIndex.value
                          ? "bg-white"
                          : index < currentTrackIndex.value
                          ? "bg-stone-500"
                          : "bg-stone-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mini Player Bar - more compact */}
      <div class="relative h-14 px-3 md:px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Track info */}
        <div class="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div class="relative w-9 h-9 md:w-10 md:h-10 rounded-md md:rounded-lg overflow-hidden flex-shrink-0 border border-stone-200/80 md:shadow-sm">
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
        <div class="flex items-center gap-1 md:gap-3">
          <button
            onClick$={prevTrack}
            class="p-1.5 md:p-2.5 rounded-full md:rounded-lg bg-stone-200/70 md:bg-white/80 border border-stone-300/60 md:border-stone-200 hover:bg-stone-300 md:hover:bg-stone-100 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300 md:shadow-sm"
          >
            <LuSkipBack class="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick$={togglePlay}
            class="p-2 md:p-3 rounded-full md:rounded-lg bg-gradient-to-r from-stone-600 to-stone-700 border border-stone-400/60 md:border-stone-500/40 hover:from-stone-500 hover:to-stone-600 hover:border-stone-300/60 flex items-center justify-center text-white shadow-md md:shadow-lg shadow-stone-900/20 transition-all duration-300 hover:scale-110"
          >
            {isPlaying.value ? (
              <LuPause class="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <LuPlay class="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
            )}
          </button>
          <button
            onClick$={nextTrack}
            class="p-1.5 md:p-2.5 rounded-full md:rounded-lg bg-stone-200/70 md:bg-white/80 border border-stone-300/60 md:border-stone-200 hover:bg-stone-300 md:hover:bg-stone-100 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300 md:shadow-sm"
          >
            <LuSkipForward class="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Right: Additional controls */}
        <div class="flex items-center gap-1.5 md:gap-3 flex-1 justify-end">
          {/* Progress bar - hidden on mobile */}
          <div class="hidden md:flex items-center gap-2 flex-1 max-w-xs bg-white/60 rounded-lg px-3 py-1.5 border border-stone-200/80">
            <span class="text-xs text-stone-500 font-medium tabular-nums">
              {Math.floor((progress.value / 100) * duration.value / 60)}:{Math.floor((progress.value / 100) * duration.value % 60).toString().padStart(2, '0')}
            </span>
            <div class="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-stone-600 to-stone-500 transition-all duration-100 rounded-full"
                style={{ width: `${progress.value}%` }}
              ></div>
            </div>
            <span class="text-xs text-stone-500 font-medium tabular-nums">
              {Math.floor(duration.value / 60)}:{Math.floor(duration.value % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Spotify Button */}
          <a
            href="https://open.spotify.com/artist/6NdP70O55lwG5h9FTZPXKa"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1.5 md:p-2.5 rounded-full md:rounded-lg bg-stone-200/70 md:bg-white/80 border border-stone-300/60 md:border-stone-200 text-green-600 hover:bg-green-50 hover:border-green-300 hover:scale-110 flex items-center justify-center transition-all duration-300 md:shadow-sm"
            title="Listen on Spotify"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>

          {/* Apple Music Button */}
          <a
            href="https://music.apple.com/artist/phineas-stewart"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1.5 md:p-2.5 rounded-full md:rounded-lg bg-stone-200/70 md:bg-white/80 border border-stone-300/60 md:border-stone-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-110 flex items-center justify-center transition-all duration-300 md:shadow-sm"
            title="Listen on Apple Music"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.336-1.085-2.477-2.17-3.331A9.064 9.064 0 0 0 19.578.199a9.23 9.23 0 0 0-2.591-.198h-9.974a9.23 9.23 0 0 0-2.591.198A9.064 9.064 0 0 0 2.416.661C1.331 1.515.563 2.656.246 3.992A9.23 9.23 0 0 0 .006 6.124v11.752a9.23 9.23 0 0 0 .24 2.132c.317 1.336 1.085 2.477 2.17 3.331.317.257.652.476 1.006.662a9.23 9.23 0 0 0 2.591.198h9.974a9.23 9.23 0 0 0 2.591-.198c.354-.186.689-.405 1.006-.662 1.085-.854 1.853-1.995 2.17-3.331a9.23 9.23 0 0 0 .24-2.132V6.124zM19.096 15.088c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223v-6.613l-5.098 1.378v6.943c0 .586-.086 1.077-.258 1.474-.172.398-.43.73-.774.997a2.497 2.497 0 0 1-1.2.48 2.855 2.855 0 0 1-1.223-.083 2.497 2.497 0 0 1-1.086-.663 2.855 2.855 0 0 1-.663-1.086 2.497 2.497 0 0 1-.083-1.223c0-.586.086-1.077.258-1.474.172-.398.43-.73.774-.997a2.497 2.497 0 0 1 1.2-.48c.172-.014.344-.014.516 0 .172.014.344.043.516.086v-8.28l8.28-2.24v8.28z"/>
            </svg>
          </a>

          <button
            onClick$={closePlayer}
            class="p-1.5 md:p-2 rounded-full md:rounded-lg bg-stone-200/70 md:bg-white/80 border border-stone-300/60 md:border-stone-200 hover:bg-stone-300 md:hover:bg-stone-100 hover:border-stone-400/60 hover:scale-110 flex items-center justify-center text-stone-600 transition-all duration-300 md:shadow-sm"
          >
            <LuX class="w-3 h-3 md:w-3.5 md:h-3.5" />
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
      )}
    </>
  );
});
