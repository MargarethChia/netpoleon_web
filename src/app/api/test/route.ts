import { NextResponse } from 'next/server';

// Force dynamic rendering - prevent static analysis during build
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
  });
}
