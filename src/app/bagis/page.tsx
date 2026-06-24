"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, CreditCard, User, Mail, Phone, Calendar, Hash } from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";

export default function BagisPage() {
  const [amount, setAmount] = useState<number | string>("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorTc, setDonorTc] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isFbiadMember, setIsFbiadMember] = useState(false);
  const [wantsMembershipInfo, setWantsMembershipInfo] = useState(false);
  const [isContractAccepted, setIsContractAccepted] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', onSuccess?: () => void}>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    // URL parametrelerini kontrol et (Moka'dan dönüş)
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true') {
      setAlertConfig({
        isOpen: true,
        message: 'Bağışınız başarıyla gerçekleştirilmiştir. Eğitime verdiğiniz destek için teşekkür ederiz!',
        type: 'success',
        onSuccess: () => {
          window.location.href = window.location.pathname; // Parametreleri temizle
        }
      });
    } else if (error) {
      let errorMessage = 'Ödeme işlemi sırasında bir hata oluştu.';
      if (error === 'moka_failed') errorMessage = '3D Secure işlemi başarısız oldu veya reddedildi.';
      else if (error === 'system_error') errorMessage = 'Bağışınız alındı fakat sisteme kaydedilirken bir hata oluştu.';
      
      setAlertConfig({
        isOpen: true,
        message: errorMessage,
        type: 'error',
        onSuccess: () => {
          window.location.href = window.location.pathname; // Parametreleri temizle
        }
      });
    }
  }, []);

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onSuccess?: () => void) => {
    setAlertConfig({ isOpen: true, message, type, onSuccess });
  };

  const handleCloseAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    if (alertConfig.onSuccess) {
      alertConfig.onSuccess();
    }
  };

  const predefinedAmounts = [2500, 5000, 10000, 20000];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("custom");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpDate(value);
  };

  const simulateBankTransaction = async (cardNum: string) => {
    // Sadece 1111111111111111 için mock dönüş yap
    const cleanCard = cardNum.replace(/\s/g, '');
    if (cleanCard === '1111111111111111') {
      return {
        success: true,
        transactionId: "TX-TEST-" + Date.now(),
        bankCode: "BANK-TEST"
      };
    }

    // Normalde buraya düşmemeli çünkü handleSubmit'te yöneteceğiz.
    return {
      success: false,
      transactionId: null,
      bankCode: "API-YONLENDI"
    };
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
    const finalAmount = amount === "custom" ? customAmount : amount;
    if (!finalAmount) {
      showAlert("Lütfen bağış tutarı seçiniz veya giriniz.", "warning");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cleanCard = cardNumber.replace(/\s/g, '');
      
      // MOCK TEST (1111 1111 1111 1111)
      if (cleanCard === '1111111111111111') {
        const bankResult = await simulateBankTransaction(cardNumber);
        
        const payload = {
          amount: finalAmount,
          donorName,
          donorTc,
          donorEmail,
          donorPhone,
          isAnonymous,
          isFbiadMember,
          wantsMembershipInfo,
          bankTransactionId: bankResult.transactionId,
          bankCode: bankResult.bankCode,
          status: bankResult.success ? 'completed' : 'failed'
        };

        const response = await fetch('/api/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(`Bağışınız başarıyla alınmıştır. İşlem No: ${bankResult.transactionId}\nTeşekkür ederiz!`, "success", () => window.location.reload());
        } else {
          showAlert("İşleminiz kaydedilirken bir hata oluştu.", "error");
        }
        setIsSubmitting(false);
        return;
      }

      // GERÇEK MOKA API (3D SECURE YÖNLENDİRMESİ)
      const [expMonth, expYear] = expDate.split('/');
      
      const mokaPayload = {
        cardInfo: {
          cardHolderName,
          cardNumber: cleanCard,
          expMonth: expMonth || "01",
          expYear: expYear || "30",
          cvc: cvv
        },
        payload: {
          adSoyad: donorName,
          tekilTutar: finalAmount,
          taksitMi: false,
          fundId: 'fbiad-bagis',
          plan: [{ id: `BAGIS-${Date.now()}` }]
        }
      };

      const mokaRes = await fetch('/api/payment/moka-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mokaPayload)
      });

      const mokaData = await mokaRes.json();

      if (mokaData.success && mokaData.redirectUrl) {
        // Redirect to Moka 3D Secure page
        window.location.href = mokaData.redirectUrl;
      } else {
        showAlert(mokaData.error || "Ödeme işlemi başlatılamadı. Lütfen kart bilgilerinizi kontrol ediniz.", "error");
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error("Payment error:", error);
      showAlert("Bir hata oluştu, lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-fbiad-dark-blue mb-4">Eğitime Destek Olun</h1>
          <p className="text-lg text-gray-600">
            Yapacağınız bağışlarla geleceğin liderlerine umut ışığı olabilir, eğitimde fırsat eşitliğine katkı sağlayabilirsiniz.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Bağış Tutarı */}
              <section>
                <h2 className="text-xl font-bold text-fbiad-dark-blue mb-6 flex items-center gap-2">
                  <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                  Bağış Tutarı Seçin
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {predefinedAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountClick(val)}
                      className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                        amount === val 
                          ? "border-fbiad-blue bg-fbiad-blue text-white" 
                          : "border-gray-200 text-gray-600 hover:border-fbiad-yellow hover:text-fbiad-dark-blue"
                      }`}
                    >
                      {val.toLocaleString('tr-TR')} ₺
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₺</span>
                  <input
                    type="number"
                    placeholder="Farklı Bir Tutar Girin"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className={`w-full pl-10 pr-4 py-4 rounded-xl border-2 outline-none transition-all ${
                      amount === "custom" ? "border-fbiad-blue ring-2 ring-fbiad-blue/20" : "border-gray-200 focus:border-fbiad-yellow"
                    }`}
                  />
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Kişisel Bilgiler */}
              <section>
                <h2 className="text-xl font-bold text-fbiad-dark-blue mb-6 flex items-center gap-2">
                  <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                  Kişisel Bilgileriniz
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Ad Soyad</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: Ahmet Yılmaz" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">T.C. Kimlik No</label>
                    <div className="relative">
                      <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" value={donorTc} onChange={(e) => setDonorTc(e.target.value)} maxLength={11} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: 12345678901" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">E-Posta Adresi</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: ahmet@mail.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefon Numarası</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: 05XX XXX XX XX" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="anonymous" 
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 text-fbiad-blue rounded border-gray-300 focus:ring-fbiad-blue cursor-pointer" 
                    />
                    <label htmlFor="anonymous" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Anonim olarak bağış yapmak istiyorum.
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="fbiadMember" 
                      checked={isFbiadMember}
                      onChange={(e) => setIsFbiadMember(e.target.checked)}
                      className="w-5 h-5 text-fbiad-blue rounded border-gray-300 focus:ring-fbiad-blue cursor-pointer" 
                    />
                    <label htmlFor="fbiadMember" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      FBİAD Derneği Üyesiyim
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="membershipInfo" 
                      checked={wantsMembershipInfo}
                      onChange={(e) => setWantsMembershipInfo(e.target.checked)}
                      className="w-5 h-5 text-fbiad-blue rounded border-gray-300 focus:ring-fbiad-blue cursor-pointer" 
                    />
                    <label htmlFor="membershipInfo" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      FBİAD Derneğine üyelikle ilgili bilgi almak istiyorum
                    </label>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Kredi Kartı Bilgileri */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-fbiad-dark-blue flex items-center gap-2">
                    <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> 
                    Ödeme Bilgileri
                  </h2>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-green-600">
                      <Lock size={20} />
                      <span className="text-sm font-bold">256-bit Güvenli Ödeme</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium hidden md:block">
                      Kredi Kartı Bilgileriniz Kaydedilmemektedir.
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Kart Üzerindeki İsim</label>
                      <input 
                        type="text" 
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
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
                            onChange={handleExpDateChange}
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
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                            required
                            maxLength={4} 
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" 
                            placeholder="123" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Onay ve Güvenlik (Captcha Mockup) */}
              <section className="space-y-6 pt-4">
                
                {/* Bağış Sözleşmesi */}
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

                {/* Robot Değilim Mockup */}
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

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-fbiad-dark-blue hover:bg-fbiad-blue text-white font-bold text-xl py-5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Lock size={24} />
                {isSubmitting ? 'İşleminiz Yapılıyor...' : 'Güvenli Bağış Yap'}
              </button>

            </form>
          </div>
        </div>

      </div>
      
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={handleCloseAlert} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
      <div className="text-center text-xs text-gray-400 pb-4">v1.2 - Moka 3D Secure Entegrasyonu</div>
    </div>
  );
}
