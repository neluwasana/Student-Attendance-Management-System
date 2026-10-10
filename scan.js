// Get elements
const startButton = document.getElementById('startButton');
const cameraPreview = document.getElementById('cameraPreview');
const resultDisplay = document.getElementById('result');
let html5QrCode;

// Function to start scanning
function startScanning() {
    // Show camera preview
    cameraPreview.style.display = 'block';

    // Initialize the QR Code scanner
    html5QrCode = new Html5Qrcode("cameraPreview");

    // Start the QR code scanning
    html5QrCode.start(
        { facingMode: "environment" }, // Use rear camera
        {
            fps: 10,
            qrbox: { width: 250, height: 250 } // Size of the QR box
        },
        qrCodeMessage => {
            // When a QR code is successfully scanned
            resultDisplay.textContent = `QR Code detected: ${qrCodeMessage}`;
            // Optionally, stop scanning after the first scan
            html5QrCode.stop().then(ignore => {
                cameraPreview.style.display = 'none'; // Hide camera preview
            }).catch(err => {
                console.error("Failed to stop scanning.", err);
            });
        },
        errorMessage => {
            // Handle error case here
        }
    ).catch(err => {
        console.error("Failed to start scanning.", err);
    });
}

// Add click event to the start button
startButton.addEventListener('click', startScanning);