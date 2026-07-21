# 모바일 청첩장 (Static Mobile Wedding Invitation)

순수 **HTML / CSS / JavaScript** 로 만든 모바일 청첩장입니다.
외부 서비스·API 키·런타임 3rd-party 스크립트 **없이** 동작하며, GitHub Pages 로 정적 호스팅합니다.

- 배포 URL(예정): https://potato9753.github.io/wedding/
- 콘텐츠는 [`js/config.js`](js/config.js) **한 곳**에서 관리합니다. (실제 정보는 placeholder)

## 특징

- **키 0 / 외부 스크립트 0** — 공개 저장소 기준 유출될 비밀값이 없습니다.
- **자가호스팅 폰트 + 인라인 SVG** — Google Fonts·아이콘 CDN 미사용 (외부 요청/추적 제거).
- **프라이버시 우선** — 분석/트래킹 스크립트 없음, 이미지 EXIF 제거 후 커밋.
- **지도** — API 키 없이 약도 이미지 + 지도앱 딥링크.
- **공유** — Web Share API + 링크복사 + OG 메타태그 (Kakao SDK 대체).

## 폴더 구조

```
wedding/
├── index.html            # 진입점 (+ <head> OG 메타태그)
├── css/
│   ├── fonts.css         # @font-face (자가호스팅)
│   ├── reset.css         # 리셋
│   ├── variables.css     # 디자인 토큰 (색·타이포·간격)
│   └── style.css         # 레이아웃 · 섹션 셸
├── js/
│   ├── config.js         # ★ 콘텐츠 중앙 관리 (키 없음)
│   ├── render.js         # config→DOM 렌더 + 날짜/이름 포맷
│   ├── reveal.js         # 스크롤 등장 애니메이션 (Intersection Observer)
│   └── main.js           # 초기화 · 와이어링
├── assets/
│   ├── images/           # 사진·약도 (최적화된 WebP)
│   ├── audio/            # 배경음악
│   ├── fonts/            # 자가호스팅 woff2
│   └── icons/            # 인라인/정적 아이콘
├── tools/                # 이미지 최적화 스크립트 (예정)
├── tests/                # node --test 단위 테스트 (예정)
└── README.md
```

## 로컬에서 실행

정적 파일이지만 ES 모듈을 쓰므로 `file://` 이 아니라 로컬 서버로 열어야 합니다.

```bash
uv run python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 접속 → 모바일 폭(~480px)으로 확인하세요.
(개발자도구의 디바이스 툴바로 모바일 화면 확인 권장)

## 콘텐츠 채우기

[`js/config.js`](js/config.js) 의 값만 수정하면 됩니다.

- `cover` — 커버 태그라인 + 대표 사진 경로
- `couple` / `parents` — 신랑·신부·혼주 이름, 소개 카드용 `traits`(특징)·`photo`
- `wedding.datetime` — 예식 일시 (ISO 8601, KST). D-day·캘린더의 기준값
- `wedding.venue` — 예식장 이름·홀·주소·전화
- `relationship.since` — 처음 만난 날 (푸터 "함께한 시간" 카운터 기준)
- `greeting.message` — 인사말 (여러 줄은 배열)
- `quote` — 감성 인용구(문구·출처). 저작권 있는 시/가사 전문 복사 주의
- `gallery.images` — 사진 경로 배열 (최적화 후 채우기)
- `timeline` — 러브스토리 타임라인 (날짜·제목·설명 배열)
- `directions` — 약도 이미지 경로 + 지도앱 검색어(`mapQuery`)
- `contact` — 연락(전화/문자/카톡) 링크아웃
- `accounts` — 축의금 계좌 (신랑측/신부측)
- `letters` — 읽기전용 편지 배열
- `bgm` / `share` / `meta` — 배경음악·공유 문구·미리보기 메타

> `config.js` 에는 **API 키/좌표/비밀값이 없습니다.** 지도는 검색어 또는 딥링크 URL만 사용합니다.

## 폰트 (자가호스팅)

- 본문/UI: **Pretendard** (400/600/700) — 한글+라틴 서브셋
- 제목/이름: **Gowun Batang** (400/700)
- 파일: `assets/fonts/*.woff2`, 선언: `css/fonts.css`
- 모두 로컬에서 서빙하므로 외부 요청이 없습니다.

## 이미지 처리 (예정 · Task 11)

`tools/optimize_images.py` 로 원본 → EXIF 제거 · 리사이즈 · WebP 변환을 수행할 예정입니다.

```bash
# (예정) uv run python3 tools/optimize_images.py
```

원본 이미지는 `assets/images/originals/` 에 두며 `.gitignore` 로 커밋 대상에서 제외합니다.

## 배포 (GitHub Pages)

1. `main` 브랜치에 푸시
2. GitHub 저장소 → **Settings → Pages** → Source: `main` / `/ (root)`
3. 잠시 후 https://potato9753.github.io/wedding/ 에서 확인

## 프라이버시 · 보안 노트

- 분석/트래킹, 외부 스크립트, API 키가 없습니다.
- 이미지는 EXIF(GPS/기기정보)를 제거하고 엄선한 소수만 업로드합니다.
- `robots.txt` + `noindex` 로 검색 노출을 최소화합니다. (예정)
- 정적 사이트 특성상 **URL 을 아는 사람은 접근 가능**합니다. 민감 정보는 올리지 마세요.

---

## 개발 진행 상황

- [x] **Task 1** — 뼈대 + config(키 없음) + 기본 스타일 셸 + 자가호스팅 폰트
- [x] **Task 2** — config→DOM 렌더 + 날짜/이름 포맷 (TDD, 17 tests)
- [x] **Task 3** — 커버 + 감성 인용구 + 인사말 + 혼주 + 스크롤 애니메이션
- [x] **Task 4** — 신랑·신부 소개 카드 (특징/한 줄 소개)
- [x] **Task 5** — 캘린더 + D-day 카운트다운 + "함께한 시간" 카운터 (TDD, 24 tests)
- [x] **Task 6** — 갤러리 + 라이트박스 (그리드·전체화면·이전/다음·스와이프·키보드)
- [x] Task 7 — 우리의 시간 (타임라인) · 구현 완료했으나 **현재 화면에서 제외**(요청)
- [x] **Task 8** — 오시는 길 (약도 + 지도앱 딥링크 + 주소복사 + 교통편)
- [ ] Task 9 — 연락/RSVP 링크아웃 + 마음 전하실 곳(계좌) + 읽기전용 편지
- [ ] Task 10 — 배경음악 + Web Share + 링크복사 + OG
- [ ] Task 11 — 로컬 이미지 파이프라인 (EXIF제거·리사이즈·WebP)
- [ ] Task 12 — 마무리 + robots/noindex + 반응형 점검 + 배포
