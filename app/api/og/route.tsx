import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';

  let displayName = 'Properti Terbaik di Indonesia';
  let subText = 'Listing properti Indonesia';
  let city = '';
  let viewCount = 0;
  let agentName = '';
  let hasWa = false;
  let heroImageUrl: string | null = null;
  let ogDescription = '';
  let accentColor = '#6591f1';
  let verticalLabel = 'Bisnis Indonesia';
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
        `${SUPABASE_URL}/rest/v1/projects?or=(published_slug.eq.${encodeURIComponent(slug)},vanity_slug.eq.${encodeURIComponent(slug)})&select=business_name,property_name,name,city,view_count,hero_image_url,whatsapp_number,user_id,style,published_html,transaction_type,published_slug,vanity_slug&limit=1`,
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

        displayName = rawName.length > 20
          ? rawName.slice(0, 18) + '…'
          : rawName;

        city = project.city || '';
        viewCount = project.view_count || 0;
        hasWa = !!project.whatsapp_number;
        heroImageUrl = project.hero_image_url || null;

        const txPrefix = project.transaction_type === 'disewakan' ? 'disewakan' : 'dijual';
        const rawNameForSearch = project.property_name || project.business_name || project.name || '';
        const postfixes = ['maiarix', 'maiarix ai', 'mrix ai', 'mrix.ai'];
        const lastChar = (slug || 'a').slice(-1);
        const postfix = postfixes[parseInt(lastChar, 16) % postfixes.length];
        const searchQuery = [txPrefix, rawNameForSearch, project.city || '', postfix].filter(Boolean).join(' ');
        searchQueryDisplay = searchQuery.length > 42 ? searchQuery.slice(0, 40) + '…' : searchQuery;
        const slugVal = project.vanity_slug || project.published_slug || '';
        urlDisplay = slugVal ? `${slugVal}.mrix.ai` : 'mrix.ai';
        titleDisplay = rawNameForSearch.length > 45 ? rawNameForSearch.slice(0, 43) + '…' : rawNameForSearch;

        if (city && viewCount > 0) {
          subText = `${city} · ${viewCount.toLocaleString('id-ID')} views`;
        } else if (city) {
          subText = city;
        } else if (viewCount > 0) {
          subText = `${viewCount.toLocaleString('id-ID')} views`;
        } else {
          subText = 'Properti Indonesia';
        }

        // Extract og:description from published_html
        if (project.published_html) {
          const descMatch = project.published_html.match(
            /property="og:description"\s+content="([^"]{10,120})"/
          );
          if (descMatch) {
            ogDescription = descMatch[1]
              .replace(/\s*-\s*cicilan.*$/i, '')
              .replace(/\s*\.\s*Info.*$/i, '')
              .trim();
          }
        }

        // Style → accent color map
        const STYLE_COLORS: Record<string, string> = {
          noir:    '#6591f1',
          ember:   '#e8600a',
          dawn:    '#4f7942',
          dusk:    '#9b59b6',
          ocean:   '#0ea5e9',
          forest:  '#16a34a',
          rose:    '#e11d48',
          slate:   '#64748b',
        };
        accentColor = STYLE_COLORS[project.style ?? ''] ?? '#6591f1';

        // Vertical detection from displayName + description
        const verticalText = (displayName + ' ' + ogDescription).toLowerCase();
        if (/desain|interior|arsitektur|renovasi|kontraktor/.test(verticalText)) {
          verticalLabel = 'Desain Interior';
        } else if (/hotel|villa|resort|penginapan|hospitality/.test(verticalText)) {
          verticalLabel = 'Hotel & Hospitality';
        } else if (/asuransi|insurance|proteksi|jiwa/.test(verticalText)) {
          verticalLabel = 'Asuransi';
        } else if (/kuliner|resto|restoran|kafe|cafe|makanan/.test(verticalText)) {
          verticalLabel = 'Kuliner & Resto';
        } else if (/properti|rumah|apartemen|kavling|ruko|tanah/.test(verticalText)) {
          verticalLabel = 'Properti';
        } else {
          verticalLabel = 'Bisnis Indonesia';
        }

        if (project.user_id) {
          const profileRes = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?id=eq.${project.user_id}&select=full_name&limit=1`,
            { headers }
          );
          const profiles = await profileRes.json();
          agentName = profiles?.[0]?.full_name || '';
        }
      }
    } catch {}
  }

  const nameFontSize = displayName.length > 16 ? 62 : displayName.length > 12 ? 72 : 82;
  const hasPhoto = !!heroImageUrl;

  const response = new ImageResponse(
    hasPhoto ? (
      /* ── D1: PHOTO HERO — BLUE BRANDED ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Full bleed hero image */}
        <img
          src={heroImageUrl!}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: 'cover',
          }}
        />

        {/* Top gradient — header readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
            display: 'flex',
          }}
        />

        {/* Bottom gradient — text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 260,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
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
            height: 58,
            backgroundColor: 'rgba(18,18,18,0.85)',
            borderBottom: '1px solid rgba(33,33,33,0.8)',
            display: 'flex',
          }}
        />

        {/* Logo block — centered in 58px bar: (58-22)/2 = 18 */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: '#0a0a0a',
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 13,
              color: '#f5f5f5',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Landing Page by Maiarix AI
          </span>
        </div>

        {/* Top-right label */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 40,
            display: 'flex',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '1px',
            }}
          >
            PROPERTI INDONESIA
          </span>
        </div>

        {/* Bottom content strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 40px 32px 40px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Business name */}
          <span
            style={{
              fontSize: nameFontSize,
              fontWeight: 900,
              color: '#f5f5f5',
              lineHeight: 1.05,
              marginBottom: 8,
            }}
          >
            {displayName}
          </span>

          {/* Info row + WA badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Left: city · views · agent */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {city && (
                <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)' }}>
                  {city}
                </span>
              )}
              {city && viewCount > 0 && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    display: 'flex',
                  }}
                />
              )}
              {viewCount > 0 && (
                <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)' }}>
                  {viewCount.toLocaleString('id-ID')} views
                </span>
              )}
              {agentName && (viewCount > 0 || city) && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    display: 'flex',
                  }}
                />
              )}
              {agentName && (
                <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)' }}>
                  {agentName}
                </span>
              )}
            </div>

            {/* Right: WA badge */}
            {hasWa && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#25D366',
                  borderRadius: 9999,
                  padding: '10px 24px',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                  Hubungi WA
                </span>
              </div>
            )}
          </div>

          {/* Google result card */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* White card */}
            <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Search bar row */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f3f4', borderRadius: 26, padding: '7px 14px', gap: 8, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {(['#4285F4', '#EA4335', '#FBBC05', '#34A853'] as const).map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: c, display: 'flex' }} />
                  ))}
                </div>
                <span style={{ fontSize: 17, color: '#3c4043', fontWeight: 400, display: 'flex' }}>
                  {searchQueryDisplay || 'properti indonesia'}
                </span>
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: '#e8eaed', margin: '0 0 10px 0', display: 'flex' }} />
              {/* Result row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Maiarix M circle */}
                <div style={{ width: 30, height: 30, borderRadius: 15, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', display: 'flex' }}>M</span>
                </div>
                {/* Text column */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 13, color: '#0F6E56', display: 'flex' }}>{urlDisplay}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1a0dab', display: 'flex' }}>{titleDisplay || displayName}</span>
                  <span style={{ fontSize: 12, color: '#70757a', display: 'flex' }}>{city ? `${city} · Properti eksklusif · lp.mrix.ai` : 'Properti eksklusif · lp.mrix.ai'}</span>
                </div>
                {/* Hasil #1 badge */}
                <div style={{ background: '#34A853', borderRadius: 8, padding: '4px 10px', display: 'flex', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex' }}>Hasil #1</span>
                </div>
              </div>
            </div>
            {/* Trust badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,168,83,0.15)', border: '1px solid rgba(52,168,83,0.4)', borderRadius: 20, padding: '4px 14px', alignSelf: 'flex-start' }}>
              <span style={{ fontSize: 16, color: '#34A853', fontWeight: 600, display: 'flex' }}>✓ Ditemukan di Google</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* ── C3: NO PHOTO — BLUE EDITORIAL ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Blue radial glow — top center */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(73,125,238,0.08) 0%, transparent 70%)',
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
            height: 58,
            backgroundColor: '#121212',
            borderBottom: '1px solid #212121',
            display: 'flex',
          }}
        />

        {/* Logo block — centered in 58px bar: (58-22)/2 = 18 */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: '#0a0a0a',
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 13,
              color: '#f5f5f5',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Landing Page by Maiarix AI
          </span>
        </div>

        {/* Top-right label */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 40,
            display: 'flex',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: '#737373',
              letterSpacing: '1px',
            }}
          >
            LANDING PAGE
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Vertical label */}
          {verticalLabel && (
            <div style={{
              fontSize: 13,
              color: accentColor,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: 12,
              opacity: 0.8,
              display: 'flex',
            }}>
              {verticalLabel}
            </div>
          )}

          {/* Business name */}
          <span
            style={{
              fontSize: nameFontSize,
              fontWeight: 900,
              color: '#f5f5f5',
              marginBottom: 20,
            }}
          >
            {displayName}
          </span>

          {/* Divider row — rules + blue dot */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              paddingLeft: 100,
              paddingRight: 100,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: '#212121',
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: accentColor,
                margin: '0 16px',
                display: 'flex',
              }}
            />
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: '#212121',
              }}
            />
          </div>

          {/* Sub info */}
          <span
            style={{
              fontSize: 18,
              color: '#737373',
              marginBottom: 24,
            }}
          >
            {ogDescription || subText}{agentName ? ` · Agen: ${agentName}` : ''}
          </span>

          {/* Google result card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 12, width: '85%' }}>
            {/* White card */}
            <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
              {/* Search bar row */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f3f4', borderRadius: 26, padding: '7px 14px', gap: 8, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {(['#4285F4', '#EA4335', '#FBBC05', '#34A853'] as const).map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: c, display: 'flex' }} />
                  ))}
                </div>
                <span style={{ fontSize: 17, color: '#3c4043', fontWeight: 400, display: 'flex' }}>
                  {searchQueryDisplay || 'properti indonesia'}
                </span>
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: '#e8eaed', margin: '0 0 10px 0', display: 'flex' }} />
              {/* Result row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', display: 'flex' }}>M</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 13, color: '#0F6E56', display: 'flex' }}>{urlDisplay}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1a0dab', display: 'flex' }}>{titleDisplay || displayName}</span>
                  <span style={{ fontSize: 12, color: '#70757a', display: 'flex' }}>{city ? `${city} · Properti eksklusif · lp.mrix.ai` : 'Properti eksklusif · lp.mrix.ai'}</span>
                </div>
                <div style={{ background: '#34A853', borderRadius: 8, padding: '4px 10px', display: 'flex', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex' }}>Hasil #1</span>
                </div>
              </div>
            </div>
            {/* Trust badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,168,83,0.15)', border: '1px solid rgba(52,168,83,0.4)', borderRadius: 20, padding: '4px 14px' }}>
              <span style={{ fontSize: 16, color: '#34A853', fontWeight: 600, display: 'flex' }}>✓ Ditemukan di Google</span>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 28,
            borderTop: '1px solid #212121',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: '#737373' }}>
            {`${verticalLabel} · Langsung WA · lp.mrix.ai`}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return response;
}
