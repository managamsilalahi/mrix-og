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

  if (slug) {
    try {
      const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      };

      const projectRes = await fetch(
        `${SUPABASE_URL}/rest/v1/projects?published_slug=eq.${encodeURIComponent(slug)}&select=business_name,property_name,name,city,view_count,hero_image_url,whatsapp_number,user_id&limit=1`,
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

        if (city && viewCount > 0) {
          subText = `${city} · ${viewCount.toLocaleString('id-ID')} views`;
        } else if (city) {
          subText = city;
        } else if (viewCount > 0) {
          subText = `${viewCount.toLocaleString('id-ID')} views`;
        } else {
          subText = 'Properti Indonesia';
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
      /* ── D1: PHOTO HERO — CLEAN BOTTOM STRIP ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0f0f0f',
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

        {/* Top gradient — brand readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
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

        {/* Logo block */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              backgroundColor: '#e8600a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: 'white',
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
            }}
          >
            Landing Page by Maiarix AI
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
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: 8,
            }}
          >
            {displayName}
          </span>

          {/* Info + WA row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: agentName ? 6 : 0,
            }}
          >
            {/* Left: city · views */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {city && (
                <span style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)' }}>
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
                  }}
                />
              )}
              {viewCount > 0 && (
                <span style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)' }}>
                  {viewCount.toLocaleString('id-ID')} views
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
                  borderRadius: 22,
                  padding: '10px 22px',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                  Hubungi WA
                </span>
              </div>
            )}
          </div>

          {/* Agent name */}
          {agentName && (
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>
              Agen: {agentName}
            </span>
          )}
        </div>

        {/* Orange accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: '#e8600a',
            display: 'flex',
          }}
        />
      </div>
    ) : (
      /* ── C3: NO PHOTO — EDITORIAL/MAGAZINE ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0c0c0c',
        }}
      >
        {/* Top header bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />

        {/* Logo block — centered within 56px bar: (56-26)/2 = 15 */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            left: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              backgroundColor: '#e8600a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: 'white',
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
            }}
          >
            Landing Page by Maiarix AI
          </span>
        </div>


        {/* Center content — inset flex column */}
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
          {/* Business name */}
          <span
            style={{
              fontSize: nameFontSize,
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: 20,
            }}
          >
            {displayName}
          </span>

          {/* Horizontal rules + orange dot */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              paddingLeft: 80,
              paddingRight: 80,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#e8600a',
                margin: '0 16px',
              }}
            />
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            />
          </div>

          {/* Sub info */}
          <span
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 20,
            }}
          >
            {subText}{agentName ? ` · Agen: ${agentName}` : ''}
          </span>

          {/* WA badge */}
          {hasWa && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#25D366',
                borderRadius: 24,
                padding: '10px 28px',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                Hubungi WA
              </span>
            </div>
          )}
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
            Properti Terbaik · Agen Profesional · Langsung WA
          </span>
        </div>

        {/* Orange accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: '#e8600a',
            display: 'flex',
          }}
        />
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
