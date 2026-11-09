# การออกแบบระบบบริหารจัดการสินทรัพย์ IT (IT Asset Management System)
> ออกแบบเฉพาะสำหรับสินทรัพย์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง อิงตามแบบฟอร์มบันทึกข้อมูลสินทรัพย์ ทอ. (26 ฟิลด์)

---

## 1. แนวคิดและโครงสร้างการจัดหมวดหมู่ข้อมูล (Data Categorization)

เพื่อให้การบันทึกข้อมูลไม่ซับซ้อนและผู้ใช้งานสามารถกรอกหรือค้นหาได้สะดวกรวดเร็ว จึงจัดกลุ่มฟิลด์ข้อมูลทั้ง 26 รายการออกเป็น **5 หมวดหมู่หลัก (Logical Groups)**:

```mermaid
mindmap
  root((ระบบสินทรัพย์ IT คอมพิวเตอร์))
    หมวด 1: ข้อมูลครุภัณฑ์และสถานที่
      หมายเลขพัสดุ ทอ.
      Serial Number
      สถานที่ติดตั้งอุปกรณ์
      ปีที่ติดตั้ง
      คอมพิวเตอร์จากโครงการ
    หมวด 2: ฮาร์ดแวร์ตัวเครื่อง
      ชื่อเครื่อง Computer Name
      ยี่ห้อของอุปกรณ์
      รุ่นของอุปกรณ์
      CPU ยี่ห้อและรุ่น
      ความเร็วสัญญาณนาฬิกา GHz
      ประเภท RAM
      ความจุ RAM GB
      ประเภท Harddisk
      ความจุ Harddisk
    หมวด 3: ระบบเครือข่าย
      MAC Address
      เครือข่ายที่ใช้ ภายใน/ภายนอก ทอ.
    หมวด 4: ซอฟต์แวร์และลิขสิทธิ์
      ระบบปฏิบัติการ OS
      ลิขสิทธิ์ OS
      โปรแกรมสำนักงาน Office
      ลิขสิทธิ์ Office
      โปรแกรมป้องกันไวรัส Antivirus
      ลิขสิทธิ์ Antivirus
    หมวด 5: ผู้ครอบครองและสถานะ
      ผู้รับผิดชอบ ยศ-ชื่อ-สกุล
      โทรศัพท์ติดต่อ / เบอร์ภายใน
      หมายเหตุ / สถานะอุปกรณ์
```

---

## 2. รายละเอียดฟิลด์ข้อมูลและค่าเริ่มต้นตัวเลือก (Preset Dropdown & Free-text)

ระบบออกแบบเป็น **Combobox (Editable Dropdown)** กล่าวคือ **มีลิสต์รายการยอดนิยมให้คลิกเลือกทันที** แต่หากเครื่องมีสเปกเฉพาะก็สามารถ **พิมพ์ค่าใหม่ลงไปได้ทันที**

