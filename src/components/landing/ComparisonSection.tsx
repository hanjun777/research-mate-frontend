"use client";

import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const comparisonData = [
  {
    label: "보고서 당 비용",
    traditional: "3~50만원",
    us: "커피 한 잔 값 (합리적 요금)",
  },
  {
    label: "소요 시간",
    traditional: "최소 3일 이상",
    us: "10분 내외",
  },
  {
    label: "보고서 작성",
    traditional: "직접 작성",
    us: "고품질 보고서 초안 제공",
  },
  {
    label: "24시간 이용",
    traditional: false,
    us: true,
  },
];

export function ComparisonSection() {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 text-sm font-bold tracking-widest mb-3 uppercase"
          >
            Efficiency
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            기존 컨설팅 <span className="text-slate-400 font-light mx-1">vs</span> <span className="text-blue-600">세특연구소</span>
          </motion.h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            막막한 심화 탐구 보고서, 더 똑똑하고 효율적인 선택을 하세요.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50">
              <div className="p-6"></div>
              <div className="p-6 text-center text-slate-500 font-semibold">기존 컨설팅</div>
              <div className="p-6 text-center font-bold text-blue-600 bg-blue-50/50">
                세특연구소
              </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-slate-100">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 transition-colors hover:bg-slate-50/30">
                  <div className="p-5 md:p-6 flex items-center text-sm md:text-base font-bold text-slate-700 bg-slate-50/30">
                    {row.label}
                  </div>
                  <div className="p-5 md:p-6 flex items-center justify-center text-center text-sm md:text-base text-slate-400 font-medium border-l border-slate-100">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? <Check className="w-5 h-5 text-blue-400" /> : <X className="w-5 h-5 text-slate-300" />
                    ) : (
                      row.traditional
                    )}
                  </div>
                  <div className="p-5 md:p-6 flex items-center justify-center text-center text-sm md:text-base font-bold text-blue-600 bg-blue-50/30 border-l border-blue-100/50">
                    {typeof row.us === 'boolean' ? (
                      row.us ? <Check className="w-6 h-6 text-blue-600" /> : <X className="w-6 h-6 text-red-500" />
                    ) : (
                      row.us
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            * 일반적인 1:1 컨설팅 업체와 당사 AI 서비스를 비교한 결과입니다.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
