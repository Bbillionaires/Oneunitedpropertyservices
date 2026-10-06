"""Generate SIMULATED "before" images from placeholder "after" photos.

These exist only so the before/after slider can be demonstrated before real
project photography is available. Replace them with actual job photos.
Usage: python3 scripts/make-placeholder-befores.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageChops
import random

SRC = Path(__file__).resolve().parent.parent / "src/assets/placeholders"
OUT = SRC / "before-after"
OUT.mkdir(exist_ok=True)
random.seed(7)


def grime(size, strength=0.55, tint=(92, 74, 52), blur=5):
    """Blotchy multiply layer that reads as dirt / mildew."""
    w, h = size
    small = Image.effect_noise((max(8, w // 110), max(8, h // 110)), 110).resize(size, Image.BICUBIC)
    small = small.filter(ImageFilter.GaussianBlur(blur))
    fine = Image.effect_noise(size, 40).filter(ImageFilter.GaussianBlur(1.2))
    mask = ImageChops.multiply(small, fine.point(lambda v: 128 + v // 2))
    mask = mask.point(lambda v: int(min(255, max(0, (255 - v) * strength * 1.6))))
    layer = Image.new("RGB", size, tint)
    return layer, mask


def surface_mask(img, ground_bias=0.0):
    """Exclude sky (bright, blue-dominant pixels); optionally favour the lower frame."""
    w, h = img.size
    px = img.convert("RGB").load()
    m = Image.new("L", img.size, 255)
    mp = m.load()
    for y in range(h):
        g = 1.0 if ground_bias == 0 else min(1.0, max(0.15, (y / h - 0.25) / 0.5 * ground_bias + (1 - ground_bias)))
        for x in range(w):
            r, gg, b = px[x, y]
            sky = b > r + 12 and b > 140
            mp[x, y] = 0 if sky else int(255 * g)
    return m.filter(ImageFilter.GaussianBlur(6))


def dirty(img, strength, tint=(92, 74, 52), sat=0.6, bright=0.82, ground_bias=0.0):
    surf = surface_mask(img, ground_bias)
    orig = img
    img = ImageEnhance.Color(img).enhance(sat)
    img = ImageEnhance.Brightness(img).enhance(bright)
    img = ImageEnhance.Contrast(img).enhance(0.88)
    layer, mask = grime(img.size, strength, tint)
    blended = ImageChops.multiply(img, Image.blend(Image.new("RGB", img.size, (255, 255, 255)), layer, 0.9))
    mask = ImageChops.multiply(mask, surf)
    out = Image.composite(blended, img, mask)
    # Keep the sky untouched apart from a slight dulling.
    dull = ImageEnhance.Color(orig).enhance(0.8)
    return Image.composite(out, dull, surf)


def dry_lawn(img):
    hsv = img.convert("HSV")
    h, s, v = hsv.split()
    # Push greens toward straw/brown and lower saturation.
    h = h.point(lambda x: int(x * 0.45) if 40 <= x <= 120 else x)
    s = s.point(lambda x: int(x * 0.55))
    out = Image.merge("HSV", (h, s, v)).convert("RGB")
    out = ImageEnhance.Brightness(out).enhance(0.9)
    return dirty(out, 0.35, tint=(110, 90, 60), sat=0.9, bright=0.97)


def stale_interior(img):
    warm = Image.new("RGB", img.size, (226, 200, 150))
    out = ImageChops.multiply(img, warm)
    out = ImageEnhance.Brightness(out).enhance(0.85)
    return dirty(out, 0.4, tint=(120, 100, 75), sat=0.7, bright=0.95)


jobs = {
    "pressure-washing": ("sidewalk-grounds.jpg", lambda im: dirty(im, 0.8, sat=0.55, bright=0.8, ground_bias=1.0)),
    "painting": ("facade-white.jpg", lambda im: dirty(im, 0.6, tint=(150, 132, 96), sat=0.5, bright=0.88)),
    "landscaping": ("lawn-commercial.jpg", dry_lawn),
    "property-cleanup": ("hoa-community.jpg", lambda im: dirty(im, 0.65, sat=0.6, bright=0.86, ground_bias=0.8)),
    "turnovers": ("turnover-interior.jpg", stale_interior),
}

for name, (src, fn) in jobs.items():
    im = Image.open(SRC / src).convert("RGB")
    w, h = im.size
    # Normalise to a 3:2 crop so the slider frames are consistent.
    target = 3 / 2
    if w / h > target:
        nw = int(h * target); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((1500, 1000), Image.LANCZOS)
    im.save(OUT / f"{name}-after.jpg", quality=84, optimize=True, progressive=True)
    fn(im).save(OUT / f"{name}-before.jpg", quality=84, optimize=True, progressive=True)
    print("wrote", name)
