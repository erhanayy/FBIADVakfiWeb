import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AppPaymentForm from './payment-form';

export const dynamic = 'force-dynamic';

export default async function AppPaymentPage(props: { searchParams: Promise<{ token?: string, success?: string, error?: string, fundId?: string }> }) {
  const searchParams = await props.searchParams;
  const { token, success, error, fundId } = searchParams;
  
  // Moka'dan başarılı dönüş
  if (success === 'true') {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ödemeniz Başarıyla Alındı!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Destekleriniz için teşekkür ederiz. İşleminize devam edebilirsiniz.
            </p>
            <div className="flex flex-col gap-3 justify-center items-center">
              <a 
                href={`https://burs.fbiadvakfi.org/dashboard/funds/${fundId}/payment`}
                className="inline-block bg-fbiad-dark-blue hover:bg-fbiad-blue text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md w-full max-w-xs text-center"
              >
                Panele Geri Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Moka'dan hatalı dönüş
  if (error) {
    let errorMessage = "Ödeme işlemi sırasında bir hata oluştu.";
    if (error === 'moka_failed') errorMessage = "3D Secure işlemi başarısız oldu veya reddedildi.";
    if (error === 'system_error') errorMessage = "Ödeme bankadan onaylandı ancak sisteme kaydedilirken bir sorun oluştu.";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">İşlem Başarısız</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <a 
            href="fbiadapp://payment-failed"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all shadow-sm w-full"
          >
            Uygulamaya Geri Dön
          </a>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-2">Geçersiz İstek</h1>
          <p className="text-gray-600">Ödeme oturumu bulunamadı veya link eksik.</p>
        </div>
      </div>
    );
  }

  let payload;
  try {
    const secretKey = process.env.AUTH_SECRET || 'super_secret_generated_key_for_local_dev';
    const secret = new TextEncoder().encode(secretKey);
    const { payload: jwtPayload } = await jwtVerify(token, secret);
    payload = jwtPayload as {
      fundId: string;
      adSoyad: string;
      tekilTutar: number;
      toplamTutar: number;
      taksitMi: boolean;
      plan: { id: string; date: string; status: string; amount: number; }[];
      returnUrl?: string;
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-2">Oturum Süresi Doldu</h1>
          <p className="text-gray-600 mb-6">Güvenliğiniz için ödeme linkinin süresi (15 dk) dolmuştur. Lütfen uygulamaya dönerek yeniden "Öde" butonuna tıklayınız.</p>
          <a 
            href="fbiadapp://payment-failed"
            className="inline-block bg-fbiad-dark-blue hover:bg-fbiad-blue text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md w-full"
          >
            Uygulamaya Geri Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-fbiad-dark-blue mb-4">Fon/Burs Ödemesi</h1>
          <p className="text-lg text-gray-600">
            FBİAD Vakfı eğitim fonu için taahhüt ettiğiniz tutarın güvenli ödeme ekranındasınız.
          </p>
        </div>

        <AppPaymentForm payload={payload} />
      </div>
    </div>
  );
}
