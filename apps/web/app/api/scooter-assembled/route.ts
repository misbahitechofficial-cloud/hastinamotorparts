import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'images', 'scooter-assembled.png');

    if (!fs.existsSync(publicPath)) {
      return new NextResponse('Assembled scooter image not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(publicPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    return new NextResponse('Error serving image: ' + error?.message, { status: 500 });
  }
}
