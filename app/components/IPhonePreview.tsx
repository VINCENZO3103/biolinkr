"use client";

import { ReactNode } from "react";

type IPhonePreviewProps = {
  children: ReactNode;
};

export default function IPhonePreview({ children }: IPhonePreviewProps) {
  return (
    <div className="relative mx-auto w-[348px] select-none">
      {/* Pulsanti laterali sinistri */}
      <span className="absolute -left-[4px] top-[118px] h-[28px] w-[4px] rounded-l-md bg-gradient-to-b from-[#4a4a50] via-[#202126] to-[#55565c] shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />
      <span className="absolute -left-[4px] top-[158px] h-[52px] w-[4px] rounded-l-md bg-gradient-to-b from-[#4a4a50] via-[#202126] to-[#55565c] shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />
      <span className="absolute -left-[4px] top-[224px] h-[52px] w-[4px] rounded-l-md bg-gradient-to-b from-[#4a4a50] via-[#202126] to-[#55565c] shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />

      {/* Pulsante laterale destro */}
      <span className="absolute -right-[4px] top-[168px] h-[78px] w-[4px] rounded-r-md bg-gradient-to-b from-[#4a4a50] via-[#202126] to-[#55565c] shadow-[0_1px_2px_rgba(0,0,0,0.65)]" />

      {/* Telaio esterno */}
      <div className="rounded-[56px] bg-gradient-to-br from-[#63646b] via-[#222329] to-[#73747a] p-[4px] shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
        {/* Bordo metallico interno */}
        <div className="rounded-[53px] bg-gradient-to-br from-[#16171c] via-[#4e4f56] to-[#101116] p-[5px]">
          {/* Corpo nero */}
          <div className="rounded-[49px] bg-[#050506] p-[8px]">
            {/* Schermo */}
            <div className="relative h-[718px] overflow-hidden rounded-[42px] bg-[#0c0d12]">
              {/* Dynamic Island */}
              <div className="pointer-events-none absolute left-1/2 top-[11px] z-30 h-[31px] w-[112px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
                <span className="absolute right-[13px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-[#101a2f] ring-1 ring-white/[0.08]" />
              </div>

              {/* Preview senza scroll e senza scrollbar, anche nei figli */}
              <div className="h-full overflow-hidden overscroll-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden">
                {children}
              </div>

              {/* Barra Home */}
              <div className="pointer-events-none absolute bottom-[9px] left-1/2 z-30 h-[5px] w-[122px] -translate-x-1/2 rounded-full bg-white/85 shadow-[0_1px_5px_rgba(0,0,0,0.45)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}