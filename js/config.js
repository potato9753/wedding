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
      order: "아들",           // 아들/장남/차남 등 관계 표기
      phone: "010-0000-0000",
      photo: "",               // 소개 카드용 (선택). 비우면 placeholder
      traits: ["언제나 듬직한 사람", "잘 웃고 잘 웃겨주는 사람", "손이 참 따뜻한 사람"], // 소개 카드
    },
    bride: {
      firstName: "이소은",
      englishName: "Soeun",
      order: "딸",
      phone: "010-0000-0000",
      photo: "",
      traits: ["함께 있으면 편안한 사람", "작은 것도 살뜰히 챙기는 사람", "웃음이 예쁜 사람"],
    },
  },

  // ── 혼주(부모) ──────────────────────────────────────────
  //  deceased: true 이면 이름 앞에 국화(故) 표기 등 렌더에서 처리
  parents: {
    groom: {
      father: { name: "홍부친", deceased: false },
      mother: { name: "이모친", deceased: false },
    },
    bride: {
      father: { name: "김부친", deceased: false },
      mother: { name: "박모친", deceased: false },
    },
  },

  // ── 예식 일시 · 장소 ────────────────────────────────────
  wedding: {
    // ISO 8601 (KST). D-day/카운트다운/캘린더의 기준값입니다.
    datetime: "2026-12-20T15:00:00+09:00",
    venue: {
      name: "더컨벤션 송파문정",
      hall: "아모르홀",
      address: "서울특별시 송파구 문정동 (정확한 주소 입력 예정)",
      tel: "",
    },
  },

  // ── 함께한 시간 (푸터 카운터 기준) ──────────────────────
  relationship: {
    since: "2020-03-14", // 처음 만난 날 / 연애 시작일
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
      "함께 걷는 길이라면",
      "먼 길도 설레는 여정이 됩니다.",
    ],
    author: "", // 예: "○○○, 「시집 제목」 중" (비우면 표시 안 함)
  },

  // ── 갤러리 ──────────────────────────────────────────────
  //  Task 11 이미지 파이프라인으로 최적화(WebP)한 뒤 경로를 채우세요.
  gallery: {
    images: [
      // { src: "assets/images/gallery/01.webp", alt: "웨딩 사진 1" },
    ],
  },

  // ── 우리의 시간 (러브스토리 타임라인) ───────────────────
  timeline: [
    { date: "2020-03-14", title: "첫 만남", description: "우연처럼 시작된 인연" },
    { date: "2021-03-14", title: "연애 시작", description: "서로의 봄이 되기로 한 날" },
    { date: "2025-12-24", title: "프러포즈", description: "평생을 약속한 겨울밤" },
    { date: "2026-05-16", title: "Wedding Day", description: "저희, 결혼합니다" },
  ],

  // ── 오시는 길 (지도 API 키 없음: 약도 이미지 + 딥링크) ──
  directions: {
    sketchMap: "assets/images/map.png", // 약도 이미지 경로
    mapQuery: "더컨벤션 송파문정",         // 지도앱 검색어 (딥링크 자동 생성용)
    // 아래를 채우면 자동 생성 대신 해당 URL을 사용합니다. (비우면 mapQuery 사용)
    mapLinks: { kakao: "", naver: "", tmap: "", google: "" },
    transit: {
      subway: "○호선 ○○역 0번 출구에서 도보 5분",
      bus: "○○ 정류장 하차 (간선 000 / 지선 0000)",
      car: "내비게이션에 '더컨벤션 송파문정' 검색",
      parking: "건물 지하 주차장 2시간 무료",
    },
  },

  // ── 연락 / RSVP (저장 기능 없음: 링크아웃) ──────────────
  contact: {
    groom: { label: "신랑에게", tel: "010-0000-0000", sms: "010-0000-0000", kakao: "" },
    bride: { label: "신부에게", tel: "010-0000-0000", sms: "010-0000-0000", kakao: "" },
    rsvpMessage: "참석 여부를 편하게 알려주시면 준비에 큰 도움이 됩니다.",
  },

  // ── 마음 전하실 곳 (계좌) ───────────────────────────────
  //  kakaopay: 카카오페이 송금 링크(선택). 비우면 표시 안 함.
  accounts: {
    groom: [
      { relation: "신랑", bank: "○○은행", number: "000-000000-00-000", holder: "이재진", kakaopay: "" },
      { relation: "신랑 아버지", bank: "○○은행", number: "000-000000-00-000", holder: "홍부친", kakaopay: "" },
    ],
    bride: [
      { relation: "신부", bank: "○○은행", number: "000-000000-00-000", holder: "이소은", kakaopay: "" },
      { relation: "신부 어머니", bank: "○○은행", number: "000-000000-00-000", holder: "박모친", kakaopay: "" },
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
