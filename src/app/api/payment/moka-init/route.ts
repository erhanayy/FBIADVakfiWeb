import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Incoming Moka payload:", JSON.stringify(body));
        const { cardInfo, payload } = body;

        // Use environment variables for Moka API credentials
        const dealerCode = process.env.MOKA_DEALER_CODE || "";
        const username = process.env.MOKA_USERNAME || "";
        const password = process.env.MOKA_PASSWORD || "";
        const isTestEnv = process.env.MOKA_IS_TEST === "true"; // default to production unless true
        const apiUrl = isTestEnv ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
        
        // Limit url length to avoid Moka InvalidRedirectUrlLength error
        // We pack the payload into a pipe-delimited string instead of a fat JSON object.
        // Format: fundId|planIds|tekilTutar|adSoyad|donorEmail|donorTc|donorPhone|isAnonymous
        const planIds = payload.plan ? payload.plan.map((p: any) => p.id).join(',') : '';
        const shortStr = `${payload.fundId || ''}|${planIds}|${payload.tekilTutar || payload.amount || 0}|${payload.adSoyad || ''}|${payload.donorEmail || ''}|${payload.donorTc || ''}|${payload.donorPhone || ''}|${payload.isAnonymous ? 1 : 0}`;
        const payloadBase64 = Buffer.from(shortStr, 'utf8').toString('base64');
        
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://burs.fbiadvakfi.org";

        if (!dealerCode || !username || !password) {
            return NextResponse.json({ success: false, error: "Moka API credentials are not configured on the server." }, { status: 500 });
        }

        // Create Check Key (SHA-256 Hash)
        const rawCheckKey = `${dealerCode}MK${username}PD${password}`;
        const checkKey = crypto.createHash("sha256").update(rawCheckKey).digest("hex");

        // Prepare Moka Request Payload
        // Create a unique TrxCode to track this specific payment
        // We will store fundId and paymentIds inside the OtherTrxCode, or save them in a DB.
        // Wait, Moka limits OtherTrxCode length, usually 50 chars. We can send a stringified simple payload if it fits,
        // or just generate a unique DB record here! Since FBIADVakfiWeb has no direct DB access to BurstaBugun, we can just pack it.
        // Let's pack: fundId + "::" + paymentIds.join(',')
        const paymentIdsStr = payload.plan.map((p: any) => p.id).join(",");
        let trxCode = `${payload.fundId}::${paymentIdsStr}`;
        if (trxCode.length > 50) {
           // Fallback if too long, although UUID is 36 chars. Multiple UUIDs will exceed 50.
           // In this scenario, we might just pass the first payment ID, and rely on webhook processing.
           // But since FBIADVakfiWeb is stateless, how do we pass data back?
           // We can pass the payload as a Base64 encoded string in the RedirectUrl query parameter!
           trxCode = "MOKA-" + Date.now();
        }

        const callbackUrl = `${appUrl}/api/payment/moka-callback`;

        const expYearStr = cardInfo.expYear.length === 2 ? `20${cardInfo.expYear}` : cardInfo.expYear;

        const mokaRequest = {
            PaymentDealerAuthentication: {
                DealerCode: dealerCode,
                Username: username,
                Password: password,
                CheckKey: checkKey
            },
            PaymentDealerRequest: {
                CardHolderFullName: cardInfo.cardHolderName,
                CardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
                ExpMonth: cardInfo.expMonth,
                ExpYear: expYearStr,
                CvcNumber: cardInfo.cvc,
                Amount: Number(payload.toplamTutar || payload.tekilTutar || payload.amount || 0),
                Currency: "TL",
                InstallmentNumber: 1, // Peşin
                ClientIP: req.headers.get("x-forwarded-for") || "127.0.0.1",
                OtherTrxCode: trxCode,
                IsPoolPayment: 0,
                IsPreAuth: 0,
                IsTokenized: 0,
                ReturnHash: 1,
                // We no longer pass the payload in the URL to avoid Moka's 255 character limit.
                // Instead, we will store it in a secure cookie.
                RedirectUrl: callbackUrl,
                RedirectType: 0,
                Description: `${payload.adSoyad} - Burs Bagisi`,
            }
        };

        console.log("Outgoing Moka Request:", JSON.stringify(mokaRequest));

        const response = await fetch(`${apiUrl}/PaymentDealer/DoDirectPaymentThreeD`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mokaRequest)
        });

        const data = await response.json();

        if (data.ResultCode === "Success" && data.Data && data.Data.Url) {
            // Moka 3D redirect URL
            // Set cookie before returning response
            const res = NextResponse.json({ success: true, redirectUrl: data.Data.Url });
            res.cookies.set('moka_payload', payloadBase64, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 15, // 15 minutes
                path: '/'
            });
            return res;
        } else {
            console.error("Moka Request Failed:", JSON.stringify(data, null, 2));
            const errorMsg = data.ResultMessage || data.ResultCode || data.Exception || "Moka ödeme isteği başarısız oldu.";
            return NextResponse.json({ success: false, error: errorMsg, details: data }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Moka init error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
