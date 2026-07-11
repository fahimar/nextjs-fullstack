import Link from "next/link";
import Image from "next/image";

const LINKS = [
  {
    title: "Product",
    items: [
      { label: "Explore Interviewers", href: "/explore" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Get Started", href: "/onboarding" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Prept"
              width={100}
              height={100}
              className="w-auto h-9"
            />
          </Link>
          <p className="text-sm text-stone-500 mt-4 max-w-xs leading-relaxed">
            Ace your next interview with AI-powered practice sessions and real
            experts from top companies.
          </p>
        </div>

        {LINKS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 mb-4">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-500 hover:text-amber-400 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Prept. All rights reserved.
          </p>
          <p className="text-xs text-stone-600">Built with Next.js & Clerk</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
