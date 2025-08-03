import { NextResponse } from 'next/server'

export function GET() {
  const robots = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /auth/

# Cultural content sitemap
Sitemap: https://voices-of-kunqu.org/sitemap.xml

# Allow search engines to index cultural content
User-agent: Googlebot
Allow: /performances/
Allow: /glossary/
Allow: /timeline/
Allow: /learn/

# Prevent indexing of user-generated content
Disallow: /discussions/
Disallow: /profile/
  `.trim()

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}