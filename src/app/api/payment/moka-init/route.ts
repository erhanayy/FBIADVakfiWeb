import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Incoming Moka payload:", JSON.stringify(body));
        const { cardInfo, payload, installmentCount, paymentMethod } = body;

        // Default to calculated count if not provided
        const finalInstallmentCount = installmentCount || ((payload.taksitMi && payload.plan && payload.plan.length > 1) ? payload.plan.length : 1);

        // Use environment variables for Moka API credentials
        const dealerCode = process.env.MOKA_DEALER_CODE || "";
        const username = process.env.MOKA_USERNAME || "";
        const password = process.env.MOKA_PASSWORD || "";
        const isTestEnv = process.env.MOKA_IS_TEST === "true"; // default to production unless true
        const apiUrl = isTestEnv ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
        
        const planCount = payload.plan ? payload.plan.length : 0;
        
        let shortStr = '';
        if (payload.fundId === 'fbiad-bagis') {
            shortStr = `${payload.fundId || ''}|${payload.userId || ''}|${planCount}|${payload.tekilTutar || payload.amount || 0}|${payload.adSoyad || ''}|${payload.donorEmail || ''}|${payload.donorTc || ''}|${payload.donorPhone || ''}|${payload.isAnonymous ? 1 : 0}|${payload.agreementsAccepted === 1 ? 1 : 0}`;
        } else {
            // For Burs payments, fundId and userId are UUIDs. We OMIT donor info to ensure Base64 string + RedirectUrl is < 255 chars!
            shortStr = `${payload.fundId || ''}|${payload.userId || ''}|${planCount}|${payload.tekilTutar || payload.amount || 0}|${paymentMethod || ''}`;
        }
        
        // Use base64url to avoid special URL characters (+, /, =) which might crash Moka's ASP.NET backend
        const payloadBase64 = Buffer.from(shortStr, 'utf8').toString('base64url');
        
        const host = req.headers.get("host") || "localhost:3005";
        const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

        if (!dealerCode || !username || !password) {
            return NextResponse.json({ success: false, error: "Moka API credentials are not configured on the server." }, { status: 500 });
        }

        // Create Check Key (SHA-256 Hash)
        const rawCheckKey = `${dealerCode}MK${username}PD${password}`;
        const checkKey = crypto.createHash("sha256").update(rawCheckKey).digest("hex");

        let trxCode = `MOKA-${Date.now()}`;

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
                Amount: paymentMethod === 'subscription' ? Number(payload.tekilTutar || payload.amount || 0) : Number(payload.toplamTutar || payload.tekilTutar || payload.amount || 0),
                Currency: "TL",
                InstallmentNumber: finalInstallmentCount,
                ClientIP: req.headers.get("x-forwarded-for") || "127.0.0.1",
                OtherTrxCode: trxCode,
                IsPoolPayment: 0,
                IsPreAuth: 0,
                IsTokenized: paymentMethod === 'subscription' ? 1 : 0,
                ReturnHash: 1,
                // We pass the ultra-compact base64 encoded payload in RedirectUrl. Since it no longer contains UUIDs for installments, it easily fits the 255 char limit!
                RedirectUrl: `${callbackUrl}?payload=${encodeURIComponent(payloadBase64)}`,
                RedirectType: 0,
                Description: `${payload.adSoyad} - Burs Bagisi`,
                ...(paymentMethod === 'subscription' ? {
                    CustomerInformation: {
                        DealerCustomerId: "",
                        CustomerCode: payload.userId || `USER-${Date.now()}`,
                        FirstName: cardInfo.cardHolderName.split(' ')[0] || "Bursiyer",
                        LastName: cardInfo.cardHolderName.split(' ').slice(1).join(' ') || "Destekcisi",
                        Gender: "1",
                        BirthDate: "",
                        GsmNumber: payload.donorPhone || "",
                        Email: payload.donorEmail || "",
                        Address: "",
                        CardName: "Aylık Burs Bağış Kartı"
                    }
                } : {})
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
            return NextResponse.json({ 
                success: true, 
                redirectUrl: data.Data.Url,
                rawRequest: mokaRequest,
                rawResponse: data
            });
        } else {
            console.error("Moka Request Failed:", JSON.stringify(data, null, 2));
            const errorMsg = data.ResultMessage || data.ResultCode || data.Exception || "Moka ödeme isteği başarısız oldu.";
            return NextResponse.json({ 
                success: false, 
                error: errorMsg, 
                details: data,
                rawRequest: mokaRequest,
                rawResponse: data
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Moka init error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
