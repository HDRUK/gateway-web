import { NextResponse } from 'next/server';

export async function GET() {
  const BLOCK_ROBOTS = process.env.BLOCK_ROBOTS;
  const NEXT_PUBLIC_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
  const isBlocked = BLOCK_ROBOTS === 'true';
  console.log('isBlocked', isBlocked)

const body = isBlocked
  ? [
      'User-agent: *',
      'Disallow: /',
      'Sitemap:'
    ].join('\n')
  : [
      'User-agent: *',
      'Allow: /',
      'Disallow: /account/',
      'Disallow: /sign-in',
      'Disallow: /search',
      `Sitemap: ${NEXT_PUBLIC_GATEWAY_URL}/sitemap.xml`
    ].join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
