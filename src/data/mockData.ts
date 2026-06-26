import { Property } from '../types';

// 샘플 매물 목록
export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: '강남역 초역세권 상가빌딩 매매',
    fullAddress: '서울특별시 강남구 역삼동 735-3',
    maskedAddress: '서울특별시 강남구 역삼동 **번지',
    roadAddress: '서울특별시 강남구 테헤란로 124',
    area: 450.5,
    buildingArea: 260.8,
    floorArea: 1850.4,
    purpose: '제2종근린생활시설 및 업무시설',
    structure: '철근콘크리트구조',
    floors: '지상 6층 / 지하 2층',
    completionYear: '2019-08-24',
    zoning: '일반상업지역',
    district: '방화지구, 중심지미관지구, 지구단위계획구역(종합시장지구)',
    regulations: [
      '국토의 계획 및 이용에 관한 법률에 따른 규제',
      '과밀억제권역 (수도권정비계획법)',
      '상수원보호구역 (수질 및 수생태계 보전에 관한 법률) - 해당없음',
      '도로구역 (도로법)',
      '지하보존지구 (문화재보호법)'
    ],
    officialPrice: 28500000, // ㎡당 공시지가 (2,850만원)
    transactionType: '매매',
    price: 3200000, // 320억 원
    description: '테헤란로 대로변 이면에 위치하여 접근성이 매우 우수하며, 공실률 0%를 자랑하는 최고급 상업 빌딩입니다. 대기업 임차인이 장기 임차 중입니다.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    registeredAt: '2026-06-15'
  },
  {
    id: 'prop-2',
    title: '정릉동 숲세권 신축급 단독주택 매매',
    fullAddress: '서울특별시 성북구 정릉동 412-15',
    maskedAddress: '서울특별시 성북구 정릉동 **번지',
    roadAddress: '서울특별시 성북구 보국문로26길 12',
    area: 280.2,
    buildingArea: 110.5,
    floorArea: 220.3,
    purpose: '단독주택',
    structure: '연와조 및 목구조',
    floors: '지상 2층 / 지하 1층',
    completionYear: '2021-03-10',
    zoning: '제1종일반주거지역',
    district: '경관지구, 최고고도지구(2층이하, 8m이하)',
    regulations: [
      '대공방어협조구역 (군사기지 및 군사시설 보호법)',
      '제한보호구역 (군사기지 및 군사시설 보호법)',
      '과밀억제권역 (수도권정비계획법)',
      '문화재보존영향 검토대상구역 (서울특별시 문화재보호조례)'
    ],
    officialPrice: 3850000, // ㎡당 공시지가
    transactionType: '매매',
    price: 135000, // 13억 5천만 원
    description: '북한산 자락 아래 위치하여 맑은 공기와 조용한 주거 환경을 선사합니다. 정원이 넓고 인테리어가 현대적으로 완비되어 있어 즉시 입주 가능합니다.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    registeredAt: '2026-06-20'
  },
  {
    id: 'prop-3',
    title: '마포구 서교동 홍대거리 근생 건물 임대(통임대)',
    fullAddress: '서울특별시 마포구 서교동 365-12',
    maskedAddress: '서울특별시 마포구 서교동 **번지',
    roadAddress: '서울특별시 마포구 홍익로3길 22',
    area: 310.0,
    buildingArea: 180.2,
    floorArea: 890.5,
    purpose: '제2종근린생활시설',
    structure: '철근콘크리트구조',
    floors: '지상 4층 / 지하 1층',
    completionYear: '2015-11-05',
    zoning: '제3종일반주거지역',
    district: '지구단위계획구역(홍대주변지구), 특정개발진흥지구',
    regulations: [
      '상대보호구역 (교육환경 보호에 관한 법률)',
      '대공방어협조구역 (군사기지 및 군사시설 보호법)',
      '과밀억제권역 (수도권정비계획법)',
      '중점경관관리구역'
    ],
    officialPrice: 12500000,
    transactionType: '월세',
    price: 0,
    deposit: 30000,  // 보증금 3억 원
    monthlyRent: 1800, // 월세 1,800만 원
    description: '홍대 메인 스트리트 인근 상권으로, 유동인구가 폭발적인 입지입니다. F&B 프랜차이즈, 플래그십 스토어, 문화/예술 쇼룸 등으로 통임대 적극 추천드립니다.',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'
    ],
    registeredAt: '2026-06-22'
  }
];

