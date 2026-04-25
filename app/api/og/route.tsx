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
        // Business name priority: business_name → property_name → name
        const rawName =
          project.business_name ||
          project.property_name ||
          project.name ||
          'Properti Terbaik di Indonesia';

        // Truncate at 22 chars for display
        displayName = rawName.length > 22
          ? rawName.slice(0, 20) + '…'
          : rawName;

        city = project.city || '';
        viewCount = project.view_count || 0;
        hasWa = !!project.whatsapp_number;
        heroImageUrl = project.hero_image_url || null;

        // Sub-text: city + views
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

  // Logo element — "M" orange square
  const LogoBrand = (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          backgroundColor: '#e8600a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 900,
          color: 'white',
        }}
      >
        M
      </div>
      <span
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '1.5px',
        }}
      >
        Landing Page by Maiarix AI
      </span>
    </div>
  );

  // Bottom strip — shared between A1 and B1
  const BottomStrip = (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 40px 36px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Business name */}
      <div
        style={{
          fontSize: displayName.length > 16 ? 62 : 76,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.05,
          marginBottom: 10,
        }}
      >
        {displayName}
      </div>

      {/* City · views row + WA badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: agentName ? 6 : 0,
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          {subText}
        </span>

        {hasWa && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#25D366',
              borderRadius: 24,
              padding: '10px 22px',
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'white',
              }}
            >
              Hubungi WA
            </span>
          </div>
        )}
      </div>

      {/* Agent name */}
      {agentName && (
        <span
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          Agen: {agentName}
        </span>
      )}
    </div>
  );

  // Orange bottom accent line
  const AccentLine = (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#e8600a',
        display: 'flex',
      }}
    />
  );

  const hasPhoto = !!heroImageUrl;

  const response = new ImageResponse(
    hasPhoto ? (
      /* ── A1: PHOTO HERO ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0f0f0f',
        }}
      >
        {/* Full bleed hero photo */}
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
            height: 120,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
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
            height: 340,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.75) 45%, transparent 100%)',
            display: 'flex',
          }}
        />

        {LogoBrand}
        {BottomStrip}
        {AccentLine}
      </div>
    ) : (
      /* ── C3: NO PHOTO — editorial/magazine layout ── */
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0c0c0c',
        }}
      >
        {/* Top bar */}
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
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
        >
          {/* Top-left: M square + MAIARIX AI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                backgroundColor: '#e8600a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: 'white',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '2px',
                fontWeight: 600,
              }}
            >
              MAIARIX AI
            </span>
          </div>

          {/* Top-right: LANDING PAGE */}
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '3px',
              fontWeight: 600,
            }}
          >
            LANDING PAGE
          </span>
        </div>

        {/* Business name — centered vertically around y=310 */}
        <div
          style={{
            position: 'absolute',
            top: 240,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize:
                displayName.length > 20 ? 56 :
                displayName.length > 16 ? 72 : 96,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.0,
              textAlign: 'center',
            }}
          >
            {displayName}
          </span>
        </div>

        {/* Left horizontal rule */}
        <div
          style={{
            position: 'absolute',
            top: 332,
            left: 80,
            width: 480,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
            display: 'flex',
          }}
        />

        {/* Orange dot */}
        <div
          style={{
            position: 'absolute',
            top: 324,
            left: 592,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#e8600a',
            display: 'flex',
          }}
        />

        {/* Right horizontal rule */}
        <div
          style={{
            position: 'absolute',
            top: 332,
            left: 640,
            width: 480,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
            display: 'flex',
          }}
        />

        {/* Sub-info centered below rules */}
        <div
          style={{
            position: 'absolute',
            top: 358,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
            }}
          >
            {[
              city,
              viewCount > 0 ? `${viewCount.toLocaleString('id-ID')} views` : '',
              agentName ? `Agen: ${agentName}` : '',
            ].filter(Boolean).join(' · ')}
          </span>
        </div>

        {/* WA badge centered */}
        {hasWa && (
          <div
            style={{
              position: 'absolute',
              top: 415,
              left: 490,
              width: 220,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'white',
              }}
            >
              Hubungi WA
            </span>
          </div>
        )}

        {/* Bottom rule */}
        <div
          style={{
            position: 'absolute',
            top: 574,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />

        {/* Bottom center text */}
        <div
          style={{
            position: 'absolute',
            top: 592,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.18)',
            }}
          >
            lp.mrix.ai · Properti Terbaik di Indonesia
          </span>
        </div>

        {/* Orange accent line — bottom 3px */}
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
