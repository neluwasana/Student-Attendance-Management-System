// Create-card.js - Student ID Card Generator

const fullnameInput    = document.getElementById("fullname");
const indexNumberInput = document.getElementById("indexnumber");
const departmentInput  = document.getElementById("department");
const photoUploadInput = document.getElementById("photo-upload");
const studentNamePreview = document.getElementById("studentNamePreview");
const departmentPreview  = document.getElementById("departmentPreview");
const studentID          = document.getElementById("studentID");
const studentPhoto       = document.getElementById("studentPhoto");
const defaultUserIcon    = document.getElementById("defaultUserIcon");
const qrCodeContainer    = document.getElementById("qrCodeContainer");

// ── Live preview updates ────────────────────────────────────
fullnameInput.addEventListener("input", function () {
    studentNamePreview.textContent = fullnameInput.value.trim() || "Student Name";
});
departmentInput.addEventListener("input", function () {
    departmentPreview.textContent = departmentInput.value.trim() || "Department / Program";
});
indexNumberInput.addEventListener("input", function () {
    var val = indexNumberInput.value.trim();
    studentID.textContent = val ? "ID: QR-" + val : "17491XXXXXXXX";
});

// ── Photo upload with preview ───────────────────────────────
photoUploadInput.addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert("Invalid file. Please select PNG or JPEG.");
        photoUploadInput.value = "";
        return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
        studentPhoto.src = ev.target.result;    // base64 - safe
        studentPhoto.style.display = "block";
        if (defaultUserIcon) defaultUserIcon.style.display = "none";
    };
    reader.readAsDataURL(file);
});

// ── Generate QR (toDataURL = base64 img, no canvas taint) ──
document.getElementById("generateBtn").addEventListener("click", function () {
    if (!fullnameInput.value.trim()) {
        alert("Please enter full name."); fullnameInput.focus(); return;
    }
    if (!indexNumberInput.value.trim()) {
        alert("Please enter index number."); indexNumberInput.focus(); return;
    }
    if (!departmentInput.value.trim()) {
        alert("Please enter department."); departmentInput.focus(); return;
    }

    studentNamePreview.textContent = fullnameInput.value.trim();
    departmentPreview.textContent  = departmentInput.value.trim();
    studentID.textContent          = "ID: QR-" + indexNumberInput.value.trim();

    var qrData = JSON.stringify({
        fullName:    fullnameInput.value.trim(),
        indexNumber: indexNumberInput.value.trim(),
        department:  departmentInput.value.trim()
    });

    // toDataURL → returns base64 PNG → put in <img> (NOT canvas)
    // This means html2canvas captures an <img> not a <canvas> → no taint!
    QRCode.toDataURL(qrData, {
        width: 110, margin: 1,
        color: { dark: "#0a0f1e", light: "#ffffff" }
    }, function (err, dataUrl) {
        if (err) { console.error(err); alert("QR generation failed."); return; }
        qrCodeContainer.innerHTML = "";
        var img = document.createElement("img");
        img.src = dataUrl;          // base64 data URL - safe from taint
        img.width = img.height = 110;
        img.style.display = "block";
        img.style.margin = "0 auto";
        qrCodeContainer.appendChild(img);
    });
});

// ── Make safe logo (pure JS canvas, no file:// image loaded) ─
// VG.jpg loaded from file:// taints html2canvas → swap it with
// a programmatically drawn canvas image before download
function makeSafeLogo() {
    var c = document.createElement("canvas");
    c.width = c.height = 60;
    var ctx = c.getContext("2d");
    // Purple circle background
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.arc(30, 30, 30, 0, Math.PI * 2);
    ctx.fill();
    // "IT" text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IT", 30, 30);
    return c.toDataURL("image/png"); // safe - no cross-origin
}

// ── Download card as PDF ────────────────────────────────────
document.getElementById("download").addEventListener("click", function () {
    var invoice = document.getElementById("invoice");
    if (!invoice) { alert("Card not found!"); return; }

    var name    = fullnameInput.value.trim()    || "Student";
    var index   = indexNumberInput.value.trim() || "ID";
    var btn     = document.getElementById("download");
    var logoImg = document.getElementById("cardLogoImg");
    var origSrc = logoImg ? logoImg.src : null;

    // Swap: replace file:// logo with safe canvas-generated base64
    if (logoImg) logoImg.src = makeSafeLogo();
    if (btn) { btn.disabled = true; btn.textContent = "Downloading..."; }

    function restore() {
        if (logoImg && origSrc) logoImg.src = origSrc;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-file-download"></i> Download PDF';
        }
    }

    // useCORS: false, allowTaint: false → all images are now base64 → no taint
    var opt = {
        margin:      5,
        filename:    name + "_" + index + "_ID_Card.pdf",
        image:       { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, useCORS: false, allowTaint: false, logging: false },
        jsPDF:       { unit: "mm", format: "a6", orientation: "portrait" }
    };

    if (window.html2pdf) {
        html2pdf().from(invoice).set(opt).save()
            .then(restore)
            .catch(function (e) { restore(); alert("PDF error: " + e.message); });
    } else if (window.html2canvas) {
        html2canvas(invoice, { scale: 3, useCORS: false, allowTaint: false, logging: false })
            .then(function (c) {
                var link = document.createElement("a");
                link.download = name + "_" + index + "_ID_Card.png";
                link.href = c.toDataURL("image/png");
                link.click();
                restore();
            })
            .catch(function (e) { restore(); alert("Error: " + e.message); });
    } else {
        restore();
        alert("Libraries not loaded. Please check internet connection.");
    }
});

// ── Back button ─────────────────────────────────────────────
function closeForgotPassword() {
    window.location.href = "Cards.html";
}
