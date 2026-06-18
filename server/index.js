const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // raised limit to allow base64 image/video thumbnail payloads

const PORT = 3001;

// ===================== Social Media Handler (separate secured module) =====================
// Credentials are kept server-side only (never shipped to the browser bundle).
// Override via environment variables in production: SOCIAL_HANDLER_ID / SOCIAL_HANDLER_PASSWORD
const SOCIAL_HANDLER_ID = process.env.SOCIAL_HANDLER_ID || '7869232331';
const SOCIAL_HANDLER_PASSWORD = process.env.SOCIAL_HANDLER_PASSWORD || 'Saint@1990';

const SOCIAL_DATA_FILE = path.join(__dirname, 'social_handler_data.json');
const SOCIAL_TOKENS_FILE = path.join(__dirname, 'social_handler_tokens.json');
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function loadJsonFile(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        const raw = fs.readFileSync(filePath, 'utf8');
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error(`Failed to read ${filePath}:`, e.message);
        return fallback;
    }
}

function saveJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error(`Failed to write ${filePath}:`, e.message);
    }
}

function defaultSocialData() {
    return { weeklyImages: [], weeklyVideos: [], activityLog: [] };
}

function getSocialData() {
    return loadJsonFile(SOCIAL_DATA_FILE, defaultSocialData());
}

function saveSocialData(data) {
    saveJsonFile(SOCIAL_DATA_FILE, data);
}

function getTokens() {
    return loadJsonFile(SOCIAL_TOKENS_FILE, {});
}

function saveTokens(tokens) {
    saveJsonFile(SOCIAL_TOKENS_FILE, tokens);
}

function pruneExpiredTokens(tokens) {
    const now = Date.now();
    let changed = false;
    for (const t of Object.keys(tokens)) {
        if (tokens[t].expiresAt < now) {
            delete tokens[t];
            changed = true;
        }
    }
    if (changed) saveTokens(tokens);
    return tokens;
}

function addActivity(data, action, detail) {
    data.activityLog.unshift({
        id: crypto.randomUUID(),
        action,
        detail: detail || '',
        timestamp: new Date().toISOString()
    });
    // keep the log from growing unbounded
    data.activityLog = data.activityLog.slice(0, 200);
}

// Middleware: validates the Bearer token issued at login
function requireSocialAuth(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing authentication token' });

    const tokens = pruneExpiredTokens(getTokens());
    const session = tokens[token];
    if (!session) return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });

    req.socialSession = session;
    next();
}

app.post('/api/social/login', (req, res) => {
    const { id, password } = req.body || {};
    if (!id || !password) {
        return res.status(400).json({ error: 'ID and password are required.' });
    }

    if (id !== SOCIAL_HANDLER_ID || password !== SOCIAL_HANDLER_PASSWORD) {
        return res.status(401).json({ error: 'Invalid ID or password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokens = pruneExpiredTokens(getTokens());
    tokens[token] = { id, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL_MS };
    saveTokens(tokens);

    res.json({ token, expiresAt: tokens[token].expiresAt });
});

app.post('/api/social/logout', requireSocialAuth, (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.slice(7);
    const tokens = getTokens();
    delete tokens[token];
    saveTokens(tokens);
    res.json({ message: 'Logged out' });
});

// Fetch everything (images, videos, activity log)
app.get('/api/social/data', requireSocialAuth, (req, res) => {
    res.json(getSocialData());
});

// ---- Weekly Images ----
app.post('/api/social/images', requireSocialAuth, (req, res) => {
    const { title, imageUrl, caption, weekLabel } = req.body || {};
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required.' });

    const data = getSocialData();
    const item = {
        id: crypto.randomUUID(),
        title: title || 'Untitled',
        imageUrl,
        caption: caption || '',
        weekLabel: weekLabel || '',
        createdAt: new Date().toISOString()
    };
    data.weeklyImages.unshift(item);
    addActivity(data, 'IMAGE_ADDED', item.title);
    saveSocialData(data);
    res.json(item);
});

app.delete('/api/social/images/:id', requireSocialAuth, (req, res) => {
    const data = getSocialData();
    const target = data.weeklyImages.find(i => i.id === req.params.id);
    data.weeklyImages = data.weeklyImages.filter(i => i.id !== req.params.id);
    if (target) addActivity(data, 'IMAGE_REMOVED', target.title);
    saveSocialData(data);
    res.json({ message: 'Deleted' });
});

// ---- Weekly Videos ----
app.post('/api/social/videos', requireSocialAuth, (req, res) => {
    const { title, videoUrl, caption, weekLabel } = req.body || {};
    if (!videoUrl) return res.status(400).json({ error: 'videoUrl is required.' });

    const data = getSocialData();
    const item = {
        id: crypto.randomUUID(),
        title: title || 'Untitled',
        videoUrl,
        caption: caption || '',
        weekLabel: weekLabel || '',
        createdAt: new Date().toISOString()
    };
    data.weeklyVideos.unshift(item);
    addActivity(data, 'VIDEO_ADDED', item.title);
    saveSocialData(data);
    res.json(item);
});

app.delete('/api/social/videos/:id', requireSocialAuth, (req, res) => {
    const data = getSocialData();
    const target = data.weeklyVideos.find(v => v.id === req.params.id);
    data.weeklyVideos = data.weeklyVideos.filter(v => v.id !== req.params.id);
    if (target) addActivity(data, 'VIDEO_REMOVED', target.title);
    saveSocialData(data);
    res.json({ message: 'Deleted' });
});

// ---- Activity Log ----
app.post('/api/social/activity', requireSocialAuth, (req, res) => {
    const { action, detail } = req.body || {};
    if (!action) return res.status(400).json({ error: 'action is required.' });
    const data = getSocialData();
    addActivity(data, action, detail);
    saveSocialData(data);
    res.json({ message: 'Logged' });
});
// ===================== End Social Media Handler module =====================

// Global State
let sock = null;
let currentPairingCode = null;
let isConnected = false;
let isPairing = false;

// Setup WhatsApp connection
async function connectToWhatsApp(phoneNumber = null) {
    if (sock && isConnected) return;

    // Use persistent auth state
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info_baileys'));

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }), // Suppress detailed logs for cleaner output
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: false
    });

    // If a phone number is provided and we are not registered
    if (phoneNumber && !sock.authState.creds.registered) {
        isPairing = true;
        currentPairingCode = null;
        try {
            // Request the pairing code (OTP-like code) for the provided phone number
            const code = await sock.requestPairingCode(phoneNumber);
            // Format code visually (XXX-XXX)
            currentPairingCode = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log(`Pairing code for ${phoneNumber}: ${currentPairingCode}`);
        } catch (error) {
            console.error("Failed to request pairing code:", error);
            isPairing = false;
        }
    }

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            isConnected = false;
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('You are logged out. Please request a new pairing code.');
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            isConnected = true;
            isPairing = false;
            currentPairingCode = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Auto connect on startup if auth state exists
