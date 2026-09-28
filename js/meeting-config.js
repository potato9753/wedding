// ============================================================
//  MEETING_CONFIG — 상견례 초대장 콘텐츠 중앙 관리
// ------------------------------------------------------------
//  * wedding/js/config.js 와 같은 구조를 최대한 재사용합니다.
//  * ⚠ 표시된 값은 아직 placeholder 입니다 — 확정되는 대로 교체하세요.
//  * 여러 줄 문구는 문자열 배열로 작성 (렌더 시 줄바꿈 처리).
// ============================================================

export const MEETING_CONFIG = {
  meta: {
    title: "이재진 · 이소은 상견례에 초대합니다",
    description: "두 사람의 가족이 처음으로 인사드리는 자리입니다.",
    url: "https://potato9753.github.io/wedding/meeting/",
    ogImage: "../assets/images/og-cover.jpg",
    themeColor: "#e0995f",
  },

  cover: {
    tagline: "두근두근, 처음 인사드려요",
    // 대표 사진 한 장 대신 5장을 흩뿌린 콜라주로 구성 (첫 번째가 가장 크게).
    // 사진 5장 기준으로 css(.cover-collage__item:nth-child)가 배치돼 있어요 — 개수를 바꾸면 css/style.css 도 같이 조정하세요.
    // 갤러리와 겹치지 않게, 서로 다른 무드로만 5장 선별
    collage: [
      { src: "../assets/images/couple/couple-04.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-12.webp", alt: "재진 · 소은 · 시라카와고" },
      { src: "../assets/images/couple/couple-07.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-03.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-02.webp", alt: "재진 · 소은" },
    ],
  },

  effects: {
    falling: "glow", // "glow" | "petal" | "snow" | "none" — 웜톤 은은한 빛 입자
    intensity: 26,
    introText: "먼저 인사드릴게요",
  },

  couple: {
    groom: {
      firstName: "이재진",
      englishName: "Jaejin",
      order: "차남",
      phone: "010-5009-4903",
    },
    bride: {
      firstName: "이소은",
      englishName: "Soeun",
      order: "차녀",
      phone: "010-8673-9937",
    },
  },

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

  // ── 양가 가족 소개 (부모님 + 형제자매) ──────────────────
  //  ⚠ 형제자매 이름/관계 표기는 placeholder 입니다. 확정되는 대로 교체하세요.
  //  photos 는 비워두면 "사진 준비중" placeholder 로 표시됩니다.
  //  (신부측은 아직 사진을 받기 전이라 전부 비워둔 상태 — 요청용 샘플)
  family: {
    groom: {
      members: [
        { relation: "아버지", name: "이준희" },
        { relation: "어머니", name: "김현미" },
        { relation: "형", name: "이재철" },
      ],
      photos: {
        past: { src: "../assets/images/family/groom/childhood-01.webp", caption: "신랑 어린 시절" },
        parents: [
          { src: "../assets/images/family/groom/parents-young-01.webp", caption: "부모님 젊으셨을 때" },
          { src: "../assets/images/family/groom/parents-young-02.webp", caption: "" },
          { src: "../assets/images/family/groom/parents-young-03.webp", caption: "" },
        ],
        recent: { src: "../assets/images/family/groom/recent-family-01.webp", caption: "요즘 우리 셋" },
      },
    },
    bride: {
      members: [
        { relation: "아버지", name: "이정돈" },
        { relation: "어머니", name: "이정희" },
        { relation: "오빠", name: "이상준" },
        { relation: "반려견", name: "두리 (진돗개)" },
      ],
      photos: {
        past: { src: "", caption: "신부 어린 시절" },
        parents: [{ src: "", caption: "부모님 젊으셨을 때" }],
        recent: { src: "", caption: "형제 포함 최근 가족사진" },
        pet: { src: "", caption: "두리" }, // ⚠ 사진 받으면 여기에 경로 채워주세요
      },
    },
  },

  // ── 상견례 일시 · 장소 ──────────────────────────────
  wedding: {
    datetime: "2026-10-03T13:00:00+09:00",
    venue: {
      name: "갓포코젠",
      hall: "", // ⚠ 예약하신 룸/좌석 이름 있으면 채워주세요
      address: "경기 수원시 영통구 광교", // ⚠ 정확한 지번/도로명 주소로 교체해주세요
      addressJibun: "",
      zipcode: "",
      tel: "",
    },
  },

  greeting: {
    title: "인사드립니다",
    message: [
      "저희 둘, 이제 양가 가족으로 인사 나누는 자리를 마련했어요.",
      "",
      "사실 며칠 전부터 둘 다 조금씩 긴장하고 있어요.",
      "그래도 그만큼 반가운 마음이 더 크니,",
      "편하게 오셔서 좋은 시간 보내주시면 좋겠습니다.",
      "귀한 걸음 해주셔서 감사합니다.",
    ],
  },

  gallery: {
    // 커버 콜라주와 중복 없이, 비슷한 컷(밤 셀카·뒷모습·아이스크림 등)은 하나씩만
    images: [
      { src: "../assets/images/couple/couple-06.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-09.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-11.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-13.webp", alt: "재진 · 소은" },
      { src: "../assets/images/bride/solo-01.webp", alt: "소은" },
    ],
  },

  // ── 오시는 길 (mapQuery 는 장소명으로 자동 딥링크 생성) ──
  //  ⚠ intro 문구는 추측으로 쓴 초안입니다 — 실제 느낌과 다르면 편하게 고쳐주세요.
  directions: {
    intro: "제철 회·튀김·구이를 코스로 즐기는 갓포 다이닝이에요. 룸으로 예약해서 편하게 얘기 나누기 좋아요.",
    sketchMap: "",
    mapQuery: "갓포코젠 광교",
    mapLinks: { kakao: "", naver: "", tmap: "", google: "" },
    transit: {
      subway: "",
      bus: "",
      car: "",
      parking: "",
    },
  },

  // ── 메뉴 코스 (갓포코젠, 7명 기준) ──────────────────────
  //  가격은 참고용으로 공개해도 괜찮은 선에서만 넣었어요. 부담스러우면 price 를 지워도(빈 값) 표시 안 됩니다.
  menu: {
    title: "메뉴 코스",
    note: "7명 기준으로 미리 짜본 코스예요. 알레르기나 못 드시는 음식 있으면 편하게 말씀해주세요.",
    courses: [
      {
        phase: "1차 · 회",
        items: [
          { name: "제철 생선회", qty: 2 },
          { name: "제철 국내산 성게알", qty: 1 },
        ],
      },
      {
        phase: "2차 · 마키",
        items: [
          { name: "마구로마키 8p", qty: 2 },
          { name: "안키모마키", qty: 2 },
        ],
      },
      {
        phase: "3차 · 튀김",
        items: [
          { name: "복어 텐푸라", qty: 1 },
          { name: "난코츠 가라아게", qty: 1 },
        ],
      },
      {
        phase: "4차 · 구이",
        items: [
          { name: "도미머리 소금구이", qty: 1 },
          { name: "은대구 미소구이", qty: 1 },
          { name: "본갈비 피망 숯불구이", qty: 1 },
        ],
      },
      {
        phase: "5차 · 국물",
        items: [
          { name: "한우 스지 오뎅나베", qty: 1 },
          { name: "1++ 한우 스키야키 전골", qty: 1 },
        ],
      },
      {
        phase: "6차 · 식사",
        items: [
          { name: "갈치 솥밥", qty: 1 },
          { name: "갈비 솥밥", qty: 1 },
        ],
      },
    ],
    // 코스에 없지만 추가로 먹고 싶은 메뉴 (당일 현장 주문 예정 등)
    wishlist: ["참외 셔벗 (디저트, 마지막에 별도 주문 예정)"],
    // 갓포코젠 추천메뉴·전체 메뉴판을 밖에서 더 보고 싶을 때 (펼쳐서 링크로 이동)
    // naver 는 directions.mapQuery 로 자동 생성됩니다. catchtable 은 ⚠ 실제 URL로 채워주세요.
    links: {
      catchtable: "",
    },
  },

  // ── 안내 말씀 (복장 · 식사 형식) ──────────────────────
  info: {
    title: "안내 말씀",
    items: [
      {
        icon: "meal",
        title: "먹는 얘기부터 하면,",
        desc: ["부담 없는 자리예요, 편하게 오세요.", "제철 회·구이 코스로 준비했습니다."],
      },
      {
        icon: "default",
        title: "옷차림은요",
        desc: ["정장까지는 진짜 안 갖추셔도 돼요.", "단정하고 편안한 차림이면 충분합니다."],
      },
      {
        icon: "default",
        title: "대화가 막히면 (웃음)",
        desc: [
          "① 요즘 다녀온 여행지 / 가보고 싶은 곳",
          "② 최근 빠진 취미 하나씩",
          "③ 서로 자주 가는 맛집 추천",
          "④ 반려동물 있으면 자랑 타임",
          "⑤ 최근 재밌게 본 드라마·영화",
          "⑥ 요즘 좋아하는 연예인",
        ],
      },
    ],
  },

  bgm: {
    enabled: true,
    src: "../assets/audio/bgm.mp3",
    title: "",
    autoplay: false,
    loop: true,
  },

  footer: {
    thanks: "함께해 주셔서 감사합니다.",
  },
};

export default MEETING_CONFIG;
