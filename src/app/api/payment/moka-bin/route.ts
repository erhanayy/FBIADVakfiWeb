import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { binNumber } = body;

        if (!binNumber || binNumber.length < 6) {
            return NextResponse.json({ success: false, error: "Geçersiz BIN numarası." }, { status: 400 });
        }

        const isTestEnv = process.env.MOKA_IS_TEST === "true" || process.env.NODE_ENV !== "production";
        const apiUrl = isTestEnv ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
        const dealerCode = isTestEnv ? (process.env.MOKA_TEST_DEALER_CODE || "Test") : (process.env.MOKA_DEALER_CODE || "");
        const username = isTestEnv ? (process.env.MOKA_TEST_USERNAME || "Test") : (process.env.MOKA_USERNAME || "");
        const password = isTestEnv ? (process.env.MOKA_TEST_PASSWORD || "Test") : (process.env.MOKA_PASSWORD || "");

        if (!dealerCode || !username || !password) {
            return NextResponse.json({ success: false, error: "Moka API bilgileri eksik." }, { status: 500 });
        }

        const rawCheckKey = `${dealerCode}MK${username}PD${password}`;
        const checkKey = crypto.createHash("sha256").update(rawCheckKey).digest("hex");

        const mokaRequest = {
            PaymentDealerAuthentication: {
                DealerCode: dealerCode,
                Username: username,
                Password: password,
                CheckKey: checkKey
            },
            BankCardInformationRequest: {
                BinNumber: binNumber
            }
        };

        const response = await fetch(`${apiUrl}/PaymentDealer/GetBankCardInformation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mokaRequest)
        });

        const data = await response.json();
        console.log("Moka BIN API Response for", binNumber, ":", JSON.stringify(data));

        if (data.ResultCode === "Success" && data.Data) {
            return NextResponse.json({ 
                success: true, 
                data: {
                    bankName: data.Data.BankName,
                    bankCode: data.Data.BankCode,
                    cardType: data.Data.CardType,
                    creditType: data.Data.CreditType,
                    productCategory: data.Data.ProductCategory, // Bireysel or Ticari
                    groupName: data.Data.GroupName // BONUS, AXESS, etc.
                } 
            });
        } else {
            console.error("Moka BIN Error:", data);
            return NextResponse.json({ success: false, error: data.ResultMessage || data.ResultCode }, { status: 400 });
        }

    } catch (error) {
        console.error("Moka BIN query exception:", error);
        return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
    }
}
