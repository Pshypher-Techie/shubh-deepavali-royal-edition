/**
 * SHUBH DEEPAVALI — LUXURY ROLEX HOROLOGY EXPERIENCE
 * Interactive Engine, Personalization Studio, Web Audio Synthesizer,
 * High-Res Canvas Card Generator, and Particle Celebration.
 */

// ============================================================================
// 1. STATE & THEMES DEFINITION & SECURITY SANITIZER
// ============================================================================
function sanitizeInput(str, maxLength = 80) {
    if (!str || typeof str !== 'string') return '';
    // Strip HTML tags and control characters
    let clean = str.replace(/<[^>]*>?/gm, '').replace(/[\x00-\x1F\x7F]/g, '').trim();
    // Enforce max length
    if (clean.length > maxLength) {
        clean = clean.substring(0, maxLength);
    }
    return clean;
}

const BLESSING_PRESETS = {
    prosperity: {
        title: "Lakshmi's Boundless Prosperity",
        bannerText: "May Mahalakshmi enter your sacred threshold with golden footsteps, bringing perpetual abundance, supreme financial wisdom, and royal fulfillment.",
        cardText: "May the golden grace of Mahalakshmi illuminate your enterprise and home with boundless prosperity, sublime joy, and generational fortune."
    },
    wisdom: {
        title: "Saraswati's Luminous Wisdom",
        bannerText: "May the divine flame of wisdom dispel every shadow of doubt, bestowing refined discernment, artistic brilliance, and intellectual tranquility.",
        cardText: "May Goddess Saraswati kindle the light of higher knowledge within your heart, guiding every decision toward noble truth and eternal clarity."
    },
    health: {
        title: "Aarogya: Radiant Health & Vitality",
        bannerText: "May Lord Dhanvantari bless you and your lineage with supreme physical vigor, boundless longevity, and an impenetrable shield of peace.",
        cardText: "Praying for supreme health, serenity of the soul, and unbroken vitality for you and all those you hold dear this auspicious Deepavali."
    },
    victory: {
        title: "Vijaya: Royal Splendor & Success",
        bannerText: "May the victorious aura of Lord Rama's triumphant return illuminate your path, turning every noble pursuit into unyielding triumph.",
        cardText: "May this festival of light crown your endeavors with illustrious success, unwavering honor, and the royal splendor of righteous victory."
    }
};

let appState = {
    recipient: "You & Your Beloved Family",
    sender: "Biswajit",
    blessingKey: "prosperity",
    customNote: "",
    diyasLit: [false, false, false, false, false],
    soundEnabled: false,
    audioContext: null,
    droneOscillators: []
};

// ============================================================================
// 2. INITIALIZATION ON DOM READY
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initUrlParams();
    updateUI();
    initParticleCanvas();
    initAstrologicalClock();
    initInteractiveEventListeners();
});

// ============================================================================
// 3. URL PARAMETER PARSER & ROUTING (STRICT SECURITY VALIDATION)
// ============================================================================
function initUrlParams() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Support ?to=, ?name=, ?recipient= with sanitization & length limits
        const rawRecipient = urlParams.get('to') || urlParams.get('name') || urlParams.get('recipient');
        if (rawRecipient) {
            const cleanRecipient = sanitizeInput(decodeURIComponent(rawRecipient), 60);
            if (cleanRecipient) appState.recipient = cleanRecipient;
        }

        // Support ?from=, ?sender=
        const rawSender = urlParams.get('from') || urlParams.get('sender');
        if (rawSender) {
            const cleanSender = sanitizeInput(decodeURIComponent(rawSender), 50);
            if (cleanSender) appState.sender = cleanSender;
        }

        // Support ?blessing= (Strict whitelist)
        const blessingParam = urlParams.get('blessing');
        if (blessingParam && BLESSING_PRESETS.hasOwnProperty(blessingParam)) {
            appState.blessingKey = blessingParam;
        }

        // Support ?note=
        const rawNote = urlParams.get('note');
        if (rawNote) {
            const cleanNote = sanitizeInput(decodeURIComponent(rawNote), 220);
            if (cleanNote) appState.customNote = cleanNote;
        }
    } catch (e) {
        console.warn("URL parameter parsing fallback:", e);
    }
}

