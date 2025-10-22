import {
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  MessageCircle,
  Users,
  Code,
  Palette,
  Shield,
  Globe,
  Zap,
  Clock,
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
    livechat: "/live-chat",
    documentation: "/docs",
    tutorials: "/tutorials",
  },
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    cookies: "/cookie-policy",
    security: "/security",
  },
  contact: {
    email: "contact@productivecontent.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA, United States",
    businessHours: "Mon-Fri 9AM-6PM PST",
  },
  company: {
    name: "Productive Content",
    description:
      "Enterprise-grade AI-powered content management platform. Streamline your workflow, enhance productivity, and transform how your team consumes and processes information.",
  },
};

const socialLinks = [
  { icon: MessageCircle, label: "Facebook", href: data.facebookLink },
  { icon: Users, label: "Instagram", href: data.instaLink },
  { icon: ExternalLink, label: "Twitter", href: data.twitterLink },
  { icon: Code, label: "GitHub", href: data.githubLink },
  { icon: Palette, label: "Dribbble", href: data.dribbbleLink },
];

const aboutLinks = [
  { text: "About Us", href: data.about.history },
  { text: "Meet the Team", href: data.about.team },
  { text: "Handbook", href: data.about.handbook },
  { text: "Careers", href: data.about.careers },
];

const serviceLinks = [
  { text: "AI Agent", href: data.services.ai },
  { text: "Analytics", href: data.services.analytics },
  { text: "Productivity Tools", href: data.services.productivity },
  { text: "Integration", href: data.services.integration },
];

const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Support Center", href: data.help.support },
  { text: "Documentation", href: data.help.documentation },
  { text: "Tutorials", href: data.help.tutorials },
  { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
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
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="size-5 text-purple-400" />
                  <span className="flex items-center gap-2">
                    {data.contact.businessHours}
                    <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-gray-700 transition-all duration-200"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
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
                      <ArrowRight className="size-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
            
            <div className="flex items-center gap-6">
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
