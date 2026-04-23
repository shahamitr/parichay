'use client';

import { MicrositeData } from '@/types/microsite';

interface TemplateProps {
  data: MicrositeData;
  children: React.ReactNode;
}

export default function ModernBusinessTemplate({ data, children }: TemplateProps) {
  const { brand } = data;
  const theme = brand.colorTheme as any;

  return (
    <div className="modern-business-template">
      <style dangerouslySetInnerHTML={{ __html: `
        .modern-business-template {
          --primary: ${theme?.primary || '#2563EB'};
          --secondary: ${theme?.secondary || '#1E40AF'};
          --accent: ${theme?.accent || '#3B82F6'};
        }
        .modern-business-template .section-container {
          padding: 4rem 1rem;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        }
        .modern-business-template .card-style {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.1);
          transition: all 0.3s ease;
        }
        .modern-business-template .card-style:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }
        .modern-business-template .btn-primary {
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }
        .modern-business-template .btn-primary:hover {
          background: var(--secondary);
          transform: translateY(-1px);
        }
        .modern-business-template .floating-elements::before {
          content: '';
          position: absolute;
          top: 20%;
          right: 10%;
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, var(--primary), var(--accent));
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}} />
      <div className="floating-elements relative">
        {children}
      </div>
    </div>
  );
}