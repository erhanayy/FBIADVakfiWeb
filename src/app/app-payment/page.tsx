import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AppPaymentForm from './payment-form';

export const dynamic = 'force-dynamic';

export default async function AppPaymentPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;
  
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
      paymentId: string;
      adSoyad: string;
      tekilTutar: number;
      toplamTutar: number;
      taksitMi: boolean;
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
