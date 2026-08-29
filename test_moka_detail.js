const crypto = require('crypto');

async function test() {
    const dealerCode = "206019";
    const username = "c4152353-27d3-4dbc-912e-d748bd63c80f";
    const password = "bc730821-ea91-46d8-8671-55307c13d0a1";
    
    const rawCheckKey = dealerCode + "MK" + username + "PD" + password;
    const checkKey = crypto.createHash("sha256").update(rawCheckKey).digest("hex");

    const payload = {
        PaymentDealerAuthentication: {
            DealerCode: dealerCode,
            Username: username,
            Password: password,
            CheckKey: checkKey
        },
        PaymentDealerRequest: {
            OtherTrxCode: "MOKA-1787742021619"
        }
    };

    console.log("Request:", JSON.stringify(payload));

    const response = await fetch("https://service.refmokaunited.com/PaymentDealer/GetPaymentDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.text();
    console.log("Response:", data);
}

test();
