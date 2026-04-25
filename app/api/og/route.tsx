import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';

  let businessName = 'Halaman Properti';
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

      const [projectRes, ] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/projects?published_slug=eq.${encodeURIComponent(slug)}&select=business_name,city,view_count,hero_image_url,whatsapp_number,user_id&limit=1`,
          { headers }
        ),
      ]);

      const projects = await projectRes.json();
      const project = projects?.[0];

      if (project) {
        businessName = project.business_name || businessName;
        city = project.city || '';
        viewCount = project.view_count || 0;
        hasWa = !!project.whatsapp_number;
        heroImageUrl = project.hero_image_url || null;

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

  // Truncate business name
  const displayName = businessName.length > 24
    ? businessName.slice(0, 22) + '…'
    : businessName;

  const hasPhoto = !!heroImageUrl;

  const response = new ImageResponse(
    hasPhoto
      ? /* WITH PHOTO — full bleed + gradient overlay */
        (
          <div
            style={{
              width: 1200,
              height: 630,
              display: 'flex',
              flexDirection: 'column',
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

            {/* Top gradient — for logo readability */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 140,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                display: 'flex',
              }}
            />

            {/* Bottom gradient — for text readability */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 320,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                display: 'flex',
              }}
            />

            {/* Top left: Maiarix brand */}
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
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  backgroundColor: '#e8600a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                M
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: 2,
                  fontWeight: 600,
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
                gap: 0,
              }}
            >
              {/* Business name */}
              <div
                style={{
                  fontSize: displayName.length > 18 ? 56 : 68,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.05,
                  marginBottom: 10,
                }}
              >
                {displayName}
              </div>

              {/* City + views + agent row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  {city && (
                    <span
                      style={{
                        fontSize: 20,
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {city}
                    </span>
                  )}
                  {city && viewCount > 0 && (
                    <span
                      style={{
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.3)',
                        margin: '0 4px',
                      }}
                    >
                      ·
                    </span>
                  )}
                  {viewCount > 0 && (
                    <span
                      style={{
                        fontSize: 20,
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {viewCount.toLocaleString('id-ID')} views
                    </span>
                  )}
                  {agentName && (
                    <span
                      style={{
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.4)',
                        marginLeft: 12,
                      }}
                    >
                      Agen: {agentName}
                    </span>
                  )}
                </div>

                {/* WA badge right */}
                {hasWa && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
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
                      💬 Hubungi WA
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom orange accent line */}
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
          </div>
        )

      : /* NO PHOTO — dark branded card */
        (
          <div
            style={{
              width: 1200,
              height: 630,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0a0a0a',
              position: 'relative',
            }}
          >
            {/* Left orange bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 5,
                height: 630,
                backgroundColor: '#e8600a',
                display: 'flex',
              }}
            />

            {/* Subtle background tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(232,96,10,0.03)',
                display: 'flex',
              }}
            />

            {/* Large faint house icon — center */}
            <div
              style={{
                position: 'absolute',
                top: 100,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                fontSize: 220,
                opacity: 0.05,
              }}
            >
              🏠
            </div>

            {/* Top: Maiarix brand */}
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
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  backgroundColor: '#e8600a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                M
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: 2,
                  fontWeight: 600,
                }}
              >
                Landing Page by Maiarix AI
              </span>
            </div>

            {/* Horizontal divider */}
            <div
              style={{
                position: 'absolute',
                top: 420,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
                display: 'flex',
              }}
            />

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
                gap: 0,
              }}
            >
              {/* Business name */}
              <div
                style={{
                  fontSize: displayName.length > 18 ? 56 : 68,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.05,
                  marginBottom: 10,
                }}
              >
                {displayName}
              </div>

              {/* City + views + agent + WA row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  {city && (
                    <span
                      style={{
                        fontSize: 20,
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {city}
                    </span>
                  )}
                  {city && viewCount > 0 && (
                    <span
                      style={{
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.2)',
                        margin: '0 4px',
                      }}
                    >
                      ·
                    </span>
                  )}
                  {viewCount > 0 && (
                    <span
                      style={{
                        fontSize: 20,
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {viewCount.toLocaleString('id-ID')} views
                    </span>
                  )}
                  {agentName && (
                    <span
                      style={{
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.3)',
                        marginLeft: 12,
                      }}
                    >
                      Agen: {agentName}
                    </span>
                  )}
                </div>

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
                      💬 Hubungi WA
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom orange accent */}
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
