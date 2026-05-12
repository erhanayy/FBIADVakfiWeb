import { kurumsalData } from "@/data/kurumsal";

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
            <p>{kurumsalData.hakkimizda}</p>
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
              <p className="text-gray-600 leading-relaxed font-medium">
                {kurumsalData.misyonumuz}
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold text-fbiad-blue mb-4">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {kurumsalData.vizyonumuz}
              </p>
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

        {/* Kurucularımız */}
        <section id="kurucularimiz" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Kurucularımız</h2>
          </div>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              Vakfımız, eğitime gönül vermiş değerli kurucularımızın öncülüğünde hayata geçirilmiştir. 
              (Buraya kurucuların kısa hikayesi veya listesi eklenecektir.)
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Kurucu İsim 1</li>
              <li>Kurucu İsim 2</li>
              <li>Kurucu İsim 3</li>
            </ul>
          </div>
        </section>

        {/* Yönetim Kurulu */}
        <section id="yonetim-kurulu" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Yönetim Kurulu</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((person) => (
              <div key={person} className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 object-cover overflow-hidden">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Fotoğraf</div>
                </div>
                <h4 className="text-lg font-bold text-fbiad-dark-blue">Yönetici Adı {person}</h4>
                <p className="text-sm text-fbiad-yellow font-medium">Yönetim Kurulu Üyesi</p>
              </div>
            ))}
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
                  <h4 className="font-bold text-fbiad-dark-blue">2025 Yılı Faaliyet Raporu</h4>
                  <p className="text-sm text-gray-500">Eklenme: Mayıs 2026</p>
                </div>
              </div>
              <a href="#" className="text-fbiad-blue hover:text-fbiad-yellow font-semibold">İndir</a>
            </div>
            <div className="flex justify-between items-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-3 rounded-lg font-bold">PDF</div>
                <div>
                  <h4 className="font-bold text-fbiad-dark-blue">2024 Yılı Faaliyet Raporu</h4>
                  <p className="text-sm text-gray-500">Eklenme: Ocak 2025</p>
                </div>
              </div>
              <a href="#" className="text-fbiad-blue hover:text-fbiad-yellow font-semibold">İndir</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
