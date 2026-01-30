// timer.js - PERBAIKAN BESAR
let timerInterval;
let timeLeft;
let isPaused = false;

function startTimer(durationInSeconds, subtestName = "") {
    console.log("Timer dimulai:", durationInSeconds, "detik untuk subtes:", subtestName);
    
    // Hentikan timer sebelumnya jika ada
    clearInterval(timerInterval);
    
    // Set waktu
    timeLeft = durationInSeconds;
    isPaused = false;
    
    // Update display timer
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) {
        console.error("Element #timerDisplay tidak ditemukan!");
        return;
    }
    
    // Update nama subtes jika ada parameter
    if (subtestName) {
        const subtestElement = document.getElementById('subtestName');
        if (subtestElement) {
            subtestElement.textContent = subtestName;
        }
    }
    
    // Update tampilan awal
    updateTimerDisplay();
    
    // Jalankan timer
    timerInterval = setInterval(function() {
        if (!isPaused && timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            
            // Cek peringatan waktu
            checkTimeWarnings();
            
            // Auto-submit ketika waktu habis
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }
    }, 1000); // Update setiap detik
    
    console.log("Timer berjalan dengan interval:", timerInterval);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    console.log("Timer update:", timerDisplay.textContent);
}

function checkTimeWarnings() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    
    // Reset semua kelas warning
    timerDisplay.classList.remove('warning', 'danger');
    
    // 5 menit tersisa - kuning
    if (timeLeft <= 5 * 60 && timeLeft > 1 * 60) {
        timerDisplay.classList.add('warning');
        timerDisplay.style.color = "#f59e0b";
    }
    // 1 menit tersisa - merah
    else if (timeLeft <= 1 * 60) {
        timerDisplay.classList.add('danger');
        timerDisplay.style.color = "#ef4444";
    }
    // Normal - biru
    else {
        timerDisplay.style.color = "#3b82f6";
    }
}

function handleTimeUp() {
    console.log("⏰ WAKTU HABIS!");
    
    // Update display ke 00:00
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = "00:00";
        timerDisplay.classList.add('danger');
    }
    
    // Alert waktu habis
    alert('⏰ WAKTU UJIAN SUDAH HABIS!');
    
    // Auto submit jika fungsi ada
    if (typeof submitAnswers === 'function') {
        console.log("Auto-submit jawaban...");
        submitAnswers();
    } else if (typeof lanjutKeSubtesBerikutnya === 'function') {
        console.log("Lanjut ke subtes berikutnya...");
        lanjutKeSubtesBerikutnya();
    }
}

function pauseTimer() {
    isPaused = true;
    console.log("Timer dijeda");
}

function resumeTimer() {
    isPaused = false;
    console.log("Timer dilanjutkan");
}

function resetTimer() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = "30:00";
        timerDisplay.style.color = "#3b82f6";
        timerDisplay.classList.remove('warning', 'danger');
    }
    console.log("Timer direset");
}

function getRemainingTime() {
    return timeLeft;
}

// Ekspor fungsi ke global
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resumeTimer = resumeTimer;
window.resetTimer = resetTimer;
window.getRemainingTime = getRemainingTime;

console.log("Timer.js loaded successfully");