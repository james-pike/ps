import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const services = [
    {
      icon: (
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
        </svg>
      ),
      title: "Studio Sessions",
      description: "Professional violin recording for albums, singles, and soundtracks. Quick turnaround with studio-quality sound.",
      link: "/offerings#studio"
    },
    {
      icon: (
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "Live Performance",
      description: "Bringing elegance and emotion to weddings, corporate events, concerts, and private functions.",
      link: "/offerings#live"
    },
    {
      icon: (
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
        </svg>
      ),
      title: "Collaboration",
      description: "Creative partnerships with producers, composers, and artists across all genres. Let's create something unique.",
      link: "/contact"
    },
    {
      icon: (
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
      title: "Sheet Music",
      description: "Custom arrangements and transcriptions for violin. Classical to contemporary, I can help bring your musical vision to life.",
      link: "/offerings#arrangements"
    }
  ];

  return (
    <section class="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-black via-tertiary-950 to-black">
      {/* Background decorations */}
      <div class="absolute top-1/4 left-10 w-64 h-64 bg-primary-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary-900/10 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-5 md:px-12">
        {/* Section Header */}
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span class="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
              What I Do
            </span>
          </h2>
          <p class="text-xl text-tertiary-300 max-w-3xl mx-auto">
            From intimate studio sessions to grand live performances, I bring versatility and passion to every project.
          </p>
        </div>

        {/* Services Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.link}
              class="group relative bg-gradient-to-br from-tertiary-900/50 to-black border border-tertiary-800/50 rounded-2xl p-8 hover:border-primary-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-900/20"
            >
              {/* Icon */}
              <div class="mb-6 text-secondary-400 group-hover:text-secondary-300 transition-colors">
                {service.icon}
              </div>

              {/* Title */}
              <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p class="text-tertiary-400 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Hover arrow */}
              <div class="flex items-center text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="mr-2">Learn more</span>
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              {/* Gradient overlay on hover */}
              <div class="absolute inset-0 bg-gradient-to-br from-primary-900/0 to-primary-900/0 group-hover:from-primary-900/10 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});