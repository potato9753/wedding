#!/usr/bin/env python3
"""OG 공유 썸네일(1200x630) 생성 — 좌: 대표 사진 / 우: 이름·일시·장소.

한글 렌더를 위해 TTF 폰트가 필요합니다. (아래 FONT_CANDIDATES 중 존재하는 것 사용)
  예) Gowun Batang: https://github.com/google/fonts/raw/main/ofl/gowunbatang/GowunBatang-Regular.ttf

사용:
  uv run --with pillow python3 tools/make_og.py <사진경로> <출력경로>
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

FONT_CANDIDATES = [
    "/tmp/GowunBatang.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
    "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
]

W, H = 1200, 630
PW = 560  # 좌측 사진 패널 폭
COL_TEXT = (62, 69, 78)
COL_SOFT = (107, 114, 123)
COL_PRIMARY = (142, 166, 180)
COL_ACCENT = (185, 143, 147)
COL_LINE = (220, 227, 231)
COL_BG = (240, 244, 246)


def font_path():
    import os
    for p in FONT_CANDIDATES:
        if os.path.exists(p):
            return p
    raise SystemExit("한글 TTF 폰트를 찾을 수 없습니다. FONT_CANDIDATES 확인.")


def main(argv):
    src = argv[0] if argv else "assets/images/originals/IMG_6708.jpeg"
    out = argv[1] if len(argv) > 1 else "assets/images/og-cover.jpg"
    fp = font_path()

    img = Image.new("RGB", (W, H), COL_BG)

    # 좌측 사진 (cover-crop, 얼굴 위해 상단 편향)
    photo = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    scale = max(PW / photo.width, H / photo.height)
    nw, nh = round(photo.width * scale), round(photo.height * scale)
    photo = photo.resize((nw, nh), Image.LANCZOS)
    left = (nw - PW) // 2
    top = int((nh - H) * 0.18)
    photo = photo.crop((left, top, left + PW, top + H))
    img.paste(photo, (0, 0))

    draw = ImageDraw.Draw(img)
    cx = PW + (W - PW) // 2

    def f(size):
        return ImageFont.truetype(fp, size)

    def center(y, text, font, fill):
        b = draw.textbbox((0, 0), text, font=font)
        draw.text((cx - (b[2] - b[0]) / 2, y), text, font=font, fill=fill)

    def center_segs(y, segs, font):
        ws = [draw.textbbox((0, 0), t, font=font)[2] for t, _ in segs]
        x = cx - sum(ws) / 2
        for (t, fill), w in zip(segs, ws):
            draw.text((x, y), t, font=font, fill=fill)
            x += w

    center(196, "W E D D I N G   I N V I T A T I O N", f(18), COL_PRIMARY)
    center_segs(240, [("이재진 ", COL_TEXT), ("♥", COL_ACCENT), (" 이소은", COL_TEXT)], f(60))
    draw.line([(cx - 42, 340), (cx + 42, 340)], fill=COL_LINE, width=2)
    center(362, "2026. 12. 20 (일) 오후 3시", f(27), COL_TEXT)
    center(406, "더컨벤션 송파문정 · 아모르홀", f(21), COL_SOFT)

    img.save(out, "JPEG", quality=88)
    print(f"OG saved: {out}  {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main(sys.argv[1:])