connectToWhatsApp();

// API Endpoints

app.get('/api/whatsapp/status', (req, res) => {
    res.json({
        isConnected,
        isPairing,
        pairingCode: currentPairingCode,
        isRegistered: sock?.authState?.creds?.registered || false
    });
});

app.post('/api/whatsapp/connect', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required (e.g., 917869232331)" });
    }

    if (isConnected) {
        return res.json({ message: "Already connected" });
    }

    // Format phone number: remove any non-digit
    const formattedNumber = phoneNumber.replace(/\D/g, '');

    await connectToWhatsApp(formattedNumber);
    
    // Wait briefly for the code to generate
    setTimeout(() => {
        if (currentPairingCode) {
            res.json({ message: "Pairing code generated", pairingCode: currentPairingCode });
        } else {
            res.status(500).json({ error: "Failed to generate pairing code. Please try again." });
        }
    }, 2000);
});

// Endpoint to send broadcast messages
app.post('/api/whatsapp/send-broadcast', async (req, res) => {
    const { numbers, message } = req.body;
    
    if (!isConnected || !sock) {
        return res.status(400).json({ error: "WhatsApp is not connected." });
    }

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: "A list of numbers is required." });
    }

    if (!message) {
        return res.status(400).json({ error: "Message content is required." });
    }

    res.json({ message: `Broadcast started for ${numbers.length} numbers.` });

    // Send messages asynchronously to avoid blocking the API response
    // And add a slight delay between messages to prevent spam bans
    const sendMessagesInLoop = async () => {
        for (let i = 0; i < numbers.length; i++) {
            let num = numbers[i].replace(/\D/g, '');
            // Basic check if Indian number format (10 digits, add 91)
            if (num.length === 10) num = `91${num}`;
            
            const jid = `${num}@s.whatsapp.net`;
            try {
                // Check if number exists on WA
                const [result] = await sock.onWhatsApp(jid);
                if (result?.exists) {
                    await sock.sendMessage(jid, { text: message });
                    console.log(`[Success] Sent to ${num}`);
                } else {
                    console.log(`[Failed] Number not on WhatsApp: ${num}`);
                }
            } catch (err) {
                console.error(`[Error] Failed sending to ${num}:`, err.message);
            }
            
            // Wait 2-3 seconds between messages
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
        }
        console.log('Broadcast complete.');
    };

    sendMessagesInLoop();
});

app.listen(PORT, () => {
    console.log(`WhatsApp Bot Server is running on port ${PORT}`);
});