// Generate universal shareable URL working across any domain / GitHub Pages
function getShareableUrl() {
    try {
        const url = new URL(window.location.href);
        const params = new URLSearchParams();
        if (appState.recipient && appState.recipient !== "You & Your Beloved Family") {
            params.set('to', appState.recipient);
        }
        if (appState.sender && appState.sender !== "Biswajit") {
            params.set('from', appState.sender);
        }
        if (appState.blessingKey && appState.blessingKey !== "prosperity") {
            params.set('blessing', appState.blessingKey);
        }
        if (appState.customNote) {
            params.set('note', appState.customNote);
        }
        url.search = params.toString() ? '?' + params.toString() : '';
        return url.toString();
    } catch (e) {
        return window.location.href;
    }
}

// Update the address bar without page reload
function syncUrlWithState() {
    const newUrl = getShareableUrl();
    window.history.replaceState({}, '', newUrl);
}

// ============================================================================
// 4. UI STATE SYNC
// ============================================================================
function updateUI() {
    const blessing = BLESSING_PRESETS[appState.blessingKey] || BLESSING_PRESETS.prosperity;
    const effectiveBannerText = appState.customNote ? `"${appState.customNote}"` : `"${blessing.bannerText}"`;
    const effectiveCardText = appState.customNote ? `"${appState.customNote}"` : `"${blessing.cardText}"`;

    // 1. Hero Section
    const heroRecipient = document.getElementById('heroRecipientPill');
    if (heroRecipient) heroRecipient.textContent = appState.recipient;

    const heroSender = document.getElementById('heroSenderSub');
    if (heroSender) heroSender.textContent = `With warmest festive blessings from ${appState.sender}`;

    // 2. Dedication Banner
    const bannerRecipient = document.getElementById('bannerRecipient');
    if (bannerRecipient) bannerRecipient.textContent = appState.recipient;

    const bannerBlessing = document.getElementById('bannerBlessingText');
    if (bannerBlessing) bannerBlessing.textContent = effectiveBannerText;

    // 3. Interactive Diya Section
    const interactiveRecipient = document.getElementById('interactiveRecipientName');
    if (interactiveRecipient) interactiveRecipient.textContent = appState.recipient;

    const altarRecipient = document.getElementById('altarRecipientSpan');
    if (altarRecipient) altarRecipient.textContent = appState.recipient;

    // 4. Haute Horlogerie Card
    const cardRecipient = document.getElementById('cardRecipientName');
    if (cardRecipient) cardRecipient.textContent = appState.recipient;

    const cardSender = document.getElementById('cardSenderName');
    if (cardSender) cardSender.textContent = appState.sender;

    const cardBlessing = document.getElementById('cardBlessingBody');
    if (cardBlessing) cardBlessing.textContent = effectiveCardText;

    // 5. Browser Title
    document.title = `Shubh Deepavali to ${appState.recipient} — Presented by ${appState.sender}`;

    // Update modal inputs if modal is populated
    const mRec = document.getElementById('modalRecipientInput');
    const mSend = document.getElementById('modalSenderInput');
    const mBless = document.getElementById('modalBlessingSelect');
    const mNote = document.getElementById('modalCustomNote');

    if (mRec && !mRec.value) mRec.value = (appState.recipient === "You & Your Beloved Family") ? "" : appState.recipient;
    if (mSend && !mSend.value) mSend.value = (appState.sender === "Biswajit") ? "" : appState.sender;
    if (mBless) mBless.value = appState.blessingKey;
    if (mNote && !mNote.value) mNote.value = appState.customNote;
}

