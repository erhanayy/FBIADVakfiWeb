"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, CreditCard, User, Calendar, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";
import { BankInstallmentRule, getBankRule } from "@/lib/bank-installments";

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
    amount: number;
  }[];
  returnUrl?: string;
};

export default function AppPaymentForm({ payload }: { payload: PaymentPayload }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', onSuccess?: () => void}>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  // New states for BIN detection and Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'installment'>(payload.taksitMi ? 'installment' : 'cash');
  const [bankRule, setBankRule] = useState<BankInstallmentRule | null>(null);
  const [isCheckingBin, setIsCheckingBin] = useState(false);
  const [binError, setBinError] = useState<string | null>(null);
  const [detectedBankName, setDetectedBankName] = useState<string | null>(null);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);

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

  useEffect(() => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length >= 6) {
      const bin = cleanCard.substring(0, 6);
      
      // Prevent re-checking if we already checked this BIN
      if (typeof window !== 'undefined' && (window as any)._lastCheckedBin === bin) return;
      (window as any)._lastCheckedBin = bin;

      setIsCheckingBin(true);
      setBinError(null);

      fetch('/api/payment/moka-bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ binNumber: bin })
      })
      .then(res => res.json())
      .then(data => {
        setIsCheckingBin(false);
        if (data.success && data.data) {
          setDetectedBankName(data.data.bankName);
          setDetectedCategory(data.data.productCategory);
          const rule = getBankRule(data.data.bankName, data.data.groupName);
          setBankRule(rule);

          if (rule && !rule.isSupported && paymentMethod === 'installment') {
            setBinError(`Bankanız (${rule.bankName}) taksitli işlemleri desteklememektedir.`);
          } else if (!rule && data.data.bankName) {
            // Moka found it, but we couldn't map it to our table
            setBinError(`Banka tanındı (${data.data.bankName} - ${data.data.groupName}) ancak tablomuzla eşleşmedi.`);
          }
        } else {
          setBankRule(null);
          setDetectedBankName(null);
          setBinError(data.error || "BIN sorgusu başarısız oldu.");
        }
      })
      .catch(err => {
        setIsCheckingBin(false);
        console.error("BIN query failed", err);
        setBinError("Sunucuya ulaşılamadı.");
      });
    } else {
      setBankRule(null);
      setBinError(null);
      setDetectedBankName(null);
      setDetectedCategory(null);
      (window as any)._lastCheckedBin = null;
    }
  }, [cardNumber, paymentMethod]);

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
      const cleanCard = cardNumber.replace(/\s/g, '');
      
      if (cleanCard === '1111111111111111') {
        // Test Bypass Scenario
        const bankResult = await simulateBankTransaction(cardNumber);
        if (!bankResult.success) {
          showAlert("Banka işlemi reddedildi. Lütfen kart bilgilerinizi kontrol ediniz.", "error");
          setIsSubmitting(false);
          return;
        }

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
          showAlert("Ödeme sisteme kaydedilirken hata oluştu.", "error");
        }
      } else {
        // Real Moka United Integration
        if (!expDate || expDate.length < 5 || !cvc || cvc.length < 3) {
          showAlert("Lütfen kartınızın son kullanma tarihini ve CVC kodunu eksiksiz giriniz.", "warning");
          setIsSubmitting(false);
          return;
        }

        if (paymentMethod === 'installment' && bankRule && !bankRule.isSupported) {
          showAlert(`Bankanız (${bankRule.bankName}) taksitli işlemleri desteklememektedir. Lütfen Tek Çekim (Peşin) ödemeyi seçiniz.`, "warning");
          setIsSubmitting(false);
          return;
        }

        const maxBankInstallments = bankRule ? (detectedCategory === 'Ticari' ? bankRule.commercialMax : bankRule.individualMax) : 1;
        const requestedInstallments = payload.plan.length > 0 ? payload.plan.length : 1;
        const finalInstallmentCount = paymentMethod === 'installment' ? Math.min(requestedInstallments, maxBankInstallments) : 1;

        const [expMonth, expYearPrefix] = expDate.split('/');
        const expYear = "20" + expYearPrefix; // Converts "25" to "2025"

        const response = await fetch('/api/payment/moka-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardInfo: {
              cardHolderName: cardHolder,
              cardNumber: cleanCard,
              expMonth,
              expYear,
              cvc
            },
            payload,
            installmentCount: finalInstallmentCount
          })
        });

        const data = await response.json();
        if (response.ok && data.success && data.redirectUrl) {
          // Redirect to Moka 3D Secure page
          window.location.href = data.redirectUrl;
          return; // Do not clear isSubmitting to prevent double clicks during redirect
        } else {
          showAlert(data.error || "Banka işlemi sırasında bir hata oluştu.", "error");
        }
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

            {payload.taksitMi && payload.plan && payload.plan.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-md font-bold text-gray-800">Ödeme Şekli</h3>
                  <div className="group relative cursor-pointer">
                    <HelpCircle size={18} className="text-gray-400 hover:text-fbiad-blue" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                      <strong>Nakit (Tek Çekim):</strong> Kart limitinden toplam tutar tek seferde düşer, bankaya taksit yapılmaz.<br/><br/>
                      <strong>Banka Taksiti:</strong> Toplam tutar kart limitinden bloke edilir, bankanın izin verdiği maksimum taksit sayısına bölünür ve aydan aya ödersiniz.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div 
                    onClick={() => setPaymentMethod('cash')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-fbiad-blue bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-fbiad-blue' : 'border-gray-300'}`}>
                        {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-fbiad-blue" />}
                      </div>
                      <span className="font-semibold text-gray-800">Nakit (Tek Çekim)</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setPaymentMethod('installment')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'installment' ? 'border-fbiad-blue bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'installment' ? 'border-fbiad-blue' : 'border-gray-300'}`}>
                        {paymentMethod === 'installment' && <div className="w-2.5 h-2.5 rounded-full bg-fbiad-blue" />}
                      </div>
                      <span className="font-semibold text-gray-800">Banka Taksiti</span>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'installment' && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {isCheckingBin ? (
                      <div className="p-4 text-sm text-gray-500 animate-pulse text-center">Banka bilgileri kontrol ediliyor...</div>
                    ) : binError ? (
                      <div className="p-4 text-sm text-red-600 bg-red-50 flex items-start gap-2">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{binError}</span>
                      </div>
                    ) : detectedBankName && bankRule && bankRule.isSupported ? (
                      (() => {
                        const maxAllowed = detectedCategory === 'Ticari' ? bankRule.commercialMax : bankRule.individualMax;
                        const finalCount = Math.min(payload.plan.length, maxAllowed);
                        const isCapped = finalCount < payload.plan.length;
                        const monthlyBase = Math.floor((payload.toplamTutar / finalCount) * 100) / 100;
                        const remainder = payload.toplamTutar - (monthlyBase * (finalCount - 1));

                        return (
                          <div className="p-4 bg-green-50 border-b border-green-100">
                            <div className="flex items-start gap-2 text-green-800 text-sm mb-2">
                              <CheckCircle size={18} className="shrink-0 mt-0.5" />
                              <div>
                                <strong>{detectedBankName} ({detectedCategory})</strong> kartınız başarıyla algılandı.
                                {isCapped && (
                                  <div className="mt-1 text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                                    <AlertCircle size={16} className="inline mr-1 mb-0.5" />
                                    Bankanız maksimum {maxAllowed} taksite izin vermektedir. Ödeme planınız {maxAllowed} taksit üzerinden yeniden hesaplanmıştır.
                                  </div>
                                )}
                              </div>
                            </div>
                            <table className="w-full text-sm text-left mt-3 bg-white rounded border">
                              <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                  <th className="px-4 py-2 font-semibold border-b">Tarih / Ay</th>
                                  <th className="px-4 py-2 font-semibold text-right border-b">Tutar</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {Array.from({ length: finalCount }).map((_, i) => {
                                  const isLast = i === finalCount - 1;
                                  const amt = isLast ? remainder : monthlyBase;
                                  return (
                                    <tr key={i} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-gray-600">
                                        <span className="font-medium">{i + 1}. Taksit</span>
                                      </td>
                                      <td className="px-4 py-2 text-right font-bold text-fbiad-dark-blue">
                                        {amt.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()
                    ) : cardNumber.replace(/\s/g, '').length >= 6 ? (
                      <div className="p-4 text-sm text-amber-600 bg-amber-50">
                        Bu kart için özel bir taksit kuralı bulunamadı veya banka algılanamadı. Standart taksit işlemi denenecektir.
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-gray-500 text-center">
                        <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
                        Taksit seçeneklerini görmek için lütfen kart numaranızın ilk 6 hanesini giriniz.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          <hr className="border-gray-100" />

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fbiad-dark-blue flex items-center gap-2">
                <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                Kart Bilgileri
                <div className="flex items-center gap-3 ml-3">
                  <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
                  <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
                </div>
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
                  <input 
                    type="text" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none uppercase" 
                    placeholder="KART SAHİBİ" 
                  />
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
                      <input 
                        type="text" 
                        value={expDate}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                          setExpDate(val);
                        }}
                        required
                        maxLength={5} 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" 
                        placeholder="AA/YY" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">CVC / CVV</label>
                    <div className="relative">
                      <ShieldCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        required
                        maxLength={3} 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" 
                        placeholder="123" 
                      />
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
