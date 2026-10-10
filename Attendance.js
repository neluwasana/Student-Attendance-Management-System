// =========================================================
// Attendance.js - QR Attendance Management System
// =========================================================

let html5QrCode = null;
let isScanning = false;
let lastScanned = null;
let lastScanTime = 0;
let scanRecords = JSON.parse(localStorage.getItem("qrScanRecords")) || [];

// DOM Elements
const startScanBtn = document.getElementById("startScan");
const stopScanBtn = document.getElementById("stopScan");
const resultElement = document.getElementById("result");
const recordsBody = document.getElementById("recordsBody");
const summaryBtn = document.getElementById("summaryBtn");
const summaryModal = document.getElementById("summaryModal");
const summaryContent = document.getElementById("summaryContent");
const closeModal = document.querySelector(".close-modal");
const filterInput = document.getElementById("filterInput");
const filterBtn = document.getElementById("filterBtn");

// 1. Start Scanner
async function startScanner() {
    if (isScanning) return;
    resultElement.innerHTML = `<span style="color:#a855f7;"><i class="fa fa-spinner fa-spin"></i> Starting camera...</span>`;
    try {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }
        await html5QrCode.start(
            { facingMode: "user" },
            { fps: 15, qrbox: { width: 250, height: 250 } },
            (decodedText) => onQrCodeScanned(decodedText),
            () => {}
        );
        isScanning = true;
        resultElement.innerHTML = `<span style="color:#10b981;"><i class="fa fa-check-circle"></i> Camera active! Scan student QR code.</span>`;
        startScanBtn.disabled = true;
        stopScanBtn.disabled = false;
    } catch (err) {
        resultElement.innerHTML = `<span style="color:#ef4444;"><i class="fa fa-exclamation-triangle"></i> Camera Error: ${err.message || "Please allow camera access."}</span>`;
    }
}

// 2. Stop Scanner
async function stopScanner() {
    if (html5QrCode && isScanning) {
        await html5QrCode.stop().catch(() => {});
        isScanning = false;
        resultElement.innerHTML = `<span><i class="fa fa-info-circle"></i> Scanner stopped.</span>`;
        startScanBtn.disabled = false;
        stopScanBtn.disabled = true;
    }
}

// 3. Process Scan Result
function onQrCodeScanned(content) {
    const now = Date.now();
    if (content === lastScanned && now - lastScanTime < 3000) return; // Prevent duplicate rapid scans
    lastScanned = content;
    lastScanTime = now;

    let scanData;
    try {
        scanData = JSON.parse(content);
    } catch (e) {
        scanData = { fullName: content };
    }

    const studentName = scanData.fullName || "Unknown Student";
    const dateStr = new Date().toLocaleDateString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Check if student already checked in today
    const existing = scanRecords.find(r => r.fullName.toLowerCase() === studentName.toLowerCase() && r.date === dateStr && !r.outTime);

    if (existing) {
        existing.outTime = timeStr;
        resultElement.innerHTML = `<span style="color:#34d399;"><strong>${studentName}</strong> checked out at ${timeStr}</span>`;
    } else {
        scanRecords.push({
            fullName: studentName,
            inTime: timeStr,
            outTime: "",
            date: dateStr,
            timestamp: Date.now()
        });
        resultElement.innerHTML = `<span style="color:#a855f7;"><strong>${studentName}</strong> checked in at ${timeStr}</span>`;
    }

    localStorage.setItem("qrScanRecords", JSON.stringify(scanRecords));
    displayRecords();
}

// 4. Render Records Table
function displayRecords(filter = "") {
    if (!recordsBody) return;
    recordsBody.innerHTML = "";

    const list = filter 
        ? scanRecords.filter(r => r.fullName.toLowerCase().includes(filter.toLowerCase()))
        : scanRecords;

    if (list.length === 0) {
        recordsBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px; color:#64748b;">No records found.</td></tr>`;
        return;
    }

    list.slice().reverse().forEach((r, i) => {
        const row = document.createElement("tr");
        const realIndex = scanRecords.indexOf(r);
        row.innerHTML = `
            <td><strong>${r.fullName}</strong></td>
            <td>${r.inTime}</td>
            <td>${r.outTime || '<span style="color:#f59e0b;">Active (In)</span>'}</td>
            <td>${r.date}</td>
            <td><button onclick="deleteRecord(${realIndex})" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;"><i class="fa fa-trash"></i></button></td>
        `;
        recordsBody.appendChild(row);
    });
}

function deleteRecord(index) {
    if (confirm("Delete this attendance record?")) {
        scanRecords.splice(index, 1);
        localStorage.setItem("qrScanRecords", JSON.stringify(scanRecords));
        displayRecords();
    }
}

// 5. Summary Modal
function showSummary() {
    if (!summaryContent || !summaryModal) return;
    if (scanRecords.length === 0) {
        summaryContent.innerHTML = "<p>No records found.</p>";
    } else {
        const counts = {};
        scanRecords.forEach(r => { counts[r.fullName] = (counts[r.fullName] || 0) + 1; });
        let html = '<div style="display:flex; flex-direction:column; gap:10px;">';
        for (let name in counts) {
            html += `<div style="background:#0f1523; padding:10px; border-radius:8px; border:1px solid #26334d;"><strong>${name}</strong>: ${counts[name]} session(s)</div>`;
        }
        summaryContent.innerHTML = html + "</div>";
    }
    summaryModal.style.display = "flex";
}

// Event Listeners
if (startScanBtn) startScanBtn.addEventListener("click", startScanner);
if (stopScanBtn) stopScanBtn.addEventListener("click", stopScanner);
if (summaryBtn) summaryBtn.addEventListener("click", showSummary);
if (closeModal) closeModal.addEventListener("click", () => summaryModal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === summaryModal) summaryModal.style.display = "none"; });

if (filterBtn) filterBtn.addEventListener("click", () => displayRecords(filterInput.value.trim()));
if (filterInput) filterInput.addEventListener("input", () => displayRecords(filterInput.value.trim()));

document.addEventListener("DOMContentLoaded", () => {
    if (stopScanBtn) stopScanBtn.disabled = true;
    displayRecords();
});