// ============================================================================
// 5. PERSONALIZATION MODAL & SHARING
// ============================================================================
function openPersonalizeModal() {
    const modal = document.getElementById('personalizeModal');
    if (!modal) return;
    
    // Sync current values to inputs
    const mRec = document.getElementById('modalRecipientInput');
    const mSend = document.getElementById('modalSenderInput');
    const mBless = document.getElementById('modalBlessingSelect');
    const mNote = document.getElementById('modalCustomNote');

    if (mRec) mRec.value = (appState.recipient === "You & Your Beloved Family") ? "" : appState.recipient;
    if (mSend) mSend.value = (appState.sender === "Biswajit") ? "" : appState.sender;
    if (mBless) mBless.value = appState.blessingKey;
    if (mNote) mNote.value = appState.customNote;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePersonalizeModal() {
    const modal = document.getElementById('personalizeModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function applyPersonalization() {
    const mRec = document.getElementById('modalRecipientInput');
    const mSend = document.getElementById('modalSenderInput');
    const mBless = document.getElementById('modalBlessingSelect');
    const mNote = document.getElementById('modalCustomNote');

    const rawRecipient = mRec && mRec.value.trim() ? mRec.value.trim() : "You & Your Beloved Family";
    const rawSender = mSend && mSend.value.trim() ? mSend.value.trim() : "Biswajit";
    const rawBlessing = mBless ? mBless.value : "prosperity";
    const rawNote = mNote ? mNote.value.trim() : "";

    // Sanitize all inputs
    const newRecipient = sanitizeInput(rawRecipient, 60);
    const newSender = sanitizeInput(rawSender, 50);
    const newBlessing = BLEING_KEY = BLESSING_PRESETS.hasOwnProperty(rawBlessing) ? rawBlessing : "prosperity";
    const newNote = sanitizeInput(rawNote, 220);

    appState.recipient = newRecipient || "You & Your Beloved Family";
    appState.sender = newSender || "Biswajit";
    appState.blessingKey = newBlessing;
    appState.customNote = newNote;

    syncUrlWithState();
    updateUI();
    closePersonalizeModal();
    showToast(`Personalized for ${appState.recipient}!`);

    // Smooth scroll to card
    const cardSection = document.getElementById('card-preview');
    if (cardSection) {
        cardSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Trigger celebratory sparkles
    triggerCelebratoryParticles();
}

function applyPreset(recipientName, blessingKey) {
    appState.recipient = sanitizeInput(recipientName, 60);
    if (blessingKey && BLESSING_PRESETS.hasOwnProperty(blessingKey)) {
        appState.blessingKey = blessingKey;
    }
    appState.customNote = "";

    // Sync input values in modal as well
    const mRec = document.getElementById('modalRecipientInput');
    const mBless = document.getElementById('modalBlessingSelect');
    const mNote = document.getElementById('modalCustomNote');
    if (mRec) mRec.value = appState.recipient;
    if (mBless) mBless.value = appState.blessingKey;
    if (mNote) mNote.value = "";

    syncUrlWithState();
    updateUI();
    showToast(`Consecrated for ${appState.recipient}!`);
    triggerCelebratoryParticles();
}

function copyShareableUrl() {
    syncUrlWithState();
    const url = getShareableUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast("Unique Diwali greeting link copied to clipboard!");
        }).catch(() => {
            prompt("Copy this unique Diwali link:", url);
        });
    } else {
        prompt("Copy this unique Diwali link:", url);
    }
}

function copyPersonalizedGreeting() {
    copyShareableUrl();
}

// Universal Social & Mobile Web Share API support
async function shareOnWhatsApp() {
    syncUrlWithState();
    const url = getShareableUrl();
    const shareTitle = `Shubh Deepavali 2026 — Consecrated for ${appState.recipient}`;
    const shareText = `✨ *SHUBH DEEPAVALI 2026* ✨\n\nDearest *${appState.recipient}*,\n\nMay the sacred flame of Deepavali illuminate your home with eternal prosperity, divine health, and serene joy.\n\nCrafted especially for you with devotion by *${appState.sender}*.\n\nExperience your royal personalized greeting here:\n👉 ${url}`;

    // If native sharing is supported (Mobile devices)
    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: url
            });
            return;
        } catch (err) {
            // User cancelled or fallback to WhatsApp URL
            if (err.name === 'AbortError') return;
        }
    }

    // Fallback directly to WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}

