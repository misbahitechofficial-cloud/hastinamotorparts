import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'images', 'video-erasio.gif');

    if (!fs.existsSync(publicPath)) {
      return new NextResponse('GIF not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(publicPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    return new NextResponse('Error serving GIF: ' + error?.message, { status: 500 });
  }
}
