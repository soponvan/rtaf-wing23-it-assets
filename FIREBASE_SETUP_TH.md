# Firebase real-time sync setup (Thai)

ไฟล์ `firebase-sync.js` เตรียมการล็อกอิน Google และซิงก์รายการสินทรัพย์ผ่าน Firestore โดยจับการบันทึก `localStorage` ที่แอปเดิมใช้อยู่ ข้อมูลจะซิงก์หลังผู้ใช้ที่ได้รับอนุญาตล็อกอินแล้ว

## ยังต้องตั้งค่าใน Firebase Console

1. Authentication → Sign-in method → เปิด **Google**
2. Authentication → Settings → Authorized domains → เพิ่มโดเมนที่ใช้เปิดเว็บ (รวม `localhost` หากทดสอบในเครื่อง)
3. Firestore Database → Create database โดยใช้ Production mode
4. เปิด Firestore → Rules แล้วใส่เนื้อหาใน `firestore.rules` หลังแทน `REPLACE_WITH_AUTHORIZED_GOOGLE_EMAIL` ด้วยอีเมล Google ที่ได้รับอนุญาต จากนั้นกด Publish
5. Deploy ไฟล์ `index.html` และ `firebase-sync.js` จาก branch `feature/firebase-realtime-sync` ไปยังเว็บที่ใช้งาน
6. เพิ่มบรรทัดนี้ใน `index.html` ก่อน `</body>` เพื่อโหลดตัวเชื่อม:

```html
<script type="module" src="./firebase-sync.js"></script>
```

จากนั้นเปิดเว็บและกด **เข้าสู่ระบบ Google** ข้อมูลที่บันทึก/แก้ไข/ลบ จะถูกส่งไป Firestore และอัปเดตหน้าเว็บอื่นที่ล็อกอินบัญชีที่อนุญาตโดยอัตโนมัติ

## ข้อมูลเดิม

การล็อกอินครั้งแรกจะนำข้อมูลจาก `localStorage` ของ browser นั้นขึ้นไปเป็นข้อมูลกลางหากเอกสาร Firestore ยังไม่มีอยู่ ดังนั้นก่อนล็อกอินครั้งแรกให้เลือก browser ที่มีข้อมูลล่าสุด และกดส่งออก CSV สำรองไว้ก่อน หาก Firestore มีเอกสารแล้ว จะใช้ข้อมูลจาก Firestore เป็นหลัก

## ความปลอดภัยและข้อจำกัด

- Firestore Rules ใน repository ปิดสิทธิ์ไว้จนกว่าจะใส่อีเมลที่ได้รับอนุญาต ห้าม publish rules ที่เปิดอ่าน/เขียนให้ทุกคน
- Firebase Web config เป็น client configuration ไม่ใช่ความลับ สิทธิ์จริงถูกบังคับด้วย Authentication และ Firestore Rules
- โค้ดใช้ CDN SDK จึง **ไม่ต้องรัน `npm install firebase`** สำหรับ HTML แบบปัจจุบัน
- รายการสินทรัพย์ถูกเก็บเป็นเอกสาร Firestore หนึ่งรายการเพื่อให้เข้ากับแอปเดิม เหมาะกับข้อมูลชุดเล็ก; เอกสาร Firestore มีขนาดจำกัด หากรายการโตมากควรย้ายเป็น collection แยกรายการ
- ตรวจสอบนโยบายหน่วยงานก่อนอัปโหลดข้อมูลภายใน (รวม MAC Address, หมายเลขครุภัณฑ์ และข้อมูลผู้รับผิดชอบ) ขึ้น cloud
- Firebase web config ถูกใส่ไว้ใน `firebase-sync.js` ตามค่าที่ผู้ใช้ให้มา; หากเป็น production ควรตั้ง API key restrictions ใน Google Cloud Console ด้วย
