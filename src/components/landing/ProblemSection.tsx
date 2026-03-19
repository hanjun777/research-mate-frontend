"use client";

import React from 'react';
import { AlertCircle, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  {
    title: "주제 선정의 늪",
    description: "무엇을 탐구해야 할지 몰라 하얀 화면만 바라보며 소중한 시간만 흐르고 있나요? 나만의 차별화된 주제 찾기가 가장 어렵습니다.",
    icon: <SearchIcon className="w-8 h-8 text-amber-500" />,
    tag: "시간 낭비 0%"
  },
  {
    title: "깊이 없는 나열식 생기부",
    description: "단순한 활동 나열만으로는 명문대 합격이 어렵습니다. 교과 성취기준과 연계된 '심화 탐구'만이 합격의 열쇠입니다.",
    icon: <BookOpen className="w-8 h-8 text-red-500" />,
    tag: "실속 가득한 합격 생기부"
  },
  {
    title: "시험 공부와의 전쟁",
    description: "탐구보고서 작성에 며칠을 쏟느라 정작 중요한 시험 공부를 놓치고 계시진 않으신가요?",
    icon: <Clock className="w-8 h-8 text-orange-500" />,
    tag: "전략적 시간 분배"
  }
];

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ProblemSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-600 text-sm font-bold tracking-widest mb-4 uppercase flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            THE REAL PROBLEM
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            혹시 이런 <span className="text-red-500">막막함</span>을<br />느끼고 계신가요?
          </motion.h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            90% 이상의 학생과 학모부님이 입시 준비 과정에서<br className="hidden md:block" />
            똑같은 고민으로 밤을 지새웁니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
            >
              <div className="mb-8 p-6 bg-slate-50 rounded-3xl group-hover:scale-110 transition-transform duration-300">
                {problem.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">{problem.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {problem.description}
              </p>
              <div className="mt-auto pt-4 text-red-500 font-bold text-sm">
                {problem.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