// ============================================================================
// 6. INTERACTIVE DIYAS ALTAR
// ============================================================================
function toggleDiya(index) {
    const i = index - 1;
    appState.diyasLit[i] = !appState.diyasLit[i];
    renderDiyas();

    if (appState.diyasLit[i]) {
        playTempleBell();
        triggerDiyaSparks(index);
    }

    checkAllDiyasLit();
}

function igniteAllDiyas() {
    appState.diyasLit = [true, true, true, true, true];
    renderDiyas();
    playTempleBell();
    triggerCelebratoryParticles();
    checkAllDiyasLit();
    showToast("All five sacred jyotis are now kindled with divine light!");
}

function resetDiyas() {
    appState.diyasLit = [false, false, false, false, false];
    renderDiyas();
    const fullBlessing = document.getElementById('fullAltarBlessing');
    if (fullBlessing) fullBlessing.classList.add('hidden');
}

function renderDiyas() {
    for (let index = 1; index <= 5; index++) {
        const isLit = appState.diyasLit[index - 1];
        const slot = document.getElementById(`diyaSlot${index}`);
        const flame = document.getElementById(`flame${index}`);
        const status = document.getElementById(`diyaStatus${index}`);

        if (isLit) {
            if (slot) slot.classList.add('active-lit');
            if (flame) flame.classList.remove('opacity-0');
            if (status) {
                status.textContent = "Radiant & Consecrated";
                status.classList.add('text-gold-light', 'font-bold');
            }
        } else {
            if (slot) slot.classList.remove('active-lit');
            if (flame) flame.classList.add('opacity-0');
            if (status) {
                status.textContent = (index === 3) ? "Master Jyoti" : "Click to Ignite";
                status.classList.remove('text-gold-light', 'font-bold');
            }
        }
    }
}

function checkAllDiyasLit() {
    const allLit = appState.diyasLit.every(Boolean);
    const fullBlessing = document.getElementById('fullAltarBlessing');
    if (fullBlessing) {
        if (allLit) {
            fullBlessing.classList.remove('hidden');
            triggerCelebratoryParticles();
        } else {
            fullBlessing.classList.add('hidden');
        }
    }
}

function triggerDiyaSparks(index) {
    const slot = document.getElementById(`diyaSlot${index}`);
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + 30;

    for (let j = 0; j < 35; j++) {
        particles.push(new SparkParticle(x, y));
    }
}

// ============================================================================
// 7. TEMPLE OF 108 LAMPS (COMMUNITY KINDLING - SECURE DOM MANIPULATION)
// ============================================================================
let lastLampSubmitTime = 0;

