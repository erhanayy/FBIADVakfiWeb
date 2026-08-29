import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const apiUrl = process.env.BURSTABUGUN_API_URL || 'http://localhost:3004';
        const apiToken = process.env.BURSTABUGUN_API_TOKEN;

        if (!apiToken) {
            console.error('API token is missing in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(`${apiUrl}/api/public/tenant-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            // next: { revalidate: 60 } // Optional: cache for 60 seconds if needed
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('BurstaBugun API returned an error:', data);
            return NextResponse.json(
                { error: 'Failed to fetch tenant info', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error in proxy tenant-info API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
