import os
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE_DIR = r"D:\CODEX-PROJECT\Perpustakaan Digital"
SVG_SRC = os.path.join(BASE_DIR, "Lambang_Kab_Sukabumi.svg")
WEBP_SRC = os.path.join(BASE_DIR, "Lambang_Kab_Sukabumi.svg.webp")

PUBLIC_DIR = os.path.join(BASE_DIR, "public")
APP_DIR = os.path.join(BASE_DIR, "src", "app")

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(APP_DIR, exist_ok=True)

# 1. Copy SVG to public and app
shutil.copy(SVG_SRC, os.path.join(PUBLIC_DIR, "logo_sukabumi.svg"))
shutil.copy(SVG_SRC, os.path.join(PUBLIC_DIR, "icon.svg"))
shutil.copy(SVG_SRC, os.path.join(APP_DIR, "icon.svg"))
print("Copied SVG logos to public and app dirs.")

# 2. Copy WebP logo
shutil.copy(WEBP_SRC, os.path.join(PUBLIC_DIR, "logo_sukabumi.webp"))

# 3. Open WebP logo with PIL
logo_img = Image.open(WEBP_SRC).convert("RGBA")
logo_w, logo_h = logo_img.size

# Save clean PNG logo
logo_img.save(os.path.join(PUBLIC_DIR, "logo_sukabumi.png"), "PNG")

# 4. Generate Apple Touch Icon (180x180) with square padding & subtle rounded corners
apple_size = 180
apple_bg = Image.new("RGBA", (apple_size, apple_size), (17, 24, 17, 255)) # Dark village green background

# Scale logo to fit inside 140x140
aspect = logo_w / logo_h
target_h = 136
target_w = int(target_h * aspect)
logo_resized = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

paste_x = (apple_size - target_w) // 2
paste_y = (apple_size - target_h) // 2
apple_bg.paste(logo_resized, (paste_x, paste_y), logo_resized)

apple_bg.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")
apple_bg.save(os.path.join(APP_DIR, "apple-icon.png"), "PNG")
print("Saved apple-touch-icon.png (180x180).")

# 5. Generate favicon.ico (16, 32, 48, 64)
ico_img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
ico_target_h = 58
ico_target_w = int(ico_target_h * aspect)
ico_logo = logo_img.resize((ico_target_w, ico_target_h), Image.Resampling.LANCZOS)
ico_x = (64 - ico_target_w) // 2
ico_y = (64 - ico_target_h) // 2
ico_img.paste(ico_logo, (ico_x, ico_y), ico_logo)