function submitWishLamp() {
    const now = Date.now();
    // Rate limit: 2.5 seconds cooldown
    if (now - lastLampSubmitTime < 2500) {
        showToast("Please pause a moment between dedications.");
        return;
    }
    lastLampSubmitTime = now;

    const authorInput = document.getElementById('wishAuthorInput');
    const textInput = document.getElementById('wishTextInput');
    const rawAuthor = (authorInput && authorInput.value.trim()) ? authorInput.value.trim() : "Anonymous Devotee";
    const rawText = (textInput && textInput.value.trim()) ? textInput.value.trim() : "May perpetual joy and light embrace all humanity!";

    const author = sanitizeInput(rawAuthor, 40) || "Anonymous Devotee";
    const text = sanitizeInput(rawText, 140) || "May perpetual joy and light embrace all humanity!";

    // Increment counter
    const counterEl = document.getElementById('globalDiyaCounter');
    if (counterEl) {
        let count = parseInt(counterEl.textContent.replace(/,/g, ''), 10) || 10842;
        count++;
        counterEl.textContent = count.toLocaleString();
    }

    // Safely add to wishes grid using pure DOM creation (No innerHTML XSS risk)
    const grid = document.getElementById('wishesGrid');
    if (grid) {
        const card = document.createElement('div');
        card.className = "p-4 rounded-sm bg-rolex-dark/80 border border-gold-champagne/40 shadow-[0_0_15px_rgba(223,183,108,0.2)] animate-fade-in";

        const topRow = document.createElement('div');
        topRow.className = "flex items-center justify-between text-xs font-cinzel text-gold-champagne mb-2";

        const authorSpan = document.createElement('span');
        authorSpan.className = "font-bold flex items-center gap-1.5";
        
        const dot = document.createElement('span');
        dot.className = "w-1.5 h-1.5 rounded-full bg-gold-champagne";
        
        const nameText = document.createTextNode(author);
        authorSpan.appendChild(dot);
        authorSpan.appendChild(nameText);

        const timeSpan = document.createElement('span');
        timeSpan.className = "text-stone-400 font-mono text-[10px]";
        timeSpan.textContent = "Just now";

        topRow.appendChild(authorSpan);
        topRow.appendChild(timeSpan);

        const wishP = document.createElement('p');
        wishP.className = "text-stone-200 text-xs italic font-serif";
        wishP.textContent = `"${text}"`;

        card.appendChild(topRow);
        card.appendChild(wishP);

        grid.prepend(card);
    }

    if (authorInput) authorInput.value = '';
    if (textInput) textInput.value = '';

    playTempleBell();
    triggerCelebratoryParticles();
    showToast("Your sacred lamp has been enshrined in the global sanctum!");
}

// ============================================================================
// 8. HIGH-RES CANVAS GREETING CARD GENERATION
// ============================================================================
function downloadCardImage() {
    const canvas = document.getElementById('cardExportCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient (Rolex Deep Green into Obsidian)
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 700);
    bgGrad.addColorStop(0, '#023824');
    bgGrad.addColorStop(0.6, '#011910');
    bgGrad.addColorStop(1, '#050a08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer 24K Gold Border Frame
    ctx.strokeStyle = '#dfb76c';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner Hairline Frame
    ctx.strokeStyle = 'rgba(223, 183, 108, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // 3. Four Corner Ornaments
    const corners = [
        [55, 55], [width - 55, 55],
        [55, height - 55], [width - 55, height - 55]
    ];
    ctx.fillStyle = '#dfb76c';
    ctx.font = '22px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    corners.forEach(([cx, cy]) => {
        ctx.fillText('✦', cx, cy);
    });

    // 4. Header Rolex / Deepavali Crown Motif
    ctx.fillStyle = '#dfb76c';
    ctx.font = 'bold 20px Cinzel, serif';
    ctx.fillText('👑  SHUBH DEEPAVALI  👑', width / 2, 120);

    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#b38728';
    ctx.letterSpacing = '3px';
    ctx.fillText('SAMVAT 2083 · THE ROYAL HOROLOGY OF LIGHT', width / 2, 150);

    // 5. Eyebrow
    ctx.font = '14px Cinzel, serif';
    ctx.fillStyle = '#a8b3ac';
    ctx.fillText('SPECIALLY CONSECRATED FOR', width / 2, 230);

    // 6. Recipient Name in Regal Gold
    ctx.font = 'italic bold 52px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#f5e3b5';
    ctx.fillText(appState.recipient, width / 2, 300);

    // 7. Divider Line
    const divGrad = ctx.createLinearGradient(width / 2 - 200, 340, width / 2 + 200, 340);
    divGrad.addColorStop(0, 'rgba(223, 183, 108, 0)');
    divGrad.addColorStop(0.5, 'rgba(223, 183, 108, 0.8)');
    divGrad.addColorStop(1, 'rgba(223, 183, 108, 0)');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 340);
    ctx.lineTo(width / 2 + 200, 340);
    ctx.stroke();

    // 8. Blessing Body
    const blessing = BLESSING_PRESETS[appState.blessingKey] || BLESSING_PRESETS.prosperity;
    const bodyText = appState.customNote || blessing.cardText;

    ctx.font = '22px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#ebe7df';
    wrapCanvasText(ctx, `"${bodyText}"`, width / 2, 410, 840, 34);

    // 9. Central Diya Graphic
    drawCanvasDiya(ctx, width / 2, 545);

    // 10. Sender Signature
    ctx.font = '13px Cinzel, serif';
    ctx.fillStyle = '#9e9e9e';
    ctx.fillText('WITH DIVINE RESPECT & WARMEST WISHES', width / 2, 650);

    ctx.font = '36px "Great Vibes", cursive';
    ctx.fillStyle = '#dfb76c';
    ctx.fillText(appState.sender, width / 2, 700);

    // 11. Footer Hallmarking
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(223, 183, 108, 0.5)';
    ctx.fillText('CERTIFIED AUSPICIOUS · 24K EVERLASTING LIGHT', width / 2, 745);

    // Download triggered
    const link = document.createElement('a');
    const safeName = appState.recipient.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Shubh-Deepavali-${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast("High-resolution Greeting Card downloaded!");
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, curY);
            line = words[n] + ' ';
            curY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, curY);
}

