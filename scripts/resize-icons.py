"""Downscale brand contact icons to 256px max for web performance."""
from PIL import Image
import os

D = "/home/z/my-project/public/icons"

for f in ["whatsapp.png", "discord.png", "telegram.png"]:
    p = os.path.join(D, f)
    im = Image.open(p).convert("RGBA")
    im.thumbnail((256, 256), Image.LANCZOS)
    im.save(p, optimize=True)

p = os.path.join(D, "band.jpg")
im = Image.open(p).convert("RGB")
im.thumbnail((256, 256), Image.LANCZOS)
im.save(p, quality=88, optimize=True)

for f in sorted(os.listdir(D)):
    fp = os.path.join(D, f)
    with Image.open(fp) as im:
        print(f, im.size, f"{os.path.getsize(fp)//1024}KB")
