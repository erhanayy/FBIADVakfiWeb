"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  return (
    <nav className="bg-fbiad-dark-blue text-fbiad-white sticky top-0 z-50 shadow-lg border-b-4 border-fbiad-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-white p-1 rounded-full shadow-md">
                <Image
                  src="/fbiad-logo.png"
                  alt="FBİAD Vakfı Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <span className="font-bold text-xl hidden sm:block tracking-wide">
                FBİAD Vakfı
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            
            {/* Kurumsal Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => handleDropdown('kurumsal')}
                onMouseEnter={() => setActiveDropdown('kurumsal')}
                className="px-4 py-2 rounded-md font-medium hover:text-fbiad-yellow transition-colors flex items-center gap-1"
              >
                Kurumsal <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'kurumsal' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 mt-2 w-56 bg-white text-fbiad-dark-blue shadow-xl rounded-md overflow-hidden border border-gray-100"
                  >
                    <div className="py-2 flex flex-col">
                      <Link href="/kurumsal#hakkimizda" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Hakkımızda</Link>
                      <Link href="/kurumsal#misyon" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Misyon & Vizyon</Link>
                      <Link href="/kurumsal#degerlerimiz" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Değerlerimiz</Link>
                      <Link href="/kurumsal#kurucularimiz" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Kurucularımız</Link>
                      <Link href="/kurumsal#yonetim-kurulu" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Yönetim Kurulu</Link>
                      <Link href="/kurumsal#yonetim-ekibi" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Yönetim Ekibi</Link>
                      <Link href="/kurumsal#faaliyet-raporlari" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors">Faaliyet Raporları</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Burs Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => handleDropdown('burs')}
                onMouseEnter={() => setActiveDropdown('burs')}
                className="px-4 py-2 rounded-md font-medium hover:text-fbiad-yellow transition-colors flex items-center gap-1"
              >
                Burs <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'burs' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 mt-2 w-64 bg-white text-fbiad-dark-blue shadow-xl rounded-md overflow-hidden border border-gray-100"
                  >
                    <div className="py-2 flex flex-col">
                      <Link href="/burs#program" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors border-b border-gray-100">Burs Programı Tanıtımı</Link>
                      <Link href="/burs#portal" className="px-4 py-2 hover:bg-gray-50 hover:text-fbiad-yellow transition-colors font-semibold">Burs Uygulaması</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/bagis" className="px-4 py-2 rounded-md font-medium hover:text-fbiad-yellow transition-colors">
              Bağış
            </Link>

            <a href="https://www.fbiad.org/" target="_blank" rel="noopener noreferrer" className="ml-4 flex items-center hover:opacity-80 transition-opacity" title="FBİAD Derneği">
              <Image src="/fbiad-dernek-logo.png" alt="FBİAD Derneği Logo" width={110} height={36} className="object-contain" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-fbiad-white hover:text-fbiad-yellow hover:bg-fbiad-dark-blue focus:outline-none"
            >
              <span className="sr-only">Menüyü aç</span>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-fbiad-dark-blue border-b-4 border-fbiad-yellow overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/kurumsal" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-fbiad-blue hover:text-fbiad-yellow" onClick={toggleMenu}>
                Kurumsal
              </Link>
              <Link href="/burs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-fbiad-blue hover:text-fbiad-yellow" onClick={toggleMenu}>
                Burs
              </Link>
              <Link href="/bagis" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-fbiad-blue hover:text-fbiad-yellow bg-fbiad-yellow/10" onClick={toggleMenu}>
                Bağış Yap
              </Link>
              <a href="https://www.fbiad.org/" target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-3 rounded-md hover:bg-fbiad-blue mt-2 bg-white/5" onClick={toggleMenu}>
                <span className="text-gray-300 mr-3 text-sm">Derneği Ziyaret Et:</span>
                <Image src="/fbiad-dernek-logo.png" alt="FBİAD Derneği Logo" width={100} height={32} className="object-contain" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
