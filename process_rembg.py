from rembg import remove
from PIL import Image

for name, src, dest in [
    ("full", "/Users/preetbansal/Infinite Dance Centre/infinite-dance/components/logo/logo with name.png", "public/logo-full.png"),
    ("icon", "/Users/preetbansal/Infinite Dance Centre/infinite-dance/components/logo/logo.png", "public/logo-icon.png")
]:
    img = Image.open(src)
    out = remove(img)
    out.save(dest)
