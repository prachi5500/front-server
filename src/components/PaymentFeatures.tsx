import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Zap, Download, CreditCard } from "lucide-react";
import Testimonials from './Testimonials';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Zap, title: "Custom Templates", description: "Choose from our collection of professionally designed templates. Each template is fully customizable to match your brand identity.", bgColor: "bg-blue-100" },
  { icon: Shield, title: "Secure Payments", description: "Your transactions are protected with bank-level encryption. We support multiple payment methods for your convenience.", bgColor: "bg-green-100" },
  { icon: Download, title: "Instant Access", description: "Get immediate access to your digital business card. Download, share, or print your design right away after purchase.", bgColor: "bg-purple-100" },
  { icon: CreditCard, title: "HD Quality", description: "High-resolution printing ensures your business cards look professional and crisp, making a lasting impression.", bgColor: "bg-orange-100" },
];

export const PaymentFeatures = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animatedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

    items.forEach((item, i) => {
      // Feature text animation
      gsap.fromTo(item,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Card wiggle animation on each feature reveal
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        onEnter: () => {
          gsap.to(animatedCardRef.current, {
            scale: 1.08,
            rotate: i % 2 === 0 ? 5 : -5,
            duration: 0.8,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }
      });
    });

    // Optional: Refresh ScrollTrigger on mount (for dynamic height)
    ScrollTrigger.refresh();

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <>
      {/* Main Services Section */}
      <section
        id="services"
        ref={sectionRef}
        className="relative min-h-screen w-full py-20 "
        style={{
          backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWbuB8lCQhWWFSrqy-lrvGLNnEnNOIn_3T7Q&s')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left: Features List */}
            <div className="space-y-32 lg:space-y-40 py-10">
              <h2 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl text-center lg:text-left">
                Our Services
              </h2>

              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    ref={el => itemsRef.current[i] = el}
                    className="opacity-0"
                  >
                    <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-6 shadow-xl`}>
                      <Icon className="w-9 h-9 text-primary" />
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {feature.title}
                    </h3>
                    <p className="text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Sticky Card */}
            <div className="h-screen sticky top-0 flex items-center justify-center py-10">
              <div className="relative w-full max-w-2xl">
                <div
                  ref={animatedCardRef}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/30 backdrop-blur-xl p-20 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4), inset 0 0 80px rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="absolute inset-0 opacity-60">
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981)",
                      backgroundSize: "400% 400%",
                      animation: "gradientShift 14s ease infinite",
                    }} />
                  </div>

                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute w-4 h-4 bg-white/40 rounded-full animate-float"
                        style={{ animationDelay: `${i * 0.8}s`, top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <h1 className="text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl mb-4">
                      Digital Cards
                    </h1>
                    <p className="text-2xl text-white/90 font-medium">
                      Modern • Professional • Instant
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Next Section - Testimonials */}
      <Testimonials />

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(25px); }
        }
        .animate-float { animation: float 12s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default PaymentFeatures;