"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const HIGH_QUALITY_TOPICS = [
  {
    title: "[의학 × 미적분]\n종양 성장의 수학적 모델링 및 항암 치료 효과 예측",
    desc: "Gompertz 수리 생물학 모델의 미분방정식을 구축하여 종양의 성장 곡선을 그리고 약물 투여 시점과 효율을 분석합니다.",
  },
  {
    title: "[경제 × 확률과 통계]\n몬테카를로 시뮬레이션을 활용한 리스크 헷징 기법 분석",
    desc: "난수 발생과 대수의 법칙을 기반으로 다양한 시장 시나리오를 시뮬레이션하고 파생상품의 합리적 가격을 결정합니다.",
  },
  {
    title: "[컴퓨터공학 × 기하]\n3D 그래픽스 렌더링에 활용되는 쿼터니언 회전 변환 분석",
    desc: "기존 오일러 각의 한계(짐벌락)를 극복하기 위해 도입된 사원수 체계의 기하학적 의미와 행렬 연산 연관성을 탐구합니다.",
  },
  {
    title: "[건축공학 × 삼각함수]\n주기 함수를 이용한 초고층 건축물의 내진 특성 및 구조 해석",
    desc: "지진파의 진동 주기를 푸리에 급수로 분해하여 구조물의 고유 진동수와 공진 현상을 수학적으로 제어하는 모델을 설계합니다.",
  },
  {
    title: "[생명과학 × 미적분]\n미카엘리스-멘텐 방정식의 유도와 효소 반응 저해제 분석",
    desc: "기질 농도에 따른 효소 반응 초기 속도를 역수 그래프(Lineweaver-Burk)로 변환해 선형 회귀 분석으로 촉매 효율을 측정합니다.",
  },
  {
    title: "[경영/마케팅 × 수열/행렬]\n마코프 체인을 활용한 소비자 브랜드 전환 시장 점유율 예측",
    desc: "소비자의 현재 상태와 전이 확률 행렬을 조합하여 시간 경과에 따른 궁극적인 브랜드 점유율 수렴값을 확률적으로 추정합니다.",
  },
  {
    title: "[미디어/통신 × 수1/기하]\n푸리에 변환의 수학적 원리와 JPEG 이미지 압축 기술 효율성",
    desc: "복잡한 화상 데이터를 단순한 삼각함수들의 합으로 근사하는 직교 변환 원리를 통해 데이터 손실 압축 메커니즘을 증명합니다.",
  },
  {
    title: "[보건/행정 × 수학(하)/수2]\nSIR 전염병 모델의 수치적 해법과 백신 접종률에 따른 집단 면역",
    desc: "감수성자(S), 감염자(I), 회복자(R) 간의 상호작용을 연립 미분방정식으로 표현하고 기초 재생산 지수(R0)를 산출합니다.",
  },
  {
    title: "[심리학 × 확률과 통계]\n베이즈 정리를 활용한 의사결정 편향성 분석과 프로파일링",
    desc: "조건부 확률을 통해 사전 확률이 새로운 증거에 의해 사후 확률로 갱신되는 과정을 추적하여 인간의 인지적 오류를 분석합니다.",
  },
  {
    title: "[기계공학 × 다항함수 미분]\n공기역학적 항력을 최소화하기 위한 비행체 날개의 유선형 최적화",
    desc: "접선의 기울기를 이용해 유체 저항 계수를 도출하는 목적함수를 설정하고, 극솟값을 구하는 미분 최적화 기법을 적용합니다.",
  }
];

export function TopicGeneratorDemo() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % HIGH_QUALITY_TOPICS.length);
                setIsFading(false);
            }, 400); // 짧은 페이드 아웃 타임
        }, 3500); // 3.5초마다 변경

        return () => clearInterval(timer);
    }, []);

    const topic = HIGH_QUALITY_TOPICS[currentIndex];

    return (
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-8 space-y-5">
                <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-3">
                    <img src="/logo.png" alt="세특연구소 로고" className="w-5 h-5 object-contain" />
                    <span>TOPICS</span>
                </div>
                
                <div className={`space-y-4 transition-opacity duration-500 min-h-[140px] ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className="text-lg md:text-[20px] font-bold text-slate-900 leading-snug whitespace-pre-wrap">
                        {topic.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed break-keep">
                        {topic.desc}
                    </p>
                </div>
                
                <div className="pt-4">
                    <div className="flex justify-center flex-wrap gap-2 pt-2">
                        {HIGH_QUALITY_TOPICS.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
