// Firebase real-time sync bridge for the existing single-file HTML application.
// This project uses the browser CDN SDK, so no npm build step is required.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, onSnapshot, runTransaction, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyB506fGoDgfwpIdydBDum1KC5RwNmUce4I',
  authDomain: 'rtaf-wing23-it-assets.firebaseapp.com',
  projectId: 'rtaf-wing23-it-assets',
  storageBucket: 'rtaf-wing23-it-assets.firebasestorage.app',
  messagingSenderId: '1095556119037',
  appId: '1:1095556119037:web:7a14a727f26a177d300194',
  measurementId: 'G-X7X0JKVZMB'
};

const STORAGE_KEY = 'RTAF_WING23_IT_ASSETS_V2';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const inventoryRef = doc(db, 'inventories', 'wing23-assets');
const provider = new GoogleAuthProvider();
const originalSetItem = Storage.prototype.setItem;
let unsubscribeInventory = null;
let signedInUser = null;
let applyingRemote = false;
let uploadTimer = null;
let cloudWriteQueue = Promise.resolve();

function renderSyncControls() {
  if (!document.body || document.getElementById('firebase-sync-panel')) return;
  const panel = document.createElement('section');
  panel.id = 'firebase-sync-panel';
  panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:10px 12px;background:#fff;border:1px solid #cbd5e1;border-radius:12px;box-shadow:0 6px 24px #0f172a22;font:13px sans-serif;color:#1e293b';
  panel.innerHTML = '<span id="firebase-sync-status">กำลังเชื่อมต่อ…</span><button id="firebase-sync-login" type="button" style="padding:6px 10px;border:0;border-radius:7px;background:#2563eb;color:#fff;cursor:pointer">เข้าสู่ระบบ Google</button><button id="firebase-sync-logout" type="button" hidden style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;cursor:pointer">ออกจากระบบ</button>';
  document.body.appendChild(panel);
  panel.querySelector('#firebase-sync-login').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Firebase sign-in failed', error);
      setStatus(`เข้าสู่ระบบไม่สำเร็จ (${error.code || 'error'})`);
      alert('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบว่าเปิด Google Sign-In และตั้ง Authorized domains ใน Firebase แล้ว');
    }
  });
  panel.querySelector('#firebase-sync-logout').addEventListener('click', () => signOut(auth));
}

function setStatus(message) {
  const status = document.getElementById('firebase-sync-status');
  if (status) status.textContent = message;
}

function readLocalAssets() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Cannot read local inventory', error);
    return [];
  }
}

function scheduleCloudSave() {
  if (!signedInUser || applyingRemote) return;
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(() => {
    const assets = readLocalAssets();
    cloudWriteQueue = cloudWriteQueue
      .then(() => setDoc(inventoryRef, { assets, updatedAt: serverTimestamp(), updatedBy: signedInUser.email || signedInUser.uid }))
      .then(() => setStatus(`ซิงก์แล้ว • ${signedInUser.email || 'Google account'}`))
      .catch(error => {
        console.error('Firebase write failed', error);
        setStatus(`บันทึกออนไลน์ไม่สำเร็จ (${error.code || 'error'})`);
      });
  }, 300);
}

// Existing app persists every add/edit/delete through localStorage. Observe that
// existing save path rather than changing its inventory logic.
Storage.prototype.setItem = function (key, value) {
  originalSetItem.call(this, key, value);
  if (this === localStorage && key === STORAGE_KEY) scheduleCloudSave();
};

async function startInventorySync(user) {
  signedInUser = user;
  setStatus(`กำลังเตรียมข้อมูล • ${user.email || 'Google account'}`);
  try {
    // Seed the shared document once from this browser's saved inventory. A
    // transaction prevents two first-time users from overwriting each other.
    await runTransaction(db, async transaction => {
      const existing = await transaction.get(inventoryRef);
      if (!existing.exists()) {
        transaction.set(inventoryRef, {
          assets: readLocalAssets(),
          updatedAt: serverTimestamp(),
          updatedBy: user.email || user.uid
        });
      }
    });
    unsubscribeInventory = onSnapshot(inventoryRef, snapshot => {
      if (!snapshot.exists()) return;
      const remoteAssets = snapshot.data().assets;
      if (!Array.isArray(remoteAssets)) {
        setStatus('ข้อมูลออนไลน์มีรูปแบบไม่ถูกต้อง');
        return;
      }
      const localJson = JSON.stringify(readLocalAssets());
      const remoteJson = JSON.stringify(remoteAssets);
      if (localJson !== remoteJson) {
        // Existing app keeps its asset array in a top-level lexical variable;
        // reload after updating storage so every table/stat/filter is refreshed.
        applyingRemote = true;
        originalSetItem.call(localStorage, STORAGE_KEY, remoteJson);
        setStatus('ได้รับข้อมูลล่าสุด กำลังอัปเดตหน้าจอ…');
        window.location.reload();
        return;
      }
      setStatus(`ซิงก์เรียลไทม์ • ${user.email || 'Google account'}`);
    }, error => {
      console.error('Firebase listener failed', error);
      setStatus(`อ่านข้อมูลออนไลน์ไม่สำเร็จ (${error.code || 'error'})`);
    });
  } catch (error) {
    console.error('Firebase sync setup failed', error);
    setStatus(`เชื่อมต่อไม่ได้ (${error.code || 'error'}) — ตรวจสอบ Firestore Rules`);
  }
}

onAuthStateChanged(auth, user => {
  const login = document.getElementById('firebase-sync-login');
  const logout = document.getElementById('firebase-sync-logout');
  if (unsubscribeInventory) {
    unsubscribeInventory();
    unsubscribeInventory = null;
  }
  signedInUser = null;
  if (login) login.hidden = Boolean(user);
  if (logout) logout.hidden = !user;
  if (user) {
    startInventorySync(user);
  } else {
    setStatus('ยังไม่เข้าสู่ระบบ • ข้อมูลที่แสดงอาจเป็นข้อมูลในเครื่องนี้เท่านั้น');
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSyncControls, { once: true });
} else {
  renderSyncControls();
}
