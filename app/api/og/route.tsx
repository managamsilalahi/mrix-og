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

          {/* Footer strip */}
          <div
            style={{
              marginTop: 16,
              borderTop: '1px solid rgba(33,33,33,0.6)',
              paddingTop: 12,
              display: 'flex',
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              lp.mrix.ai · Properti Terbaik · Agen Profesional · Langsung WA
            </span>
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
                backgroundColor: '#6591f1',
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
            {subText}{agentName ? ` · ${agentName}` : ''}
          </span>

          {/* WA badge */}
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
            lp.mrix.ai · Properti Terbaik · Agen Profesional · Langsung WA
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
