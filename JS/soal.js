// validasi.js - WAKTU YANG BENAR
const SUBTES_ORDER = ["pu", "ppu", "pbm","pk","lbi","lbe", "pm"];
const params = new URLSearchParams(window.location.search);
const subtes = params.get("subtes") || "pu";

// Validasi
if (!SOAL_DATA[subtes]) {
    alert("Subtes tidak valid");
    window.location.href = "index.html";
}

// Cek urutan
const idx = SUBTES_ORDER.indexOf(subtes);
if (idx > 0) {
    const prevSubtes = SUBTES_ORDER[idx - 1];
    if (localStorage.getItem(`done_${prevSubtes}`) !== "true") {
        alert(`Selesaikan ${prevSubtes.toUpperCase()} dulu!`);
        window.location.href = "index.html";
    }
}

// =============== WAKTU YANG BENAR SESUAI INFORMASI ANDA ===============
const SUBTES_TIMES = {
    "pu": 30 * 60,   
    "ppu": 15 * 60,    
    "pbm": 25 * 60,
    "pk": 20 * 60,
    "lbi": 42.5 * 60,
    "lbe": 25*60,
    "pm": 42.5 * 60

};

const SUBTES_NAMES = {
    "pu": "TPS - Penalaran Umum",
    "ppu": "TPS - Pengetahuan & Pemahaman Umum", 
    "pbm": "TPS - Pemahaman Baca dan Menulis",
    "pk": "TPS - Pengatahuan Kuantitatif",
    "lbi": "TLB - Literasi Bahasa Indonesia",
    "lbe": "TLB - Literasi Bahasa Inggris",
    "pm": "TPM - Penalaran Matematika"
};

// Inisialisasi
const soal = SOAL_DATA[subtes];
let currentQuestion = 0;
const userAnswers = new Array(soal.length).fill(null);

console.log("=== KONFIGURASI SUBTES ===");
console.log("Subtes:", subtes);
console.log("Nama:", SUBTES_NAMES[subtes]);
console.log("Waktu:", SUBTES_TIMES[subtes] / 60, "menit");
console.log("Jumlah soal:", soal.length);

// =============== SISANYA TETAP SAMA ===============
// Generate nomor soal
function generateQuestionNumbers() {
    const container = document.getElementById('nomorSoalContainer');
    container.innerHTML = '';
    
    for (let i = 1; i <= soal.length; i++) {
        const li = document.createElement('li');
        li.textContent = i;
        li.dataset.index = i - 1;
        
        li.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            currentQuestion = index;
            loadQuestion();
        });
        
        container.appendChild(li);
    }
}

// Update active question
function updateActiveQuestion() {
    const allItems = document.querySelectorAll('#nomorSoalContainer li');
    allItems.forEach(item => item.classList.remove('active'));
    if (allItems[currentQuestion]) {
        allItems[currentQuestion].classList.add('active');
    }
}

// Load question
function loadQuestion() {
    const q = soal[currentQuestion];
    
    // Tampilkan pertanyaan
    document.getElementById("pertanyaan").innerHTML = q.tanya;
    
    // Tampilkan pilihan
    const opsiContainer = document.getElementById("opsi");
    opsiContainer.innerHTML = "";
    
    q.opsi.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "opsi-item";
        
        // Check if this option is selected
        const isSelected = userAnswers[currentQuestion] === i;
        if (isSelected) {
            div.classList.add('selected');
        }
        
        div.innerHTML = `
            <div class="option-letter">${String.fromCharCode(65 + i)}</div>
            <button class="opsi" data-index="${i}">${opt}</button>
        `;
        
        // Event listener untuk opsi
        const button = div.querySelector('.opsi');
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const index = parseInt(this.getAttribute('data-index'));
            
            // Hapus class selected dari semua opsi
            document.querySelectorAll('.opsi-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Tambah class selected ke opsi yang dipilih
            div.classList.add('selected');
            
            // Simpan jawaban
            selectAnswer(index);
        });
        
        opsiContainer.appendChild(div);
    });
    
    // Update progress
    const totalDijawab = userAnswers.filter(a => a !== null).length;
    document.querySelector(".progress span:first-child").textContent = totalDijawab;
    document.querySelector(".progress span:last-child").textContent = soal.length;
    
    // Update tombol
    document.getElementById("prev-btn").style.display = currentQuestion === 0 ? "none" : "block";
    document.getElementById("next-btn").style.display = currentQuestion === soal.length - 1 ? "none" : "block";
    document.getElementById("submit-btn").style.display = currentQuestion === soal.length - 1 ? "block" : "none";
    
    // Update nomor aktif
    updateActiveQuestion();
    
    // Update status answered
    updateQuestionStatus();
}

