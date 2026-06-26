import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Loader2, Database, AlertCircle, Save, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Property } from '../types';
import { simulatePublicData } from '../data/mockData';

interface PropertyRegisterProps {
  onRegisterSuccess: (newProperty: Property) => void;
}

export default function PropertyRegister({ onRegisterSuccess }: PropertyRegisterProps) {
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [transactionType, setTransactionType] = useState<'매매' | '전세' | '월세'>('매매');
  const [price, setPrice] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [description, setDescription] = useState('');

  // 공공데이터 연동 상태
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [apiData, setApiData] = useState<any>(null);

  // 등록 완료 상태
  const [isSaved, setIsSaved] = useState(false);

  const handleFetchPublicData = () => {
    if (!fullAddress.trim()) {
      alert('공공데이터 조회를 위해 전체 주소지를 입력해주세요.');
      return;
    }

    setIsFetching(true);
    setHasFetched(false);

    // 공공데이터(토지이용계획정보서비스, 건축물대장) API 동기화 시뮬레이션
    setTimeout(() => {
      const data = simulatePublicData(fullAddress);
      setApiData(data);
      setIsFetching(false);
      setHasFetched(true);
    }, 1800);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFetched || !apiData) {
      alert('먼저 주소를 입력하고 공공데이터 조회를 완료해주세요.');
      return;
    }

    // 마스킹 지번 주소 생성
    // 서울시 마포구 정릉동 123-45 -> 서울시 마포구 정릉동 **번지
    const generateMaskedAddress = (addr: string) => {
      const parts = addr.trim().split(' ');
      const lastPart = parts[parts.length - 1];
      if (lastPart && (lastPart.match(/\d/) || lastPart.includes('-'))) {
        parts[parts.length - 1] = '**번지';
      } else {
        parts.push('**번지');
      }
      return parts.join(' ');
    };

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: title || `${fullAddress.split(' ').slice(1, 3).join(' ')} ${transactionType} 매물`,
      fullAddress,
      maskedAddress: generateMaskedAddress(fullAddress),
      roadAddress: apiData.roadAddress,
      area: apiData.area,
      buildingArea: apiData.buildingArea,
      floorArea: apiData.floorArea,
      purpose: apiData.purpose,
      structure: apiData.structure,
      floors: apiData.floors,
      completionYear: apiData.completionYear,
      zoning: apiData.zoning,
      district: apiData.district,
      regulations: apiData.regulations,
      officialPrice: apiData.officialPrice,
      transactionType,
      price: transactionType === '매매' ? price : 0,
      deposit: transactionType !== '매매' ? deposit : undefined,
      monthlyRent: transactionType === '월세' ? monthlyRent : undefined,
      description,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      ],
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setIsSaved(true);
    setTimeout(() => {
      onRegisterSuccess(newProperty);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto my-6" id="property-register-section">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {isSaved ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-blue-100 mb-6"
            >
              <CheckCircle2 className="w-14 h-14" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">매물 등록 성공!</h2>
            <p className="text-slate-500 leading-relaxed max-w-sm mb-4">
              공공데이터(건축물대장/토지이용계획) 자동 조회가 매핑되어 매물이 안전하게 등록되었습니다.
            </p>
            <div className="text-xs bg-slate-50 px-4 py-2 rounded-lg text-slate-400 font-mono">
              [지번 마스킹 정책에 의해 일반인 조회 시에는 상세 번지가 자동 제한됩니다]
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* 왼쪽 등록 폼 (7칸) */}
            <form onSubmit={handleSaveProperty} className="lg:col-span-7 p-8 border-r border-slate-100 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">신규 매물 등록</h2>
                <p className="text-slate-400 text-xs mt-1">전체 주소를 입력하고 공공데이터 연동 버튼을 눌러주세요.</p>
              </div>

              {/* 매물 명칭 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">매물 명칭 (임의)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="예: 역삼동 리치타워 근생 상가"
                />
              </div>

              {/* 거래 형태 & 가격 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">거래 구분</label>
                  <select
                    value={transactionType}
                    onChange={(e: any) => setTransactionType(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="매매">매매</option>
                    <option value="전세">전세</option>
                    <option value="월세">월세</option>
                  </select>
                </div>

                {transactionType === '매매' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-2">매매가 (만원)</label>
                    <input
                      type="number"
                      required
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="예: 500000 (50억)"
                    />
                  </div>
                )}

                {transactionType === '전세' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-2">전세금 (만원)</label>
                    <input
                      type="number"
                      required
                      value={deposit || ''}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="예: 35000 (3억 5천)"
                    />
                  </div>
                )}

                {transactionType === '월세' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">보증금 (만원)</label>
                      <input
                        type="number"
                        required
                        value={deposit || ''}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="예: 5000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">월세 (만원)</label>
                      <input
                        type="number"
                        required
                        value={monthlyRent || ''}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="예: 250"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* 핵심: 전체 주소지 입력란 */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <label className="block text-xs font-bold text-blue-900 mb-2">소재지 전체 주소 (지번 필히 포함)</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={fullAddress}
                      onChange={(e) => {
                        setFullAddress(e.target.value);
                        setHasFetched(false); // 주소 수정 시 공공데이터 조회 리셋
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="예: 서울특별시 마포구 서교동 365-12"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchPublicData}
                    disabled={isFetching || !fullAddress}
                    className={`px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isFetching 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10'
                    }`}
                  >
                    {isFetching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                    공공데이터 연동
                  </button>
                </div>
                <p className="text-[11px] text-blue-700 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> 
                  지번을 포함한 정확한 전체 주소를 입력하셔야 규제 및 용도 분석이 정상 처리됩니다.
                </p>
              </div>

              {/* 매물 설명 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">중개 대상물 추가 설명</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="공공데이터 외에 매수/임차인에게 홍보할 내부 상태, 인테리어 등을 적어주세요."
                />
              </div>

              {/* 제출 및 등록 */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!hasFetched}
                  className={`px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    hasFetched
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/15 active:scale-[0.98]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  중개사 대시보드에 매물 등록
                </button>
              </div>
            </form>

            {/* 오른쪽 실시간 공공데이터 모니터링 시뮬레이션 (5칸) */}
            <div className="lg:col-span-5 bg-slate-50/50 p-8 flex flex-col">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600" /> 공공포털 원격조회 결과
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">건축물대장, 토지이용계획정보서비스, 공시지가 API 실시간 결과</p>
              </div>

              {isFetching ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-xs font-semibold text-slate-600">공공데이터 행정망 연결 중...</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">REST API GET /v1/building/ledger</span>
                </div>
              ) : hasFetched && apiData ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 flex-1 text-slate-700 text-xs leading-relaxed"
                >
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-start gap-2 mb-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-[11px]">토지이용계획 및 건축물대장 수신 완료</p>
                      <p className="text-[10px] opacity-80 font-mono">가져온 데이터는 확인설명서 & 계약서 자동 매핑에 보관됩니다.</p>
                    </div>
                  </div>

                  {/* 자동 조회된 정보 항목들 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">소재 도로명주소</span>
                      <span className="text-slate-800 font-medium">{apiData.roadAddress}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">대지면적</span>
                        <span className="text-slate-800 font-semibold">{apiData.area} ㎡</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">용도지역</span>
                        <span className="text-blue-700 font-bold">{apiData.zoning}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">주용도</span>
                        <span className="text-slate-800 font-medium">{apiData.purpose}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">구조</span>
                        <span className="text-slate-800">{apiData.structure}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">규모</span>
                        <span className="text-slate-800">{apiData.floors}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">사용승인일</span>
                        <span className="text-slate-800">{apiData.completionYear}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">공시지가</span>
                      <span className="text-slate-800 font-semibold">㎡당 {apiData.officialPrice.toLocaleString()} 원</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">토지이용 규제지구/구역</span>
                      <span className="text-amber-700 font-bold text-[11px] leading-snug">{apiData.district}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">행위 및 규제제한사항</span>
                      <ul className="space-y-1 pl-1">
                        {apiData.regulations.map((reg: string, idx: number) => (
                          <li key={idx} className="text-slate-500 text-[10px] flex items-start gap-1">
                            <span className="text-amber-500">•</span>
                            <span className="leading-normal">{reg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-10 h-10 stroke-[1.2] mb-3 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">주소 등록 후 대기 상태</p>
                  <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-normal">
                    전체 주소를 입력하시고, 공공데이터 조회 버튼을 누르면 건축정보, 규제사항, 공시지가가 자동으로 파싱됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
