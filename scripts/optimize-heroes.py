"""Optimize GFL hero images: convert PNG -> WebP and remove dead assets.

- gfl-hero-random-1..7.png  -> .webp (quality 82, method 6, visually lossless)
- deletes the 3 unreferenced legacy heroes (clan-village-v2, fantasy-v1, loot-v3)
Run from repo root: python3 scripts/optimize-heroes.py
"""
from pathlib import Path
from PIL import Image

ASSETS = Path("/home/z/my-project/public/assets")
HEROES = [f"gfl-hero-random-{i}" for i in range(1, 8)]
DEAD = ["gfl-hero-clan-village-v2", "gfl-hero-fantasy-v1", "gfl-hero-loot-v3"]


def main() -> None:
    total_before = total_after = 0
    for name in HEROES:
        src = ASSETS / f"{name}.png"
        dst = ASSETS / f"{name}.webp"
        if not src.exists():
            print(f"skip {src.name} (missing)")
            continue
        img = Image.open(src).convert("RGB")
        img.save(dst, "WEBP", quality=82, method=6)
        before, after = src.stat().st_size, dst.stat().st_size
        total_before += before
        total_after += after
        print(f"{name}: {before/1e6:.2f}MB -> {after/1e6:.2f}MB "
              f"({100 - after * 100 // before}% smaller) "
              f"{img.size[0]}x{img.size[1]}")
        src.unlink()  # remove the heavy PNG once WebP exists
        print(f"  deleted {src.name}")

    for name in DEAD:
        dead_file = ASSETS / f"{name}.png"
        if dead_file.exists():
            size = dead_file.stat().st_size
            dead_file.unlink()
            total_before += size
            print(f"deleted unreferenced {dead_file.name} ({size/1e6:.2f}MB)")

    print(f"\nTOTAL: {total_before/1e6:.1f}MB -> {total_after/1e6:.1f}MB "
          f"(saved {(total_before-total_after)/1e6:.1f}MB)")


if __name__ == "__main__":
    main()
