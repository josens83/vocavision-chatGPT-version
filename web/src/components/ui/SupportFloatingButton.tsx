"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SupportFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href="/chat"
      className={`fixed right-4 bottom-24 md:right-6 md:bottom-28 z-40 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      aria-label="고객센터 및 챗봇으로 이동"
    >
      <div className="relative flex items-center gap-3 px-4 py-3 bg-white shadow-xl rounded-2xl border border-brand-primary/30">
        <div className="relative">
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01m-8 4h5m-7 8l1.664-3.328A7 7 0 015 9a7 7 0 1113.304 2.695"
              />
            </svg>
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">고객센터 & FAQ</div>
          <div className="text-xs text-slate-500">실시간 응답 배지 확인</div>
        </div>
        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          실시간 응답
        </span>
      </div>
    </Link>
  );
}
