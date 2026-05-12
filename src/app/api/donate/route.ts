import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // BurstaBugun API configuration
        const apiUrl = process.env.BURSTABUGUN_API_URL || 'http://localhost:3004';
        const apiToken = process.env.BURSTABUGUN_API_TOKEN;

        if (!apiToken) {
            console.error('API token is missing in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Forward the request to BurstaBugun API
        const response = await fetch(`${apiUrl}/api/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('BurstaBugun API returned an error:', data);
            return NextResponse.json(
                { error: 'Failed to process donation in backend system', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Error in proxy donate API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
