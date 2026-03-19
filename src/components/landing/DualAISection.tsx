"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ShieldCheck, RefreshCw, Bot, ChevronRight } from 'lucide-react';

export function DualAISection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 text-sm font-bold tracking-widest mb-4 uppercase"
          >
            Technical Core
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            단순한 생성이 아닌,<br />두 AI의 <span className="text-blue-600 italic">상호 피드백 협업</span>
          </motion.h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            세특연구소는 하나의 AI가 글을 쓰고 끝내는 방식이 아닙니다.<br className="hidden md:block" />
            작성형 AI와 검수형 AI가 <span className="text-slate-900 font-bold">실시간으로 정보를 주고받으며</span> 최고의 고품질 보고서를 완성합니다.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Background Decorative Line (Loop) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Writer AI */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50/50 p-8 rounded-[3rem] border border-blue-100 relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <PenTool className="text-white w-7 h-7" />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-3">작성형 AI (Writer)</h3>
                <p className="text-blue-700/70 text-sm leading-relaxed">
                  학생의 학생부 정보를 분석하여<br />
                  교과 성취기준에 최적화된<br />
                  심화 탐구 보고서 초안을 작성합니다.
                </p>
              </div>
            </motion.div>

            {/* Loop Animation (Desktop Only) */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center"
              >
                <RefreshCw className="text-blue-400 w-8 h-8" />
              </motion.div>
              <div className="text-blue-600 font-bold text-sm animate-pulse">
                실시간 무한 루프 검수
              </div>
              <ChevronRight className="text-blue-200 w-12 h-12" />
            </div>

            {/* Reviewer AI */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-50/50 p-8 rounded-[3rem] border border-emerald-100 relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">검역형 AI (Reviewer)</h3>
                <p className="text-emerald-700/70 text-sm leading-relaxed">
                  작성된 초안의 학술적 논리성,<br />
                  데이터 정확성, 가독성을 정밀 평가하여<br />
                  부족한 부분을 다시 쓰도록 지시합니다.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bot className="text-blue-400 w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">왜 듀얼 AI인가요?</h4>
              <p className="text-slate-400 leading-relaxed">
                단일 모델 방식은 할루시네이션(환각)이나 논리적 비약이 발생할 확률이 높습니다. 세특연구소는 <span className="text-blue-400 font-bold">두 모델의 상호 검증</span>을 통해, 유료 컨설팅 수준의 압도적인 학술적 완성도를 보장합니다.
              </p>
            </div>
            <div className="flex-shrink-0 bg-blue-600 px-6 py-3 rounded-2xl font-bold text-sm">
              완성도 200% 보장
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
