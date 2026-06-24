# FBİAD Vakfı Web - Google Cloud Run Deployment Kılavuzu

Bu proje Google Cloud Run üzerinde **Source** (Kaynak Kod) tabanlı olarak derlenip yayınlanmaktadır. 

## Proje Bilgileri
- **Google Cloud Projesi:** `dernekte-bugun`
- **Cloud Run Service Adı:** `fbiad-web`
- **Bölge (Region):** `europe-west1`
- **Erişim:** Public (Unauthenticated)

## Yayına Alma (Deploy) İşlemi

Projede yaptığınız değişiklikleri canlı ortama (internete) göndermek için terminalden proje kök dizininde aşağıdaki komutu çalıştırmanız yeterlidir:

```bash
gcloud run deploy fbiad-web --source . --project dernekte-bugun --region europe-west1 --allow-unauthenticated
```

### Arka Planda Ne Oluyor?
1. `.gcloudignore` dosyasındaki kurallara göre gereksiz dosyalar (`node_modules`, `.next`, gizli env dosyaları vb.) hariç tutularak kaynak kodlarınız Google Cloud Build sunucularına yüklenir.
2. Cloud Build, `package.json` içerisindeki `build` komutunu otomatik olarak çalıştırarak Next.js projenizi derler.
3. Derleme başarılı olduğunda, proje yeni bir konteyner olarak ayağa kalkar ve `fbiad-web` servisi güncellenir.
4. İşlem genellikle kod büyüklüğüne göre 2-4 dakika sürer.

### Çevre Değişkenleri (Environment Variables)
Uygulamanın çalışması için gereken MOKA API şifreleri gibi bilgileri, Cloud Run yönetim panelinden (Revisions -> Variables & Secrets bölümünden) eklemeli veya güncellemelesiniz. `.env.local` dosyası `.gcloudignore` listesinde olduğu için sunucuya aktarılmaz, güvenlik için şifrelerin sadece Google Cloud panelinde tutulması en sağlıklı yöntemdir.
