import { ImageResponse } from 'next/og';

export const alt = 'Neros Finance Application';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FFFFFF',
          color: '#0A0A0A',
          padding: '72px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 96,
            height: 8,
            background: '#0A0A0A',
            borderRadius: 4,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1.4,
            lineHeight: 1.05,
          }}
        >
          Neros Finance Application
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 30,
            lineHeight: 1.35,
            color: '#525252',
            maxWidth: 900,
          }}
        >
          Open-source car finance calculator by Nazeer — payment, balloon, and budget leftover.
        </div>
      </div>
    ),
    { ...size }
  );
}
