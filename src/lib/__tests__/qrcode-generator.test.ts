import {
  generateQRCode,
  generateQRCodeBuffer,
  validateQRCodeUrl,
  QRCodeOptions,
} from '../qrcode-generator';
import QRCode from 'qrcode';

// Mock QRCode library
jest.mock('qrcode');

describe('QR Code Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQRCode', () => {
    it('should generate QR code in PNG format', async () => {
      const mockDataUrl = 'data:image/png;base64,mockdata';
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockDataUrl);

      const options: QRCodeOptions = {
        url: 'https://example.com',
        format: 'png',
        size: 512,
      };

      const result = await generateQRCode(options);

      expect(result).toEqual({
        data: mockDataUrl,
        format: 'PNG',
        url: options.url,
      });
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        options.url,
        expect.objectContaining({
          width: 512,
          errorCorrectionLevel: 'M',
        })
      );
    });

    it('should generate QR code in SVG format', async () => {
      const mockSvg = '<svg>mock svg</svg>';
      (QRCode.toString as jest.Mock).mockResolvedValue(mockSvg);

      const options: QRCodeOptions = {
        url: 'https://example.com',
        format: 'svg',
        size: 256,
      };

      const result = await generateQRCode(options);

      expect(result).toEqual({
        data: mockSvg,
        format: 'SVG',
        url: options.url,
      });
      expect(QRCode.toString).toHaveBeenCalledWith(
        options.url,
        expect.objectContaining({
          type: 'svg',
          width: 256,
        })
      );
    });

    it('should apply brand colors to QR code', async () => {
      const mockDataUrl = 'data:image/png;base64,mockdata';
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockDataUrl);

      const options: QRCodeOptions = {
        url: 'https://example.com',
        format: 'png',
        brandColors: {
          primary: '#FF0000',
          secondary: '#00FF00',
        },
      };

      await generateQRCode(options);

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        options.url,
        expect.objectContaining({
          color: {
            dark: '#FF0000',
            light: '#FFFFFF',
          },
        })
      );
    });

    it('should use default values when options are not provided', async () => {
      const mockDataUrl = 'data:image/png;base64,mockdata';
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockDataUrl);

      const options: QRCodeOptions = {
        url: 'https://example.com',
        format: 'dataurl',
      };

      await generateQRCode(options);

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        options.url,
        expect.objectContaining({
          width: 512,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
      );
    });

    it('should handle QR code generation errors', async () => {
      (QRCode.toDataURL as jest.Mock).mockRejectedValue(
        new Error('QR generation failed')
      );
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const options: QRCodeOptions = {
        url: 'https://example.com',
        format: 'png',
      };

      await expect(generateQRCode(options)).rejects.toThrow(
        'Failed to generate QR code'
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should support different error correction levels', async () => {
      const mockDataUrl = 'data:image/png;base64,mockdata';
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockDataUrl);

      const errorLevels: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H'];

      for (const level of errorLevels) {
        const options: QRCodeOptions = {
          url: 'https://example.com',
          format: 'png',
          errorCorrectionLevel: level,
        };

        await generateQRCode(options);

        expect(QRCode.toDataURL).toHaveBeenCalledWith(
          options.url,
          expect.objectContaining({
            errorCorrectionLevel: level,
          })
        );
      }
    });
  });

  describe('generateQRCodeBuffer', () => {
    it('should generate QR code buffer', async () => {
      const mockBuffer = Buffer.from('mock buffer');
      (QRCode.toBuffer as jest.Mock).mockResolvedValue(mockBuffer);

      const url = 'https://example.com';
      const result = await generateQRCodeBuffer(url);

      expect(result).toBe(mockBuffer);
      expect(QRCode.toBuffer).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          type: 'png',
          width: 512,
        })
      );
    });

    it('should apply custom options to buffer generation', async () => {
      const mockBuffer = Buffer.from('mock buffer');
      (QRCode.toBuffer as jest.Mock).mockResolvedValue(mockBuffer);

      const url = 'https://example.com';
      const options = {
        size: 1024,
        errorCorrectionLevel: 'H' as const,
        brandColors: {
          primary: '#0000FF',
        },
      };

      await generateQRCodeBuffer(url, options);

      expect(QRCode.toBuffer).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          width: 1024,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#0000FF',
            light: '#FFFFFF',
          },
        })
      );
    });

    it('should handle buffer generation errors', async () => {
      (QRCode.toBuffer as jest.Mock).mockRejectedValue(
        new Error('Buffer generation failed')
      );
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        generateQRCodeBuffer('https://example.com')
      ).rejects.toThrow('Failed to generate QR code buffer');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('validateQRCodeUrl', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://example.com/path',
        'https://example.com/path?query=value',
        'https://subdomain.example.com',
      ];

      validUrls.forEach((url) => {
        expect(validateQRCodeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'example.com',
        '',
      ];

      invalidUrls.forEach((url) => {
        expect(validateQRCodeUrl(url)).toBe(false);
      });
    });
  });
});