function drawCanvasDiya(ctx, x, y) {
    // Diya Base
    ctx.save();
    ctx.fillStyle = '#b38728';
    ctx.beginPath();
    ctx.arc(x, y + 10, 24, 0, Math.PI, false);
    ctx.fill();

    // Diya Flame
    const flameGrad = ctx.createLinearGradient(x, y - 28, x, y + 8);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.3, '#ffbe0b');
    flameGrad.addColorStop(0.7, '#ff5400');
    flameGrad.addColorStop(1, '#b21e35');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(x, y - 28);
    ctx.bezierCurveTo(x - 12, y - 10, x - 10, y + 6, x, y + 8);
    ctx.bezierCurveTo(x + 10, y + 6, x + 12, y - 10, x, y - 28);
    ctx.fill();
    ctx.restore();
}

// ============================================================================
// 9. WEB AUDIO API SOUNDSCAPE (ROYAL INDIAN AMBIENCE & TEMPLE BELL)
// ============================================================================
function initAudio() {
    if (!appState.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        appState.audioContext = new AudioContext();
    }
    if (appState.audioContext.state === 'suspended') {
        appState.audioContext.resume();
    }
}

function toggleSound() {
    initAudio();
    appState.soundEnabled = !appState.soundEnabled;

    const btn = document.getElementById('soundToggle');
    const text = document.getElementById('soundText');

    if (appState.soundEnabled) {
        startDrone();
        if (btn) btn.classList.add('sound-playing', 'border-gold-champagne');
        if (text) text.textContent = "Playing";
        showToast("Divine ambient drone initiated.");
    } else {
        stopDrone();
        if (btn) btn.classList.remove('sound-playing', 'border-gold-champagne');
        if (text) text.textContent = "Ambience";
    }
}

function startDrone() {
    if (!appState.audioContext) return;
    stopDrone();

    // Indian Tanpura harmonic fundamental: D# (approx 155.56 Hz)
    const baseFreq = 155.56;
    const harmonics = [
        { mult: 0.5, gain: 0.08, type: 'sine' },      // Low octave foundation
        { mult: 1.0, gain: 0.12, type: 'triangle' },  // Fundamental Sa
        { mult: 1.5, gain: 0.09, type: 'sine' },      // Pa (Perfect fifth)
        { mult: 2.0, gain: 0.05, type: 'sine' }       // High Sa
    ];

    harmonics.forEach(h => {
        const osc = appState.audioContext.createOscillator();
        const gainNode = appState.audioContext.createGain();

        osc.type = h.type;
        osc.frequency.setValueAtTime(baseFreq * h.mult, appState.audioContext.currentTime);

        // Gentle subtle LFO for tanpura shimmer
        const lfo = appState.audioContext.createOscillator();
        const lfoGain = appState.audioContext.createGain();
        lfo.frequency.setValueAtTime(0.2, appState.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(0.02, appState.audioContext.currentTime);
        lfo.connect(gainNode.gain);
        lfo.start();

        gainNode.gain.setValueAtTime(h.gain, appState.audioContext.currentTime);

        osc.connect(gainNode);
        gainNode.connect(appState.audioContext.destination);

        osc.start();
        appState.droneOscillators.push(osc, gainNode, lfo);
    });
}

function stopDrone() {
    appState.droneOscillators.forEach(node => {
        try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
        } catch (e) {}
    });
    appState.droneOscillators = [];
}

