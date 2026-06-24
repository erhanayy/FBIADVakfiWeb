# FBIADVakfiWeb (FBİAD Ana Web ve Bağış Sitesi)

Bu proje, FBİAD Vakfı'nın ana web sitesi olup aynı zamanda tüm genel bağışları ve Burs (BurstaBugun) platformundan gelen Moka sanal pos ödemelerinin altyapısını yönetir.

## 🚀 Canlı Ortam (Deployment) Bilgileri

Sistem Google Cloud Run üzerinde barındırılmaktadır. Yeni bir geliştirici sistemi devraldığında aşağıdaki bilgilere dikkat etmelidir:

- **Google Cloud Projesi:** `dernektebugun-492221`
- **Cloud Run Servis Adı:** `fbiad-web`
- **Bölge (Region):** `europe-west1`
- **Canlı (Custom) Domain:** `fbiadvakfi.org` ve `www.fbiadvakfi.org`

### Nasıl Deploy Edilir?

Terminalden projeyi deploy etmek için aşağıdaki komutu kullanmalısınız. **Uyarı:** `gcloud run deploy --set-env-vars` komutu ortam değişkenlerini **üzerine yazar (ezerek siler)**. Bu nedenle canlı şifreleri kaybetmemek için ya konsol üzerinden manuel deploy yapın ya da `--update-env-vars` komutunu kullanın. Örnek deploy komutu:

```bash
gcloud run deploy fbiad-web \
  --source . \
  --project dernektebugun-492221 \
  --region europe-west1 \
  --allow-unauthenticated
```

## 🗄️ Veritabanı Bilgileri

Bu proje, temel bağış ve ödeme işlemlerini yürüttüğü için **şu anlık harici bir Cloud SQL veritabanına doğrudan bağlı değildir**. Ödemeler ve form kayıtları, ilgili CRM veya 3. parti API'lere POST edilir. 

## ⚙️ Moka Ödeme Entegrasyonu ve Mimari Notlar

Bu projenin en kritik altyapılarından biri **Moka Sanal Pos** entegrasyonudur. Sistem sadece kendi (`/bagis`) sayfasından gelen ödemeleri değil, aynı zamanda `BurstaBugun` projesinden yönlendirilen (`/app-payment`) ödemeleri de yönetir.

1. **Burs Yönlendirmesi:** `BurstaBugun` uygulamasındaki kullanıcı ödeme ekranına geçtiğinde, oluşturulan `token` ile beraber bu projeye (`fbiadvakfi.org/app-payment`) gelir.
2. **Kısa Payload Mimarisi:** Moka, `RedirectUrl` parametresinde maksimum **255 karakter** destekler. Bu nedenle `/api/payment/moka-init` adresinde ödeme payload'u `base64url` formatında çok kısa bir string olarak (örn: `fbiad-bagis|BAGIS-1234|...`) şifrelenir.
3. **Moka Callback:** Kullanıcı Moka 3D Secure sayfasından sonra `/api/payment/moka-callback` adresine geri döner. Bu sunucu `base64url` verisini tekrar çözer, eğer ödeme "Burs" kaynaklıysa, başarılı olduktan sonra kullanıcıyı `burs.fbiadvakfi.org/dashboard/...` adresine (Panele) yönlendirir.

*Dikkat: Server Component'lerde güvenlik gereği `onClick` gibi client-side fonksiyonlar kullanılmaz, yönlendirmeler `<a href>` ile yapılmalıdır.*
