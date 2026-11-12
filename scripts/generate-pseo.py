"""Programmatic SEO generator for ShrinkMyPhoto.

Generates standalone static landing pages for high-volume photo compression queries.
All output is pure static HTML with Schema.org JSON-LD and zero runtime dependencies.
"""
import os
import json

BASE_URL = "https://shrinkmyphoto.othrys.be"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_TOOLS = os.path.join(ROOT, "public", "tools")

PAGES = [
    {
        "slug": "compress-image-to-100kb",
        "target": "100",
        "format": "image/jpeg",
        "title": "Compress Image to 100KB Online Free - Fast & Private",
        "meta_desc": "Compress photos and images to under 100KB online for free. 100% in-browser client-side compression for government forms, job portals, and upload limits.",
        "h1": "Compress Image to 100KB Online",
        "subtitle": "Precision client-side image compression. Reduce any photo under 100KB with zero quality loss and zero cloud uploads.",
        "badge": "Target KB Tool",
        "faqs": [
            {
                "q": "How do I compress an image to exactly 100KB?",
                "a": "Upload or drag your image into ShrinkMyPhoto, set the target size to 100 KB, and click 'Shrink photo'. The browser automatically calculates the optimal resolution and JPEG compression ratio to stay strictly under 100KB."
            },
            {
                "q": "Is it safe to compress sensitive ID or passport photos here?",
                "a": "Yes, absolutely. ShrinkMyPhoto is 100% sovereign and client-side. Your photos never leave your device, are never uploaded to any server, and no cookies or third-party trackers exist."
            },
            {
                "q": "Which file formats are supported?",
                "a": "You can compress JPG, PNG, and WebP images. You can also convert between formats (e.g. PNG to compressed JPEG) directly in your browser."
            }
        ],
        "use_cases": [
            "Government application portals with strict 100KB upload limits",
            "Job application portals (Workday, Taleo, Greenhouse)",
            "University admission and scholarship registration forms",
            "Email attachments that must remain lightweight"
        ]
    },
    {
        "slug": "compress-image-to-200kb",
        "target": "200",
        "format": "image/jpeg",
        "title": "Compress Image to 200KB Online Free - US Visa & Passport",
        "meta_desc": "Compress your photo to under 200KB for US Visa (DS-160), Schengen Visa, and passport application portals. 100% private in-browser compression.",
        "h1": "Compress Photo to 200KB Online",
        "subtitle": "Perfect for US Visa DS-160, Schengen Visa, and passport portals requiring under 200KB/240KB file sizes.",
        "badge": "Visa & Passport Spec",
        "faqs": [
            {
                "q": "Will this work for US Visa DS-160 photo upload?",
                "a": "Yes! The US State Department DS-160 photo portal requires JPEG files equal to or less than 240 KB. Compressing to 200KB guarantees instant acceptance without exceeding the limit."
            },
            {
                "q": "Does compressing reduce the 600x600 px dimensions?",
                "a": "You can control dimension downscaling. If your photo is already 600x600 pixels, you can set resize to 'Original dimensions' so only byte compression is applied."
            },
            {
                "q": "Are my visa photos stored anywhere?",
                "a": "Never. All image processing executes via local Canvas Web APIs inside your browser sandbox. Zero bytes are transmitted across the internet."
            }
        ],
        "use_cases": [
            "US Visa application (DS-160) requiring files <= 240 KB",
            "Schengen Visa appointment photo uploads",
            "Passport renewal portals (UK, Canada, Australia, EU)",
            "Online identity verification portals"
        ]
    },
    {
        "slug": "compress-image-to-50kb",
        "target": "50",
        "format": "image/jpeg",
        "title": "Compress Image to 50KB Online Free - Exam & Portal Ready",
        "meta_desc": "Reduce image size to under 50KB online. Perfect for state examinations, civil service forms, signature scans, and recruitment portals.",
        "h1": "Compress Image to 50KB Online",
        "subtitle": "Ultra-compact compression for strict examination boards, civil service portals, and signature uploads.",
        "badge": "High Compression",
        "faqs": [
            {
                "q": "How can I get an image down to 50KB without making it blurry?",
                "a": "ShrinkMyPhoto uses binary search optimization to balance downsampling and high-efficiency quantization, preserving text and facial details while meeting the 50KB ceiling."
            },
            {
                "q": "Can I compress signature and thumb impression photos to 50KB?",
                "a": "Yes! You can paste or upload scanned signatures and set the target to 50KB (or 20KB) for instant portal-compliant files."
            }
        ],
        "use_cases": [
            "Public service and competitive exam application portals",
            "Digital signature and identity card card scans",
            "Restricted mobile web forms",
            "Embedded thumbnails and avatar icons"
        ]
    },
    {
        "slug": "compress-image-to-20kb",
        "target": "20",
        "format": "image/jpeg",
        "title": "Compress Image to 20KB Online Free - Signature & Thumbprint",
        "meta_desc": "Compress scanned signatures and photos to under 20KB online for free. Instant client-side binary search optimizer with zero cloud uploads.",
        "h1": "Compress Image to 20KB Online",
        "subtitle": "Extreme compression tailored for scanned signatures, candidate photographs, and government upload limits.",
        "badge": "Micro Compression",
        "faqs": [
            {
                "q": "Why do some government portals require 10KB - 20KB images?",
                "a": "Many legacy administrative databases enforce strict 20KB limits per field to save storage. ShrinkMyPhoto lets you hit exact byte thresholds effortlessly."
            },
            {
                "q": "Will 20KB compression work on mobile phones?",
                "a": "Yes, ShrinkMyPhoto works seamlessly in mobile Safari, Chrome, and Firefox directly on iOS and Android."
            }
        ],
        "use_cases": [
            "State exam online portals requiring 10KB to 20KB files",
            "Scanned signature uploads for banking and KYC",
            "Thumbprint biometric image uploads",
            "Ultra-low bandwidth web applications"
        ]
    },
    {
        "slug": "compress-image-to-500kb",
        "target": "500",
        "format": "image/jpeg",
        "title": "Compress Image to 500KB Online Free - High Quality",
        "meta_desc": "Compress high-resolution photos to under 500KB without visible quality loss. Great for real estate, portfolio websites, and email attachments.",
        "h1": "Compress Photo to 500KB Online",
        "subtitle": "Optimal balance of visual fidelity and lightweight file size for web publishing and email sharing.",
        "badge": "Quality Preservation",
        "faqs": [
            {
                "q": "What is 500KB best suited for?",
                "a": "500KB is the sweet spot for full-bleed hero images, photography portfolios, and real estate listings where high resolution is vital but fast loading is necessary."
            },
            {
                "q": "Can I compress PNG images to 500KB?",
                "a": "Yes, you can compress PNGs directly or convert them to WebP/JPEG for maximum byte savings."
            }
        ],
        "use_cases": [
            "Real estate and property photography uploads",
            "Email newsletters and marketing attachments",
            "Content management systems (WordPress, Shopify)",
            "Social media banner and cover photos"
        ]
    },
    {
        "slug": "compress-image-to-1mb",
        "target": "1024",
        "format": "image/jpeg",
        "title": "Compress Image to 1MB Online Free - Discord & Slack Ready",
        "meta_desc": "Compress large camera photos to under 1MB online for free. Ideal for Discord non-Nitro limits, Slack uploads, and document attachments.",
        "h1": "Compress Photo to 1MB Online",
        "subtitle": "Instantly downsize 15MB+ smartphone photos to under 1MB for smooth sharing on chat platforms.",
        "badge": "Fast Sharing",
        "faqs": [
            {
                "q": "Why compress to 1MB?",
                "a": "Modern phone cameras shoot 12MP to 48MP photos weighing 8MB to 25MB. Compressing to 1MB allows instant transmission over mobile networks without noticeable visual loss."
            },
            {
                "q": "Does this work offline?",
                "a": "Yes, because ShrinkMyPhoto runs 100% in your browser, once loaded it continues to compress photos even if you disconnect from the internet."
            }
        ],
        "use_cases": [
            "Discord free tier uploads (stay comfortably under limits)",
            "Slack workspace storage optimization",
            "Sending multiple photo attachments via standard email",
            "Fast cloud backup savings"
        ]
    },
    {
        "slug": "passport-photo-compressor",
        "target": "200",
        "format": "image/jpeg",
        "title": "Passport Photo Compressor - Exact Size & Dimensions Online",
        "meta_desc": "Compress and format your passport and visa photo online. Strict compliance with official embassy standards, < 240KB size limit, and zero privacy risks.",
        "h1": "Passport Photo Compressor",
        "subtitle": "Ensure your passport photo meets strict government file size limits with 100% local, sovereign image compression.",
        "badge": "Official Standards",
        "faqs": [
            {
                "q": "What are the standard requirements for a digital passport photo?",
                "a": "Most embassies (including US, UK, EU, and Schengen) require JPEG format, between 600x600 and 1200x1200 pixels, with a file size strictly between 50KB and 240KB on a plain white background."
            },
            {
                "q": "Can I replace the background with white?",
                "a": "ShrinkMyPhoto provides an automatic white background flattening option when converting transparent or cropped images to JPEG."
            }
        ],
        "use_cases": [
            "Online passport renewal systems",
            "Electronic visa (e-Visa) applications worldwide",
            "International student visa registration",
            "Official civil registry identity cards"
        ]
    },
    {
        "slug": "compress-webp-image",
        "target": "80",
        "format": "image/webp",
        "title": "Compress WebP Image Online Free - Next-Gen Web Optimizer",
        "meta_desc": "Compress WebP images directly in your browser. Target exact KB budgets for maximum Google Lighthouse Performance and Core Web Vitals.",
        "h1": "Compress WebP Images Online",
        "subtitle": "Lightweight, next-generation WebP compression. Perfect for web developers optimizing Core Web Vitals and Lighthouse 100 scores.",
        "badge": "Modern WebP",
        "faqs": [
            {
                "q": "Why compress WebP instead of JPEG?",
                "a": "WebP offers superior lossy and lossless compression algorithms, typically achieving 25% to 35% smaller file sizes than JPEG at equivalent visual quality."
            },
            {
                "q": "Does WebP support transparency?",
                "a": "Yes! WebP supports full alpha transparency while maintaining high compression ratios."
            }
        ],
        "use_cases": [
            "Optimizing hero images for 100/100 Google Lighthouse scores",
            "Reducing Largest Contentful Paint (LCP) on modern websites",
            "Static website asset optimization for edge deployments",
            "Progressive web application bundle assets"
        ]
    }
]

HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="theme-color" content="#000000"/>
  <title>{title} | ShrinkMyPhoto</title>
  <meta name="description" content="{meta_desc}"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <link rel="canonical" href="{canonical}"/>
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg"/>
  <style>
    :root {{
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg: #0b0f19;
      --card-bg: #111827;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --border: #1f2937;
      --radius: 12px;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 16px/1.6 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }}
    .container {{
      max-width: 820px;
      margin: 4vh auto;
      padding: 0 20px;
    }}
    header {{
      text-align: center;
      margin-bottom: 32px;
    }}
    .badge {{
      display: inline-block;
      background: rgba(37, 99, 235, 0.15);
      color: #60a5fa;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 999px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }}
    h1 {{
      font-size: clamp(26px, 4.5vw, 40px);
      line-height: 1.2;
      margin: 0 0 14px 0;
      color: #ffffff;
    }}
    .subtitle {{
      font-size: 18px;
      color: var(--text-muted);
      margin: 0 0 24px 0;
    }}
    .cta-box {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      margin-bottom: 36px;
    }}
    .start-button {{
      display: inline-block;
      background: var(--primary);
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 36px;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.15s ease-in-out, transform 0.1s ease;
    }}
    .start-button:hover {{
      background: var(--primary-hover);
      transform: translateY(-1px);
    }}
    .guarantees {{
      margin-top: 16px;
      font-size: 14px;
      color: var(--text-muted);
    }}
    .content-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      margin-bottom: 24px;
    }}
    h2, h3 {{ color: #ffffff; margin-top: 0; }}
    ul, ol {{ padding-left: 20px; }}
    li {{ margin-bottom: 8px; color: var(--text-muted); }}
    li strong {{ color: var(--text); }}
    .privacy-box {{
      background: rgba(16, 185, 129, 0.08);
      border-left: 4px solid #10b981;
      padding: 16px;
      border-radius: 0 var(--radius) var(--radius) 0;
      margin: 20px 0;
      font-size: 14px;
      color: #a7f3d0;
    }}
    .faq-item {{
      border-bottom: 1px solid var(--border);
      padding: 14px 0;
    }}
    .faq-item summary {{
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
    }}
    .faq-item p {{
      margin: 10px 0 0 0;
      color: var(--text-muted);
    }}
    footer {{
      text-align: center;
      padding: 32px 0;
      font-size: 14px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      margin-top: 40px;
    }}
    footer a {{ color: #60a5fa; text-decoration: none; margin: 0 8px; }}
    footer a:hover {{ text-decoration: underline; }}
  </style>
  <script type="application/ld+json">
  {schema_json}
  </script>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">{badge}</span>
      <h1>{h1}</h1>
      <p class="subtitle">{subtitle}</p>
    </header>

    <div class="cta-box">
      <a href="/?target={target}&format={format}" class="start-button">
        Launch Compressor (Target: {target} KB) ↗
      </a>
      <div class="guarantees">
        ⚡ 100% In-Browser · 🔒 Zero Cloud Uploads · 🆓 Free Forever
      </div>
    </div>

    <div class="content-card">
      <h2>How to Compress Your Photo to {target} KB</h2>
      <ol>
        <li>Click <strong>Launch Compressor</strong> to load ShrinkMyPhoto with the {target} KB preset preselected.</li>
        <li>Drag and drop your photo or click <strong>Choose photo</strong> (you can also paste directly with Ctrl+V).</li>
        <li>Review your target size ({target} KB) and chosen format.</li>
        <li>Click <strong>Shrink photo</strong>. The browser searches for the ideal quality setting in under 150ms.</li>
        <li>Click <strong>Download photo</strong> or <strong>Copy photo</strong> to use your newly compressed image immediately.</li>
      </ol>
      <div class="privacy-box">
        <strong>🔒 Sovereign Privacy Guarantee:</strong> Unlike traditional image compression services, ShrinkMyPhoto operates entirely inside your device's browser memory using HTML5 Canvas. Your personal identification documents and photos are never sent across the internet.
      </div>
    </div>

    <div class="content-card">
      <h2>Common Use Cases for {target} KB Images</h2>
      <ul>
        {use_cases_html}
      </ul>
    </div>

    <div class="content-card">
      <h2>Frequently Asked Questions</h2>
      {faqs_html}
    </div>

    <footer>
      <div>
        <a href="/">ShrinkMyPhoto Home</a> ·
        <a href="https://freeqr.othrys.be">FreeQR</a> ·
        <a href="https://quickpercent.othrys.be">QuickPercent</a> ·
        <a href="https://unixtime.othrys.be">UnixTime</a> ·
        <a href="https://vintagetoycatalog.com">Vintage Toy Catalog</a>
      </div>
      <p style="margin-top: 12px;">© 2026 OTHRYS. Built to be useful, private, and durable.</p>
    </footer>
  </div>
</body>
</html>"""

def generate():
    os.makedirs(PUBLIC_TOOLS, exist_ok=True)
    sitemap_urls = []

    for page in PAGES:
        slug_dir = os.path.join(PUBLIC_TOOLS, page["slug"])
        os.makedirs(slug_dir, exist_ok=True)
        canonical = f"{BASE_URL}/tools/{page['slug']}/"
        sitemap_urls.append(canonical)

        use_cases_html = "\n        ".join(f"<li><strong>{uc}</strong></li>" for uc in page["use_cases"])
        faqs_html = "\n      ".join(
            f'<details class="faq-item"><summary>{faq["q"]}</summary><p>{faq["a"]}</p></details>'
            for faq in page["faqs"]
        )

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebApplication",
                    "name": page["title"],
                    "applicationCategory": "MultimediaApplication",
                    "operatingSystem": "Any modern web browser",
                    "url": canonical,
                    "description": page["meta_desc"],
                    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
                    "isAccessibleForFree": True,
                    "featureList": [
                        f"Compress image to {page['target']} KB",
                        "Client-side HTML5 canvas processing",
                        "Zero tracking cookies & zero server uploads",
                        "High fidelity quantization and downsampling"
                    ]
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": faq["q"],
                            "acceptedAnswer": {"@type": "Answer", "text": faq["a"]}
                        }
                        for faq in page["faqs"]
                    ]
                }
            ]
        }

        html = HTML_TEMPLATE.format(
            title=page["title"],
            meta_desc=page["meta_desc"],
            canonical=canonical,
            badge=page["badge"],
            h1=page["h1"],
            subtitle=page["subtitle"],
            target=page["target"],
            format=page["format"],
            use_cases_html=use_cases_html,
            faqs_html=faqs_html,
            schema_json=json.dumps(schema, indent=2)
        )

        file_path = os.path.join(slug_dir, "index.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Generated {file_path}")

    # Generate sitemap-tools.xml
    sitemap_content = ['<?xml version="1.0" encoding="UTF-8"?>',
                       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in sitemap_urls:
        sitemap_content.append(f"  <url><loc>{url}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>")
    sitemap_content.append('</urlset>')

    sitemap_path = os.path.join(ROOT, "public", "sitemap-tools.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap_content))
    print(f"Generated {sitemap_path}")

    # Update sitemap.xml to be a sitemap index or include both
    index_sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>{BASE_URL}/sitemap-core.xml</loc></sitemap>
  <sitemap><loc>{BASE_URL}/sitemap-tools.xml</loc></sitemap>
</sitemapindex>'''

    core_sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>'''

    with open(os.path.join(ROOT, "public", "sitemap-core.xml"), "w", encoding="utf-8") as f:
        f.write(core_sitemap)
    with open(os.path.join(ROOT, "public", "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(index_sitemap)
    print("Updated sitemap.xml to sitemapindex with sitemap-core.xml & sitemap-tools.xml")

if __name__ == "__main__":
    generate()
