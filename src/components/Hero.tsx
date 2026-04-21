import React from 'react';

interface HeroProps {
  tagline: string;
}

const Hero: React.FC<HeroProps> = ({ tagline }) => {
  return (
    <div className="relative h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
      >
        <source src="/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-primary/40 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl">
        <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-8 tracking-tighter animate-fade-in uppercase drop-shadow-2xl">
          Simba <span className="text-secondary">Supermarket</span>
        </h2>
        <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
          <p className="text-lg md:text-3xl text-secondary font-bold italic tracking-wide">
            "{tagline}"
          </p>
        </div>
      </div>

      {/* Decorative Bottom Wave/Edge */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  );
};

export default Hero;
