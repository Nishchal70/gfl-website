"""Generate favicon.ico (16/32/48) from the GFL logo PNG."""
from PIL import Image

src = Image.open("/home/z/my-project/public/assets/gfl-logo.png").convert("RGBA")
# Square-crop centered (logo is roughly square already)
w, h = src.size
side = min(w, h)
src = src.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))

sizes = [(16, 16), (32, 32), (48, 48)]
frames = [src.resize(s, Image.LANCZOS) for s in sizes]
frames[-1].save(
    "/home/z/my-project/public/favicon.ico",
    format="ICO",
    sizes=sizes,
)
print("favicon.ico written:", frames[-1].size)
