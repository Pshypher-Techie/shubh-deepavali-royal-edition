# Shubh Deepavali — The Art of Auspicious Illumination
### *Presented in the Grand Tradition of Rolex Watchmaking & Royal Indian Heritage*

[![Live Website](https://img.shields.io/badge/Live%20Website-GitHub%20Pages-006039?style=for-the-badge&logo=github)](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/)
[![License: MIT](https://img.shields.io/badge/License-MIT-dfb76c?style=for-the-badge)](LICENSE)

A bespoke, ultra-luxurious web experience designed to greet **Diwali (Deepavali)** with personalised names, inspired by the prestigious editorial craftsmanship and design language of **[Rolex Watchmaking Features](https://www.rolex.com/watchmaking/features)** merged with **Imperial Indian artistry**.

🌐 **Live Experience**: [https://pshypher-techie.github.io/shubh-deepavali-royal-edition/](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/)

---

## 🌟 Live Personalization Links

Share bespoke, consecrated greetings with friends, family, and colleagues with a single click:

- **For Family**: [https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=The%20Kapoor%20Family&from=Biswajit&blessing=prosperity](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=The%20Kapoor%20Family&from=Biswajit&blessing=prosperity)
- **For Wisdom & Growth**: [https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Pooja%20%26%20Aarav&from=Biswajit&blessing=wisdom](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Pooja%20%26%20Aarav&from=Biswajit&blessing=wisdom)
- **For Business Partners**: [https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Esteemed%20Partners&from=Biswajit&blessing=victory](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Esteemed%20Partners&from=Biswajit&blessing=victory)
- **For Parents**: [https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Beloved%20Parents&from=Biswajit&blessing=health](https://pshypher-techie.github.io/shubh-deepavali-royal-edition/?to=Beloved%20Parents&from=Biswajit&blessing=health)

---

## 🛡️ Security & Usability Hardening

This project was built with security and broad usability at its core:

1. **Content Security Policy (CSP)**:
   - Configured with strict resource origin whitelisting (`script-src`, `style-src`, `font-src`, `img-src`).
2. **Defensive Input Sanitization**:
   - All query parameters (`?to=`, `?from=`, `?note=`, `?blessing=`) and user form inputs are strictly sanitized and truncated to safe lengths.
   - Blessing themes are strictly matched against a validated whitelist (`prosperity`, `wisdom`, `health`, `victory`).
3. **Zero `innerHTML` Injection Risk**:
   - Dynamic user contributions (such as the community lamps) are generated using native DOM node construction (`document.createElement` + `document.createTextNode` / `textContent`), completely preventing XSS (Cross-Site Scripting).
4. **Anti-Spam & Rate Limiting**:
   - Dedication requests at the Temple of 108 Lamps enforce a client-side cooldown to protect performance and avoid interface flooding.
5. **Universal Web Share API**:
   - Automatically uses the native mobile share sheet (`navigator.share`) on iOS/Android devices for seamless sharing over WhatsApp, Telegram, iMessage, and Mail, with automated fallbacks to WhatsApp Web and clipboard copying on desktop browsers.
6. **Open Graph & Twitter Card Ready**:
   - Rich link preview metadata configured for WhatsApp, iMessage, Twitter, and LinkedIn.

---

## 👑 The Five Pillars of Auspicious Craft

Structured with the exact rhythm, technical framing, and narrative authority of Rolex watchmaking pillars:

1. **Feature 01: Chronometry of the Stars (The Sacred Muhurat)**
   *Vedic astronomical precision of Kartik Amavasya & Swati Nakshatra ($\pm0$ seconds divine alignment).*
2. **Feature 02: 24-Karat Kundan Filigree (Noble Alloys & Goldsmithing)**
   *Unblemished Au 999.9 gold reflecting the uncorrupted radiance of Mahalakshmi.*
3. **Feature 03: The Sacred Jyoti (Eternal Luminescence / The Oyster Equivalent)**
   *Hand-pressed clay diya fueled with pure desi ghee—indomitable against the darkness.*
4. **Feature 04: The Sacred Rangoli (Vedic Geometry & Dial Guilloché)**
   *Ashta-Lakshmi Yantra threshold geometry channelled in the Golden Ratio ($1:1.618$).*
5. **Feature 05: The Celestial Samvaad (5,000-Year Heritage of Joy & Brotherhood)**
   *Vasudhaiva Kutumbakam—the universal brotherhood of Diwali celebrated across millennia.*

---

## 🪔 Interactive Features

- **Kindle The Five Sacred Diyas**: Click each diya (*Dhana*, *Aarogya*, *Siddhi*, *Vidya*, *Shanti*) to ignite flickering flames with golden spark bursts and temple bell chimes.
- **Temple of 108 Sacred Lamps**: Global community altar with live kindling counter where users can dedicate their own lamp.
- **Astrological Muhurat Live Clock**: Real-time Indian Standard Time (IST) clock tracking Pradosh Kaal.
- **Harmonic Web Audio Synthesizer**: Generates Indian Tanpura drone harmonics and resonant sacred temple brass bell chimes with zero external audio dependencies.
- **Haute Horlogerie Greeting Card**: Renders a collector's edition **1200×800 24K Gold framed greeting card** ready for one-click high-resolution PNG download.

---

## 💻 Local Development

Clone the repository and run:

```bash
git clone https://github.com/Pshypher-Techie/shubh-deepavali-royal-edition.git
cd shubh-deepavali-royal-edition
python -m http.server 8080
```

Then visit `http://localhost:8080`.
