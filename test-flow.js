const fs = require('fs');

async function testFlow() {
  const fileBuffer = fs.readFileSync('package.json');
  const fileBlob = new Blob([fileBuffer], { type: 'application/json' });
  const formData = new FormData();
  formData.append('file', fileBlob, 'package.json');

  const uploadRes = await fetch('http://localhost:3005/api/upload', {
    method: 'POST',
    body: formData
  });

  console.log("Upload Status:", uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log("Upload Data:", uploadData);

  const payload = {
    fundId: "d7a6ab69-115d-4e27-b34b-10d4b5d604f0",
    transactionId: "WIRE-" + Date.now(),
    paymentIds: ["625499ab-9fc5-47bd-9e8e-be75ee6b036f"],
    paymentMethod: 'wire_transfer',
    receiptUrl: uploadData.url
  };

  const execRes = await fetch('http://localhost:3005/api/app-payment/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log("Execute Status:", execRes.status);
  const execData = await execRes.json();
  console.log("Execute Data:", execData);
}

testFlow();
