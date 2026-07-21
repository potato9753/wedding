// ============================================================
//  WEDDING_CONFIG — 콘텐츠 중앙 관리 (placeholder)
// ------------------------------------------------------------
//  * 여기에는 API 키/비밀값이 하나도 없습니다. (공개 repo 안전)
//  * 지도는 좌표/키 대신 "검색어(mapQuery)" 또는 "딥링크 URL"만 사용.
//  * 실제 결혼식 정보로 이 파일의 값만 바꾸면 사이트 전체에 반영됩니다.
//  * 여러 줄 문구는 문자열 배열로 작성 (렌더 시 줄바꿈 처리).
// ============================================================

export const WEDDING_CONFIG = {
  // ── 사이트 메타 (검색/공유 미리보기용) ──────────────────
  meta: {
    title: "이재진 ♥ 이소은 결혼합니다",
    description: "저희 두 사람이 사랑으로 하나 되는 자리에 초대합니다.",
    url: "https://potato9753.github.io/wedding/", // 배포 URL (OG 태그용)
    ogImage: "assets/images/og-cover.jpg",         // 공유 썸네일 (권장 1200x630)
    themeColor: "#c9a26b",
  },

  // ── 커버 ────────────────────────────────────────────────
  cover: {
    tagline: "We're getting married",
    photo: "", // assets/images/cover.webp (비우면 placeholder 표시)
  },

  // ── 신랑 · 신부 ─────────────────────────────────────────
  couple: {
    groom: {
      firstName: "이재진",     // 이름
      englishName: "Jaejin",   // (선택) 영문 표기
      order: "차남",           // 아들/장남/차남 등 관계 표기
      phone: "010-0000-0000",
      photo: "",               // 소개 카드용 (선택). 비우면 placeholder
      traits: ["언제나 듬직한 사람", "잘 웃고 잘 웃겨주는 사람", "손이 참 따뜻한 사람"], // 소개 카드
    },
    bride: {
      firstName: "이소은",
      englishName: "Soeun",
      order: "차녀",
      phone: "010-0000-0000",
      photo: "",
      traits: ["함께 있으면 편안한 사람", "작은 것도 살뜰히 챙기는 사람", "웃음이 예쁜 사람"],
    },
  },

  // ── 혼주(부모) ──────────────────────────────────────────
  //  deceased: true 이면 이름 앞에 국화(故) 표기 등 렌더에서 처리
  parents: {
    groom: {
      father: { name: "이준희", deceased: false },
      mother: { name: "김현미", deceased: false },
    },
    bride: {
      father: { name: "이정돈", deceased: false },
      mother: { name: "이정희", deceased: false },
    },
  },

  // ── 예식 일시 · 장소 ────────────────────────────────────
  wedding: {
    // ISO 8601 (KST). D-day/카운트다운/캘린더의 기준값입니다.
    datetime: "2026-12-20T15:00:00+09:00",
    venue: {
      name: "더컨벤션 송파문정",
      hall: "아모르홀",
      address: "서울 송파구 송파대로 155 NH송파농협 11~13층", // 도로명 (표시·복사)
      addressJibun: "서울 송파구 문정동 651-8",                // 지번
      zipcode: "05855",
      tel: "02-6418-5000",
    },
  },

  // ── 함께한 시간 (푸터 카운터 기준) ──────────────────────
  relationship: {
    since: "2017-06-05", // 처음 만난 날 / 연애 시작일
    label: "우리가 처음 만난 날부터",
  },

  // ── 인사말 ──────────────────────────────────────────────
  greeting: {
    title: "모시는 글",
    message: [
      "두 사람이 처음 마주한 날부터",
      "오늘에 이르기까지",
      "서로를 향한 마음이 깊어졌습니다.",
      "",
      "이제 같은 곳을 바라보며",
      "평생을 함께 걷고자 합니다.",
      "귀한 걸음으로 축복해 주신다면",
      "더없는 기쁨으로 간직하겠습니다.",
    ],
  },

  // ── 감성 인용구 (시/문구 카드) ──────────────────────────
  //  * 저작권 있는 시/가사 전문 복사에 주의하세요. (직접 작성 또는 출처 표기)
  quote: {
    text: [
      "사랑은 서로를 마주 보는 것이 아니라",
      "함께 같은 곳을 바라보는 것입니다.",
    ],
    author: "생텍쥐페리", // 비우면 표시 안 함
  },

  // ── 갤러리 ──────────────────────────────────────────────
  //  지금은 placeholder(SVG)입니다. 실제 사진이 준비되면 이 목록만 교체하세요.
  //  (Task 11 이미지 파이프라인으로 EXIF 제거 + WebP 최적화 후 경로 지정)
  gallery: {
    images: [
      { src: "assets/images/gallery/01.svg", alt: "웨딩 사진 1" },
      { src: "assets/images/gallery/02.svg", alt: "웨딩 사진 2" },
      { src: "assets/images/gallery/03.svg", alt: "웨딩 사진 3" },
      { src: "assets/images/gallery/04.svg", alt: "웨딩 사진 4" },
      { src: "assets/images/gallery/05.svg", alt: "웨딩 사진 5" },
      { src: "assets/images/gallery/06.svg", alt: "웨딩 사진 6" },
    ],
  },

  // ── 우리의 시간 (러브스토리 타임라인) ───────────────────
  //  현재 화면에서 제외된 섹션입니다. 다시 넣으려면 index.html 의
  //  #timeline 섹션(<div data-timeline>)을 복원하면 자동 렌더됩니다.
  timeline: [
    { date: "2017-06-05", title: "첫 만남", description: "우연처럼 시작된 인연" },
    { date: "2018-06-05", title: "연애 시작", description: "서로의 봄이 되기로 한 날" }, // 날짜 확인 예정
    { date: "2025-12-24", title: "프러포즈", description: "평생을 약속한 겨울밤" },       // 날짜 확인 예정
    { date: "2026-12-20", title: "Wedding Day", description: "저희, 결혼합니다" },
  ],

  // ── 오시는 길 (지도 API 키 없음: 약도 이미지 + 딥링크) ──
  directions: {
    sketchMap: "assets/images/map.svg", // 약도 이미지 경로 (실제 약도로 교체)
    mapQuery: "더컨벤션 송파문정",         // 지도앱 검색어 (딥링크 자동 생성용)
    // 명시 URL을 채우면 자동 생성 대신 사용합니다. (비우면 mapQuery로 생성)
    mapLinks: {
      kakao: "",
      naver: "https://map.naver.com/p/entry/place/1958047921",
      tmap: "",
      google: "",
    },
    // 예식장 공식 '오시는 길' 기준
    transit: {
      subway: "8호선 문정역 3번 출구에서 도보 5분",
      bus: "일반 30·31·100·331\n간선 302·303·320·333·350·360·343·345·422·N13·N37\n지선 3322·3420\n직행 1009·1112·1117·1650·500-1·500-1A·3302·4305·G2100·G6009\n※ 문정법조타운·건영아파트 정류소 하차 후 도보 (일반버스)",
      car: "네비게이션에 '송파구 송파대로 155' 검색",
      parking: "",
    },
  },

  // ── 연락 / RSVP (저장 기능 없음: 링크아웃) ──────────────
  contact: {
    groom: { label: "신랑에게", tel: "010-5009-4903", sms: "010-5009-4903", kakao: "" },
    bride: { label: "신부에게", tel: "010-8673-9937", sms: "010-8673-9937", kakao: "" },
    rsvpMessage: "참석 여부를 편하게 알려주시면 준비에 큰 도움이 됩니다.",
  },

  // ── 마음 전하실 곳 (계좌) ───────────────────────────────
  //  kakaopay: 카카오페이 송금 링크(선택). 비우면 표시 안 함.
  accounts: {
    //  ⚠ 계좌번호는 아직 placeholder 입니다 — 실제 은행/번호 받는 대로 교체하세요.
    groom: [
      { relation: "신랑", bank: "○○은행", number: "000-000000-00-000", holder: "이재진", kakaopay: "" },
      { relation: "신랑 어머니", bank: "○○은행", number: "000-000000-00-000", holder: "김현미", kakaopay: "" },
    ],
    bride: [
      { relation: "신부", bank: "○○은행", number: "000-000000-00-000", holder: "이소은", kakaopay: "" },
      { relation: "신부 어머니", bank: "○○은행", number: "000-000000-00-000", holder: "이정희", kakaopay: "" },
    ],
  },

  // ── 편지 (읽기전용, 방명록 대체) ────────────────────────
  letters: [
    // { author: "양가 가족 일동", message: "귀한 걸음 해 주시는 모든 분께 감사드립니다.", date: "" },
  ],

  // ── 배경음악 (자가호스팅) ───────────────────────────────
  bgm: {
    enabled: true,
    src: "assets/audio/bgm.mp3",
    title: "",
    autoplay: false, // 브라우저 정책상 자동재생 제한 → 사용자가 토글로 재생
    loop: true,
  },

  // ── 공유 (Web Share API / 링크복사 — Kakao SDK 미사용) ──
  share: {
    text: "이재진 ♥ 이소은 결혼합니다. 저희의 시작을 함께해 주세요.",
  },

  // ── 푸터 ────────────────────────────────────────────────
  footer: {
    thanks: "찾아와 주셔서 감사합니다.",
  },
};

export default WEDDING_CONFIG;