// Update status soal
function updateQuestionStatus() {
    const allItems = document.querySelectorAll('#nomorSoalContainer li');
    allItems.forEach((item, index) => {
        item.classList.remove('answered');
        if (userAnswers[index] !== null) {
            item.classList.add('answered');
        }
    });
}

// Pilih jawaban
function selectAnswer(answerIndex) {
    console.log("Memilih jawaban:", answerIndex, "untuk soal:", currentQuestion);
    userAnswers[currentQuestion] = answerIndex;
    saveAnswers();
    updateQuestionStatus();
    
    // Update progress
    const totalDijawab = userAnswers.filter(a => a !== null).length;
    document.querySelector(".progress span:first-child").textContent = totalDijawab;
}

// Save answers
function saveAnswers() {
    localStorage.setItem(`jawaban_${subtes}`, JSON.stringify(userAnswers));
}

// Load saved answers
function loadSavedAnswers() {
    const saved = localStorage.getItem(`jawaban_${subtes}`);
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((ans, i) => {
            if (ans !== null) userAnswers[i] = ans;
        });
    }
}

// Navigasi
function nextQuestion() {
    if (currentQuestion < soal.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitAnswers();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Submit
function submitAnswers() {
    const unanswered = userAnswers.filter(a => a === null).length;
    
    if (unanswered > 0 && !confirm(`Masih ada ${unanswered} soal belum dijawab. Lanjut?`)) {
        return;
    }
    
    lanjutKeSubtesBerikutnya();
}

// Lanjut ke subtes berikutnya
function lanjutKeSubtesBerikutnya() {
    // Simpan hasil
    let score = 0;
    soal.forEach((q, i) => {
        if (userAnswers[i] === q.jawab) score++;
    });
    
    localStorage.setItem(`skor_${subtes}`, score);
    localStorage.setItem(`total_${subtes}`, soal.length);
    localStorage.setItem(`done_${subtes}`, "true");
    
    // Hentikan timer
    if (typeof resetTimer === 'function') {
        resetTimer();
    }
    
    // Cek subtes berikutnya
    const nextIdx = SUBTES_ORDER.indexOf(subtes) + 1;
    
    if (nextIdx < SUBTES_ORDER.length) {
        const nextSubtes = SUBTES_ORDER[nextIdx];
        alert(`✅ Subtes ${SUBTES_NAMES[subtes]} selesai!\nMengarahkan ke ${SUBTES_NAMES[nextSubtes]}...`);
        
        setTimeout(() => {
            window.location.href = `soal.html?subtes=${nextSubtes}`;
        }, 1500);
    } else {
        alert(`🎉 SELESAI! Semua subtes telah dikerjakan!\nMengarahkan ke halaman hasil...`);
        
        setTimeout(() => {
            window.location.href = "hasil.html";
        }, 1500);
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    console.log("=== VALIDASI.JS DIMUAT ===");
    console.log("Subtes aktif:", subtes);
    console.log("Nama subtes:", SUBTES_NAMES[subtes]);
    console.log("Waktu subtes:", SUBTES_TIMES[subtes], "detik", "(", SUBTES_TIMES[subtes]/60, "menit )");
    console.log("Jumlah soal:", soal.length);
    
    // Load saved answers
    loadSavedAnswers();
    
    // Generate nomor soal
    generateQuestionNumbers();
    
    // Event listeners untuk tombol navigasi
    document.getElementById("prev-btn").addEventListener("click", prevQuestion);
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
    document.getElementById("submit-btn").addEventListener("click", submitAnswers);
    
    // Set nama subtes di display
    const subtestNameElement = document.getElementById("subtestName");
    if (subtestNameElement) {
        subtestNameElement.textContent = SUBTES_NAMES[subtes] || "TPS - Ujian";
    }
    
    // Load soal pertama
    loadQuestion();
    
    // Start timer dengan nama subtes yang benar
    if (typeof startTimer === 'function') {
        console.log("Memulai timer untuk", SUBTES_NAMES[subtes]);
        startTimer(SUBTES_TIMES[subtes], SUBTES_NAMES[subtes]);
    } else {
        console.error("Fungsi startTimer tidak ditemukan!");
    }
    
    // Debug: Cek apakah timer berjalan
    setTimeout(() => {
        console.log("Timer check - 2 detik setelah load:");
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            console.log("Timer display value:", timerDisplay.textContent);
        }
    }, 2000);
});

