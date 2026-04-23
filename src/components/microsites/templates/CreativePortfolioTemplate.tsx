'use client';

import { MicrositeData } from '@/types/microsite';

interface TemplateProps {
  data: MicrositeData;
  children: React.ReactNode;
}

export default function CreativePortfolioTemplate({ data, children }: TemplateProps) {
  const { brand } = data;
  const theme = brand.colorTheme as any;

  return (
    <div className="creative-portfolio-template">
      <style dangerouslySetInnerHTML={{ __html: `
        .creative-portfolio-template {
          --primary: ${theme?.primary || '#7C3AED'};
          --secondary: ${theme?.secondary || '#5B21B6'};
          --accent: ${theme?.accent || '#8B5CF6'};
          background: linear-gradient(45deg, #1a1a2e, #16213e, #0f3460);
          min-height: 100vh;
        }
        .creative-portfolio-template .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .creative-portfolio-template .neon-glow {
          box-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary), 0 0 60px var(--primary);
          animation: neon-pulse 2s ease-in-out infinite alternate;
        }
        .creative-portfolio-template .creative-overlay {
          position: relative;
          z-index: 1;
        }
        .creative-portfolio-template .creative-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin: 2rem 0;
          padding: 2rem;
        }
        .creative-portfolio-template .creative-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        .creative-portfolio-template .creative-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
        }
        .creative-portfolio-template .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(45deg, #1a1a2e, #16213e, #0f3460, #7C3AED);
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        @keyframes neon-pulse {
          0% { box-shadow: 0 0 20px var(--primary); }
          100% { box-shadow: 0 0 30px var(--primary), 0 0 40px var(--primary); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
      <div className="animated-bg"></div>
      <div className="creative-overlay">
        {children}
      </div>
    </div>
  );
}