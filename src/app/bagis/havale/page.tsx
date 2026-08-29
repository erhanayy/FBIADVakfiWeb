"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, User, Mail, Phone, Hash, UploadCloud, Landmark } from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";
import { ContractModal } from "@/components/ui/ContractModal";

export default function HavaleBagisPage() {
  const [amount, setAmount] = useState<number | string>("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorTc, setDonorTc] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  
  // File upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isFbiadMember, setIsFbiadMember] = useState(false);
  const [wantsMembershipInfo, setWantsMembershipInfo] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Contracts and Tenant Info state
  const [contractsData, setContractsData] = useState<{ kvkk?: any, agreement?: any }>({});
  const [tenantInfo, setTenantInfo] = useState<{ iban?: string, accountName?: string }>({});
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [activeModal, setActiveModal] = useState<'kvkk' | 'agreement' | null>(null);

  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', onSuccess?: () => void}>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    // Fetch contracts
    fetch('/api/contracts?types=WEB_KVKK,WEB_DONATION_AGREEMENT')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const kvkk = data.data.find((c: any) => c.type === 'WEB_KVKK');
          const agreement = data.data.find((c: any) => c.type === 'WEB_DONATION_AGREEMENT');
          setContractsData({ kvkk, agreement });
        }
      })
      .catch(err => console.error("Contracts fetch error:", err));

    // Fetch tenant info
    fetch('/api/tenant-info')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTenantInfo({
            iban: data.data.tenantIban,
            accountName: data.data.tenantAccountName
          });
        }
      })
      .catch(err => console.error("Tenant info fetch error:", err));

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
      else errorMessage = decodeURIComponent(error as string);
      
      setAlertConfig({
        isOpen: true,
        message: errorMessage,
        type: 'error',
        onSuccess: () => {
          window.location.href = window.location.pathname; // Parametreleri temizle
        }
      });
    }

    // Test verilerini doldurmak için klavye kısayolu (Alt + Shift + T / Option + Shift + T)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault();
        setAmount("custom");
        setCustomAmount("1");
        setDonorName("Erhan Ayyıldız");
        setDonorTc("12345678901");
        setDonorEmail("erhanayyildiz@hotmail.com");
        setDonorPhone("05305146033");
        setIsAnonymous(true);
        setIsFbiadMember(false);
        setWantsMembershipInfo(false);

        setKvkkAccepted(true);
        setAgreementAccepted(true);
        setIsNotRobot(true);
        
        showAlert("Test verileri form alanlarına dolduruldu!", "success");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const predefinedAmounts = [5000, 10000, 20000];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("custom");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Dosya boyutu 5MB'dan büyük olamaz.", "warning");
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(file.name);
    }
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
    if (!kvkkAccepted || !agreementAccepted) {
      showAlert("Lütfen Aydınlatma Metnini ve Bağış Sözleşmesini okuyup onaylayınız.", "warning");
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
    if (!receiptFile) {
      showAlert("Lütfen Havale/EFT dekontunuzu yükleyiniz.", "warning");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Upload receipt
      const formData = new FormData();
      formData.append('file', receiptFile);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok || !uploadData.url) {
        showAlert("Dekont yüklenirken bir hata oluştu.", "error");
        setIsSubmitting(false);
        return;
      }

      const receiptUrl = uploadData.url;

      // 2. Submit donation
      const payload = {
        amount: finalAmount,
        donorName,
        donorTc,
        donorEmail,
        donorPhone,
        isAnonymous,
        isFbiadMember,
        wantsMembershipInfo,
        agreementsAccepted: true,
        paymentMethod: 'wire_transfer',
        receiptUrl: receiptUrl,
        status: 'pending' // Wait for admin approval
      };

      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert("Bağışınız ve dekontunuz başarıyla alınmıştır. İşleminiz onaylandıktan sonra tarafınıza bilgi verilecektir.\nTeşekkür ederiz!", "success", () => window.location.reload());
      } else {
        showAlert("İşleminiz kaydedilirken bir hata oluştu.", "error");
      }
      
      setIsSubmitting(false);
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
                  <button
                    type="button"
                    onClick={() => handleAmountClick(50000)}
                    className={`py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                        amount === 50000 
                          ? "border-fbiad-blue bg-fbiad-blue text-white" 
                          : "border-gray-200 text-gray-600 hover:border-fbiad-yellow hover:text-fbiad-dark-blue"
                    }`}
                  >
                    <span className="text-lg">50.000 ₺</span>
                    <span className="text-[10px] font-normal leading-tight px-1">(2026-2027 1 Öğrenci Burs Bedeli)</span>
                  </button>
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
                  Kişisel Bilgileriniz (Opsiyonel)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Ad Soyad</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: Ahmet Yılmaz" />
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
                      <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: ahmet@mail.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefon Numarası</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-fbiad-blue focus:ring-2 focus:ring-fbiad-blue/20 outline-none" placeholder="Örn: 05XX XXX XX XX" />
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

              {/* Havale Bilgileri */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-fbiad-dark-blue flex items-center gap-2">
                    <span className="bg-fbiad-yellow text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> 
                    Banka Hesap Bilgilerimiz
                  </h2>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-blue-100">
                      <Landmark className="text-fbiad-blue flex-shrink-0 mt-1" size={24} />
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Alıcı Adı</p>
                        <p className="font-semibold text-gray-900">{tenantInfo.accountName || 'Yükleniyor...'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fbiad-blue flex-shrink-0 mt-1"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">IBAN Numarası</p>
                        <p className="font-mono font-bold text-lg text-gray-900">{tenantInfo.iban || 'Yükleniyor...'}</p>
                        <p className="text-xs text-gray-500 mt-2">Lütfen havale/EFT yaparken açıklama kısmına Adınızı ve Soyadınızı yazmayı unutmayınız.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-800">Dekont Yükle</label>
                  <p className="text-sm text-gray-500">Transfer işlemini tamamladıktan sonra dekont görüntüsünü buraya yükleyiniz.</p>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      required
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <UploadCloud className="text-fbiad-blue" size={32} />
                      </div>
                      {receiptPreview ? (
                        <div>
                          <p className="font-semibold text-green-600 text-lg">Dosya Seçildi</p>
                          <p className="text-sm text-gray-500 mt-1 truncate max-w-[200px] sm:max-w-xs">{receiptPreview}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-fbiad-dark-blue text-lg">Dekont Seçin veya Sürükleyin</p>
                          <p className="text-sm text-gray-500 mt-1">JPEG, PNG veya PDF (Maks 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Onay ve Güvenlik */}
              <section className="space-y-6 pt-4">
                
                {/* Sözleşmeler */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal('kvkk')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${kvkkAccepted ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white hover:border-fbiad-blue text-gray-700'} transition-all w-full text-left`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${kvkkAccepted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                      {kvkkAccepted && <ShieldCheck size={16} />}
                    </div>
                    <span className="font-semibold text-sm">
                      <span className="text-fbiad-blue underline">Bağış Aydınlatma Metni'ni</span> okudum ve onaylıyorum.
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveModal('agreement')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${agreementAccepted ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white hover:border-fbiad-blue text-gray-700'} transition-all w-full text-left`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${agreementAccepted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                      {agreementAccepted && <ShieldCheck size={16} />}
                    </div>
                    <span className="font-semibold text-sm">
                      <span className="text-fbiad-blue underline">Bağış Sözleşmesi'ni</span> okudum ve onaylıyorum.
                    </span>
                  </button>
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
      
      <ContractModal 
        isOpen={activeModal === 'kvkk'}
        onClose={() => setActiveModal(null)}
        title={contractsData.kvkk?.title || "Bağış Aydınlatma Metni"}
        content={contractsData.kvkk?.content || "Metin yüklenemedi. Lütfen internet bağlantınızı kontrol ediniz."}
        onAccept={() => setKvkkAccepted(true)}
        isAccepted={kvkkAccepted}
      />
      
      <ContractModal 
        isOpen={activeModal === 'agreement'}
        onClose={() => setActiveModal(null)}
        title={contractsData.agreement?.title || "Bağış Sözleşmesi"}
        content={contractsData.agreement?.content || "Metin yüklenemedi. Lütfen internet bağlantınızı kontrol ediniz."}
        onAccept={() => setAgreementAccepted(true)}
        isAccepted={agreementAccepted}
      />
      
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={handleCloseAlert} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
      <div className="text-center text-xs text-gray-400 pb-4">v1.2 - Havale/EFT Bağış Bildirimi</div>
    </div>
  );
}
