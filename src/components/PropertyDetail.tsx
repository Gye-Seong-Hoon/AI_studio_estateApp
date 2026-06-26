import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, Ruler, FileText, Landmark, ShieldCheck, 
  User, Check, Phone, EyeOff, Calendar, DollarSign, PenTool, ClipboardCheck, ArrowRight
} from 'lucide-react';
import { Property, Realtor } from '../types';

interface PropertyDetailProps {
  properties: Property[];
  isRealtorMode: boolean;
  realtor: Realtor | null;
  onStartContract: (property: Property) => void;
}

export default function PropertyDetail({ 
  properties, 
  isRealtorMode, 
  realtor, 
  onStartContract 
}: PropertyDetailProps) {
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const selectedProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const formatPrice = (prop: Property) => {
    if (prop.transactionType === '매매') {
      const eoc = Math.floor(prop.price / 10000);
      const remaining = prop.price % 10000;
      if (eoc > 0) {
        return `${eoc}억 ${remaining > 0 ? remaining.toLocaleString() + '만' : ''}원`;
      }
      return `${prop.price.toLocaleString()}만원`;
    } else if (prop.transactionType === '전세') {
      const eoc = Math.floor((prop.deposit || 0) / 10000);
      const remaining = (prop.deposit || 0) % 10000;
      if (eoc > 0) {
        return `전세 ${eoc}억 ${remaining > 0 ? remaining.toLocaleString() + '만' : ''}원`;
      }
      return `전세 ${(prop.deposit || 0).toLocaleString()}만원`;
    } else {
      return `보증금 ${(prop.deposit || 0).toLocaleString()}만 / 월 ${prop.monthlyRent}만원`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6" id="property-detail-dashboard">
      
      {/* 매물 목록 사이드바 (5칸) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            실시간 등록 매물 ({properties.length}건)
          </h3>
          <p className="text-[11px] text-slate-500">
            {isRealtorMode ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 개설 공인중개사 전용 전체 주소 열람 모드
              </span>
            ) : (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" /> 일반인 공개 모드 (지번 생략 및 제한적 공개)
              </span>
            )}
          </p>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => setSelectedPropId(prop.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedProp?.id === prop.id
                  ? 'bg-blue-50/50 border-blue-500 shadow-md shadow-blue-500/5'
                  : 'bg-white border-slate-150 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  prop.transactionType === '매매' 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : prop.transactionType === '전세'
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {prop.transactionType}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{prop.registeredAt}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{prop.title}</h4>
              
              {/* 주소 마스킹 처리 */}
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-sans">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isRealtorMode ? prop.fullAddress : prop.maskedAddress}
              </p>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono">대지 {prop.area}㎡</span>
                <span className="text-sm font-extrabold text-blue-700">{formatPrice(prop)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 매물 상세 정보 메인 (8칸) */}
      <div className="lg:col-span-8">
        {selectedProp ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            
            {/* 상단 이미지 및 간략 소개 */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img 
                src={selectedProp.images[0]} 
                alt={selectedProp.title}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 px-2.5 py-1 rounded text-xs font-extrabold uppercase">
                    {selectedProp.transactionType}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">ID: {selectedProp.id}</span>
                </div>
                <h1 className="text-2xl font-bold font-sans tracking-tight leading-tight">{selectedProp.title}</h1>
                <p className="text-slate-200 text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="font-semibold">{isRealtorMode ? selectedProp.fullAddress : selectedProp.maskedAddress}</span>
                </p>
              </div>
            </div>

            {/* 본문 정보 */}
            <div className="p-6 space-y-6">
              
              {/* 공인중개사 특별 안내 배너 / 일반인 가이드 배너 */}
              {isRealtorMode ? (
                <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex justify-between items-center">
                  <div className="flex gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">공인중개사 인증 회원 상태</p>
                      <p className="text-[11px] text-emerald-700 leading-normal mt-0.5">
                        본 매물은 등록된 전체 지번 주소와 대장 규제 내역이 전수 검증되었습니다. 즉시 확인설명서와 계약서 작성을 진행할 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartContract(selectedProp)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ml-4 transition-all hover:shadow-md"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    계약서 작성하기
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex justify-between items-center">
                  <div className="flex gap-2.5">
                    <EyeOff className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-950">일반 고객 공개 모드</p>
                      <p className="text-[11px] text-amber-700 leading-normal mt-0.5">
                        공인중개사 회원 정보 보호 정책으로 인해 <b>세부 번지 정보와 확인설명서 작성 기능이 제한</b>됩니다. 이 매물의 상세 위치 및 계약 가능 여부는 전담 공인중개사에게 직접 문의해주십시오.
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${realtor?.phone || '010-1234-5678'}`}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ml-4 transition-all hover:shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    중개사 바로 문의
                  </a>
                </div>
              )}

              {/* 금액 요약 */}
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">중개 희망 거래 가격</span>
                <span className="text-2xl font-black text-blue-800">{formatPrice(selectedProp)}</span>
              </div>

              {/* 1. 건축물 및 토지 정보 (공공데이터) */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-slate-500" /> 건축물 및 토지 정보 (공공데이터 자동 수집)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">대지면적</span>
                    <span className="text-xs font-bold text-slate-800">{selectedProp.area} ㎡</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">건축면적</span>
                    <span className="text-xs font-bold text-slate-800">{selectedProp.buildingArea} ㎡</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">연면적</span>
                    <span className="text-xs font-bold text-slate-800">{selectedProp.floorArea} ㎡</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 block mb-0.5">도로명주소</span>
                    <span className="text-xs font-semibold text-slate-700 truncate block px-1" title={selectedProp.roadAddress}>
                      {selectedProp.roadAddress}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">건물주용도:</span>
                    <span className="text-slate-800 font-semibold">{selectedProp.purpose}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">건물구조:</span>
                    <span className="text-slate-800 font-semibold">{selectedProp.structure}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">규모:</span>
                    <span className="text-slate-800 font-semibold">{selectedProp.floors}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">사용승인일:</span>
                    <span className="text-slate-800 font-semibold">{selectedProp.completionYear}</span>
                  </div>
                </div>
              </div>

              {/* 2. 국토계획 및 이용 제한사항 */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-slate-500" /> 국토계획 및 행위제한 (공공데이터)
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">용도지역:</span>
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded">
                        {selectedProp.zoning}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">용도지구/구역:</span>
                      <span className="text-slate-800 font-medium bg-slate-100 px-2.5 py-1 rounded">
                        {selectedProp.district}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">공시지가 (㎡당):</span>
                      <span className="text-slate-800 font-mono font-bold">
                        {selectedProp.officialPrice.toLocaleString()} 원
                      </span>
                    </div>
                  </div>

                  {/* 규제 정보는 일반인의 경우 블러처리하거나 요약만 제공, 중개사는 전체 공개 */}
                  <div className="relative overflow-hidden rounded-xl border border-amber-100">
                    <div className="p-4 bg-amber-50/30">
                      <span className="text-[10px] text-amber-800 uppercase font-bold block mb-2">토지이용 규제 및 고시 제한사항</span>
                      
                      <ul className="space-y-1.5">
                        {selectedProp.regulations.slice(0, isRealtorMode ? undefined : 2).map((reg, idx) => (
                          <li key={idx} className="text-slate-600 text-xs flex items-start gap-1.5">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{reg}</span>
                          </li>
                        ))}
                        {!isRealtorMode && (
                          <li className="text-amber-600 text-xs font-semibold flex items-center gap-1 mt-1">
                            <EyeOff className="w-3.5 h-3.5" /> 외 3건의 군사/문화재 규제사항은 공인중개사 회원인증 후 조회 가능합니다.
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* 일반인 모드 시 규제 디테일 차단 효과 비주얼 */}
                    {!isRealtorMode && (
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent flex items-end justify-center pb-2 pointer-events-none">
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. 매물 부가 정보 및 사진 */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">중개 대상물 현장 설명</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                  {selectedProp.description}
                </p>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl shadow-xl border border-slate-100 text-center text-slate-400">
            <EyeOff className="w-12 h-12 stroke-[1.2] mx-auto mb-3" />
            <p className="text-sm font-semibold">등록된 매물이 존재하지 않거나 선택되지 않았습니다.</p>
          </div>
        )}
      </div>

    </div>
  );
}
