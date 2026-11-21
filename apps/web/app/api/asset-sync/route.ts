import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const targetDir = path.join(process.cwd(), 'public', 'images');
    const targetPath = path.join(targetDir, 'video-erasio.gif');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      return NextResponse.json({
        success: true,
        message: 'GIF available in public folder',
        size: stats.size,
        destination: targetPath,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'GIF not found at ' + targetPath,
        exists: false,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}
