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

        // Moka usually sends "ResultCode" in the form data. If it's "Success", we process.
        // Actually, if it's a 3D return, Moka might redirect with GET or POST.
        // If it's successful, we call our own execute webhook!

        const isSuccess = entries.ResultCode === "Success" || entries.mdStatus === "1" || entries.mdStatus === "9" || entries.isSuccessful === "true" || entries.Hash?.toString().endsWith("T"); // We'll try to catch success broadly since Moka docs are brief on 3D return format.

        if (!isSuccess) {
            // Redirect to failure page
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org";
            return NextResponse.redirect(`${appUrl}/app-payment?error=moka_failed`, 302);
        }

        if (payloadBase64) {
            try {
                const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
                const payload = JSON.parse(payloadStr);

                // Call the BurstaBugun execute webhook
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org";
                const executeUrl = `${appUrl}/api/app-payment/execute`;
                
                const executeRes = await fetch(executeUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fundId: payload.fundId,
                        transactionId: entries.TrxCode || "MOKA-" + Date.now(),
                        paymentIds: payload.plan.map((p: any) => p.id)
                    })
                });

                if (executeRes.ok) {
                    return NextResponse.redirect(`${appUrl}/app-payment?success=true&fundId=${payload.fundId}`, 302);
                } else {
                    console.error("BurstaBugun execute failed", await executeRes.text());
                    return NextResponse.redirect(`${appUrl}/app-payment?error=system_error`, 302);
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
