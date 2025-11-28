import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// 5 original testimonials — ab ek bhi galti nahi
const baseTestimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Small Business Owner",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        content: "The business cards I got were absolutely stunning! The quality is top-notch.",
  },
    {
        id: 2,
        name: "Michael Chen",
        role: "Freelance Designer",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        content: "Exceeded my expectations in both design and print quality. Highly recommend!",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Marketing Manager",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        content: "Great service and super fast delivery. Made a fantastic impression!",
    },
    {
        id: 4,
        name: "David Kim",
        role: "Startup Founder",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 5,
        content: "Our team cards look absolutely professional. Best decision ever!",
    },
    {
        id: 5,
        name: "Lisa Wong",
        role: "Creative Director",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        rating: 5,
        content: "Customization options are endless. We got exactly what we wanted!",
    },
];

// Duplicate for infinite smooth loop
const testimonials = [...baseTestimonials, ...baseTestimonials.map(t => ({ ...t, id: t.id + 100 }))];

const SocialProof = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="py-16 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        What Our Customers Say
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Trusted by thousands of happy professionals
                    </p>
                </div>

                {/* Single Row — Fast Auto Scroll */}
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.div
                        className="flex"
                        animate={{ x: isHovered ? 0 : ["0%", "-50%"] }}
                        transition={{
                            duration: 18,           // Bahut tez chalega
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop",
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="flex-shrink-0 w-96 px-6">
                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -12 }}
                                >
                                    <div className="flex items-center mb-6">
                                        <img
                                            className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-lg"
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                            <div className="flex mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg text-gray-700 italic leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;