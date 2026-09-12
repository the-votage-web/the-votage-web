"use client"
import { Logo } from '../ui/logo';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SubLink {
  name: string;
  href: string;
  description?: string;
}

interface NavLinkItem {
  name: string;
  href?: string;
  hasDropdown?: boolean;
  subLinks?: SubLink[];
}

const navLinks: NavLinkItem[] = [
  { name: 'Home', hasDropdown: false },
  { name: 'About', hasDropdown: false },
  { name: 'Connect', hasDropdown: false },
  { name: 'Sermons', hasDropdown: false },
  { name: 'Give', hasDropdown: false },
  { name: 'Contact', hasDropdown: false },
  { name: 'Growth Track', href: '/growth-track', hasDropdown: false },
  {
    name: 'Quick Links',
    hasDropdown: true,
    subLinks: [
      {
        name: 'Naming Ceremony',
        href: '/quick-links/baby-naming',
        description: 'Schedule baby naming ceremony',
      },
      {
        name: 'Baby Dedication',
        href: '/quick-links/baby-dedication',
        description: 'Dedicate your newborn to the Lord',
      },
    ],
  },
];

interface NavbarProps {
  darkText?: boolean;
}

export const Navbar = ({ darkText = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileQuickLinksOpen, setMobileQuickLinksOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [hasAnimated, setHasAnimated] = useState(true);

  // Only run animation on initial browser load, not on client-side navigation
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('navbarAnimated');
    if (!hasVisited) {
      setHasAnimated(false);
      sessionStorage.setItem('navbarAnimated', 'true');
    }
  }, []);

  const handlePlanYourVisitClick = () => {
    if (pathname === '/plan-your-visit') {
      const contactForm = document.querySelector('#contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/plan-your-visit');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text color based on darkText prop and scroll state
  const getTextColor = () => {
    if (darkText && !isScrolled) return 'text-black/90 hover:text-black';
    return 'text-white/90 hover:text-white';
  };

  return (
    <motion.nav
      initial={hasAnimated ? false : { y: -100 }}
      animate={hasAnimated ? false : { y: 0 }}
      transition={hasAnimated ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50 w-full
        transition-all duration-300 ease-in-out max-h-20
        ${isScrolled 
          ? 'bg-black/70 backdrop-blur-lg shadow-lg border-b border-white/10' 
          : darkText 
            ? 'bg-transparent backdrop-blur-[2px] border-b border-black/5'
            : 'bg-nav-bg/5 backdrop-blur-[2px] border-b border-white/5'
        }
      `}
    >
      <div className={`
        max-w-360 mx-auto px-6 lg:px-20 flex items-center justify-between
        transition-all duration-300 ease-in-out
        ${isScrolled ? 'h-16' : 'h-20'}
      `}>
        {/* Logo */}
        <div
          onClick={() => router.push('/')}
          className="shrink-0 rounded-full overflow-hidden bg-white/10 cursor-pointer h-[3.75rem] w-[3.75rem]"
        >
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            if (link.hasDropdown && link.subLinks) {
              return (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDesktopDropdown(link.name)}
                  onMouseLeave={() => setActiveDesktopDropdown(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 ${getTextColor()} font-sans text-base transition-colors py-2 focus:outline-none`}
                    aria-expanded={activeDesktopDropdown === link.name}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDesktopDropdown === link.name ? 'rotate-180 text-brand-blue' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDesktopDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/15 p-2.5 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="flex flex-col gap-1">
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setActiveDesktopDropdown(null)}
                              className="group/item flex flex-col p-2.5 rounded-xl transition-all duration-200 hover:bg-white/10"
                            >
                              <span className="text-sm font-medium text-white group-hover/item:text-brand-blue transition-colors">
                                {sub.name}
                              </span>
                              {sub.description && (
                                <span className="text-[11px] text-white/60 group-hover/item:text-white/80 transition-colors">
                                  {sub.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div
                key={link.name}
                className={`group flex items-center gap-1.5 ${getTextColor()} font-sans text-base transition-colors`}
              >
                <Link
                  href={link.href || `/${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-1.5"
                >
                  {link.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex gap-4 items-center">
          <Button 
            variant="nav-cta" 
            className={`font-body text-lg px-8 py-3 rounded-full border-opacity-60 transition-all duration-300 ${
              darkText && !isScrolled 
                ? 'text-black border-black hover:bg-black hover:text-white' 
                : 'text-white border-white hover:bg-white hover:text-black'
            }`}
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
          <Button 
            variant="nav-cta" 
            className={`font-body text-lg px-8 py-3 rounded-full border-opacity-60 transition-all duration-300 ${
              darkText && !isScrolled 
                ? 'text-black border-black hover:bg-black hover:text-white' 
                : 'text-white border-white hover:bg-white hover:text-black'
            }`}
            onClick={handlePlanYourVisitClick}
          >
            Plan Your Visit
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-2 ${darkText && !isScrolled ? 'text-black' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-4 items-center">
              {navLinks.map((link, index) => {
                if (link.hasDropdown && link.subLinks) {
                  return (
                    <motion.div
                      key={link.name}
                      className="w-full text-center flex flex-col items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <button
                        type="button"
                        onClick={() => setMobileQuickLinksOpen(!mobileQuickLinksOpen)}
                        className="text-white text-xl font-medium flex items-center justify-center gap-2 py-1 cursor-pointer focus:outline-none"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            mobileQuickLinksOpen ? 'rotate-180 text-brand-blue' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileQuickLinksOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full flex flex-col gap-2 mt-2 py-2 px-4 bg-white/5 rounded-xl border border-white/10"
                          >
                            {link.subLinks.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setMobileQuickLinksOpen(false);
                                }}
                                className="text-white/80 hover:text-white py-2 text-base font-normal flex flex-col items-center border-b border-white/5 last:border-none"
                              >
                                <span className="font-medium">{sub.name}</span>
                                {sub.description && (
                                  <span className="text-xs text-white/50">{sub.description}</span>
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={link.name}
                    className="text-white text-xl font-medium flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href || `/${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-2"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="w-full flex flex-col items-center gap-3 pt-2"
              >
                <Button 
                  variant="nav-cta" 
                  className="w-full max-w-xs"
                  onClick={() => {
                    router.push('/register');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Register
                </Button>
                <Button 
                  variant="nav-cta" 
                  className="w-full max-w-xs"
                  onClick={() => {
                    handlePlanYourVisitClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Plan Your Visit
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
