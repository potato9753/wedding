// ============================================================
//  MEETING_CONFIG — 상견례 초대장 콘텐츠 중앙 관리
// ------------------------------------------------------------
//  * wedding/js/config.js 와 같은 구조를 최대한 재사용합니다.
//  * ⚠ 표시된 값은 아직 placeholder 입니다 — 확정되는 대로 교체하세요.
//  * 여러 줄 문구는 문자열 배열로 작성 (렌더 시 줄바꿈 처리).
// ============================================================

export const MEETING_CONFIG = {
  meta: {
    title: "이재진 · 이소은 상견례 안내",
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
      { src: "../assets/images/couple/couple-19.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-12.webp", alt: "재진 · 소은 · 시라카와고" },
      { src: "../assets/images/couple/couple-07.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-03.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-16.webp", alt: "재진 · 소은" },
    ],
  },

  effects: {
    falling: "glow", // "glow" | "petal" | "snow" | "none" — 웜톤 은은한 빛 입자
    intensity: 26,
    introText: "오늘의 만남이 두 가족의 행복한 시작이 되기를 바랍니다.",
    calendarTapTip: "드디어 뵙는 날 🙌",
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
        // ⚠ 소개 문구는 샘플이에요 — 실제 느낌으로 바꿔주세요.
        past: {
          src: "../assets/images/family/groom/childhood-01.webp",
          caption: "낯가림 없고 장난기 많던 개구쟁이였대요. 지금도 크게 안 변했다는 후문이 있어요.",
        },
        recent: [
          { src: "../assets/images/family/groom/recent-family-01.webp", caption: "요즘 우리 셋" },
          { src: "../assets/images/family/groom/recent-family-02.webp", caption: "" },
        ],
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
        past: {
          src: "../assets/images/family/bride/childhood-01.webp",
          caption: "순하고 조용한 아이였다고 해요 — 지금 성격이랑 비슷하죠?",
        },
        recent: { src: "../assets/images/family/bride/recent-01.webp", caption: "" },
        pet: { src: "../assets/images/family/bride/pet-01.webp", caption: "두리" },
      },
    },
  },

  // ── 상견례 일시 · 장소 ──────────────────────────────
  wedding: {
    datetime: "2026-10-03T13:00:00+09:00",
    venue: {
      name: "갓포코젠",
      hall: "", // ⚠ 예약하신 룸/좌석 이름 있으면 채워주세요
      address: "경기 수원시 영통구 도청로66번길 6 상가3동 333호",
      addressJibun: "경기 수원시 영통구 이의동 1333",
      zipcode: "",
      tel: "031-895-5571",
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
      { src: "../assets/images/couple/couple-17.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-06.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-18.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-09.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-11.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-14.webp", alt: "재진 · 소은" },
      { src: "../assets/images/couple/couple-15.webp", alt: "재진 · 소은" },
      { src: "../assets/images/groom/solo-01.webp", alt: "재진" },
      { src: "../assets/images/bride/solo-01.webp", alt: "소은" },
    ],
  },

  // ── 오시는 길 (mapQuery 는 장소명으로 자동 딥링크 생성) ──
  //  ⚠ intro 문구는 추측으로 쓴 초안입니다 — 실제 느낌과 다르면 편하게 고쳐주세요.
  directions: {
    intro: "제철 회·튀김·구이를 코스로 즐기는 갓포 다이닝이에요.\n룸으로 예약해서 편하게 얘기 나누기 좋아요.",
    sketchMap: "",
    mapQuery: "갓포코젠 광교",
    mapLinks: { kakao: "", naver: "https://map.naver.com/p/entry/place/2044348009", tmap: "", google: "" },
    transit: {
      subway: "광교중앙역(신분당선) 3번 출구에서 도보 1분\n3번 출구로 나와 오른쪽(이편한세상 방향)으로 직진하면 광교힐스에비뉴 상가동이 보여요. 늘봄약국 옆 엘리베이터 타고 3층으로 올라오시면 비율헤어 바로 오른쪽이에요.",
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
    // 사진은 네이버플레이스 등록 사진(자가호스팅, assets/images/menu/course-*.webp)
    courses: [
      {
        phase: "1차 · 회",
        items: [
          { name: "제철 생선회", qty: 2, photo: "../assets/images/menu/course-01-hoe.webp" },
          { name: "제철 국내산 성게알", qty: 1, photo: "../assets/images/menu/course-02-sungae.webp" },
        ],
      },
      {
        phase: "2차 · 마키",
        items: [
          { name: "마구로마키 8p", qty: 2, photo: "../assets/images/menu/course-03-maguromaki.webp" },
          { name: "안키모마키", qty: 2, photo: "../assets/images/menu/course-04-ankimo.webp" },
        ],
      },
      {
        phase: "3차 · 튀김",
        items: [
          { name: "복어 텐푸라", qty: 1, photo: "../assets/images/menu/course-05-bokeo.webp" },
          { name: "난코츠 가라아게", qty: 1, photo: "../assets/images/menu/course-06-nankotsu.webp" },
        ],
      },
      {
        phase: "4차 · 구이",
        items: [
          { name: "도미머리 소금구이", qty: 1, photo: "../assets/images/menu/course-07-domi.webp" },
          { name: "은대구 미소구이", qty: 1, photo: "../assets/images/menu/course-08-eundaegu.webp" },
          { name: "본갈비 피망 숯불구이", qty: 1, photo: "../assets/images/menu/course-09-bongalbi.webp" },
        ],
      },
      {
        phase: "5차 · 국물",
        items: [
          { name: "한우 스지 오뎅나베", qty: 1, photo: "../assets/images/menu/course-10-hanwoo-sooji.webp" },
          { name: "1++ 한우 스키야키 전골", qty: 1, photo: "../assets/images/menu/course-11-sukiyaki.webp" },
        ],
      },
      {
        phase: "6차 · 식사",
        items: [
          { name: "갈치 솥밥", qty: 1, photo: "../assets/images/menu/course-12-galchi-sotbap.webp" },
          { name: "갈비 솥밥", qty: 1, photo: "../assets/images/menu/course-13-galbi-sotbap.webp" },
        ],
      },
    ],
    // 코스에 없지만 추가로 먹고 싶은 메뉴 (당일 현장 주문 예정 등)
    wishlist: ["참외 셔벗 (디저트, 마지막에 별도 주문 예정)"],
    // 네이버플레이스에 등록된 갓포코젠 대표메뉴 9종 (사진은 자가호스팅 — assets/images/menu/)
    // ⚠ 코스 리스트에 이미 있는 대표메뉴(제철 생선회·마구로마키·스키야키전골)는 중복이라 여기서 뺐어요.
    // 네이버플레이스 전체 메뉴판(37개) 중 코스에 없는 항목은 다 넣었어요.
    // (시즌아웃/품절 메뉴, 참외셔벗(위시리스트에 이미 있음)은 제외)
    reprMenu: [
      { name: "(런치) 스키야키 정식", price: "35,000원", photo: "../assets/images/menu/14-lunch-sukiyaki.webp" },
      { name: "(런치) 우나쥬 정식", price: "38,000원", photo: "../assets/images/menu/15-lunch-unaju.webp" },
      { name: "(런치) 치라시동 정식", price: "28,000원", photo: "../assets/images/menu/16-lunch-chirashi.webp" },
      { name: "(런치) 카이센동 정식", price: "35,000원", photo: "../assets/images/menu/17-lunch-kaisendon.webp" },
      { name: "갈치 아이올리", price: "28,000원", photo: "../assets/images/menu/18-galchi-aioli.webp" },
      { name: "고등어봉초밥 (4p)", price: "16,000원", photo: "../assets/images/menu/19-mackerel-4.webp" },
      { name: "고등어봉초밥 (8p)", price: "32,000원", photo: "../assets/images/menu/20-mackerel-8.webp" },
      { name: "도미 머리 조림", price: "38,000원", photo: "../assets/images/menu/21-domi-jorim.webp" },
      { name: "돌문어튀김(타코텐푸라)", price: "26,000원", photo: "../assets/images/menu/22-tako-tempura.webp" },
      { name: "민물장어 숯불구이 (2인)", price: "25,000원", photo: "../assets/images/menu/23-eel-25.webp" },
      { name: "민물장어숯불구이 (통)", price: "48,000원", photo: "../assets/images/menu/24-eel-48.webp" },
      { name: "바질부라타치즈 플래터", price: "25,000원", photo: "../assets/images/menu/25-burrata.webp" },
      { name: "아지후라이", price: "28,000원", photo: "../assets/images/menu/26-aji-fry.webp" },
      { name: "양갈비 숯불구이", price: "46,000원", photo: "../assets/images/menu/27-lamb.webp" },
      { name: "참치젓갈 생선회 무침", price: "26,000원", photo: "../assets/images/menu/28-tuna-jeotgal.webp" },
      { name: "츠케모노 5종", price: "13,000원", photo: "../assets/images/menu/29-tsukemono.webp" },
      { name: "카이센 갈릭 이나니와 비빔우동", price: "29,000원", photo: "../assets/images/menu/30-udon-garlic.webp" },
      { name: "타코 사라다", price: "35,000원", photo: "../assets/images/menu/31-taco-salad.webp" },
      { name: "프로슈토 아보카도 사라다", price: "28,000원", photo: "../assets/images/menu/32-prosciutto.webp" },
      { name: "해물모시우동", price: "25,000원", photo: "../assets/images/menu/33-udon-seafood.webp" },
      { name: "해물베이컨토마토스튜", price: "35,000원", photo: "../assets/images/menu/34-stew.webp" },
    ],
    // 전체 메뉴판을 밖에서 더 보고 싶을 때 (펼쳐서 링크로 이동)
    links: {
      catchtable: "https://app.catchtable.co.kr/ct/shop/kappokozen/menuAllList",
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
