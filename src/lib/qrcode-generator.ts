/**
 * QR Code Generation Utility
 * Handles QR code generation in multiple formats with brand customization
 */

import QRCode from 'qrcode';

export interface QRCodeOptions {
  url: string;
  format: 'png' | 'svg' | 'dataurl';
  brandColors?: {
    primary: string;
    secondary?: string;
  };
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeResult {
  data: string; // Base64 or SVG string
  format: string;
  url: string;
}

/**
 * Generate QR code in specified format
 */
export async function generateQRCode(
  options: QRCodeOptions
): Promise<QRCodeResult> {
  const {
    url,
    format,
    brandColors,
    size = 512,
    errorCorrectionLevel = 'M',
  } = options;

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel,
    type: 'image/png',
    width: size,
    margin: 2,
    color: {
      dark: brandColors?.primary || '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    let qrData: string;

    switch (format) {
      case 'png':
        // Generate as data URL (base64)
        qrData = await QRCode.toDataURL(url, qrOptions);
        break;

      case 'svg':
        // Generate as SVG string
        qrData = await QRCode.toString(url, {
          type: 'svg',
          errorCorrectionLevel,
          width: size,
          margin: 2,
          color: {
            dark: brandColors?.primary || '#000000',
            light: '#FFFFFF',
          },
        });
        break;

      case 'dataurl':
      default:
        // Generate as data URL for storage
        qrData = await QRCode.toDataURL(url, qrOptions);
        break;
    }

    return {
      data: qrData,
      format: format.toUpperCase(),
      url,
    };
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code buffer for PDF generation
 */
export async function generateQRCodeBuffer(
  url: string,
  options?: Partial<QRCodeOptions>
): Promise<Buffer> {
  const qrOptions: QRCode.QRCodeToBufferOptions = {
    errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
    type: 'png',
    width: options?.size || 512,
    margin: 2,
    color: {
      dark: options?.brandColors?.primary || '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    return await QRCode.toBuffer(url, qrOptions);
  } catch (error) {
    console.error('QR Code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Validate URL for QR code generation
 */
export function validateQRCodeUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
