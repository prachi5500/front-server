import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

// SLIDES
const slides = [
  {
    img: "https://plus.unsplash.com/premium_photo-1752231847575-3ac4e0dda918?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Create Stunning Business Cards With Ease",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1755994149244-d7887690b774?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Design Your Brand Identity Effortlessly",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1661661374846-23e8f44be169?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D",
  },
  {
    img: "https://res.cloudinary.com/vistaprint/images/f_auto,q_auto/v1702621824/ideas-and-advice-prod/en-us/en-au-2/en-au-2.png?_i=AA",
    text: "Professional & Print-Ready Card Designs",
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1661385603150-e2317488f5fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwMHx8fGVufDB8fHx8fA%3D%3D",
    text: "Smart Digital Business Cards With QR Codes",
  },
];


export const Hero = () => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto‑slide
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // SWIPE HANDLERS
  const minSwipe = 50;
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart - touchEnd > minSwipe) next();
    if (touchEnd - touchStart > minSwipe) prev();
  };

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* BACKGROUND IMAGE */}
      <img
        key={index}
        src={slides[index].img}
        className="absolute inset-0 w-full h-full object-cover brightness-[1.25] contrast-[1.2] saturate-[1.3] scale-110 animate-zoom-fade duration-[1400ms]"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* FLOATING SHAPES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-48 h-48 bg-purple-500/20 rounded-full blur-3xl top-10 left-20 animate-float-slow"></div>
        <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl bottom-10 right-32 animate-float"></div>
      </div>

      {/* FLOATING LOGO CLOUDS */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src="/logos/logo1.png" className="absolute top-10 left-10 w-14 animate-cloud-slow" />
        <img src="/logos/logo2.png" className="absolute bottom-14 right-20 w-16 animate-cloud" />
        <img src="/logos/logo3.png" className="absolute top-1/2 left-1/3 w-12 animate-cloud-fast" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-reveal">

        {/* BADGE (STAGGERED) */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 mb-6 animate-fade-in-up [animation-delay:0.1s] shadow-xl">
          <Sparkles className="w-4 h-4 text-white animate-glow" />
          <span className="text-sm text-white font-medium">Professional Business Cards in Minutes</span>
        </div>

        {/* HEADING WITH SHIMMER */}
        <h1 className="text-4xl md:text-7xl font-extrabold text-white drop-shadow-2xl leading-tight animate-fade-in-up [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
          Create Your Perfect
          <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white animate-text-shimmer">
            Business Card
          </span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mt-6 mb-8 font-semibold leading-relaxed animate-fade-in-up [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
          Choose from <span className="font-bold text-white">100+ AI‑generated templates</span>, customize
          with your details, and get a <span className="font-bold text-white">professional business card</span>
          with <span className="font-bold text-white">QR code instantly</span>.
        </p>

        {/* STAGGERED BUTTONS */}
        

        {/* SLIDE TEXT */}
        <div
          key={index + "caption"}
          className="absolute bottom-10 text-white text-2xl md:text-4xl font-extrabold drop-shadow-2xl animate-fade-in-up"
        >
          {slides[index].text}
        </div>

        {/* ARROWS */}
        <button onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-xl transition shadow-2xl"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-xl transition shadow-2xl"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </section>
  );
};
