#!/usr/bin/env python3
"""이미지 최적화 파이프라인 — EXIF 제거 · 회전 보정 · 리사이즈 · WebP 변환.

프라이버시: 원본 사진의 EXIF(GPS/기기정보)를 제거하고, 웹용으로 리사이즈합니다.

사용법 (uv):
  # 개별 매핑 (src:dst[:최대변길이])
  uv run --with pillow python3 tools/optimize_images.py \
      IMG_1234.jpeg:assets/images/cover.webp:1400 \
      IMG_5678.jpeg:assets/images/gallery/01.webp:1200

  # 폴더 일괄 (out 폴더에 같은 이름의 .webp 생성)
  uv run --with pillow python3 tools/optimize_images.py --dir 입력폴더 출력폴더 [최대변길이]

원본 이미지는 assets/images/originals/ (gitignore) 에 보관하세요.
"""
import glob
import os
import sys

from PIL import Image, ImageOps

EXTS = (".jpg", ".jpeg", ".png", ".webp", ".heic")


def optimize(src, dst, max_side=1600, quality=82):
    im = ImageOps.exif_transpose(Image.open(src))  # 회전 보정(EXIF orientation 적용)
    im = im.convert("RGB")                          # 알파/ICC 정리
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
    # exif 를 전달하지 않으므로 메타데이터(GPS 등) 제거됨
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"{os.path.basename(src)} -> {dst}  {im.size[0]}x{im.size[1]}  {os.path.getsize(dst) // 1024}KB")


def main(argv):
    if not argv:
        print(__doc__)
        return
    if argv[0] == "--dir":
        indir, outdir = argv[1], argv[2]
        max_side = int(argv[3]) if len(argv) > 3 else 1600
        for f in sorted(glob.glob(os.path.join(indir, "*"))):
            if f.lower().endswith(EXTS):
                name = os.path.splitext(os.path.basename(f))[0] + ".webp"
                optimize(f, os.path.join(outdir, name), max_side)
        return
    for spec in argv:
        parts = spec.split(":")
        src, dst = parts[0], parts[1]
        max_side = int(parts[2]) if len(parts) > 2 else 1600
        optimize(src, dst, max_side)


if __name__ == "__main__":
    main(sys.argv[1:])
