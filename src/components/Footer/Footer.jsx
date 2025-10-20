import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const data = {
  facebookLink: "https://facebook.com/yourpage",
  instaLink: "https://instagram.com/yourpage",
  twitterLink: "https://twitter.com/yourpage",
  githubLink: "https://github.com/yourusername",
  dribbbleLink: "https://dribbble.com/yourprofile",
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
  },
  contact: {
    email: "boomyoeveryone@gmail.com",
    phone: "+91 6364039992",
    address: "Bengaluru, Karnataka, India",
  },
  company: {
    name: "Productive Content consumption",
    description:
      "Personalized AI agent helping you consume content more efficiently, improve productivity, and stay informed effortlessly.",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
  { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
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
  { text: "Support", href: data.help.support },
  { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer
      id="footer"
      className="bg-gradient-to-b from-gray-900 via-gray-100 to-black w-full place-self-end"
>
      <div className="mx-auto max-w-screen-xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Company Info & Socials */}
          <div>
            <p className="text-2xl font-semibold text-center sm:text-left">
              {data.company.name}
            </p>

            <p className="text-foreground/50 mt-8 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-10 flex justify-center gap-8 sm:justify-start md:gap-10">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {/* About Us */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-10 space-y-6 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Our Services</p>
              <ul className="mt-10 space-y-6 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helpful Links */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-10 space-y-6 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-2 sm:justify-start"
                          : "text-secondary-foreground/70 transition"
                      }`}
                    >
                      <span className="text-secondary-foreground/70 transition">{text}</span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-10 space-y-6 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start"
                      href="#"
                    >
                      <Icon className="text-primary size-5 shrink-0 shadow-sm" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70 flex-1 transition">{text}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 border-t pt-8">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
