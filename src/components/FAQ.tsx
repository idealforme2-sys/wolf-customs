import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do you work with my insurance company?",
    answer: "Yes, we work with all major insurance providers. We can handle the paperwork and communicate directly with your insurer to ensure a smooth repair process."
  },
  {
    question: "How long will my vehicle repair take?",
    answer: "Repair times vary depending on the extent of the damage and parts availability. A standard bumper respray might take 2-3 days, while a full restoration can take several months. We'll provide an estimated timeline with your quote."
  },
  {
    question: "Is there a warranty on your paintwork?",
    answer: "Absolutely. We stand behind our craftsmanship and offer a comprehensive warranty on all our paint and panel work against peeling, flaking, and fading."
  },
  {
    question: "Can you perfectly match my car's current colour?",
    answer: "Yes. We use advanced computerized colour-matching technology and premium automotive paints to ensure a seamless match with your vehicle's existing finish."
  },
  {
    question: "Do I need an appointment for a quote?",
    answer: "While walk-ins are welcome, we highly recommend booking an appointment so we can dedicate the proper time to thoroughly inspect your vehicle and discuss your needs."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-wolf-black relative border-t border-wolf-gunmetal">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-wolf-red uppercase tracking-widest text-sm font-semibold mb-2">Your Questions Answered</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight"
          >
            Frequently Asked <span className="text-wolf-red">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-wolf-gunmetal bg-wolf-gray overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-wolf-gunmetal/50 transition-colors"
              >
                <span className="font-heading font-bold uppercase tracking-wide text-white pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-wolf-red shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
