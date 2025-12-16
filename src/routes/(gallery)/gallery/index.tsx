import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from "@qwikest/icons/lucide";
import { SITE } from "~/config.mjs";
import { tursoClient } from "~/lib/turso";
import confetti from 'canvas-confetti';

// Interface for gallery images
interface GalleryImage {
  id: number;
  title: string;
  src: string;
  alt: string;
}

// Helper function to get MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
  };
  return mimeTypes[extension] || 'image/jpeg';
}

// Helper function to convert various blob formats to base64
function convertBlobToBase64(imageData: any, filename: string): string {
  try {
    const extension = filename.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = getMimeType(extension);
    let base64String = '';

    if (imageData instanceof Uint8Array) {
      // Convert Uint8Array to base64
      base64String = btoa(String.fromCharCode(...imageData));
    } else if (imageData instanceof ArrayBuffer) {
      // Convert ArrayBuffer to base64
      const uint8Array = new Uint8Array(imageData);
      base64String = btoa(String.fromCharCode(...uint8Array));
    } else if (typeof imageData === 'string') {
      // Handle case where it might already be base64 or binary string
      if (imageData.startsWith('data:')) {
        // Already a data URL
        return imageData;
      } else if (imageData.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        // Looks like base64, use as is
        base64String = imageData;
      } else {
        // Treat as binary string
        base64String = btoa(imageData);
      }
    } else if (Array.isArray(imageData)) {
      // Convert array to Uint8Array then to base64
      const uint8Array = new Uint8Array(imageData);
      base64String = btoa(String.fromCharCode(...uint8Array));
    } else {
      console.error('Unknown image data format:', typeof imageData, imageData);
      return '';
    }

    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error converting blob to base64:', error, 'for file:', filename);
    return '';
  }
}

// ---- Loader ----
export const useGalleryLoader = routeLoader$(async (event) => {
  try {
    const client = tursoClient(event);

    // Debug: Check what columns exist in your table
    const schemaResult = await client.execute("PRAGMA table_info(gallery_images)");
    console.log('Table schema:', schemaResult.rows);

    const result = await client.execute("SELECT * FROM gallery_images ORDER BY position ASC");
    console.log('Query result count:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('No rows found in gallery_images table');
      return [];
    }

    // Debug: Log the first row to see the structure
    console.log('First row structure:', Object.keys(result.rows[0] || {}));
    console.log('First row sample:', result.rows[0]);

    const processedImages = result.rows.map((row: any, index: number) => {
      const filename = String(row.filename || row.name || `image_${row.id || index}.jpg`);
      const title = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      console.log(`Processing image ${index + 1}:`, filename);
      console.log('Image data type:', typeof row.image);
      console.log('Image data length:', row.image?.length || 'N/A');

      // Convert blob to base64 data URL
      let src = '';
      if (row.image) {
        src = convertBlobToBase64(row.image, filename);
        if (!src) {
          console.error(`Failed to convert image data for ${filename}`);
          // Fallback to filesystem path
          src = `/images/${filename}`;
        } else {
          console.log(`Successfully converted ${filename} to data URL (length: ${src.length})`);
        }
      } else {
        console.log(`No image data found for ${filename}, using filesystem fallback`);
        // Fallback to filesystem path
        src = `/images/${filename}`;
      }

      return {
        id: Number(row.id) || index,
        title,
        src,
        alt: `Gallery image: ${title}`,
      };
    });

    console.log(`Processed ${processedImages.length} images`);
    return processedImages as GalleryImage[];
  } catch (error) {
    console.error("Error loading gallery images:", error);
    // Return some dummy data for testing if database fails
    return [
      {
        id: 1,
        title: "Test Image",
        src: "/images/placeholder.jpg",
        alt: "Test gallery image"
      }
    ] as GalleryImage[];
  }
});