ico_img.save(os.path.join(PUBLIC_DIR, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
ico_img.save(os.path.join(APP_DIR, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("Saved multi-size favicon.ico.")

# 6. Generate Stunning Open Graph / Link Thumbnail (1200 x 630 px)
OG_W = 1200
OG_H = 630

# Background base
bg_path = os.path.join(PUBLIC_DIR, "images", "desa_pangkalan_bg.jpg")
if os.path.exists(bg_path):
    og_base = Image.open(bg_path).convert("RGBA")
    # Resize and crop to 1200x630
    og_base = og_base.resize((OG_W, int(OG_W * og_base.height / og_base.width)), Image.Resampling.LANCZOS)
    if og_base.height > OG_H:
        top = (og_base.height - OG_H) // 2
        og_base = og_base.crop((0, top, OG_W, top + OG_H))
    else:
        og_base = og_base.resize((OG_W, OG_H), Image.Resampling.LANCZOS)
    
    # Slight blur on background for depth of field
    og_base = og_base.filter(ImageFilter.GaussianBlur(3))
else:
    og_base = Image.new("RGBA", (OG_W, OG_H), (10, 16, 11, 255))

# Dark gradient overlay with rich emerald tone
overlay = Image.new("RGBA", (OG_W, OG_H), (0, 0, 0, 0))
draw_overlay = ImageDraw.Draw(overlay)

# Fill with rich dark gradient
for y in range(OG_H):
    alpha = int(220 + (y / OG_H) * 25)  # 220 to 245
    r, g, b = 10, 20, 12
    draw_overlay.line([(0, y), (OG_W, y)], fill=(r, g, b, alpha))

og_canvas = Image.alpha_composite(og_base, overlay)

# Decorative emerald/gold glow circles
glow_layer = Image.new("RGBA", (OG_W, OG_H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)
glow_draw.ellipse([-100, -100, 450, 450], fill=(36, 64, 33, 140)) # Top-left emerald ambient
glow_draw.ellipse([800, 150, 1350, 700], fill=(24, 76, 38, 100)) # Bottom-right ambient
glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(60))
og_canvas = Image.alpha_composite(og_canvas, glow_layer)

# Place Mascot on the right side if exists
mascot_path = os.path.join(PUBLIC_DIR, "images", "pak_kades_mascot.png")
if os.path.exists(mascot_path):
    mascot_img = Image.open(mascot_path).convert("RGBA")
    m_aspect = mascot_img.width / mascot_img.height
    m_h = 490
    m_w = int(m_h * m_aspect)
    mascot_resized = mascot_img.resize((m_w, m_h), Image.Resampling.LANCZOS)
    
    # Mascot subtle drop shadow
    shadow = Image.new("RGBA", (m_w + 30, m_h + 30), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse([10, m_h - 20, m_w + 20, m_h + 20], fill=(0, 0, 0, 140))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    
    m_x = OG_W - m_w - 60
    m_y = OG_H - m_h - 20
    og_canvas.paste(shadow, (m_x - 15, m_y + 10), shadow)
    og_canvas.paste(mascot_resized, (m_x, m_y), mascot_resized)

# Place Sukabumi Logo on the left
logo_banner_h = 160
logo_banner_w = int(logo_banner_h * aspect)
logo_banner = logo_img.resize((logo_banner_w, logo_banner_h), Image.Resampling.LANCZOS)

# Logo glow backdrop
logo_x = 75
logo_y = 65
logo_glow = Image.new("RGBA", (logo_banner_w + 80, logo_banner_h + 80), (0, 0, 0, 0))
lg_draw = ImageDraw.Draw(logo_glow)
lg_draw.ellipse([10, 10, logo_banner_w + 70, logo_banner_h + 70], fill=(46, 125, 50, 100))
logo_glow = logo_glow.filter(ImageFilter.GaussianBlur(25))
og_canvas.paste(logo_glow, (logo_x - 40, logo_y - 40), logo_glow)
og_canvas.paste(logo_banner, (logo_x, logo_y), logo_banner)

# Fonts
font_bold_path = "C:/Windows/Fonts/segoeuib.ttf"
font_regular_path = "C:/Windows/Fonts/segoeui.ttf"

f_badge = ImageFont.truetype(font_bold_path, 16)
f_title = ImageFont.truetype(font_bold_path, 46)
f_sub = ImageFont.truetype(font_bold_path, 20)
f_tagline = ImageFont.truetype(font_regular_path, 19)
f_chip = ImageFont.truetype(font_bold_path, 14)
f_domain = ImageFont.truetype(font_bold_path, 17)

draw = ImageDraw.Draw(og_canvas)

# Header Badge
text_start_x = logo_x + logo_banner_w + 35
badge_text = "PEMERINTAH KABUPATEN SUKABUMI • DESA PANGKALAN"
draw.text((text_start_x, logo_y + 5), badge_text, font=f_badge, fill=(163, 230, 53, 255)) # Lime/gold color

# Main Headline
draw.text((text_start_x, logo_y + 35), "Pustaka Pangkalan", font=f_title, fill=(255, 255, 255, 255))

# Sub-headline
draw.text((text_start_x, logo_y + 98), "Perpustakaan & Portal Pengetahuan Digital Desa", font=f_sub, fill=(209, 250, 229, 255))

# Description / Tagline
desc_y = logo_y + logo_banner_h + 35
desc_text1 = "Gerbang Literasi Mandiri Desa Pangkalan, Kec. Cikidang."
desc_text2 = "Menyediakan ratusan modul pertanian modern, BUMDes, kesehatan,"
desc_text3 = "sastra budaya Sunda, serta asisten cerdas Kades AI Desa."
draw.text((logo_x, desc_y), desc_text1, font=f_tagline, fill=(243, 244, 246, 255))
draw.text((logo_x, desc_y + 28), desc_text2, font=f_tagline, fill=(209, 213, 219, 255))
draw.text((logo_x, desc_y + 56), desc_text3, font=f_tagline, fill=(209, 213, 219, 255))

# Feature Chips
chips = [
    "5.000+ Koleksi E-Book",
    "Teknologi Tani & Bioflok",
    "Aksara Sunda",
    "Tanya Kades AI",
    "Sirkulasi Buku Balai Desa"
]

chip_y = desc_y + 115
cur_x = logo_x
for chip in chips:
    # Measure chip width
    bbox = draw.textbbox((0, 0), chip, font=f_chip)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    pad_x = 14
    pad_y = 7
    chip_w = tw + pad_x * 2
    chip_h = th + pad_y * 2
    
    # Check if exceeds mascot area
    if cur_x + chip_w > 780:
        break
        
    # Draw pill background
    draw.rounded_rectangle(
        [cur_x, chip_y, cur_x + chip_w, chip_y + chip_h],
        radius=12,
        fill=(27, 43, 29, 200),
        outline=(74, 140, 77, 180),
        width=1
    )
    draw.text((cur_x + pad_x, chip_y + pad_y - 1), chip, font=f_chip, fill=(236, 253, 245, 255))
    cur_x += chip_w + 10

# Bottom URL Badge Bar
url_y = OG_H - 74
url_box_w = 460
draw.rounded_rectangle(
    [logo_x, url_y, logo_x + url_box_w, url_y + 44],
    radius=16,
    fill=(16, 50, 24, 230),
    outline=(52, 168, 83, 220),
    width=2
)

# Glowing online indicator dot
dot_cx = logo_x + 24
dot_cy = url_y + 22
draw.ellipse([dot_cx - 6, dot_cy - 6, dot_cx + 6, dot_cy + 6], fill=(52, 211, 153, 255))
draw.ellipse([dot_cx - 3, dot_cy - 3, dot_cx + 3, dot_cy + 3], fill=(255, 255, 255, 255))

draw.text((logo_x + 40, url_y + 11), "https://perpus-pangkalan.vercel.app", font=f_domain, fill=(255, 255, 255, 255))

# Save output thumbnail in multiple destinations
og_rgb = og_canvas.convert("RGB")
og_rgb.save(os.path.join(PUBLIC_DIR, "og-image.png"), "PNG", quality=95)
og_rgb.save(os.path.join(PUBLIC_DIR, "thumbnail.png"), "PNG", quality=95)
og_rgb.save(os.path.join(APP_DIR, "opengraph-image.png"), "PNG", quality=95)
print("Saved og-image.png, thumbnail.png, and opengraph-image.png (1200x630).")
