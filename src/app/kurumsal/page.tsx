import { kurumsalData } from "@/data/kurumsal";
import Image from "next/image";

export const metadata = {
  title: "Kurumsal | FBİAD Vakfı",
  description: "FBİAD Vakfı hakkımızda, misyonumuz, vizyonumuz ve yönetim kadromuz.",
};

export default function KurumsalPage() {
  return (
    <div className="bg-white">
      {/* Kurumsal Header */}
      <section className="bg-fbiad-dark-blue text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Kurumsal</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          FBİAD Vakfı olarak eğitim yolculuğunda nerede durduğumuzu ve kim olduğumuzu keşfedin.
        </p>
      </section>

      {/* Sections Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
        
        {/* Hakkımızda */}
        <section id="hakkimizda" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Hakkımızda</h2>
          </div>
          <div className="prose prose-lg text-gray-600 max-w-none font-medium leading-relaxed">
            <div className="space-y-4">
              {kurumsalData.hakkimizda.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Misyon & Vizyon */}
        <section id="misyon" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Misyon & Vizyon</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-fbiad-blue mb-4">Misyonumuz</h3>
              <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                {kurumsalData.misyonumuz.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-fbiad-blue mb-4">Vizyonumuz</h3>
              <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                {kurumsalData.vizyonumuz.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Değerlerimiz */}
        <section id="degerlerimiz" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Değerlerimiz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kurumsalData.degerlerimiz.map((deger, i) => (
              <div key={i} className="bg-fbiad-blue/5 p-6 rounded-xl border border-fbiad-blue/10 flex flex-col">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-black text-fbiad-yellow opacity-50">0{i+1}</span>
                  <h4 className="font-bold text-xl text-fbiad-dark-blue">{deger.baslik}</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{deger.aciklama}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tarihçemiz */}
        <section id="tarihcemiz" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Tarihçemiz</h2>
          </div>
          <div className="prose prose-lg text-gray-600 max-w-none font-medium leading-relaxed">
            <div className="space-y-4">
              {kurumsalData.tarihcemiz.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Mütevelli Heyeti Başkanımızdan */}
        <section id="mutevelli-heyeti" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Mütevelli Heyeti Başkanımızdan</h2>
          </div>
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21L16.41 14.583C16.89 13.25 17.51 12.167 18.27 11.333C19.03 10.5 19.89 10.083 20.85 10.083V5.5C18.85 5.5 17.15 6.271 15.75 7.812C14.35 9.354 13.65 11.458 13.65 14.125V21H14.017ZM4.917 21L7.31 14.583C7.79 13.25 8.41 12.167 9.17 11.333C9.93 10.5 10.79 10.083 11.75 10.083V5.5C9.75 5.5 8.05 6.271 6.65 7.812C5.25 9.354 4.55 11.458 4.55 14.125V21H4.917Z"/>
              </svg>
            </div>
            <div className="prose prose-lg text-gray-600 max-w-none font-medium leading-relaxed space-y-4 relative z-10">
              {kurumsalData.mutevelliHeyeti.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
              <div className="pt-6 mt-8 border-t border-gray-200">
                <h4 className="font-bold text-fbiad-dark-blue text-xl">Güven Güleşce</h4>
                <p className="text-fbiad-yellow font-medium">Kurucu & Mütevelli Heyeti Başkanı</p>
                <p className="text-gray-500 text-sm">Fenerbahçeli İş Adamları Vakfı</p>
              </div>
            </div>
          </div>
        </section>

        {/* Kurucularımız ve Yönetim Kurulu */}
        <section id="kurucularimiz-ve-yonetim" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Kurucularımız ve Yönetim Kurulu</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Sol Kolon - Başkan */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-2xl font-semibold text-fbiad-blue mb-6">Kurucu & Mütevelli Heyeti Başkanı</h3>
              <div className="relative w-64 h-80 mb-6 rounded-xl overflow-hidden shadow-md">
                <Image 
                  src="/guven-gulesce.jpg" 
                  alt="Güven Güleşce" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-fbiad-dark-blue">Güven Güleşce</h4>
              <p className="text-gray-600 font-medium mt-1">Fenerbahçeli İş Adamları Vakfı</p>
            </div>

            {/* Sağ Kolon - Yönetim Kurulu */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-fbiad-blue mb-6">Yönetim Kurulu Üyelerimiz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kurumsalData.yonetimKuruluUyeleri.map((uye, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-fbiad-yellow"></div>
                    <span className="font-semibold text-gray-700">{uye}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Yönetim Ekibi */}
        <section id="yonetim-ekibi" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Yönetim Ekibi</h2>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <p className="text-gray-600 mb-6">
              Operasyonel süreçlerimizi yürüten ve vakfımızın günlük faaliyetlerini gerçekleştiren profesyonel ekibimiz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-lg">
                <h4 className="font-bold text-fbiad-dark-blue">Ekip Üyesi 1</h4>
                <p className="text-sm text-gray-500">Genel Sekreter</p>
              </div>
              <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-lg">
                <h4 className="font-bold text-fbiad-dark-blue">Ekip Üyesi 2</h4>
                <p className="text-sm text-gray-500">Burs Operasyon Sorumlusu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Faaliyet Raporları */}
        <section id="faaliyet-raporlari" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Faaliyet Raporları</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-3 rounded-lg font-bold">PDF</div>
                <div>
                  <h4 className="font-bold text-fbiad-dark-blue">2025-2026 Öğretim yılı Faaliyet Raporu</h4>
                  <p className="text-sm text-gray-500">Burs Dönemi</p>
                </div>
              </div>
              <a href="/fbiad_vakfi_2025_2026_burs_faaliyet_raporu.pdf" download target="_blank" className="text-fbiad-blue hover:text-fbiad-yellow font-semibold">İndir</a>
            </div>
            <div className="flex justify-between items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-3 rounded-lg font-bold">PDF</div>
                <div>
                  <h4 className="font-bold text-fbiad-dark-blue">2024-2025 Öğretim yılı Faaliyet Raporu</h4>
                  <p className="text-sm text-gray-500">Burs Dönemi</p>
                </div>
              </div>
              <a href="/fbiad_vakfi_2024_2025_burs_faaliyet_raporu.pdf" download target="_blank" className="text-fbiad-blue hover:text-fbiad-yellow font-semibold">İndir</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
