import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const W = 1080;
const H = 1920;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';

  let displayName = 'Properti Terbaik di Indonesia';
  let city = '';
  let heroImageUrl: string | null = null;
  let searchQueryDisplay = '';
  let urlDisplay = 'mrix.ai';
  let titleDisplay = '';

  if (slug) {
    try {
      const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      };

      const projectRes = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?or=(published_slug.eq.${encodeURIComponent(slug)},vanity_slug.eq.${encodeURIComponent(slug)})&select=business_name,property_name,name,city,hero_image_url,transaction_type,published_slug,vanity_slug&limit=1`,
        { headers }
      );

      const projects = await projectRes.json();
      const project = projects?.[0];

      if (project) {
        const rawName =
          project.business_name ||
          project.property_name ||
          project.name ||
          'Properti Terbaik di Indonesia';

        displayName = rawName.length > 22 ? rawName.slice(0, 20) + '…' : rawName;
        city = project.city || '';
        heroImageUrl = project.hero_image_url || null;

        const txPrefix = project.transaction_type === 'disewakan' ? 'disewakan' : 'dijual';
        const rawNameForSearch = project.property_name || project.business_name || project.name || '';
        const postfixes = ['maiarix', 'maiarix ai', 'mrix ai', 'mrix.ai'];
        const lastChar = (slug || 'a').slice(-1);
        const postfix = postfixes[parseInt(lastChar, 16) % postfixes.length];
        const searchQuery = [txPrefix, rawNameForSearch, project.city || '', postfix].filter(Boolean).join(' ');
        searchQueryDisplay = searchQuery.length > 38 ? searchQuery.slice(0, 36) + '…' : searchQuery;
        const slugVal = project.vanity_slug || project.published_slug || '';
        urlDisplay = slugVal ? `${slugVal}.mrix.ai` : 'mrix.ai';
        titleDisplay = rawNameForSearch.length > 45 ? rawNameForSearch.slice(0, 43) + '…' : rawNameForSearch;
      }
    } catch {}
  }

  const nameFontSize = displayName.length > 18 ? 68 : displayName.length > 12 ? 78 : 90;

  const response = new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Hero image — top 45% */}
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: W,
            height: Math.round(H * 0.47),
            objectFit: 'cover',
          }}
        />
      )}

      {/* Dark gradient over hero bottom */}
      <div
        style={{
          position: 'absolute',
          top: Math.round(H * 0.28),
          left: 0,
          right: 0,
          height: Math.round(H * 0.22),
          background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.98))',
          display: 'flex',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: 'rgba(18,18,18,0.90)',
          borderBottom: '1px solid rgba(33,33,33,0.8)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 44,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 900,
            color: '#0a0a0a',
          }}
        >
          M
        </div>
        <span
          style={{
            fontSize: 16,
            color: '#f5f5f5',
            fontWeight: 600,
          }}
        >
          Landing Page by Maiarix AI
        </span>
      </div>

      {/* Content area — from hero bottom down */}
      <div
        style={{
          position: 'absolute',
          top: Math.round(H * 0.47),
          left: 0,
          right: 0,
          bottom: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px 0 72px',
        }}
      >
        {/* Property name */}
        <span
          style={{
            fontSize: nameFontSize,
            fontWeight: 900,
            color: '#f5f5f5',
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          {displayName}
        </span>

        {/* City */}
        {city && (
          <span
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 60,
            }}
          >
            {city}
          </span>
        )}

        {/* Google result card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 40,
            padding: '44px 52px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            marginBottom: 24,
            width: '100%',
          }}
        >
          {/* Search bar row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f3f4',
              borderRadius: 48,
              padding: '22px 32px',
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              {(['#4285F4', '#EA4335', '#FBBC05', '#34A853'] as const).map((c, i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: c, display: 'flex' }} />
              ))}
            </div>
            <span style={{ fontSize: 32, color: '#3c4043', fontWeight: 400, display: 'flex' }}>
              {searchQueryDisplay || 'properti indonesia'}
            </span>
          </div>
          {/* Divider */}
          <div style={{ height: 1, background: '#e8eaed', marginBottom: 28, display: 'flex' }} />
          {/* Result row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Maiarix M circle */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                background: '#1D9E75',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', display: 'flex' }}>M</span>
            </div>
            {/* Text column */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 4 }}>
              <span style={{ fontSize: 26, color: '#0F6E56', display: 'flex' }}>{urlDisplay}</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#1a0dab', display: 'flex' }}>{titleDisplay || displayName}</span>
              <span style={{ fontSize: 24, color: '#70757a', display: 'flex' }}>
                {city ? `${city} · Properti eksklusif · lp.mrix.ai` : 'Properti eksklusif · lp.mrix.ai'}
              </span>
            </div>
            {/* Hasil #1 badge */}
            <div
              style={{
                background: '#34A853',
                borderRadius: 16,
                padding: '10px 24px',
                display: 'flex',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', display: 'flex' }}>Hasil #1</span>
            </div>
          </div>
        </div>

        {/* ✓ Ditemukan di Google trust badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(52,168,83,0.15)',
            border: '1.5px solid rgba(52,168,83,0.45)',
            borderRadius: 40,
            padding: '14px 36px',
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 36, color: '#34A853', fontWeight: 700, display: 'flex' }}>
            ✓ Ditemukan di Google
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          borderTop: '1px solid #212121',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 18, color: '#737373' }}>
          Properti Indonesia · lp.mrix.ai
        </span>
      </div>
    </div>,
    {
      width: W,
      height: H,
    }
  );

  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return response;
}
