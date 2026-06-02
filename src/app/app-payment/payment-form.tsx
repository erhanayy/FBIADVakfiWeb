"use client";

import { useState } from "react";
import { ShieldCheck, Lock, CreditCard, User, Calendar } from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";

type PaymentPayload = {
  fundId: string;
  adSoyad: string;
  tekilTutar: number;
  toplamTutar: number;
  taksitMi: boolean;
  plan: {
    id: string;
    date: string;
    status: string;
  }[];
  returnUrl?: string;
};

export default function AppPaymentForm({ payload }: { payload: PaymentPayload }) {
  const [cardNumber, setCardNumber] = useState("");
  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', onSuccess?: () => void}>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onSuccess?: () => void) => {
    setAlertConfig({ isOpen: true, message, type, onSuccess });
  };

  const handleCloseAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    if (alertConfig.onSuccess) {
      alertConfig.onSuccess();
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const simulateBankTransaction = async (cardNum: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const cleanCard = cardNum.replace(/\s/g, '');
    if (cleanCard === '1111111111111111') {
      return { success: true, transactionId: "TX-TEST-" + Date.now() };
    }
    const isSuccess = Math.random() > 0.1;
    return { success: isSuccess, transactionId: isSuccess ? "TX-" + Date.now() : null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContractAccepted) {
      showAlert("Lütfen Bağış Sözleşmesini onaylayınız.", "warning");
      return;
    }
    if (!isNotRobot) {
      showAlert("Lütfen güvenlik doğrulamasını (Robot Değilim) tamamlayınız.", "warning");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bankResult = await simulateBankTransaction(cardNumber);
      
      if (!bankResult.success) {
        showAlert("Banka işlemi reddedildi. Lütfen kart bilgilerinizi kontrol ediniz.", "error");
        setIsSubmitting(false);
        return;
      }

      // Call our API to hit the webhook of BurstaBugun
      const response = await fetch('/api/app-payment/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundId: payload.fundId,
          transactionId: bankResult.transactionId,
          paymentIds: payload.plan.map(p => p.id)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        showAlert("Ödeme banka tarafından onaylandı ancak sisteme kaydedilirken bir hata oluştu.", "error");
        console.error(data.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
      showAlert("Bir hata oluştu, lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ödemeniz Başarıyla Alındı!</h2>
        <p className="text-gray-600 text-lg mb-8">
          Destekleriniz için teşekkür ederiz. Mobil uygulamanıza geri dönerek işlemlerinize devam edebilirsiniz.
        </p>
        <div className="flex flex-col gap-3 justify-center items-center">
          <button 
            onClick={() => window.location.href = payload.returnUrl || `http://localhost:3000/dashboard/funds/${payload.fundId}/payment`} 
            className="bg-fbiad-dark-blue hover:bg-fbiad-blue text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md w-full max-w-xs"
          >
            Panele Geri Dön (Web)
          </button>
          <button 
            onClick={() => window.location.href = `fbiadapp://payment-success?fundId=${payload.fundId}`} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl transition-all shadow-sm w-full max-w-xs"
          >
            Uygulamaya Geri Dön (Mobil)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          <section>
            <h2 className="text-xl font-bold text-fbiad-dark-blue mb-6 flex items-center gap-2">
              <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
              Ödeme ve Kişisel Bilgiler
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ad Soyad</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={payload.adSoyad} 
                    readOnly 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="text-sm font-semibold text-blue-800 mb-1">Aylık/Tekil Tutar</div>
                <div className="text-3xl font-bold text-blue-900">{payload.tekilTutar.toLocaleString('tr-TR')} ₺</div>
              </div>
              
              {payload.taksitMi && payload.toplamTutar > payload.tekilTutar && (
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                  <div className="text-sm font-semibold text-amber-800 mb-1">Karttan Çekilecek Tutar</div>
                  <div className="text-3xl font-bold text-amber-900">{payload.toplamTutar.toLocaleString('tr-TR')} ₺</div>
                  <div className="text-xs text-amber-700 mt-2">Kredi kartınızdan toplam burs tutarı tahsil edilecek, sistemde kalan aylara otomatik yansıtılacaktır.</div>
                </div>
              )}
            </div>

            {payload.plan && payload.plan.length > 0 && (
              <div className="mt-8">
                <h3 className="text-md font-bold text-gray-800 mb-3">Kapatılacak Ödeme Planı (Taksitler)</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Tarih</th>
                        <th className="px-4 py-3 font-semibold text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payload.plan.map((item, index) => {
                        const dateObj = new Date(item.date);
                        const dateStr = dateObj.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td suppressHydrationWarning className="px-4 py-3 text-gray-600">
                              <span className="font-medium">{index + 1}. Taksit</span> - {dateStr}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-fbiad-dark-blue">
                              {item.amount.toLocaleString('tr-TR')} ₺
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <hr className="border-gray-100" />

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fbiad-dark-blue flex items-center gap-2">
                <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                Kart Bilgileri
              </h2>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-green-600">
                  <Lock size={20} />
                  <span className="text-sm font-bold">256-bit Güvenli Ödeme</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Kart Üzerindeki İsim</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none uppercase" placeholder="KART SAHİBİ" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Kart Numarası</label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      maxLength={19} 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none tracking-widest font-mono" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Son Kullanma Tarihi</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" maxLength={5} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="AA/YY" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">CVC / CVV</label>
                    <div className="relative">
                      <ShieldCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" maxLength={3} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="contract" 
                required
                checked={isContractAccepted}
                onChange={(e) => setIsContractAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-fbiad-blue rounded border-gray-300 focus:ring-fbiad-blue cursor-pointer" 
              />
              <label htmlFor="contract" className="text-sm text-gray-600 cursor-pointer">
                <a href="#" className="text-fbiad-blue font-semibold hover:underline">Bağış Aydınlatma Metnini</a> ve <a href="#" className="text-fbiad-blue font-semibold hover:underline">Bağış Sözleşmesini</a> okudum ve kabul ediyorum.
              </label>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg w-full md:w-80">
              <input 
                type="checkbox" 
                id="captcha" 
                required
                checked={isNotRobot}
                onChange={(e) => setIsNotRobot(e.target.checked)}
                className="w-6 h-6 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer" 
              />
              <label htmlFor="captcha" className="font-semibold text-gray-700 cursor-pointer">Ben robot değilim</label>
              <div className="ml-auto">
                <ShieldCheck size={28} className="text-blue-500" />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-fbiad-dark-blue hover:bg-fbiad-blue text-white font-bold text-xl py-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Lock size={24} />
            {isSubmitting ? 'İşleminiz Yapılıyor...' : `Ödemeyi Tamamla (${(payload.taksitMi && payload.toplamTutar > payload.tekilTutar ? payload.toplamTutar : payload.tekilTutar).toLocaleString('tr-TR')} ₺)`}
          </button>

        </form>
      </div>
      
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={handleCloseAlert} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
    </div>
  );
}
