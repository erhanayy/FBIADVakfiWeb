"use client";

import Image from "next/image";
import { kurumsalData } from "@/data/kurumsal";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, GraduationCap, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-fbiad-dark-blue text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fbiad-yellow rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fbiad-blue rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Geleceğin Liderlerini <br/>
                <span className="text-fbiad-yellow">Birlikte</span> Yetiştiriyoruz
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
                FBİAD Vakfı olarak eğitime verdiğimiz destek ve sağladığımız burs imkanları ile yarının başarılı profesyonellerini bugünden hazırlıyoruz.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/bagis" className="bg-fbiad-yellow text-fbiad-dark-blue font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transition-transform transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  Hemen Bağış Yap <HeartHandshake size={20} />
                </Link>
                <Link href="/burs" className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-fbiad-dark-blue transition-colors flex items-center gap-2">
                  Burs Programları <GraduationCap size={20} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white/5 p-4 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center">
                <Image
                  src="/fbiad-logo.png"
                  alt="FBİAD Vakfı Logo"
                  width={300}
                  height={300}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Quick Links / Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-fbiad-blue/10 text-fbiad-blue rounded-full flex items-center justify-center mb-6 group-hover:bg-fbiad-blue group-hover:text-white transition-colors">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">Vakfımızı Tanıyın</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Misyonumuz, vizyonumuz ve değerlerimiz hakkında detaylı bilgi alın. Yönetim kurulumuz ile tanışın.
              </p>
              <Link href="/kurumsal" className="text-fbiad-blue font-semibold flex items-center gap-1 group-hover:text-fbiad-yellow transition-colors">
                Detaylı Bilgi <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-fbiad-yellow/20 text-fbiad-yellow rounded-full flex items-center justify-center mb-6 group-hover:bg-fbiad-yellow group-hover:text-white transition-colors">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">Burs Başvurusu</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                FBİAD Vakfı burs programlarının şartlarını inceleyin ve size uygun olan programa hemen başvurun.
              </p>
              <Link href="/burs" className="text-fbiad-blue font-semibold flex items-center gap-1 group-hover:text-fbiad-yellow transition-colors">
                Başvuru Şartları <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">Bağış & Destek</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Eğitimde fırsat eşitliği yaratmak ve başarılı öğrencilere destek olmak için vakfımıza bağış yapın.
              </p>
              <Link href="/bagis" className="text-fbiad-blue font-semibold flex items-center gap-1 group-hover:text-fbiad-yellow transition-colors">
                Bağış Seçenekleri <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-fbiad-yellow text-fbiad-dark-blue text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">"Eğitim, aydınlık geleceğin teminatıdır."</h2>
          <p className="text-lg font-medium opacity-80">
            {kurumsalData.vizyonumuz}
          </p>
          <div className="pt-8">
            <Link href="/kurumsal#misyon" className="inline-block border-2 border-fbiad-dark-blue text-fbiad-dark-blue font-bold px-8 py-3 rounded-full hover:bg-fbiad-dark-blue hover:text-white transition-colors">
              Misyonumuzu Oku
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
