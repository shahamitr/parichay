'use client';

import { MicrositeData } from '@/types/microsite';

interface TemplateProps {
  data: MicrositeData;
  children: React.ReactNode;
}

export default function MinimalElegantTemplate({ data, children }: TemplateProps) {
  const { brand } = data;
  const theme = brand.colorTheme as any;

  return (
    <div className="minimal-elegant-template">
      <style dangerouslySetInnerHTML={{ __html: `
        .minimal-elegant-template {
          --primary: ${theme?.primary || '#059669'};
          --secondary: ${theme?.secondary || '#047857'};
          --accent: ${theme?.accent || '#10B981'};
          background: #fafafa;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .minimal-elegant-template .zen-section {
          padding: 6rem 2rem;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        .minimal-elegant-template .zen-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 60px;
          background: linear-gradient(to bottom, var(--primary), transparent);
        }
        .minimal-elegant-template .clean-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 2px;
          padding: 2rem;
          margin: 2rem 0;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .minimal-elegant-template .clean-card:hover {
          border-color: var(--primary);
          box-shadow: 0 0 0 1px var(--primary);
        }
        .minimal-elegant-template .typography-focus h1,
        .minimal-elegant-template .typography-focus h2,
        .minimal-elegant-template .typography-focus h3 {
          font-weight: 300;
          letter-spacing: -0.025em;
          line-height: 1.2;
          color: #1f2937;
        }
        .minimal-elegant-template .subtle-animation {
          animation: subtle-fade-in 1s ease-out;
        }
        .minimal-elegant-template .geometric-separator {
          width: 40px;
          height: 2px;
          background: var(--primary);
          margin: 3rem auto;
          position: relative;
        }
        .minimal-elegant-template .geometric-separator::before,
        .minimal-elegant-template .geometric-separator::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          top: -3px;
        }
        .minimal-elegant-template .geometric-separator::before {
          left: -12px;
        }
        .minimal-elegant-template .geometric-separator::after {
          right: -12px;
        }
        @keyframes subtle-fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
      <div className="typography-focus">
        {children}
      </div>
    </div>
  );
}