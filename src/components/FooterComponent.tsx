import { useTheme } from "../ThemeProvider";
import { FaFacebookF, FaYoutube, FaGoogle } from "react-icons/fa";
import type { IconType } from "react-icons";

type SocialLink = {
  label: string;
  href: string;
  Icon: IconType;
};

type NavLink = {
  label: string;
  href: string;
};

const SOCIALS: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1EShT8KnVx/",
    Icon: FaFacebookF,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@istad7665",
    Icon: FaYoutube,
  },
  {
    label: "Google",
    href: "mailto:info.istad@gmail.com",
    Icon: FaGoogle,
  },
];

const SocialIcon = ({ label, href, Icon }: SocialLink) => (
  <a
    aria-label={label}
    href={href}
    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition hover:bg-indigo-600 hover:text-white dark:bg-indigo-900 dark:text-white dark:hover:bg-indigo-800"
  >
    <Icon className="text-lg" />
  </a>
);

type LinkListProps = {
  title: string;
  links: NavLink[];
  align?: "center" | "left";
};

const LinkList = ({ title, links, align = "center" }: LinkListProps) => (
  <div className={`space-y-4 ${align === "center" ? "text-center lg:text-left" : ""}`}>
    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
      {title}
    </h4>
    <ul className="space-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
      {links.map((link) => (
        <li key={link.label}>
          <a
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            href={link.href}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const COMPANY_LINKS: NavLink[] = [
  { label: "Home", href: "/home" },
  { label: "Ai", href: "/ai" },
  { label: "Question", href: "/" },
  { label: "About Us", href: "/home" },
];

const EXPLORE_LINKS: NavLink[] = [
  { label: "Technology", href: "/home" },
  { label: "Ai-Reference", href: "https://gemini.google.com/app/8ec028bfeb32d64e" },
  { label: "Deatil", href: "/" },
  { label: "Profile", href: "/profile" },
];

const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Legal", href: "#" },
  { label: "Site Map", href: "#" },
];

export const FooterComponent = () => {
  const { theme } = useTheme();
  void theme;

  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-slate-50 pb-8 pt-12 text-slate-700 transition-colors duration-300 dark:border-indigo-900 dark:bg-indigo-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="-mt-6 flex flex-col items-center space-y-10 text-center lg:hidden">
          <div className="flex flex-col items-center space-y-3">
            <img
              alt="AQUARIUM Logo"
              className="h-20 w-20 rounded-full border border-slate-300 object-contain p-1 dark:border-indigo-400/30 sm:h-24 sm:w-24"
              id="custom-cartora-logo"
              src="/images/Logo.png"
            />
            <span className="font-serif text-xl font-bold uppercase tracking-wider">
              AQUARIUM
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Your one-stop destination for top quality, unbeatable deals,
              and fast delivery. Shop smart, anytime, anywhere.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {SOCIALS.map((s) => (
              <SocialIcon key={s.label} {...s} />
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:max-w-md">
            <LinkList title="COMPANY" links={COMPANY_LINKS} />
            <LinkList title="EXPLORE" links={EXPLORE_LINKS} />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              CONTACT
            </h4>
            <div className="space-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Call:</p>
                <p className="mt-0.5">(+885)99 666 777</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gmail:</p>
                <p className="mt-0.5 break-all">istadshop168@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Organized by
            </h4>
            <img
              alt="ISTAD Logo"
              className="mx-auto h-24 w-24 rounded-full border border-slate-300 object-contain p-1 dark:border-indigo-400/30 sm:h-28 sm:w-28"
              src="/images/ISTAD.png"
            />
          </div>

          <div className="w-full space-y-4 border-t border-slate-300 pt-6 text-xs text-slate-500 dark:border-indigo-800/60 dark:text-slate-400">
            <p>© Copyright by CodeUI. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  className="transition hover:text-slate-900 dark:hover:text-slate-200"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-12 items-start gap-10 pb-12">
            <div className="col-span-4 space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  alt="CARTORA Logo"
                  className="h-20 w-20 object-contain"
                  src="/images/Logo.png"
                />
                <span className="font-serif text-2xl font-bold uppercase tracking-wider">
                  AQUARIUM
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Your one-stop destination for top quality, unbeatable deals,
                and fast delivery. Shop smart, anytime, anywhere.
              </p>
              <div className="flex items-center space-x-3 pt-2">
                {SOCIALS.map((s) => (
                  <SocialIcon key={s.label} {...s} />
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <LinkList title="COMPANY" links={COMPANY_LINKS} align="left" />
            </div>

            <div className="col-span-2">
              <LinkList title="EXPLORE" links={EXPLORE_LINKS} align="left" />
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                CONTACT
              </h4>
              <div className="space-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Call:</p>
                  <p className="mt-0.5">(+885)99 666 777</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gmail:</p>
                  <p className="mt-0.5 break-all">istadshop168@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                ORGANIZE BY ISTAD
              </h4>
              <div className="flex justify-start pt-1">
                <img
                  alt="ISTAD Logo"
                  className="h-36 w-36 rounded-full border border-slate-300 object-contain p-1 dark:border-indigo-400/30"
                  src="/images/Istad.png"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between space-y-0 border-t border-slate-300 pt-6 text-xs text-slate-500 dark:border-indigo-800/60 dark:text-slate-400">
            <p>© Copyright by CodeUI. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              {LEGAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  className="transition hover:text-slate-900 dark:hover:text-slate-200"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};