| ลำดับ | ชื่อฟิลด์ (Field Name) | ประเภทข้อมูล | ตัวเลือกเริ่มต้นใน Dropdown (Presets) | ความสำคัญ |
|:---:|:---|:---:|:---|:---:|
| 1 | **ลำดับ (No.)** | Auto Number | ระบบสร้างให้อัตโนมัติ (1, 2, 3...) | จำเป็น |
| 2 | **สถานที่ติดตั้งอุปกรณ์** | Combobox | **หน่วยงานใน กองบิน 23 (บน.23) รวม 31 หน่วย:**<br>- ผธก.บก.บน.23<br>- ผกพ.บก.บน.23<br>- ผขว.บก.บน.23<br>- ผยก.บก.บน.23<br>- ผกบ.บก.บน.23<br>- ผกร.บก.บน.23<br>- มว.จัดหา บก.บน.23<br>- นงป.บน.23<br>- นธน.บน.23<br>- นิรภัย บน.23<br>- อศจ.บน.23<br>- ผกง.บน.23<br>- ฝูง.231 บน.23<br>- พัน.อย.บน.23<br>- ผนบ.บน.23<br>- บก.กทน.บน.23<br>- ผชอ.กทน.บน.23<br>- ผสอ.กทน.บน.23<br>- ผสพ.กทน.บน.23<br>- มว.บชพ.กทน.บน.23<br>- รพ.กองบิน บน.23<br>- ผชย.บน.23<br>- ผขส.บน.23<br>- ผพธ.บน.23<br>- ผสก.บน.23<br>- ร้อย.ทสห.บน.23<br>- ฝคก.บน.23<br>- ฝูง.236 (สกลนคร)<br>- ฝูง.238 (นครพนม)<br>- ฝคส.2 (แอมโม่)<br>- หน่วยบิน 2038 *(หรือพิมพ์ห้อง/จุดติดตั้งเพิ่มเติมเองได้)* | จำเป็น |
| 3 | **ชื่อเครื่องคอมพิวเตอร์** | Text / Generator | แนะนำรูปแบบ: `[หน่วยงาน]-[ประเภท]-[ลำดับ]` เช่น `RTAF-HQ-PC01`, `COMM-DESK-015`, `FIN-NB-008` | จำเป็น |
| 4 | **หมายเลขพัสดุ ทอ.** | Text | รูปแบบมาตรฐาน: `ทอ.7110-001-XXXX/66`, `ทอ.7025-002-XXXX/67` | จำเป็น |
| 5 | **Serial number (S/N)** | Text | บาร์โค้ด / Serial number จากโรงงานผู้ผลิต | จำเป็น |
| 6 | **ยี่ห้อของอุปกรณ์** | Combobox | - Dell<br>- HP<br>- Lenovo<br>- Acer<br>- ASUS<br>- Apple<br>- Fujitsu<br>- ประกอบเอง (Custom PC) | จำเป็น |
| 7 | **รุ่นของอุปกรณ์** | Combobox | - Dell OptiPlex 7010 / 5090 / 3080<br>- HP ProDesk 400 G7 / EliteDesk 800 G6<br>- Lenovo ThinkCentre M70q / M720s<br>- Acer Veriton M Series<br>- ASUS ExpertCenter D500<br>- HP ProBook / EliteBook (Laptop)<br>- Dell Latitude / Vostro (Laptop) | แนะนำ |
| 8 | **ยี่ห้อ และรุ่น CPU** | Combobox | - Intel Core i3-12100<br>- Intel Core i5-10400 / 11400 / 12400 / 13400<br>- Intel Core i7-11700 / 12700 / 13700<br>- AMD Ryzen 5 5600G / 7600<br>- AMD Ryzen 7 5700G / 7700<br>- Apple M1 / M2 / M3 | จำเป็น |
| 9 | **ความเร็วสัญญาณนาฬิกา (GHz)** | Combobox | - 2.00 GHz<br>- 2.50 GHz<br>- 2.90 GHz<br>- 3.20 GHz<br>- 3.60 GHz<br>- 3.90 GHz<br>- 4.20 GHz | เสริม |
| 10 | **MAC Address** | Text (Regex) | รูปแบบ `XX:XX:XX:XX:XX:XX` หรือ `XX-XX-XX-XX-XX-XX` | จำเป็น |
| 11 | **เครือข่ายที่ใช้** | Combobox | - เครือข่ายภายใน ทอ. (AirNet / RTAF Intranet)<br>- เครือข่ายภายนอก ทอ. (Internet สาธารณะ)<br>- ใช้งาน 2 ระบบ (Dual Network Card)<br>- Standalone (ไม่เชื่อมต่อเครือข่าย / Air-gapped) | จำเป็น |
| 12 | **ประเภทของ RAM** | Combobox | - DDR5<br>- DDR4<br>- DDR3<br>- LPDDR5 (On-board)<br>- LPDDR4x | แนะนำ |
| 13 | **ความจุของ RAM (GB)** | Combobox | - 8 GB<br>- 16 GB<br>- 32 GB<br>- 64 GB<br>- 4 GB (รุ่นเก่า) | จำเป็น |
| 14 | **ประเภท Harddisk** | Combobox | - M.2 NVMe PCIe SSD<br>- 2.5" SATA SSD<br>- 3.5" SATA HDD (7200 RPM)<br>- M.2 SSD + SATA HDD (ไดรฟ์คู่) | จำเป็น |
| 15 | **ความจุของ Harddisk** | Combobox | - 256 GB SSD<br>- 512 GB SSD<br>- 1 TB SSD<br>- 1 TB HDD<br>- 256 GB SSD + 1 TB HDD<br>- 512 GB SSD + 1 TB HDD | จำเป็น |
| 16 | **ชื่อระบบปฏิบัติการ (OS)** | Combobox | - Windows 11 Pro 64-bit<br>- Windows 10 Pro 64-bit<br>- Windows 11 Home 64-bit<br>- Windows 10 Enterprise<br>- Ubuntu Linux Desktop 22.04 LTS / 24.04 LTS<br>- macOS Sonoma / Sequoia | จำเป็น |
| 17 | **ลิขสิทธิ์ของระบบปฏิบัติการ** | Combobox | - OEM (ติดสติกเกอร์มาพร้อมเครื่อง)<br>- Volume License (KMS / MAK ประจำ ทอ.)<br>- FPP (Full Packaged Product - กล่อง)<br>- Open Source / GNU General Public License | จำเป็น |
| 18 | **ชื่อโปรแกรมสำนักงาน** | Combobox | - Microsoft Office 2021 Professional Plus<br>- Microsoft Office 2019 Professional<br>- Microsoft 365 Apps for Enterprise<br>- LibreOffice 7.x / 24.x<br>- WPS Office<br>- OpenOffice<br>- ไม่ได้ติดตั้ง | จำเป็น |
| 19 | **ลิขสิทธิ์ของโปรแกรมสำนักงาน** | Combobox | - Volume License (สัญญาลิขสิทธิ์ ทอ.)<br>- Retail / FPP<br>- Subscription (รายปี M365)<br>- Open Source / ฟรีแวร์<br>- ไม่มีลิขสิทธิ์ / ทดลองใช้งาน | จำเป็น |
| 20 | **ชื่อโปรแกรมป้องกันไวรัส** | Combobox | - Windows Defender / Microsoft Defender<br>- Trend Micro Apex One<br>- Kaspersky Endpoint Security<br>- ESET Endpoint Security<br>- Symantec Endpoint Protection<br>- Bitdefender GravityZone<br>- ไม่ได้ติดตั้ง | จำเป็น |
| 21 | **ลิขสิทธิ์โปรแกรมป้องกันไวรัส** | Combobox | - Enterprise Centralized License (ทอ.)<br>- Standalone License (รายเครื่อง)<br>- ฟรีไลเซนส์ / ติดมากับระบบปฏิบัติการ<br>- หมดอายุการคุ้มครอง | แนะนำ |
| 22 | **คอมพิวเตอร์จากโครงการ** | Combobox | - โครงการจัดหาระบบคอมพิวเตอร์เพื่อการพัฒนางาน ทอ. ปี 65<br>- โครงการจัดซื้อทดแทนเครื่องคอมพิวเตอร์หมดอายุ ปี 66<br>- โครงการเสริมสร้างขีดความสามารถด้านสารสนเทศ ทอ. ปี 67<br>- โครงการศูนย์ปฏิบัติการไซเบอร์ ทอ.<br>- งบประมาณดำเนินงานปกติของหน่วย<br>- ได้รับโอนกรรมสิทธิ์จากหน่วยงานอื่น | แนะนำ |
| 23 | **ปีที่ติดตั้ง** | Combobox | ปี พ.ศ. ครอบคลุม **2550 ถึง 2580** (เช่น 2568, 2567, 2566, 2565...) | จำเป็น |
| 24 | **ผู้รับผิดชอบ** | Combobox / Text | ยศ - ชื่อ - นามสกุล (เช่น น.ต.สมชาย รักชาติ, ร.ท.หญิงกมลวรรณ ทวีทรัพย์) | จำเป็น |
| 25 | **โทรศัพท์ติดต่อผู้รับผิดชอบ** | Text | เบอร์โทรศัพท์มือถือ หรือเบอร์โทรศัพท์ภายใน ทอ. (เช่น `081-234-5678`, `2-4567`) | จำเป็น |
| 26 | **หมายเหตุ** | Combobox / Text | - สภาพพร้อมใช้งานปกติ<br>- อยู่ระหว่างส่งซ่อมภายนอก<br>- อยู่ระหว่างรออะไหล่ทดแทน<br>- เครื่องสำรองฉุกเฉิน (Standby)<br>- ปลดประจำการ / รอจำหน่าย | เสริม |

