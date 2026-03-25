import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ChevronDown, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSiteContent } from "./SiteContentProvider";
import { uploadToCloudinary } from "../utils/cloudinary";

export default function Contact() {
  const { content } = useSiteContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileName, setFileName] = useState("");
  const serviceOptions = [...new Set(content.services.items.map((item) => item.title).filter(Boolean).concat("Other"))];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message'),
    };

    try {
      // 1. Upload Images to Cloudinary if they exist
      const imageUrls: string[] = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          imageUrls.push(await uploadToCloudinary(files[i]));
        }
      }

      // 2. Save Lead to Firestore
      await addDoc(collection(db, "quotes"), {
        ...data,
        images: imageUrls,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      setSubmitStatus('success');
      setFileName("");
      setFiles(null);
      (e.target as HTMLFormElement).reset();

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-wolf-black relative border-t border-wolf-gunmetal"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight mb-8"
            >
              {content.contact.title} <span className="molten-highlight">{content.contact.highlight}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg mb-12 max-w-md"
            >
              {content.contact.description}
            </motion.p>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-wolf-gunmetal flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-wolf-red" />
                </div>
                <div>
                  <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-1">
                    Location
                  </h4>
                  <p className="text-gray-400 whitespace-pre-line">{content.business.address}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-wolf-gunmetal flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-wolf-red" />
                </div>
                <div>
                  <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-1">
                    Phone
                  </h4>
                  <a href={content.business.phoneHref} className="text-gray-400 hover:text-white transition-colors">
                    {content.business.phoneDisplay}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-wolf-gunmetal flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-wolf-red" />
                </div>
                <div>
                  <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-1">
                    Email
                  </h4>
                  <a href={`mailto:${content.business.email}`} className="text-gray-400 hover:text-white transition-colors">
                    {content.business.email}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-wolf-gunmetal flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-wolf-red" />
                </div>
                <div>
                  <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-1">
                    Hours
                  </h4>
                  <p className="text-gray-400 whitespace-pre-line">{content.business.hours}</p>
                </div>
              </motion.div>
            </div>

            {/* Google Map */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 w-full h-64 border border-wolf-gunmetal grayscale hover:grayscale-0 transition-all duration-500"
            >
              <iframe 
                src={content.business.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-wolf-gray p-8 md:p-12 border border-wolf-gunmetal relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-wolf-red" />
            <h3 className="text-2xl font-heading font-bold uppercase tracking-wide mb-8 text-white">
              {content.contact.quoteTitle}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2"
                >
                  Service Required
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors appearance-none cursor-pointer"
                  >
                    {serviceOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wolf-red pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2">
                  Upload Images of Damage (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFiles(e.target.files);
                        setFileName(e.target.files.length === 1 ? e.target.files[0].name : `${e.target.files.length} files selected`);
                      } else {
                        setFiles(null);
                        setFileName("");
                      }
                    }}
                  />
                  <label
                    htmlFor="images"
                    className="w-full bg-wolf-black border border-wolf-gunmetal border-dashed px-4 py-6 flex flex-col items-center justify-center text-gray-400 hover:border-wolf-red hover:text-wolf-red transition-all duration-300 cursor-pointer group"
                  >
                    <UploadCloud className="w-8 h-8 mb-3 text-wolf-gunmetal group-hover:text-wolf-red transition-colors duration-300 group-hover:scale-110 transform" />
                    <span className="text-xs font-heading tracking-widest uppercase text-center">
                      {fileName || "Choose Files / No Files Uploaded"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2"
                >
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors resize-none"
                  placeholder="Tell us about your vehicle and what you need done..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-wolf-red text-wolf-black font-heading tracking-widest uppercase py-4 hover:bg-wolf-red-hover transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-500/10 border border-green-500/50 p-4 flex items-center gap-3 text-green-400"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-sm">Quote request sent successfully! We'll be in touch soon.</p>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">Something went wrong. Please try again or call us directly.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
