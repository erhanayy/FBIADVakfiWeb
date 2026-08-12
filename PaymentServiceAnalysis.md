# Ödeme Servisi Analizi (Payment Service Analysis)

Lütfen entegre edeceğimiz ödeme sisteminin (Sanal POS, API vb.) tüm teknik dokümantasyonunu, endpoint bilgilerini, örnek istek/cevap (request/response) yapılarını ve API anahtarı (key) kullanım kurallarını bu dosyanın altına yapıştırın.

## 1. Servis Genel Bilgileri
- **Servis Adı:** (Örn: Iyzico, Stripe, PayTR vb.)
- **Test (Sandbox) URL:** 
- **Production URL:** 

## 2. Kimlik Doğrulama (Authentication)
(API Key, Secret Key veya Token alma yöntemleri buraya eklenecek)

## 3. Ödeme Başlatma Endpoint'i (Create Payment)
(İstek atılacak adres, HTTP metodu ve JSON body yapısı buraya eklenecek)

## 4. Geri Dönüş / Onay (Webhook & Callback)
(Ödeme başarılı olduğunda bankanın bize göndereceği verilerin formatı buraya eklenecek)

---
*Not: Siz bilgileri buraya yapıştırıp "Hazır, bakabilirsin" dedikten sonra bu doküman üzerinden kodlama planını oluşturacağım.*
Genel Bilgiler
Moka United ile ödeme alma, ödeme isteği gönderme, kart saklama servisleri ve tekrarlayan ödeme servisleri ile ödemelerinizi alabilirsiniz. Örnek projeler sayesinde mokaunited.com servislerine çok daha kolay bir şekilde entegre olabilirsiniz.

Başlarken
Üye İşyeri Test Ortamı Adresi
https://service.refmokaunited.com

Canlı Ortam Adresi
https://service.mokaunited.com

Önemli Bilgiler
Servislerin Çağrılması
Moka United servisleri JSON – POST yöntemiyle çalışmaktadır. Aşağıda her bir servis için verilen servis adresleri test ya da prod domain’lerin sonuna eklenerek oluşan URL’e, yine aşağıda her bir servis için detaylı bir şekilde örnekleriyle verilen parametreler JSON nesnesi olarak POST edilir.


ÖNEMLİ !!!
Servislerimiz PCI-DSS kuralları gereği sadece TLS 1.2 ve üstü protokollerinin kullanımına izin vermektedir. Lütfen uygulamanızın bu protokoller üzerinden Moka United URL’ sine POST attığından emin olunuz. Aksi taktirde “Bağlantı kapatılacaktır veya Connection Closed” şeklinde hatalar alınacaktır.

.NET Örneğinde :

Global.asax.cs dosyasının içerisinde,
protected void Application_Start() metodunun içine şu satırlar eklenmelidir.

ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;

Servislerden Yanıt Alınması
Moka United servisleri yanıt olarak ApiResponse nesnesi döner. Bu nesnenin “ResultCode” ve “Data” alanları okunarak akışlar yönetilebilir.

ApiResponse
Data	Gönderdiğiniz istek Moka United’ a doğru bir şekilde iletilmiş, kullanıcı bilgileri doğru bir şekilde girilmiş ve girilen bilgiler Moka United tarafında herhangi bir uyarıya veya hataya yol açmamışsa, Data alanı dolu gelecektir. Data alanı içinde size dönen verileri kullanarak işlem sonucunu yorumlayabilirsiniz.
ResultCode	Gönderilen veriler Moka United tarafında bir uyarıya veya hataya yol açmışsa, Data alanı null olarak gelecektir ve ResultCode alanında Moka United hata kodu yer alacaktır.
ResultMessage	Hataya ilişkin özel bir açıklama var ise bu alan dolu olacaktır.
Exception	Beklenmedik bir hata oluştuğunda ResultCode alanında EX yazacaktır ve Exception alanında alınan hatanın açıklaması yer alacaktır.

3D Secure ile Ödeme
Servis Adresi
/PaymentDealer/DoDirectPaymentThreeD
İstek Parametreleri
PaymentDealerAuthentication
Parametre	Açıklama
DealerCode(string)	Moka United sistemi tarafından verilen bayi kodu
Username (string)	Moka United sistemi tarafından verilen Api kullanıcı adı
Password (string)	Moka United sistemi tarafından verilen Api şifresi
CheckKey (string)	Kontrol anahtarı (DealerCode + "MK" + Username + "PD" + Password) String olarak birleştirilen bu bilgilerin SHA-256 hash algoritmasından geçirilmesiyle oluşturulur.
Buraya tıklayarak deneme ekranına gidebilirsiniz.
PaymentDealerRequest
Parametre	Açıklama
CardHolderFullName (string)	Kart sahibinin adı soyadı
CardNumber (string)	Kart numarası
ExpMonth (string)	Son kullanma tarihi ay bilgisi (MM)
ExpYear (string)	Son kullanma tarihi yıl bilgisi (YYYY)
CvcNumber (string)	Kart güvenlik numarası
CardToken (string)	Moka United üzerinde Kart saklama özelliği kullanılıyorsa, Kartın Token’ ı verilerek çekim yapılabilir. Token verilmişse, kart numarası ve diğer kart bilgilerinin (son kul. tarihi, cvc) verilmesine gerek yoktur.