---

## 3. สถาปัตยกรรมระบบสำหรับพัฒนาต่อยอด (Recommended Tech Stack)

หากต้องการนำไปพัฒนาเป็นระบบ Production ประจำหน่วยงาน แนะนำสถาปัตยกรรมดังนี้:

1. **Frontend**: Next.js 14 / React หรือ Vite + Tailwind CSS + Lucide Icons สำหรับ UI ที่ทันสมัย ลื่นไหล และรองรับ Responsive (เปิดได้ทั้งคอมพิวเตอร์ตั้งโต๊ะ โน้ตบุ๊ก แท็บเล็ตตรวจพัสดุ)
2. **Backend**: Node.js (NestJS / Express) หรือ Python (FastAPI) มี REST API / GraphQL ในการเพิ่ม ลบ แก้ไข ค้นหา และพิมพ์ใบตรวจเช็ก
3. **Database**: PostgreSQL หรือ MySQL (พร้อมทำ Full-text search สำหรับหมายเลขพัสดุ และชื่อผู้รับผิดชอบ)
4. **Data Import/Export**: รองรับการนำเข้า-ส่งออกเป็น **Excel (.xlsx)** และ **CSV** ตามรูปแบบที่กองทัพอากาศใช้อยู่เดิม 100%
5. **Security & Governance**: มีระบบ Role-Based Access Control (Admin ผู้ดูแลระบบ IT / Custodian ผู้ครอบครองเครื่อง / Auditor ผู้ตรวจสอบพัสดุ)
