import React from 'react';

interface OrnateFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'purple' | 'cream' | 'pink_arcade';
  title?: string;
  subtitle?: string;
}

export default function OrnateFrame({ children, className = '', variant = 'purple', title, subtitle }: OrnateFrameProps) {
  // Styles mirroring 'Bistrot de Ville' layout
  const baseBg = variant === 'purple' 
    ? 'bg-gradient-to-b from-[#3a202d] via-[#1a0f15] to-[#2d1923] text-[#FAEDD9] border-4 border-[#B7A795]'
    : variant === 'cream'
    ? 'bg-[#F5E3C9] text-[#212519] border-4 border-[#6F654F]' 
    : 'bg-gradient-to-b from-[#fcd7d9] to-[#ffffff] text-[#452635] border-4 border-[#E1999C]';

  const goldColor = variant === 'cream' ? 'border-[#6F654F]' : 'border-[#B7A795]';

  return (
    <div className={`relative p-6 md:p-8 rounded-sm shadow-2xl transition-all ${baseBg} ${className}`}>
      {/* Corner Ornaments */}
      <div className={`absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 ${goldColor} opacity-70`}></div>
      <div className={`absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 ${goldColor} opacity-70`}></div>
      <div className={`absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 ${goldColor} opacity-70`}></div>
      <div className={`absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 ${goldColor} opacity-70`}></div>

      {/* Internal double-thin border */}
      <div className={`absolute inset-1.5 border border-dashed ${goldColor} opacity-30 pointer-events-none`}></div>

      {/* Headers inside the frame */}
      {title && (
        <div className="text-center mb-6 pt-2 select-none">
          <div className="flex justify-center items-center gap-2 mb-1">
            <span className={`h-[1px] w-8 ${variant === 'cream' ? 'bg-[#6F654F]' : 'bg-[#B7A795]'}`}></span>
            <span className={`text-[10px] font-mono tracking-widest uppercase ${variant === 'cream' ? 'text-[#6F654F]' : 'text-[#B7A795]'}`}>
              {subtitle || 'BISTROT DE VILLE'}
            </span>
            <span className={`h-[1px] w-8 ${variant === 'cream' ? 'bg-[#6F654F]' : 'bg-[#B7A795]'}`}></span>
          </div>
          <h4 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase" style={{ wordSpacing: '4px' }}>
            {title}
          </h4>
          <div className="flex justify-center items-center gap-1.5 mt-2">
            <span className="text-xs">❦</span>
            <span className={`w-12 h-[1px] ${variant === 'cream' ? 'bg-[#6F654F]' : 'bg-[#B7A795]'} opacity-50`}></span>
            <span className="text-xs">❦</span>
          </div>
        </div>
      )}

      {/* Dynamic Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