Not : Token ile ödeme yapılırken NonSecure (Non-3D) işlem yapılmak isteniyorsa, Moka United' dan bu parametrik yetki istenerek Non3D ödeme servisi de kullanılabilir.
Amount (decimal)	Ödeme tutarı (Kuruş kısmı nokta ile yazılır. Örn: 27.50)
Currency (string)	Para birimi. Opsiyonel alandır, hiç gönderilmezse veya boş gönderilirse, default’ u TL dir, Diğer değerler : USD, EUR, GBP
InstallmentNumber (integer)	Taksit Sayısı. Opsiyonel alandır, hiç gönderilmezse, boş gönderilirse, 0 veya 1 gönderilirse Peşin satış demektir, Taksit için 2 ile 12 arasında bir değer gönderilmelidir.
ClientIP (string)	Kart numarasının alındığı uygulamanın (desktop/web) çalıştırıldığı bilgisayarın IP bilgisi
OtherTrxCode (string)	Mütabakat sağlamak için kendi Unique Transaction (İşlem) Kodunuzu bu alanda gönderebilirsiniz. (Boş da gönderilebilir).
Not : Bayi ödeme detay listesi alırken bu kodunuzu kullanarak Ödeme durumunu öğrenebilirsiniz.
SubMerchantName (string) (opsiyonel)	Ekstrede görünmesini istediğiniz isim – Moka United'a önceden bildirilmeli
IsPoolPayment (tinyint)	Havuz ödemesi mi ?
0 : Hayır - Karttan çekilen tutar, Moka United ile bayi arasındaki anlaşmaya göre ertesi gün veya daha sonra bayinin hesabına yatırılır.
1 : Evet - Para kredi kartından çekilecek fakat havuzda bekletilecek. Bayi, müşteri hizmet veya ürünü teslim aldıktan sonra ödemeyi onaylayacak ve bu işlemle ilgili ödeme onaydan sonra bayinin ekstresine yansıyacak. Bayi, havuz ödemesini onaylayıncaya kadar, bu ödeme ekstreye dahil edilmez. Havuz sisteminde bir ödeme göndermek için bu alanı 1 yapınız.
IsPreAuth (tinyint)	Ön provizyon işlemi mi ?
0 : Hayır - Doğrudan Çekim İşlemi
1 : Evet - Ön Provizyon Alma İşlemi (Bir süre sonra DoCapture servisi ile ödemeye dönüştürülmeli)
IsTokenized (tinyint)	Ödeme için girilen kart Moka United sisteminde saklanacak mı ? (Kart saklayabilmek için bayinin kart saklama hizmeti alıyor olması gerekir)
0 : Kart saklanmayacak
1 : Kart saklanacak
IntegratorId (tinyint) (opsiyonel)	Hazır ETicaret paketlerine Moka United entegrasyonu yapan Sistem Entegratörü Firmanın ID si – (Entegratör firma değilseniz bu alanı göndermeyiniz !)
Software (string)	Moka United ödeme sistemiyle entegre çalışan, bu servisi çağırdığınız Eticaret paketinin veya yazılımınızın ismi. (Max 30 karakter)
Description (string)(opsiyonel)	Açıklama alanıdır. Ödemeye ilişkin bir açıklama yazmak istenirse bu alana yazılabilir.(200 karaktere kadar yazılabilir.)
ReturnHash (tinyint)	Değeri 1 olarak verilmek zorundadır. 3D Ödeme akışı tamamlandığında, RedirectURL' nize, işlemin başarılı olup olmadığı bu servisin cevabında dönen CodeForHash kodunun sonuna, T veya F harfi eklenerek hash' lenmesi ile bildirilecektir.
RedirectUrl (string)	3D işlemi sonucunda, başarılı ya da başarısız işlem sonucunun döndürüldüğü ve kullanıcının yönlendirildiği bayi web sayfası. Bu URL’ yi verirken, sonuna parametre olarak kendi işlem ID’ nizi yazarsanız, hangi işleminizin sonucunu aldığınızı belirlemiş olursunuz.
Örnek : https://www.mysite.com/PayResult?MyTrxId=1A2B3C4DF5R
Önemli Not : URL sonuna yazdığınız kendinize ait işlem kodunun, güvenliğiniz için, tahmin edilemez bir kod olmasını tercih ediniz.
RedirectType (integer)	Opsiyonel alandır. Default değeri 0 (sıfır) dır. Ödeme işleminin sonucu servisi çağıran web sitesinde ana sayfaya yönlendirme yapar. IFrame içerisinden bu servis çağrılmışsa ve sonuç IFrame içine redirect yapılsın isteniyorsa, bu alana 1 yazılmalıdır.
BuyerInformation (Array)(opsiyonel)	Bayimizden Ürün/Hizmet satın alan müşterisi ile ilgili alanlardır. Bu alanların gönderilmesi zorunlu olmamasına karşın, Moka United ile paylaşılması, ileride ödemeyle ilgili oluşabilecek sorunlara karşı, hem bayimizin hem de Moka United' ın menfaatinedir.

