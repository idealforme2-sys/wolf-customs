import { Instagram, Facebook } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

export default function Footer() {
  const { content } = useSiteContent();
  const footerLinkClassName =
    "text-gray-400 transition-all duration-300 hover:text-wolf-red hover:[text-shadow:0_0_18px_rgba(243,163,55,0.24)]";

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
                className="w-10 h-10 bg-wolf-gunmetal flex items-center justify-center hover:bg-wolf-red hover:text-wolf-black transition-colors duration-300 text-gray-400"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={content.business.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-wolf-gunmetal flex items-center justify-center hover:bg-wolf-red hover:text-wolf-black transition-colors duration-300 text-gray-400"
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
                    className={footerLinkClassName}
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
                  href="#portfolio"
                  className={footerLinkClassName}
                >
                  Our Work
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className={footerLinkClassName}
                >
                  The Process
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={footerLinkClassName}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={footerLinkClassName}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={footerLinkClassName}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wolf-gunmetal pt-8 flex flex-col items-center justify-center gap-3">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wolf Customs. All rights reserved.
          </p>
          <a
            href="https://www.instagram.com/creative_webflow_co/"
            target="_blank"
            rel="noopener noreferrer"
            className="group text-[11px] uppercase tracking-[0.22em] text-gray-600 transition-colors hover:text-gray-300"
          >
            Site by{" "}
            <span className="molten-swap-primary">
              Creative
            </span>{" "}
            <span className="molten-swap-secondary">
              WebFlow Co.
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
