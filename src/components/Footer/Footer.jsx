import {
  Mail,
  MapPin,
  Phone,
  Shield,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";

const data = {
  services: {
    ai: "/ai-agent",
    analytics: "/analytics",
    productivity: "/productivity-tools",
    integration: "/integration",
  },
  about: {
    history: "/about-us",
    team: "/team",
    handbook: "/handbook",
    careers: "/careers",
  },
  help: {
    faqs: "/faqs",
    support: "/support",
   
    documentation: "/docs",
    
  },
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    cookies: "/cookie-policy",
    security: "/security",
  },
  contact: {
    email: "mail",
    phone: "+91 XXXXX XXXXX",
    address: "Jayanagar, Bengaluru",
  },
  company: {
    name: "Productive Content",
    description:
      "Enterprise-grade AI-powered content management platform. Streamline your workflow, enhance productivity, and transform how your team consumes and processes information.",
  },
};



const aboutLinks = [
  { text: "Features", href: "#features" },
  { text: "About Us", href: "#aboutus" },
];

const serviceLinks = [
  { text: "Content", href: "/dashboard/content" },
  { text: "Scheduler", href: "/smart-scheduler" },
  { text: "Summarizer", href: "/summarizer" },
  { text: "Notes", href: "/notes" },
];

const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Support Center", href: data.help.support },
  { text: "Documentation", href: data.help.documentation },
];

const legalLinks = [
  { text: "Privacy Policy", href: data.legal.privacy },
  { text: "Terms of Service", href: data.legal.terms },
  { text: "Cookie Policy", href: data.legal.cookies },
  { text: "Security", href: data.legal.security },
];

const contactInfo = [
  {
    icon: Mail,
    text: data.contact.email,
    href: `mailto:${data.contact.email}`,
    label: "Email us"
  },
  {
    icon: Phone,
    text: data.contact.phone,
    href: `tel:${data.contact.phone.replace(/\s/g, '')}`,
    label: "Call us"
  },
  {
    icon: MapPin,
    text: data.contact.address,
    isAddress: true,
    label: "Visit us"
  },
];



export default function Footer4Col() {
  return (
    <footer
      id="footer"
      className="bg-black w-full place-self-end border-t border-gray-800"
    >
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">


        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Company Info & Contact */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {data.company.name}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {data.company.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, text, isAddress, href, label }) => (
                  <a
                    key={text}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                    href={href || "#"}
                    title={label}
                    {...(href?.startsWith('mailto:') || href?.startsWith('tel:') ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <Icon className="size-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                    {isAddress ? (
                      <address className="not-italic">{text}</address>
                    ) : (
                      <span>{text}</span>
                    )}
                  </a>
                ))}

              </div>
            </div>


          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Features & About */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Features</h4>
              <ul className="space-y-3">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      href={href}
                    >
                      <ArrowRight className="size-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      href={href}
                    >
                      <ArrowRight className="size-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-colors duration-200" />
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support & Legal</h4>
              <ul className="space-y-3">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="size-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span>{text}</span>
                      {hasIndicator && (
                        <span className="relative flex size-2 ml-1">
                          <span className="bg-green-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-green-500 relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}

                {/* Legal Links */}
                <li className="pt-4 mt-4 border-t border-gray-800">
                  <div className="space-y-3">
                    {legalLinks.map(({ text, href }) => (
                      <a
                        key={text}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                        href={href}
                      >
                        <ArrowRight className="size-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        {text}
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 {data.company.name}. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-green-500" />
                <span className="text-sm text-gray-400">SOC 2 Compliant</span>
              </div>
            </div>

            q            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-yellow-500" />
                <span className="text-sm text-gray-400">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-blue-500" />
                <span className="text-sm text-gray-400">Global CDN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
