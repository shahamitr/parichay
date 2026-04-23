import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseColor, type = 'complementary' } = body;

    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!baseColor || !hexRegex.test(baseColor)) {
      return NextResponse.json(
        { success: false, error: 'Valid hex color is required (e.g., #FF5733)' },
        { status: 400 }
      );
    }

    // Convert hex to HSL for color manipulation
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    // Convert HSL to hex
    const hslToHex = (h: number, s: number, l: number) => {
      h /= 360; s /= 100; l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
      else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
      else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
      else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
      else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
      else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const [h, s, l] = hexToHsl(baseColor);
    let palette: string[] = [baseColor];

    // Generate palette based on type
    switch (type) {
      case 'complementary':
        palette = [
          baseColor,
          hslToHex((h + 180) % 360, s, l),
          hslToHex(h, s, Math.max(10, l - 20)),
          hslToHex(h, s, Math.min(90, l + 20)),
          hslToHex((h + 180) % 360, s, Math.max(10, l - 20))
        ];
        break;

      case 'triadic':
        palette = [
          baseColor,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex(h, s, Math.max(10, l - 30)),
          hslToHex(h, s, Math.min(90, l + 30))
        ];
        break;

      case 'analogous':
        palette = [
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 15 + 360) % 360, s, l),
          baseColor,
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l)
        ];
        break;

      case 'monochromatic':
        palette = [
          hslToHex(h, s, Math.max(10, l - 40)),
          hslToHex(h, s, Math.max(10, l - 20)),
          baseColor,
          hslToHex(h, s, Math.min(90, l + 20)),
          hslToHex(h, s, Math.min(90, l + 40))
        ];
        break;

      default:
        palette = [baseColor];
    }

    return NextResponse.json({
      success: true,
      palette,
      baseColor,
      type,
      metadata: {
        hsl: [Math.round(h), Math.round(s), Math.round(l)],
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} color palette based on ${baseColor}`
      }
    });
  } catch (error) {
    console.error('Failed to generate color palette:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate color palette' },
      { status: 500 }
    );
  }
}