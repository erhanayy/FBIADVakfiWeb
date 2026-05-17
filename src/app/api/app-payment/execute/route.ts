import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fundId, transactionId, paymentIds } = await request.json();

    if (!fundId) {
      return NextResponse.json({ success: false, error: 'Missing fundId' }, { status: 400 });
    }

    // Call BurstaBugun webhook to mark specified fund payments as completed
    const burstaAppUrl = process.env.BURSTABUGUN_API_URL || 'http://localhost:3004';
    const webhookUrl = `${burstaAppUrl}/api/webhooks/payment-complete`;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In a real app, send a shared secret to authenticate this webhook call
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || 'fbiad-webhook-secret-key-123'}`,
      },
      body: JSON.stringify({ fundId, transactionId, paymentIds })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BurstaBugun webhook failed:", errorText);
      return NextResponse.json({ success: false, error: 'Webhook hatası' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Ödeme tamamlandı ve sisteme işlendi.' });

  } catch (error) {
    console.error("App Payment Execution Error:", error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
