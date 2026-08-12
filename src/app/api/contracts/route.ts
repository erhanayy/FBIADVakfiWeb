import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const types = url.searchParams.get('types');

        const apiUrl = process.env.BURSTABUGUN_API_URL || 'http://localhost:3004';
        
        const response = await fetch(`${apiUrl}/api/public/contracts?types=${types || ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('BurstaBugun API returned an error:', data);
            return NextResponse.json(
                { error: 'Failed to fetch contracts', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error in proxy contracts API:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
