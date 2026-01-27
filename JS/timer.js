// JS/simple-timer.js - Timer paling sederhana
function startSimpleTimer() {
    console.log('Starting simple timer...');
    
    const display = document.getElementById('timerDisplay');
    if (!display) {
        console.error('Cannot find timerDisplay element!');
        return;
    }
    
    let secondsLeft = 45 * 60; // 45 menit
    
    // Update display pertama kali
    updateDisplay();
    
    // Start interval
    const timerInterval = setInterval(() => {
        secondsLeft--;
        updateDisplay();
        
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            alert('Waktu habis!');
        }
    }, 1000);
    
    function updateDisplay() {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        display.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        console.log('Timer:', display.textContent);
    }
    
    return timerInterval;
}

// Jalankan saat halaman siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSimpleTimer);
} else {
    startSimpleTimer();
}