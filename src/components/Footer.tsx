import { Instagram, Facebook } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="bg-wolf-black border-t border-wolf-gunmetal pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a
              href="#"
              className="text-3xl font-heading font-bold tracking-wider flex items-center gap-2 mb-6"
            >
              <span className="text-wolf-red">WOLF</span>
              <span>CUSTOMS</span>
            </a>
            <p className="text-gray-400 max-w-md leading-relaxed mb-8">
              {content.business.footerBlurb}
            </p>
            <div className="flex gap-4">
              <a
                href={content.business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-wolf-gunmetal flex items-center justify-center hover:bg-wolf-red hover:text-white transition-colors duration-300 text-gray-400"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={content.business.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-wolf-gunmetal flex items-center justify-center hover:bg-wolf-red hover:text-white transition-colors duration-300 text-gray-400"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {content.services.items.slice(0, 5).map((service) => (
                <li key={service.title}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-wolf-red transition-colors"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#work"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Our Work
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  The Process
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wolf-gunmetal pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Wolf Customs. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Wolf Customs
          </p>
        </div>
      </div>
    </footer>
  );
}
