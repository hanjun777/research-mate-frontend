"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle2, Microscope, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReportPreviewDemo() {
    return (
        <div className="relative w-full max-w-4xl mx-auto" style={{ perspective: '1000px' }}>
            {/* Background Decor */}
            <div className="absolute inset-0 bg-blue-100/50 rounded-3xl blur-3xl -z-10 transform scale-110" />

            {/* Main Document Container - Tilted Effect */}
            <motion.div
                className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                initial={{ rotateX: 2 }}
                whileHover={{ rotateX: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {/* Header / Toolbar */}
                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="text-xs text-slate-400 font-medium ml-2">Final_Report_Preview.pdf</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 gap-1 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </Badge>
                    </div>
                </div>

                {/* Document Content */}
                <div className="p-8 md:p-12 min-h-[600px] font-serif text-slate-800 relative bg-white overflow-hidden">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Report Header */}
                        <div className="text-center border-b pb-6 mb-8">
                            <div className="flex justify-center mb-4">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600">경제·수학 융합 탐구</Badge>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 leading-tight">
                                금융공학에서의 수열 응용:<br />
                                주식 가격 예측을 위한 피보나치 수열과 기하급수 모델 분석
                            </h1>
                            <p className="text-slate-500 italic text-[10px] md:text-xs">Advanced Subject Exploration Report</p>
                            <div className="flex justify-center gap-4 mt-6 text-xs text-slate-600 font-sans font-medium">
                                <span>2학년 김수학</span>
                                <span className="text-slate-300">|</span>
                                <span>관련 교과: 경제, 수학 I</span>
                            </div>
                        </div>

                        {/* Report Sections */}
                        <div className="space-y-6 text-xs md:text-sm leading-relaxed text-justify text-slate-700">
                            <section>
                                <h2 className="text-base md:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6">1. 연구의 배경과 목적</h2>
                                <p>
                                    금융 시장에서 주식 가격 예측은 투자 의사결정의 핵심 요소로 작용하며, 수학적 모델을 활용한 분석 방법이 지속적으로 연구되고 있습니다. 본 연구는 고등학교 수학 교과에서 배운 <strong>수열(특히 피보나치 수열)</strong>과 <strong>지수함수(기하급수 모델의 기초)</strong> 개념을 금융공학 분야로 확장 적용하여, 이론의 실용적 가치를 탐구하는 것을 목표로 합니다.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-base md:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6">2. 피보나치 수열과 금융 기술적 분석의 이론적 기초</h2>
                                <p>
                                    피보나치 수열은 각 항이 앞의 두 항의 합으로 정의되는 수열로, 인접한 항의 비율이 <strong>황금비(Φ ≈ 1.618)</strong>에 수렴하는 성질을 가집니다. 금융공학에서는 이 수열에서 파생된 피보나치 비율(예: 23.6%, 38.2%, 50%, 61.8%)이 주식 차트 분석에 활용됩니다.
                                </p>
                                <p className="mt-3">
                                    이러한 비율들은 <strong>피보나치 되돌림(Fibonacci Retracement)</strong> 기법에서 지지선과 저항선을 설정하는 기준으로 사용되며, 가격 변동의 잠재적 반전 지점을 예측하는 데 적용됩니다. 이는 시장 참여자들의 심리적 반응이 일정한 수학적 패턴을 보일 수 있다는 기술적 분석 가정에 기반을 두고 있습니다.
                                </p>
                            </section>

                            <div className="flex justify-center my-8 text-slate-300">
                                <span className="tracking-widest">. . . (일부 내용 생략) . . .</span>
                            </div>

                            <section>
                                <h2 className="text-base md:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6">3. 기하급수 모델의 수학적 구조와 금융 적용 원리</h2>
                                <p className="mb-4">
                                    기하급수 모델은 시간에 따른 지수적 성장을 설명하는 수학적 모델로, 주식 가격 예측에서는 다음과 같은 형태로 표현됩니다.
                                </p>
                                <div className="my-4 text-center font-serif italic text-slate-800 bg-slate-50 border border-slate-100 py-5 rounded-md text-lg shadow-sm">
                                    <span>P(t) = P<sub className="text-sm">0</sub> e<sup className="text-sm">rt</sup></span>
                                </div>
                                <p className="leading-relaxed">
                                    여기서 <strong>P₀</strong>는 초기 가격, <strong>r</strong>은 연속 복리 성장률, <strong>t</strong>는 시간을 나타내며, <strong>e</strong>는 자연로그의 밑입니다. 이 모델은 고등학교 미적분에서 배운 <strong>지수함수와 미분 개념</strong>을 기반으로 하며, 주식 가격이 일정한 성장률로 지수적으로 증가한다는 가정을 포함합니다.
                                </p>
                            </section>
                            
                            <section>
                                <h2 className="text-base md:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6">4. 기하급수 모델의 매개변수 추정과 예측 과정</h2>
                                <p className="leading-relaxed mb-4">
                                    성장률 <strong>r</strong>을 추정하기 위해 <strong>최소제곱법</strong>이 적용됩니다. 먼저 모델을 선형화하기 위해 양변에 자연로그를 취하여 <strong>ln P(t) = ln P₀ + rt</strong> 형태로 변환합니다. 이는 <strong>y = a + bt</strong> 로 설정할 때 선형 회귀 모델로 표현될 수 있습니다. 
                                </p>
                                <div className="my-4 flex justify-center font-serif italic text-slate-800 bg-slate-50 border border-slate-100 py-4 rounded-md text-lg shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span>b =</span>
                                        <div className="flex flex-col items-center">
                                            <span className="border-b border-slate-800 px-2 pb-1 text-base">n Σ(t<sub className="text-xs">i</sub>y<sub className="text-xs">i</sub>) - (Σt<sub className="text-xs">i</sub>)(Σy<sub className="text-xs">i</sub>)</span>
                                            <span className="pt-1 text-base">n Σ(t<sub className="text-xs">i</sub>)<sup className="text-xs">2</sup> - (Σt<sub className="text-xs">i</sub>)<sup className="text-xs">2</sup></span>
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    과거 주식 가격 데이터를 수집한 후, 시간에 대한 수학적 절차로 기울기 <strong>b</strong>와 절편 <strong>a</strong>를 추정합니다. 이 방법은 고등학교 확률과 통계 교육에서 배운 <strong>회귀 분석</strong> 개념을 금융 데이터에 적용한 탁월한 사례로, 선형대수학적 이론의 실용적 활용을 보여줍니다.
                                </p>
                            </section>
                            
                            <div className="flex justify-center my-8 text-slate-300">
                                <span className="tracking-widest">. . . (결론 생략) . . .</span>
                            </div>
                            
                            <section>
                                <h2 className="text-base md:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6">7. 생활기록부용 활동 요약</h2>
                                <p>
                                    금융공학에서 수열 이론의 적용 방법을 체계적으로 분석함. 피보나치 수열이 주식 차트의 지지/저항선 설정에 활용되는 원리를 이해하고, 기하급수 모델이 가격 성장률 예측에 적용되는 구조를 탐구함. 고등학교 수준의 수학 지식을 금융 분야로 성공적으로 확장하였으며, 수리적 모델링의 실용적 가치와 그 한계를 비판적으로 평가하는 탁월한 STEM 역량을 보여줌.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