export default component$(() => {
  const loaderData = useGalleryLoader();
  const galleryImages = useSignal<GalleryImage[]>([]);
  const currentIndex = useSignal(0);
  const selectedImage = useSignal<GalleryImage | null>(null);
  const autoPlay = useSignal(false);
  const isFullscreen = useSignal(false);
  const bookButtonRef = useSignal<HTMLAnchorElement>();
  const didClickSig = useSignal(false);

  // Load data from the loader
  useVisibleTask$(() => {
    console.log('Loader data received:', loaderData.value.length, 'images');
    galleryImages.value = loaderData.value;
  });

  // Auto-play logic
  useVisibleTask$(({ cleanup, track }) => {
    track(() => autoPlay.value);
    track(() => galleryImages.value.length);

    let interval: NodeJS.Timeout | null = null;
    if (autoPlay.value && galleryImages.value.length > 0) {
      interval = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
      }, 5000);
    }

    cleanup(() => {
      if (interval) clearInterval(interval);
    });
  });

  // Navigation functions
  const toggleAutoPlay = $(() => {
    autoPlay.value = !autoPlay.value;
  });

  const goToPrev = $(() => {
    if (galleryImages.value.length === 0) return;
    currentIndex.value = (currentIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
  });

  const goToNext = $(() => {
    if (galleryImages.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
  });

  const selectImage = $((index: number) => {
    currentIndex.value = index;
  });

  const toggleFullscreen = $(async () => {
    const elem = document.querySelector(".lightbox-content") as HTMLElement;
    if (!isFullscreen.value) {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        isFullscreen.value = true;
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    }
  });

  const handleBookClick = $(async (event: Event) => {
    event.preventDefault();
    didClickSig.value = true;
    if (!bookButtonRef.value) return;

    const rect = bookButtonRef.value.getBoundingClientRect();
    if (!rect) return;

    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = rect.top / window.innerHeight;

    await confetti({
      colors: ['#02B9FC', '#B57DFC'],
      origin: { x, y },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    window.open("https://bookeo.com/earthenvessels", "_blank", "noopener,noreferrer");
  });

  // Show loading or error state
  if (galleryImages.value.length === 0) {
    return (
      <section class="relative min-h-screen overflow-hidden py-20 md:py-28 bg-black">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-950 via-black to-tertiary-950 opacity-80"></div>
        <div class="relative max-w-7xl mx-auto px-5 md:px-12">
          <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
              <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
                Performance Gallery
              </span>
            </h1>
          </div>
          <div class="text-center">
            <p class="text-xl text-tertiary-300">
              Loading gallery...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section class="relative min-h-screen overflow-hidden py-20 md:py-28 bg-black">
      {/* Dark gradient background */}
      <div class="absolute inset-0 bg-gradient-to-br from-primary-950 via-black to-tertiary-950 opacity-80"></div>

      {/* Floating decorative elements */}
      <div class="absolute top-20 left-10 w-64 h-64 bg-primary-900/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-64 h-64 bg-secondary-900/10 rounded-full blur-3xl animate-floatx"></div>

      <div class="relative max-w-7xl mx-auto px-5 md:px-12">
        {/* Section Header */}
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
              Performance Gallery
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-tertiary-300 max-w-3xl mx-auto">
            Explore a collection of performances, recordings, and collaborations
          </p>
        </div>

        {/* Interactive Gallery Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {galleryImages.value.map((image, index) => (
            <div
              key={image.id}
              class="group relative bg-gradient-to-br from-tertiary-900/50 to-black border border-tertiary-800/50 rounded-2xl overflow-hidden hover:border-primary-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-900/20 cursor-pointer"
              onClick$={() => {
                selectImage(index);
                selectedImage.value = image;
              }}
            >
              {/* Image */}
              <div class="aspect-[4/3] relative bg-tertiary-900">
                <img
                  src={image.src}
                  alt={image.alt}
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError$={(event) => {
                    console.error('Image failed to load:', image.src);
                    (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
                {/* Gradient overlay */}
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Play button overlay for video items */}
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                    </svg>
                  </div>
                </div>

                {/* Title overlay */}
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-semibold text-lg truncate">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Carousel */}
        <div class="mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Featured Highlight
          </h2>
          <div class="gallery-player relative w-full max-w-5xl mx-auto">
            <div class="image-container relative w-full rounded-2xl overflow-hidden shadow-2xl border border-primary-800/50">
              {galleryImages.value[currentIndex.value] && (
                <>
                  <img
                    src={galleryImages.value[currentIndex.value].src}
                    alt={galleryImages.value[currentIndex.value].alt}
                    class="w-full max-h-[70vh] object-contain bg-tertiary-950 transition-opacity duration-500"
                    onError$={(event) => {
                      console.error('Image failed to load:', galleryImages.value[currentIndex.value].src);
                      (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  {/* Image title overlay */}
                  <div class="absolute bottom-6 left-6 right-6">
                    <h3 class="text-2xl md:text-3xl font-bold text-white">
                      {galleryImages.value[currentIndex.value].title}
                    </h3>
                  </div>
                </>
              )}
            </div>

            {/* Control buttons */}
            <div class="flex gap-3 mt-6 justify-center">
              <button
                class="px-6 py-3 bg-tertiary-800/80 hover:bg-tertiary-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                onClick$={goToPrev}
                aria-label="Previous slide"
              >
                <LuChevronLeft class="w-6 h-6" />
              </button>
              <button
                class="px-6 py-3 bg-primary-600/80 hover:bg-primary-500 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                onClick$={toggleAutoPlay}
                aria-label={autoPlay.value ? "Pause carousel" : "Play carousel"}
              >
                {autoPlay.value ? <LuPause class="w-6 h-6" /> : <LuPlay class="w-6 h-6" />}
              </button>
              <button
                class="px-6 py-3 bg-tertiary-800/80 hover:bg-tertiary-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                onClick$={goToNext}
                aria-label="Next slide"
              >
                <LuChevronRight class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Lightbox/Modal */}
        {selectedImage.value && (
          <div class="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick$={() => (selectedImage.value = null)}>
            <div class="relative max-w-6xl w-full bg-gradient-to-br from-tertiary-900/90 to-black/90 rounded-2xl overflow-hidden lightbox-content border border-primary-800/50" onClick$={(e) => e.stopPropagation()}>
              <button
                class="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-tertiary-600 text-white hover:text-primary-300 hover:border-primary-500 transition-all z-10 flex items-center justify-center"
                onClick$={() => (selectedImage.value = null)}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                class="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-tertiary-600 text-white hover:text-primary-300 hover:border-primary-500 transition-all z-10 flex items-center justify-center"
                onClick$={toggleFullscreen}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5m11 11v-4m0 0h-4m4 0l-5-5m-6 6v4m0 0h4m-4 0l5-5" />
                </svg>
              </button>
              <img
                src={selectedImage.value.src}
                alt={selectedImage.value.alt}
                class="w-full h-auto max-h-[85vh] object-contain bg-black"
              />
              <div class="p-8 text-center bg-gradient-to-t from-black to-transparent">
                <h3 class="text-2xl md:text-3xl font-bold text-white">
                  {selectedImage.value.title}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Carousel - Hidden on mobile */}
        {galleryImages.value.length > 0 && (
          <div class="mt-12 hidden md:block">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">Browse All</h3>
            <div class="relative w-full max-w-5xl mx-auto overflow-hidden">
              <div
                class="flex space-x-4 pb-4"
                style={{ transform: `translateX(-${currentIndex.value * 144}px)`, transition: 'transform 0.3s ease' }}
              >
                {galleryImages.value.map((image, index) => (
                  <div
                    key={image.id}
                    class={`flex-shrink-0 w-36 h-36 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      index === currentIndex.value
                        ? "ring-4 ring-primary-500 shadow-lg shadow-primary-900/50 scale-105"
                        : "ring-2 ring-tertiary-700 hover:ring-primary-400"
                    }`}
                    onClick$={() => selectImage(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      class="w-full h-full object-cover"
                      width={144}
                      height={144}
                      loading="lazy"
                      onError$={(event) => {
                        console.error('Thumbnail failed to load:', image.src);
                        (event.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Book Session CTA */}
        <div class="text-center mt-20">
          <div class="bg-gradient-to-r max-w-2xl mx-auto from-primary-900/30 via-tertiary-900/30 to-primary-900/30 backdrop-blur-md rounded-3xl p-10 md:p-14 border-2 border-primary-700/50 shadow-2xl">
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Work Together
            </h3>
            <p class="text-lg text-tertiary-300 mb-8">
              Ready to add violin to your next project? Book a session today.
            </p>
            <a
              ref={bookButtonRef}
              href="/contact"
              onClick$={handleBookClick}
              class="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-full shadow-lg shadow-primary-900/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span class="relative z-10">Book a Session</span>
              <span class="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: `${SITE.title} - Gallery`,
  meta: [
    {
      name: "description",
      content: "Discover our stunning collection of handcrafted pottery images, showcasing the beauty of gathering, listening, connecting, and creating.",
    },
  ],
};