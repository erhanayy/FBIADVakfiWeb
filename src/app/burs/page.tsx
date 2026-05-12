import { ExternalLink, Smartphone, Globe } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Burs Programları | FBİAD Vakfı",
  description: "FBİAD Vakfı burs programı detayları, başvuru şartları ve burs platformlarına erişim.",
};

export default function BursPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-fbiad-dark-blue text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Burs Programlarımız</h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          Öğrencilerimize sunduğumuz destek programları ve başvuru süreçleri.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Burs Programı Tanıtımı */}
        <section id="program">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-fbiad-yellow rounded-full"></div>
            <h2 className="text-3xl font-bold text-fbiad-dark-blue">Burs Programı Tanıtımı</h2>
          </div>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-xl leading-relaxed font-medium text-gray-800 mb-6">
              FBİAD Vakfı, eğitimde fırsat eşitliğini sağlamak ve başarılı gençlerin akademik hedeflerine ulaşmalarını desteklemek amacıyla kapsamlı bir burs programı yürütmektedir.
            </p>
            <p>
              Programımız kapsamında maddi desteğe ihtiyaç duyan başarılı üniversite öğrencilerine geri ödemesiz eğitim bursu sağlanmaktadır. Bursiyerlerimiz sadece finansal destek almakla kalmaz, aynı zamanda vakfımızın düzenlediği eğitim, seminer ve mentorluk programlarına katılma ayrıcalığı elde ederler.
            </p>
            <h3 className="text-xl font-bold text-fbiad-dark-blue mt-8 mb-4">Başvuru Şartları</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>T.C. vatandaşı olmak.</li>
              <li>Yurt içindeki devlet üniversitelerinde veya vakıf üniversitelerinde %100 burslu okumak.</li>
              <li>Maddi desteğe ihtiyaç duymak.</li>
              <li>Başarılı bir akademik geçmişe sahip olmak (Not ortalaması vb. kriterler).</li>
            </ul>
          </div>
        </section>

        {/* Uygulama Yönlendirmeleri */}
        <section id="portal" className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm scroll-mt-32">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-fbiad-dark-blue mb-4">Burs Portalı</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Burs başvurusu yapmak, başvuru durumunuzu takip etmek ve bursiyer ağına dahil olmak için web portalımızı veya mobil uygulamamızı kullanabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Web Uygulaması */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-fbiad-yellow transition-colors group text-center flex flex-col h-full">
              <div className="w-16 h-16 bg-fbiad-blue/10 text-fbiad-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-fbiad-blue group-hover:text-white transition-colors">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">Web Portalı</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Tarayıcınız üzerinden mevcut BurstaBugün altyapısına geçiş yaparak başvurularınızı yönetebilirsiniz.
              </p>
              <Link href="#" className="w-full inline-flex items-center justify-center gap-2 bg-fbiad-dark-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-fbiad-blue transition-colors">
                Portala Git <ExternalLink size={18} />
              </Link>
            </div>

            {/* Mobil Uygulama */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-fbiad-yellow transition-colors group text-center flex flex-col h-full">
              <div className="w-16 h-16 bg-fbiad-yellow/20 text-fbiad-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-fbiad-yellow group-hover:text-white transition-colors">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">Mobil Uygulama</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Hareket halindeyken bildirimleri almak ve hızlı işlem yapmak için FBİAD Vakfı Burs mobil uygulamasını indirin.
              </p>
              <div className="flex flex-col gap-3">
                <a href="#" className="w-full inline-flex items-center justify-center gap-2 border-2 border-fbiad-dark-blue text-fbiad-dark-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                  App Store'dan İndir <ExternalLink size={18} />
                </a>
                <a href="#" className="w-full inline-flex items-center justify-center gap-2 border-2 border-fbiad-dark-blue text-fbiad-dark-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                  Google Play'den İndir <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
