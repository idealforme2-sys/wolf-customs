import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
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
              Adelaide's premier automotive restoration and custom paint studio.
              We specialize in bringing legends back to life with uncompromising
              quality and precision.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/wolfcustoms_adelaide/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-wolf-gunmetal flex items-center justify-center hover:bg-wolf-red hover:text-white transition-colors duration-300 text-gray-400"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://web.facebook.com/wolfcustomsadelaide?rdid=KcDxg51u4492qlPe&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F19LsBACZEz%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26_rdc%3D1%26_rdr"
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
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Paint & Panel Repairs
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Vehicle Restorations
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Full Car Resprays
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Rust Repairs
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-wolf-red transition-colors"
                >
                  Custom Paint Jobs
                </a>
              </li>
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
