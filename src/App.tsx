import React, { useState, useEffect } from 'react';
import { 
  Building2, PlusCircle, Search, ClipboardList, ShieldCheck, 
  User, RefreshCw, Key, LogOut, CheckCircle2, FileText, ArrowRight
} from 'lucide-react';
import { Property, Realtor, Contract } from './types';
import { INITIAL_PROPERTIES } from './data/mockData';
import RealtorAuth from './components/RealtorAuth';
import PropertyRegister from './components/PropertyRegister';
import PropertyDetail from './components/PropertyDetail';
import ContractGenerator from './components/ContractGenerator';

export default function App() {
  // 모드 상태: 공인중개사 모드 vs 일반인 모드
  const [isRealtorMode, setIsRealtorMode] = useState<boolean>(true);
  
  // 공인중개사 가입 및 인증 상태
  const [realtor, setRealtor] = useState<Realtor | null>(() => {
    const saved = localStorage.getItem('realtor_session');
    return saved ? JSON.parse(saved) : null;
  });

  // 매물 데이터 상태
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('realtor_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  // 계약 내역 상태
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('realtor_contracts');
    return saved ? JSON.parse(saved) : [];
  });

  // 탭 상태: 'browse' | 'register' | 'contracts'
  const [activeTab, setActiveTab] = useState<'browse' | 'register' | 'contracts'>('browse');

  // 현재 활성화된 계약서 작성 매물 (null이면 대시보드 표출)
  const [contractTargetProperty, setContractTargetProperty] = useState<Property | null>(null);

  // 로컬 스토리지 보존 동기화
  useEffect(() => {
    localStorage.setItem('realtor_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('realtor_contracts', JSON.stringify(contracts));
  }, [contracts]);

  const handleAuthSuccess = (newRealtor: Realtor) => {
    setRealtor(newRealtor);
    localStorage.setItem('realtor_session', JSON.stringify(newRealtor));
  };

  const handleLogout = () => {
    setRealtor(null);
    localStorage.removeItem('realtor_session');
    setActiveTab('browse');
    setContractTargetProperty(null);
  };

  const handleNewPropertyRegister = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    setActiveTab('browse'); // 등록 성공 후 목록 탭으로 귀환
  };

  const handleContractComplete = (newContract: Contract) => {
    setContracts([newContract, ...contracts]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="realtor-link-app">
      
      {/* 1. 글로벌 헤더 (중개사 <-> 일반인 즉각 변경 토글 포함) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight font-sans">
                중개Link <span className="text-blue-400 text-xs font-bold font-mono">v1.2</span>
              </h1>
              <p className="text-[10px] text-slate-400">공인중개사 원스톱 매물 규제 조회 & 계약 솔루션</p>
            </div>
          </div>

          {/* 역할 전환 스위치 (이 시스템의 핵심!) */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
            <button
              onClick={() => {
                setIsRealtorMode(false);
                setContractTargetProperty(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isRealtorMode
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              일반인 모드
            </button>
            <button
              onClick={() => setIsRealtorMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isRealtorMode
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              공인중개사 모드
            </button>
          </div>

          {/* 중개사 로그인 유저 정보 및 로그아웃 */}
          {isRealtorMode && realtor && (
            <div className="flex items-center gap-3 text-xs bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-bold">{realtor.officeName}</span>
              <span className="text-slate-500">|</span>
              <span className="text-blue-400 font-mono text-[11px]">{realtor.name} 중개사</span>
              <button 
                onClick={handleLogout} 
                className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors"
                title="인증 로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. 주메뉴 탭 네비게이션 (가입 완료된 중개사만 전체 탭 활성화) */}
      <nav className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6">
            <button
              onClick={() => {
                setActiveTab('browse');
                setContractTargetProperty(null);
              }}
              className={`py-4 px-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'browse' && !contractTargetProperty
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              매물 둘러보기
            </button>

            {/* 중개사 탭: 매물 등록 및 계약 관리 (가입된 상태에서만 완전 동작) */}
            {isRealtorMode && (
              <>
                <button
                  onClick={() => {
                    if (!realtor) {
                      alert('매물을 등록하려면 먼저 공인중개사 가입 및 인증을 완료해주세요.');
                      return;
                    }
                    setActiveTab('register');
                    setContractTargetProperty(null);
                  }}
                  className={`py-4 px-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'register'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  신규 매물 등록
                </button>
                <button
                  onClick={() => {
                    if (!realtor) {
                      alert('체결된 계약을 조회하려면 공인중개사 인증이 필요합니다.');
                      return;
                    }
                    setActiveTab('contracts');
                    setContractTargetProperty(null);
                  }}
                  className={`py-4 px-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'contracts'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  체결된 계약 보관함 ({contracts.length}건)
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 3. 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 만약 중개사 모드인데 아직 가입/인증하지 않은 경우, 인증화면 우선 표출 */}
        {isRealtorMode && !realtor ? (
          <RealtorAuth onAuthSuccess={handleAuthSuccess} />
        ) : contractTargetProperty ? (
          /* 특정 매물 '계약하기' 클릭 시 바로 계약서 자동 매핑 생성 화면으로 진입 */
          <ContractGenerator
            property={contractTargetProperty}
            realtor={realtor!}
            onBack={() => setContractTargetProperty(null)}
            onContractSave={handleContractComplete}
          />
        ) : (
          /* 일반 탭 컴포넌트 렌더링 */
          <>
            {activeTab === 'browse' && (
              <PropertyDetail
                properties={properties}
                isRealtorMode={isRealtorMode}
                realtor={realtor}
                onStartContract={(prop) => setContractTargetProperty(prop)}
              />
            )}

            {activeTab === 'register' && (
              <PropertyRegister
                onRegisterSuccess={handleNewPropertyRegister}
              />
            )}

            {activeTab === 'contracts' && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto" id="contract-archive">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" /> 공인중개사 계약 보관함
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    소속 중개사무소({realtor?.officeName})를 통해 정식 체결되어 국토부 중개이력에 등록된 계약 목록입니다.
                  </p>
                </div>

                {contracts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-12 h-12 stroke-[1.2] mx-auto mb-3" />
                    <p className="text-sm font-semibold">체결 완료된 계약이 아직 없습니다.</p>
                    <p className="text-xs text-slate-400 mt-1">매물 둘러보기에서 매물을 선택한 후 계약서 작성을 시작하세요.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contracts.map((cnt) => (
                      <div key={cnt.id} className="p-5 border border-slate-150 rounded-xl bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              {cnt.status}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono">ID: {cnt.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">{cnt.propertyName}</h4>
                          <p className="text-xs text-slate-500">
                            당사자: <span className="font-semibold">{cnt.sellerName}</span>(매도) ⇄ <span className="font-semibold">{cnt.buyerName}</span>(매수)
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">계약체결일: {cnt.contractDate}</p>
                        </div>
                        <div className="text-right space-y-1.5 shrink-0">
                          <p className="text-xs text-slate-400">계약보증금</p>
                          <p className="text-sm font-black text-indigo-700">금 {cnt.depositAmount.toLocaleString()} 만원</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. 푸터 */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs">
            © 2026 중개Link (RealtorLink). All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            본 웹 어플리케이션은 중개업무 효율화를 위한 프로토타입 시뮬레이터입니다. 국토교통부 행정 전산망 조회 및 자동 계약 기입 기능은 공공데이터 연동 시뮬레이션 엔진을 통해 작동하며, 실제 법적 계약 효력의 최종 검증은 자격을 갖춘 개설공인중개사 본인에게 있습니다.
          </p>
        </div>
      </footer>

    </div>
  );
}
