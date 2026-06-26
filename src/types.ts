export interface Property {
  id: string;
  title: string;
  fullAddress: string;      // 중개사용 전체 주소 (예: 서울특별시 강남구 역삼동 735-3)
  maskedAddress: string;    // 일반인용 마스킹 주소 (예: 서울특별시 강남구 역삼동 **번지)
  roadAddress: string;      // 도로명 주소 (예: 서울특별시 강남구 테헤란로 152)
  area: number;             // 대지면적 (㎡)
  buildingArea: number;     // 건축면적 (㎡)
  floorArea: number;        // 연면적 (㎡)
  purpose: string;          // 주용도 (예: 단독주택, 제2종근린생활시설, 공동주택)
  structure: string;        // 구조 (예: 철근콘크리트구조)
  floors: string;           // 규모 (예: 지상 5층 / 지하 1층)
  completionYear: string;   // 사용승인일 (예: 2018-05-12)
  
  // 공공데이터 기반 규제 정보
  zoning: string;           // 용도지역 (예: 일반상업지역, 제3종일반주거지역)
  district: string;         // 용도지구/구역 (예: 방화지구, 지구단위계획구역)
  regulations: string[];    // 토지이용규제 및 제한사항 (예: 과밀억제권역, 상대보호구역, 비행안전구역)
  officialPrice: number;    // 공시지가 (원/㎡)
  
  // 거래 정보
  transactionType: '매매' | '전세' | '월세';
  price: number;            // 거래가 (만원)
  deposit?: number;         // 보증금 (만원, 월세인 경우)
  monthlyRent?: number;     // 월세 (만원)
  description: string;
  images: string[];
  registeredAt: string;
}

export interface Contract {
  id: string;
  propertyId: string;
  propertyName: string;
  realtorId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  contractDate: string;
  depositAmount: number;    // 계약금 (만원)
  interimAmount: number;    // 중도금 (만원)
  balanceAmount: number;    // 잔금 (만원)
  monthlyAmount?: number;   // 차임/월세 (만원)
  status: '작성중' | '체결완료' | '출력대기';
}

export interface Realtor {
  id: string;
  name: string;
  officeName: string;
  registrationNumber: string; // 중개업 등록번호
  address: string;
  phone: string;
  isVerified: boolean;
}
