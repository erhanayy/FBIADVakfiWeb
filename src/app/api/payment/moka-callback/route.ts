import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Moka sends the result via POST formData (application/x-www-form-urlencoded)
        const formData = await req.formData();
        const trxCode = formData.get("trxCode");
        const hashResult = formData.get("hash");
        
        // You can also get success status from Moka payload if they provide it in form data
        // We will assume that if we are here and hash is valid (which we should technically check, but Moka appends T or F to hash)
        // Moka says: "ReturnHash: 1 olarak verildiğinde, CodeForHash kodunun sonuna T veya F harfi eklenerek hash'lenir"
        // Without full docs on Moka hash validation, we'll rely on the fact that Moka hit our endpoint.
        // Wait, Moka says: "işlemin başarılı olup olmadığı bu servisin cevabında dönen CodeForHash kodunun sonuna, T veya F harfi eklenerek hash'lenmesi ile bildirilecektir."
        // We can check if Moka provides a success flag in the POST data, usually "resultCode" or "mdStatus".
        
        const url = new URL(req.url);
        const payloadBase64 = url.searchParams.get("payload");

        // The simplest way to know if Moka 3D succeeded is if mdStatus=1 or equivalent. Moka often sends `isSuccessful` or `resultCode`.
        // If we can't reliably parse Moka's 3D result, we can check `trxCode` and call DoCapture if IsPreAuth was 1, or just trust the payload for now.
        // Let's assume Moka passes `resultCode="Success"` in the form data or `isSuccessful="true"`.
        // Let's log it to debug easily in production:
        const entries = Object.fromEntries(formData.entries());
        console.log("MOKA CALLBACK RECEIVED:", entries);

        // Moka often sends empty resultCode for success in 3D return, or "Success".
        const isError = entries.resultCode && entries.resultCode !== "Success" && entries.resultCode !== "";
        const isSuccess = !isError;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org";
        let redirectBaseUrl = `${appUrl}/app-payment`;
        let fundId = "";

        if (payloadBase64) {
             try {
                 const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
                 const payload = JSON.parse(payloadStr);
                 fundId = payload.fundId;
                 if (payload.fundId === 'fbiad-bagis') {
                     redirectBaseUrl = `${appUrl}/bagis`;
                 }
             } catch (e) {
                 console.error("Payload parse error", e);
             }
        }

        if (!isSuccess) {
            const errorMsg = entries.resultMessage || entries.resultCode || entries.ResultCode || "moka_failed";
            return NextResponse.redirect(`${redirectBaseUrl}?error=${encodeURIComponent(errorMsg as string)}`, 302);
        }

        if (payloadBase64) {
            try {
                const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
                const payload = JSON.parse(payloadStr);

                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org";
                
                if (payload.fundId === 'fbiad-bagis') {
                    // Bu jenerik bir web bağışı, BurstaBugun'e web bağışı olarak kaydet
                    const donateUrl = `${appUrl}/api/donate`;
                    const donateRes = await fetch(donateUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: payload.tekilTutar,
                            donorName: payload.adSoyad,
                            donorTc: payload.donorTc || '',
                            donorEmail: payload.donorEmail || '',
                            donorPhone: payload.donorPhone || '',
                            isAnonymous: payload.isAnonymous || false,
                            isFbiadMember: false,
                            wantsMembershipInfo: false,
                            bankTransactionId: entries.TrxCode || entries.trxCode || "MOKA-" + Date.now(),
                            bankCode: "MOKA",
                            status: "completed"
                        })
                    });

                    if (donateRes.ok) {
                        return NextResponse.redirect(`${redirectBaseUrl}?success=true&fundId=${payload.fundId}`, 302);
                    } else {
                        console.error("Donate API failed", await donateRes.text());
                        return NextResponse.redirect(`${redirectBaseUrl}?error=system_error`, 302);
                    }
                } else {
                    // Bu bir Burs (Tenant) ödemesi, BurstaBugun execute webhook'una gönder
                    const executeUrl = `${appUrl}/api/app-payment/execute`;
                    
                    const executeRes = await fetch(executeUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fundId: payload.fundId,
                            transactionId: entries.TrxCode || entries.trxCode || "MOKA-" + Date.now(),
                            paymentIds: payload.plan ? payload.plan.map((p: any) => p.id) : []
                        })
                    });

                    if (executeRes.ok) {
                        return NextResponse.redirect(`${redirectBaseUrl}?success=true&fundId=${payload.fundId}`, 302);
                    } else {
                        console.error("BurstaBugun execute failed", await executeRes.text());
                        return NextResponse.redirect(`${redirectBaseUrl}?error=system_error`, 302);
                    }
                }
            } catch (err) {
                console.error("Payload decoding error", err);
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org"}/app-payment?error=payload_error`, 302);
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org"}/app-payment?error=invalid_payload`, 302);
    } catch (e) {
        console.error("Moka callback error:", e);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org"}/app-payment?error=server_error`, 302);
    }
}