BuyerFullName (string)	Opsiyonel alandır.Alıcının adı ve soyadıdır.
BuyerEmail (string)	Opsiyonel alandır.Alıcının eposta adresidir.
BuyerGsmNumber (string)	Opsiyonel alandır.Alıcının cep telefonu numarasıdır. 10 hane olarak, boşluksuz girilmelidir.
BuyerAddress (string)	Opsiyonel alandır.Alıcının adresidir.
BasketProduct (Array)(opsiyonel)	

ProductId (integer)	Ürün ID sidir..
ProductCode (string)	Ürünün bayi tarafındaki özel kodudur.
UnitPrice (integer)	Birim fiyatıdır.
Quantity (integer)	Ürünün miktarı.
CustomerInformation (Array)(opsiyonel)	Ödeme esnasında, kart bilgileri de saklanmak isteniyorsa ve Moka United tarafında bayinin kart saklama hizmeti aktive edilmişse, o zaman bu bilgi bloğu gönderilerek, müşteri oluşturulup, ödeme için kullanılan kart numarası bu müşteri altına eklenebilir.

DealerCustomerId (integer)	Daha önceden bu müşteri Moka United sistemine kaydedilmişse, Moka United sistemindeki bu müşterinin Unique ID si.
CustomerCode (string)	Bu müşterinin, sizin sisteminizdeki Unique ID si. Bu kod Moka United'ya daha önceden kaydedilmişse, bu kod ile de ödeme isteği gönderebilirsiniz ve kart saklanacaksa, bu müşteri altında saklanır. Bu müşteri ilk kez kaydedilecekse, bu kod ile kaydedilir
FirstName (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin adı girilir.
LastName (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin soyadı girilir. (opsiyonel)
Gender (tinyint)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin cinsiyeti girilir. (opsiyonel) 1: erkek 2: kadın
BirthDate (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin doğum tarihi girilir. (opsiyonel)
GsmNumber (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin cep telefonu girilir. (opsiyonel)
Email (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin email adresi girilir. (opsiyonel)
Address (string)	Müşteri Moka United sistemine ilk kez kaydedilecekse, müşterinin ikamet adresi girilir. (opsiyonel)
CardName (string)	Karta verilen isim (Örn : “Maximum kartım”) (Max 50 karakter)(opsiyonel)

Örnek İstek (Json)

{
   "PaymentDealerAuthentication":{
      "DealerCode":"xxx",
      "Username":"xxx",
      "Password":"xxx",
      "CheckKey":"28ba1f316e661ee7a0477a13aa30613da548c94a8098829af9255b04d7e916e3"
   },
   "PaymentDealerRequest":{
      "CardHolderFullName":"Ali Yılmaz",
      "CardNumber":"5555666677778888",
      "ExpMonth":"09",
      "ExpYear":"2024",
      "CvcNumber":"123",
      "CardToken":"",
      "Amount":0.01,
      "Currency":"TL",
      "InstallmentNumber":1,
      "ClientIP":"192.168.1.116",
      "OtherTrxCode":"20210114172139",
      "SubMerchantName":"",
      "IsPoolPayment":0,
      "IsPreAuth":0,
      "IsTokenized":0,
      "IntegratorId":0,
      "Software":"Possimulation",
      "Description":"",
      "ReturnHash":1,
      "RedirectUrl":"https://service.TestMokaUnited.com/PaymentDealerThreeD?MyTrxCode=20210114172139",
      "RedirectType":0,
      "BuyerInformation":{
         "BuyerFullName":"Ali Yılmaz",
         "BuyerGsmNumber":"5551110022",
         "BuyerEmail":"aliyilmaz@xyz.com",
         "BuyerAddress":"Tasdelen / Çekmeköy"
      },
      "CustomerInformation":{
         "DealerCustomerId":"",
         "CustomerCode":"1234",
         "FirstName":"Ali",
         "LastName":"Yılmaz",
         "Gender":"1",
         "BirthDate":"",
         "GsmNumber":"",
         "Email":"aliyilmaz@xyz.com",
         "Address":"",
         "CardName":"Maximum kartım"
      }
   }
}