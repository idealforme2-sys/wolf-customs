import { motion } from "framer-motion";
import { Star, Award, ShieldCheck, Clock } from "lucide-react";

const stats = [
  { icon: Award, value: "5+", label: "Years Experience" },
  { icon: Star, value: "100+", label: "Projects Completed" },
  { icon: ShieldCheck, value: "100%", label: "Satisfaction Guarantee" },
  { icon: Clock, value: "24/7", label: "Secure Facility" },
];

const testimonials = [
  {
    name: "James T.",
    text: "Wolf Customs brought my 68 Mustang back to life. The paint is flawless, and the attention to detail is unmatched in Adelaide.",
    car: "1968 Ford Mustang",
  },
  {
    name: "Sarah M.",
    text: "Had a nasty scrape on my daily driver. They matched the pearl white perfectly. You cannot tell it was ever damaged.",
    car: "2022 Audi Q5",
  },
  {
    name: "Mark R.",
    text: "The rust repair work they did on my LandCruiser was exceptional. True craftsmen who care about the final result.",
    car: "Toyota LandCruiser 80 Series",
  },
];

export default function Trust() {
  return (
    <section className="py-24 bg-wolf-black relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b border-wolf-gunmetal pb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <stat.icon className="w-10 h-10 text-wolf-red mb-4" />
              <h4 className="text-4xl font-heading font-bold text-white mb-2">
                {stat.value}
              </h4>
              <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-4"
          >
            Client <span className="text-wolf-red">Reviews</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-wolf-gray p-8 border border-wolf-gunmetal relative group"
            >
              <div className="flex text-wolf-red mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <h5 className="font-heading font-bold uppercase text-white tracking-wide">
                  {testimonial.name}
                </h5>
                <p className="text-wolf-red text-sm font-semibold">
                  {testimonial.car}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-wolf-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
