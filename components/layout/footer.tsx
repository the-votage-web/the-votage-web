import { Logo } from '../ui/logo';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { TikTokIcon } from '../icons/tiktok-icon';
import { Button } from '../ui/button';

export const Footer = () => {
  return (
    <footer 
      className="bg-[#010101] text-white pt-20 pb-10 overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/img/footer-bg.png)' }}>
      {/* Background Texture Overlay (Optional subtle texture from design) */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Socials */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <Logo />
               </div>
               <span className="font-body text-2xl">Follow us</span>
            </div>
            <p className="font-body text-base text-white/80">
              On all our social media
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/wearethevotage?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://youtube.com/@thevotage?si=9FD0iPKjwzKgMybv" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/share/17qGmvUop7/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@thevotage?_r=1&_t=ZS-96qLSNdt3FE" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <TikTokIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-copperplate font-bold text-2xl mb-8">Quick links</h3>
            <ul className="space-y-3 font-body text-base text-white/80">
              <li><a href="/quick-links/baby-naming" className="hover:text-brand-blue transition-colors">Naming Ceremony</a></li>
              <li><a href="/quick-links/baby-dedication" className="hover:text-brand-blue transition-colors">Baby Dedication</a></li>
              <li><a href="/give" className="hover:text-brand-blue transition-colors">Partner with us</a></li>
              <li><a href="/connect" className="hover:text-brand-blue transition-colors">Connect</a></li>
              <li><a href="/join" className="hover:text-brand-blue transition-colors">Join Us</a></li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="pt-0 lg:pt-16">
            <ul className="space-y-4 font-body text-base text-white/80">
              <li><a href="/" className="hover:text-brand-blue transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-brand-blue transition-colors">About Us</a></li>
              <li><a href="/sermons" className="hover:text-brand-blue transition-colors">Sermons</a></li>
              <li><a href="/growth-track" className="hover:text-brand-blue transition-colors">Growth Track</a></li>
              <li><a href="/plan-your-visit" className="hover:text-brand-blue transition-colors">Plan Your Visit</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-body font-bold text-2xl mb-2">Stay connected</h3>
            <p className="font-body text-white/60 mb-6">
              Subscribe for updates, devotionals and event announcements
            </p>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <div className="flex bg-white/10 rounded-full p-1 pl-6 border border-white/10 focus-within:border-white/50 transition-colors">
                <input 
                  type="email" 
                  placeholder="Anastasia@gmail.com" 
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
                />
                <Button variant="primary" className="rounded-full px-8 py-2">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center lg:text-left">
          <p className="font-body text-white/40 text-sm">
            @ 2026 The VOTAGE. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
