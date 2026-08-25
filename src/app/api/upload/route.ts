import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const defaultUrl = process.env.NODE_ENV === 'production' ? 'https://burs.fbiadvakfi.org' : 'http://localhost:3004';
    const burstaAppUrl = process.env.BURSTABUGUN_API_URL || defaultUrl;
    const uploadUrl = `${burstaAppUrl}/api/upload`;

    // Forward the file to BurstaBugun
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    
    // Pass along user ID if provided
    const userId = formData.get('userId');
    if (userId) {
      backendFormData.append('userId', userId);
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend upload failed:", errorText);
      return NextResponse.json({ error: 'Backend upload failed' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
