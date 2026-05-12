import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-fbiad-dark-blue text-fbiad-white border-t-4 border-fbiad-yellow pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <h3 className="text-xl font-bold tracking-wide mb-2 text-fbiad-yellow">FBİAD Vakfı</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Geleceğin liderlerini yetiştirmek ve eğitime destek olmak amacıyla kurulan vakfımız, aydınlık bir yarın için çalışmaktadır.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-fbiad-yellow">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/kurumsal#hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/kurumsal#misyon" className="hover:text-white transition-colors">Misyon ve Vizyon</Link></li>
              <li><Link href="/kurumsal#degerlerimiz" className="hover:text-white transition-colors">Değerlerimiz</Link></li>
              <li><Link href="/kurumsal#yonetim-kurulu" className="hover:text-white transition-colors">Yönetim Kurulu</Link></li>
              <li><Link href="/kurumsal#faaliyet-raporlari" className="hover:text-white transition-colors">Faaliyet Raporları</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-fbiad-yellow">Burs & Bağış</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/burs" className="hover:text-white transition-colors">Burs Programı</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Bursiyer Girişi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobil Uygulama İndir</a></li>
              <li><Link href="/bagis" className="hover:text-white transition-colors font-semibold text-fbiad-yellow">Hemen Bağış Yap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-fbiad-yellow">İletişim</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <span className="block font-medium text-white mb-1">Adres:</span>
                Fenerbahçe Mah. Kurukahveci Sok. No:1 Kadıköy / İstanbul
              </li>
              <li className="pt-2">
                <span className="block font-medium text-white mb-1">E-Posta:</span>
                <a href="mailto:info@fbiad.org" className="hover:text-white transition-colors">info@fbiad.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-fbiad-blue pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} FBİAD Vakfı. Tüm hakları saklıdır.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
            <a href="https://www.fbiad.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FBİAD Derneği</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
