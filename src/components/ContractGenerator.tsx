import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ClipboardCheck, ArrowLeft, Printer, Send, 
  Signature, CheckCircle2, Calculator, ShieldAlert, Award, Building
} from 'lucide-react';
import { Property, Realtor, Contract } from '../types';

interface ContractGeneratorProps {
  property: Property;
  realtor: Realtor;
  onBack: () => void;
  onContractSave: (contract: Contract) => void;
}

export default function ContractGenerator({ 
  property, 
  realtor, 
  onBack, 
  onContractSave 
}: ContractGeneratorProps) {
  
  // 거래 유형에 따른 디폴트 금액 세팅 (매매가, 보증금 등)
  const basePrice = property.transactionType === '매매' ? property.price : (property.deposit || 0);
  
  // 계약 당사자 상태
  const [seller, setSeller] = useState({ name: '임장수', phone: '010-8888-9999', address: '서울특별시 서초구 반포동 12-3' });
  const [buyer, setBuyer] = useState({ name: '김매수', phone: '010-5555-4444', address: '서울특별시 마포구 합정동 144-15' });
  
  // 금액 정보 상태 (만원 기준)
  const [totalPrice, setTotalPrice] = useState<number>(basePrice);
  const [deposit, setDeposit] = useState<number>(Math.floor(basePrice * 0.1)); // 10% 계약금
  const [interim, setInterim] = useState<number>(Math.floor(basePrice * 0.4)); // 40% 중도금
  const [balance, setBalance] = useState<number>(Math.floor(basePrice * 0.5)); // 50% 잔금
  const [monthlyRent, setMonthlyRent] = useState<number>(property.monthlyRent || 0);

  // 계약 날짜
  const [contractDate, setContractDate] = useState(new Date().toISOString().split('T')[0]);

  // 서명 및 완료 상태
  const [activeTab, setActiveTab] = useState<'explanation' | 'contract'>('explanation');
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoiceAlert, setShowInvoiceAlert] = useState(false);

  // 금액 변경 시 자동 밸런싱 계산 헬퍼
  const handlePriceChange = (val: number) => {
    setTotalPrice(val);
    const dep = Math.floor(val * 0.1);
    const int = Math.floor(val * 0.4);
    const bal = val - dep - int;
    setDeposit(dep);
    setInterim(int);
    setBalance(bal);
  };

  const handleContractSubmit = () => {
    if (!seller.name || !buyer.name) {
      alert('매도인(임대인)과 매수인(임차인) 정보를 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSigned(true);
      
      const newContract: Contract = {
        id: `cnt-${Date.now()}`,
        propertyId: property.id,
        propertyName: property.title,
        realtorId: realtor.id,
        buyerName: buyer.name,
        buyerPhone: buyer.phone,
        buyerAddress: buyer.address,
        sellerName: seller.name,
        sellerPhone: seller.phone,
        sellerAddress: seller.address,
        contractDate,
        depositAmount: deposit,
        interimAmount: interim,
        balanceAmount: balance,
        monthlyAmount: monthlyRent || undefined,
        status: '체결완료'
      };

      onContractSave(newContract);
    }, 2000);
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto my-4" id="contract-builder">
      
      {/* 상단 네비게이션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> 매물 상세로 돌아가기
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'explanation'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" /> 중개대상물 확인설명서
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'contract'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> 부동산 표준 계약서
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={printDocument}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> 인쇄 (PDF 저장)
          </button>
          {!isSigned && (
            <button
              onClick={handleContractSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  공인인증서 전자서명 및 조율 중...
                </>
              ) : (
                <>
                  <Signature className="w-4 h-4" /> 계약 체결 및 전자서명
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 왼쪽 폼 컨트롤 (4칸): 금액 조정 및 당사자 정보 기입 */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {isSigned ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-md font-bold text-emerald-950 mb-1">계약 체결 완료!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                공인중개사 {realtor.name}님의 공인 전자서명 검증이 완료되었으며, 거래 계약이 안전하게 시스템에 등록되었습니다. 확인설명서와 계약서 전문을 인쇄하실 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 space-y-6">
              
              {/* 거래 금액 정밀 계산기 */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-blue-600" /> 계약 금액 조율 및 자동 분할
                </h4>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">
                      총 {property.transactionType === '매매' ? '거래가' : '보증금'} (만원)
                    </label>
                    <input
                      type="number"
                      value={totalPrice}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">계약금(10%)</label>
                      <input
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">중도금(40%)</label>
                      <input
                        type="number"
                        value={interim}
                        onChange={(e) => setInterim(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">잔금(50%)</label>
                      <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {property.transactionType === '월세' && (
                    <div>
                      <label className="block text-slate-500 mb-1">차임 / 월세금 (만원)</label>
                      <input
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 매도인(임대인) 정보 */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  매도인 (임대인) 정보
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="성명"
                      value={seller.name}
                      onChange={(e) => setSeller({ ...seller, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="연락처"
                      value={seller.phone}
                      onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="주소"
                      value={seller.address}
                      onChange={(e) => setSeller({ ...seller, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 매수인(임차인) 정보 */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  매수인 (임차인) 정보
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="성명"
                      value={buyer.name}
                      onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="연락처"
                      value={buyer.phone}
                      onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="주소"
                      value={buyer.address}
                      onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 계약서 체결 가이드 */}
              <div className="bg-amber-50 p-3 rounded-lg text-[11px] text-amber-700 leading-normal flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  가입 완료된 공인중개사 계정으로 작성 시, <b>공공데이터망에서 연동한 부동산 규제 정보</b>가 하단 확인설명서에 자동 맵핑되어 기재됩니다. 실제 서명 전 내용의 검증을 최종 확인하십시오.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* 오른쪽 법적 양식 실시간 바인딩 뷰어 (8칸) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200 font-sans text-slate-800 leading-relaxed text-xs relative overflow-x-auto min-w-[320px]">
          
          {/* 워터마크 또는 검증필 도장 인쇄 효과 */}
          {isSigned && (
            <div className="absolute top-10 right-10 border-4 border-emerald-600 text-emerald-600 font-black px-4 py-2 rounded-lg rotate-12 text-sm z-30 tracking-widest uppercase bg-white/95">
              중개Link 검증필
            </div>
          )}

          {/* 탭 1: 중개대상물 확인설명서 */}
          {activeTab === 'explanation' && (
            <div className="space-y-4 max-w-[800px] mx-auto">
              
              <div className="text-center mb-6">
                <h1 className="text-xl font-black border-double border-4 border-slate-800 py-3.5 inline-block px-12 uppercase tracking-widest bg-slate-50">
                  중개대상물 확인ㆍ설명서 [Ⅰ]
                </h1>
                <p className="text-[10px] text-slate-400 mt-2 text-right">개인 주거용 및 비주거용 건축물 자동대장연동형</p>
              </div>

              {/* 1. 대상 물건의 표시 */}
              <div className="space-y-1">
                <h3 className="font-bold text-[13px] bg-slate-100 px-3 py-1 text-slate-900 border-l-4 border-blue-900">
                  1. 대상 물건의 표시 (공공데이터망 자동 조회)
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <tbody>
                    <tr>
                      <td className="w-1/5 bg-slate-50 p-2 font-bold border border-slate-300 text-center">소재지</td>
                      <td className="w-2/5 p-2 border border-slate-300 font-semibold">{property.fullAddress}</td>
                      <td className="w-1/5 bg-slate-50 p-2 font-bold border border-slate-300 text-center">도로명주소</td>
                      <td className="w-2/5 p-2 border border-slate-300">{property.roadAddress}</td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">대지면적</td>
                      <td className="p-2 border border-slate-300 font-mono">{property.area} ㎡</td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">용도지역</td>
                      <td className="p-2 border border-slate-300 text-indigo-800 font-bold">{property.zoning}</td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">주용도</td>
                      <td className="p-2 border border-slate-300">{property.purpose}</td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">구조 / 규모</td>
                      <td className="p-2 border border-slate-300">{property.structure} / {property.floors}</td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">사용승인일</td>
                      <td className="p-2 border border-slate-300 font-mono">{property.completionYear}</td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">공시지가 (㎡당)</td>
                      <td className="p-2 border border-slate-300 font-mono">{property.officialPrice.toLocaleString()} 원</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. 권리관계 */}
              <div className="space-y-1 mt-4">
                <h3 className="font-bold text-[13px] bg-slate-100 px-3 py-1 text-slate-900 border-l-4 border-blue-900">
                  2. 토지이용계획, 공법상 이용제한 및 거래규제에 관한 사항
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <tbody>
                    <tr>
                      <td className="w-1/4 bg-slate-50 p-2.5 font-bold border border-slate-300 text-center">용도지역 / 지구 / 구역</td>
                      <td className="p-2.5 border border-slate-300">
                        <span className="font-bold block text-indigo-700">{property.zoning}</span>
                        <span className="text-slate-600 block mt-0.5 text-[10px]">{property.district}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2.5 font-bold border border-slate-300 text-center">도시계획 시설 및 조례 제한</td>
                      <td className="p-2.5 border border-slate-300">
                        지구단위계획구역 조례에 따른 건축규제, 용적률 및 건폐율 상한은 각 자치구청 조례에 따름.
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2.5 font-bold border border-slate-300 text-center">공공행위 제한 (토지이용법 고시)</td>
                      <td className="p-2.5 border border-slate-300 space-y-1">
                        {property.regulations.map((reg, idx) => (
                          <div key={idx} className="flex gap-1 items-start text-slate-600 text-[10px]">
                            <span className="text-red-500">•</span>
                            <span>{reg}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3. 중개수수료 및 실비 */}
              <div className="space-y-1 mt-4">
                <h3 className="font-bold text-[13px] bg-slate-100 px-3 py-1 text-slate-900 border-l-4 border-blue-900">
                  3. 중개대상물 확인ㆍ설명 사항 및 인적 사항
                </h3>
                <p className="text-[10px] text-slate-500 my-1">
                  위 토지이용계획 및 행위제한에 관한 사항은 국토교통부 행정전산망 API(v1/land/usage) 실시간 조회 본을 기반으로 작성되었습니다.
                </p>
                
                <div className="grid grid-cols-3 gap-4 border border-slate-300 p-4 bg-slate-50">
                  <div>
                    <p className="font-bold text-[11px] mb-1.5 text-slate-500 uppercase border-b pb-1">매도인 (임대인)</p>
                    <p className="font-bold text-slate-800">{seller.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{seller.phone}</p>
                    {isSigned && <p className="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1">✓ 무인날인 서명필</p>}
                  </div>
                  <div>
                    <p className="font-bold text-[11px] mb-1.5 text-slate-500 uppercase border-b pb-1">매수인 (임차인)</p>
                    <p className="font-bold text-slate-800">{buyer.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{buyer.phone}</p>
                    {isSigned && <p className="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1">✓ 무인날인 서명필</p>}
                  </div>
                  <div>
                    <p className="font-bold text-[11px] mb-1.5 text-slate-500 uppercase border-b pb-1">개설공인중개사</p>
                    <p className="font-bold text-slate-800">{realtor.officeName}</p>
                    <p className="text-[10px] text-slate-400 mt-1">대표: {realtor.name}</p>
                    {isSigned && <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">✓ 대표 공인날인 완료</p>}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 탭 2: 부동산 표준 계약서 */}
          {activeTab === 'contract' && (
            <div className="space-y-4 max-w-[800px] mx-auto">
              
              <div className="text-center mb-6">
                <h1 className="text-xl font-black border-4 border-double border-slate-800 py-3.5 inline-block px-12 uppercase tracking-widest bg-slate-50">
                  부동산 {property.transactionType} 표준 계약서
                </h1>
                <p className="text-[10px] text-slate-400 mt-2 text-right">대한민국 국토교통부 표준 권고 서식 준수</p>
              </div>

              {/* 계약목적물 규정 */}
              <p className="text-[11px] font-medium leading-relaxed">
                매도인(임대인)과 매수인(임차인) 쌍방은 아래 표시 중개대상물에 관하여 합의에 의거하여 다음과 같이 {property.transactionType} 계약을 체결한다.
              </p>

              {/* 제 1조 [부동산의 표시] */}
              <div className="space-y-1">
                <h3 className="font-bold text-[12px] bg-slate-100 px-3 py-1 text-slate-900">
                  제 1 조 [부동산의 표시] - 공공데이터 자동 대장 매핑
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <tbody>
                    <tr>
                      <td className="w-1/5 bg-slate-50 p-2 font-bold border border-slate-300 text-center">소재지</td>
                      <td className="w-4/5 p-2 border border-slate-300 font-semibold" colSpan={3}>
                        {property.fullAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">지목 / 용도</td>
                      <td className="p-2 border border-slate-300">대 / {property.purpose}</td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">면 적</td>
                      <td className="p-2 border border-slate-300 font-mono">대지 {property.area} ㎡ / 연면적 {property.floorArea} ㎡</td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">도로명주소</td>
                      <td className="p-2 border border-slate-300" colSpan={3}>{property.roadAddress}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 제 2조 [계약 내용 및 대금 지급안] */}
              <div className="space-y-1 mt-4">
                <h3 className="font-bold text-[12px] bg-slate-100 px-3 py-1 text-slate-900">
                  제 2 조 [계약금액 및 대금 지급 지침]
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <tbody>
                    <tr>
                      <td className="w-1/4 bg-slate-50 p-2 font-bold border border-slate-300 text-center">
                        총 {property.transactionType === '매매' ? '매매대금' : '임대보증금'}
                      </td>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900 font-mono text-[12px]" colSpan={3}>
                        금 {totalPrice.toLocaleString()} 만원 정
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">계 약 금</td>
                      <td className="p-2 border border-slate-300 font-mono" colSpan={3}>
                        금 {deposit.toLocaleString()} 만원 정 (계약 체결 시 지불 및 수령함)
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">중 도 금</td>
                      <td className="p-2 border border-slate-300 font-mono">
                        금 {interim.toLocaleString()} 만원 정
                      </td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">지급 기한</td>
                      <td className="p-2 border border-slate-300 font-mono">{contractDate}</td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">잔   금</td>
                      <td className="p-2 border border-slate-300 font-mono">
                        금 {balance.toLocaleString()} 만원 정
                      </td>
                      <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">지급 기한</td>
                      <td className="p-2 border border-slate-300 font-mono">{contractDate} (인도일 동시이행)</td>
                    </tr>
                    {property.transactionType === '월세' && (
                      <tr>
                        <td className="bg-slate-50 p-2 font-bold border border-slate-300 text-center">월세(차임)</td>
                        <td className="p-2 border border-slate-300 font-bold text-blue-900 font-mono" colSpan={3}>
                          금 {monthlyRent.toLocaleString()} 만원 정 (매월 지정일에 후불/선불 지급)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 거래 당사자 법적 인적 서명 */}
              <div className="space-y-1 mt-6">
                <h3 className="font-bold text-[12px] bg-slate-100 px-3 py-1 text-slate-900">
                  본 계약의 효력 발생 및 거래 당사자 서명
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 p-4 mt-2">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-500 border-b pb-1">매도인 (임대인)</p>
                    <p className="font-semibold text-slate-800">성명: {seller.name}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">주소: {seller.address}</p>
                    <p className="text-[10px] text-slate-500">연락처: {seller.phone}</p>
                    <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">인(서명)란:</span>
                      {isSigned ? (
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold text-[10px] border border-blue-200">✓ 서명완료</span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">[서명 대기]</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-slate-500 border-b pb-1">매수인 (임차인)</p>
                    <p className="font-semibold text-slate-800">성명: {buyer.name}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">주소: {buyer.address}</p>
                    <p className="text-[10px] text-slate-500">연락처: {buyer.phone}</p>
                    <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">인(서명)란:</span>
                      {isSigned ? (
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold text-[10px] border border-blue-200">✓ 서명완료</span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">[서명 대기]</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-slate-500 border-b pb-1">개설 공인중개사 (중개업자)</p>
                    <p className="font-semibold text-slate-800">명칭: {realtor.officeName}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">사무소 주소: {realtor.address}</p>
                    <p className="text-[10px] text-slate-500">개설등록번호: {realtor.registrationNumber}</p>
                    <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">직인란:</span>
                      {isSigned ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">✓ 공인인증필</span>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">[서명 대기]</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