// Authentic Temple Brass Bell Sound (Synthesized with pure harmonic damping)
function playTempleBell() {
    try {
        initAudio();
        const ctx = appState.audioContext;
        if (!ctx) return;

        const fundamental = 852; // Solfeggio / Sacred bell frequency
        const partials = [
            { freq: fundamental * 1.0, gain: 0.3, decay: 3.2 },
            { freq: fundamental * 1.52, gain: 0.18, decay: 2.5 },
            { freq: fundamental * 2.05, gain: 0.12, decay: 1.8 },
            { freq: fundamental * 3.14, gain: 0.06, decay: 1.2 }
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(p.freq, ctx.currentTime);

            gain.gain.setValueAtTime(p.gain, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + p.decay);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + p.decay);
        });
    } catch (e) {
        console.warn("Audio unavailable:", e);
    }
}

// ============================================================================
// 10. INTERACTIVE CANVAS: GOLDEN EMBERS, PHULJHADI & FIREWORKS
// ============================================================================
let canvas, ctx;
let particles = [];
let mouse = { x: -100, y: -100, isMoving: false };
let mouseTimer = null;

function initParticleCanvas() {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial floating embers
    for (let i = 0; i < 40; i++) {
        particles.push(new FloatingEmber(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    // Sparkler effect on cursor movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isMoving = true;

        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => { mouse.isMoving = false; }, 100);

        // Spawn golden phuljhadi spark on move
        if (Math.random() > 0.4) {
            particles.push(new SparkParticle(mouse.x, mouse.y));
        }
    });

    // Tap or click produces celebratory burst
    window.addEventListener('click', (e) => {
        // Only if not clicking an interactive button
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && e.target.tagName !== 'SELECT') {
            for (let i = 0; i < 20; i++) {
                particles.push(new SparkParticle(e.clientX, e.clientY));
            }
        }
    });

    requestAnimationFrame(renderParticles);
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Ambient floating gold dust
class FloatingEmber {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.8;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.3 ? '#dfb76c' : '#ff9f1c';
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) {
            this.y = canvas.height + 10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Explosive / Sparkler golden spark
class SparkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.08;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
        this.size = Math.random() * 2.5 + 1;
        this.color = Math.random() > 0.4 ? '#dfb76c' : (Math.random() > 0.5 ? '#ffbe0b' : '#ffffff');
    }
    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffbe0b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function renderParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(renderParticles);
}

function triggerCelebratoryParticles() {
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    for (let i = 0; i < 70; i++) {
        particles.push(new SparkParticle(centerX + (Math.random() - 0.5) * 200, centerY + (Math.random() - 0.5) * 100));
    }
}

// ============================================================================
// 11. ASTROLOGICAL MUHURAT LIVE CLOCK
// ============================================================================
function initAstrologicalClock() {
    const clockEl = document.getElementById('muhuratClock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
        
        const hours = String(istDate.getHours()).padStart(2, '0');
        const minutes = String(istDate.getMinutes()).padStart(2, '0');
        const seconds = String(istDate.getSeconds()).padStart(2, '0');

        clockEl.textContent = `SACRED HOROLOGY: ${hours}:${minutes}:${seconds} IST · PRADOSH KAAL`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ============================================================================
// 12. EVENT LISTENERS & MOBILE NAVIGATION
// ============================================================================
function initInteractiveEventListeners() {
    // Sound Button
    const soundBtn = document.getElementById('soundToggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', toggleSound);
    }

    // Mobile Menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close Mobile Drawer on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            if (menu) menu.classList.add('hidden');
        });
    });

    // Close Modal on backdrop click
    const modal = document.getElementById('personalizeModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePersonalizeModal();
            }
        });
    }

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePersonalizeModal();
        }
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}
