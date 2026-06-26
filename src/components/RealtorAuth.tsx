import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Building2, Smartphone, FileText, CheckCircle2 } from 'lucide-react';
import { Realtor } from '../types';

interface RealtorAuthProps {
  onAuthSuccess: (realtor: Realtor) => void;
}

export default function RealtorAuth({ onAuthSuccess }: RealtorAuthProps) {
  const [formData, setFormData] = useState({
    name: '홍길동',
    officeName: '한샘 공인중개사사무소',
    registrationNumber: '11680-2024-00124',
    address: '서울특별시 강남구 역삼동 735-15 1층',
    phone: '010-1234-5678',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 국토교통부 중개업자 조회 인증 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onAuthSuccess({
          id: 'realtor-1',
          name: formData.name,
          officeName: formData.officeName,
          registrationNumber: formData.registrationNumber,
          address: formData.address,
          phone: formData.phone,
          isVerified: true
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden" id="realtor-auth-container">
      <div className="p-8 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative">
        <div className="absolute right-6 top-6 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          보안 검증
        </div>
        <h2 className="text-2xl font-bold font-sans tracking-tight mb-2">공인중개사 전용 인증</h2>
        <p className="text-blue-100 text-sm leading-relaxed">
          가입 완료 및 국토교통부 중개업 개설등록정보가 검증된 공인중개사만 전체 매물 상세 내역과 계약서 작성 기능을 열람할 수 있습니다.
        </p>
      </div>

      <div className="p-8">
        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border-4 border-emerald-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">중개업 조회 및 검증 완료</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              개설등록정보 검증에 성공하였습니다.<br />
              {formData.officeName} 대시보드로 이동합니다.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-600" /> 공인중개사 성명
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                placeholder="공인중개사 성명을 입력하세요."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> 중개사무소 명칭
              </label>
              <input
                type="text"
                required
                value={formData.officeName}
                onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                placeholder="중개사사무소 이름을 입력하세요."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> 중개업 개설등록번호
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm font-mono transition-all"
                placeholder="예: 11680-2024-00124"
              />
              <p className="text-[11px] text-slate-400 mt-1">부동산 중개업 등록증의 개설등록번호를 입력해주세요.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" /> 중개사 휴대폰 번호
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                placeholder="예: 010-0000-0000"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-sm transition-all ${
                isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  국토교통부 중개업자 정보 검증 중...
                </span>
              ) : (
                '인증 신청 및 가입'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