// 주소를 검색했을 때 가상의 공공데이터(토지이용계획, 건축물대장)를 실시간으로 빌드해주는 시뮬레이터
export const simulatePublicData = (address: string) => {
  // 기본 세팅
  const randArea = Math.floor(Math.random() * 300) + 150;
  const randBuildingArea = Math.floor(randArea * 0.6);
  const randFloorArea = randBuildingArea * (Math.floor(Math.random() * 4) + 2);
  const floorsCount = Math.floor(randFloorArea / randBuildingArea);
  
  // 주소에 따른 시뮬레이션 데이터 분기
  let zoning = '제2종일반주거지역';
  let district = '지구단위계획구역, 경관지구';
  let regulations = [
    '과밀억제권역 (수도권정비계획법)',
    '대공방어협조구역 (군사기지 및 군사시설 보호법)',
  ];
  let officialPrice = 4500000;
  let purpose = '제2종근린생활시설';
  let structure = '철근콘크리트구조';

  if (address.includes('강남') || address.includes('테헤란') || address.includes('역삼')) {
    zoning = '일반상업지역';
    district = '방화지구, 지구단위계획구역, 개발행위허가제한지역';
    regulations = [
      '과밀억제권역 (수도권정비계획법)',
      '지하보존지구 (문화재보호법)',
      '상대보호구역 (교육환경 보호에 관한 법률)'
    ];
    officialPrice = 22000000;
    purpose = '제2종근린생활시설 및 업무시설';
  } else if (address.includes('상업') || address.includes('명동') || address.includes('종로')) {
    zoning = '중심상업지역';
    district = '방화지구, 역사문화특화경관지구';
    regulations = [
      '문화재보존영향 검토대상구역 (서울특별시 문화재보호조례)',
      '과밀억제권역 (수도권정비계획법)',
      '역사도심권역'
    ];
    officialPrice = 31000000;
    purpose = '판매시설 및 업무시설';
  } else if (address.includes('그린벨트') || address.includes('개발제한') || address.includes('정릉') || address.includes('북한산')) {
    zoning = '자연녹지지역';
    district = '개발제한구역(그린벨트)';
    regulations = [
      '개발제한구역의 지정 및 관리에 관한 특별조치법에 따른 규제',
      '비행안전구역 (군사기지 및 군사시설 보호법)',
      '공익용산지 (산지관리법)',
      '과밀억제권역 (수도권정비계획법)'
    ];
    officialPrice = 1200000;
    purpose = '단독주택 (요양소)';
    structure = '경량철골구조';
  } else if (address.includes('학교') || address.includes('대학') || address.includes('서교') || address.includes('신촌')) {
    zoning = '제3종일반주거지역';
    district = '학교시설보호지구, 교육환경보호구역';
    regulations = [
      '절대보호구역 (교육환경 보호에 관한 법률) - 학교경계선으로부터 50m 이내',
      '상대보호구역 (교육환경 보호에 관한 법률) - 학교경계선으로부터 200m 이내',
      '과밀억제권역 (수도권정비계획법)'
    ];
    officialPrice = 8500000;
    purpose = '교육연구시설 및 근린생활시설';
  }

  // 도로명 주소 생성 헬퍼
  const generateRoadAddress = (addr: string) => {
    // 예시: 서울시 마포구 망원동 453-12 -> 서울시 마포구 망원로 12
    const parts = addr.split(' ');
    const gu = parts.find(p => p.endsWith('구')) || '마포구';
    const dong = parts.find(p => p.endsWith('동')) || '망원동';
    const roadName = dong.replace('동', '로') + ' ' + (Math.floor(Math.random() * 120) + 1) + '길';
    return `${parts[0] || '서울특별시'} ${gu} ${roadName}`;
  };

  return {
    roadAddress: generateRoadAddress(address),
    area: randArea,
    buildingArea: randBuildingArea,
    floorArea: randFloorArea,
    purpose,
    structure,
    floors: `지상 ${floorsCount}층 / 지하 ${Math.random() > 0.5 ? '1' : '없음'}`,
    completionYear: `${2010 + Math.floor(Math.random() * 15)}-0${Math.floor(Math.random() * 8) + 1}-12`,
    zoning,
    district,
    regulations,
    officialPrice
  };
};
