console.log("JS soal.js dimuat");

// Variabel global
let currentQuestion = 0;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", function() {
  // Validasi data
  if (typeof soal === 'undefined' || !Array.isArray(soal) || soal.length === 0) {
    document.getElementById("pertanyaan").textContent = "Data soal tidak tersedia";
    return;
  }
  
  // Elemen DOM
  const pertanyaanEl = document.getElementById("pertanyaan");
  const opsiButtons = document.querySelectorAll("#opsi .opsi");
  const nomorSoalItems = document.querySelectorAll(".nomor-soal li");
  const progressCurrent = document.querySelector(".progress span:first-child");
  const progressTotal = document.querySelector(".progress span:last-child");
  
  // Update progress total
  if (progressTotal) {
    progressTotal.textContent = soal.length;
  }
  
  // Fungsi untuk menampilkan soal
  function showQuestion(index) {
    if (index < 0 || index >= soal.length) return;
    
    currentQuestion = index;
    const question = soal[index];
    

    pertanyaanEl.textContent = question.tanya;
    
    // Tampilkan opsi
    opsiButtons.forEach((btn, i) => {
      if (question.opsi[i]) {
        btn.textContent = question.opsi[i];
        btn.dataset.index = i; // Simpan index opsi
        
        // Reset style
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.style.borderColor = "";
      } else {
        btn.style.display = "none";
      }
    });
    
    // Update nomor aktif di sidebar
    nomorSoalItems.forEach((item, i) => {
      item.classList.remove("active");
      if (i === index) {
        item.classList.add("active");
      }
      // Tandai yang sudah dijawab
      if (userAnswers[i] !== undefined) {
        item.classList.add("done");
      }
    });
    
    // Update progress
    if (progressCurrent) {
      progressCurrent.textContent = index + 1;
    }
    
    // Tampilkan jawaban sebelumnya jika ada
    if (userAnswers[index] !== undefined) {
      const selectedBtn = opsiButtons[userAnswers[index]];
      if (selectedBtn) {
        selectedBtn.style.backgroundColor = "#1d4ed8";
        selectedBtn.style.color = "white";
        selectedBtn.style.borderColor = "#1d4ed8";
      }
    }
  }
  
  // Event listener untuk button opsi
  opsiButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      const selectedIndex = parseInt(this.dataset.index);
      
      // Simpan jawaban user
      userAnswers[currentQuestion] = selectedIndex;
      
      // Tandai nomor di sidebar
      nomorSoalItems[currentQuestion].classList.add("done");
      
      // Highlight button yang dipilih
      opsiButtons.forEach(b => {
        b.style.backgroundColor = "";
        b.style.color = "";
        b.style.borderColor = "";
      });
      
      this.style.backgroundColor = "#1d4ed8";
      this.style.color = "white";
      this.style.borderColor = "#1d4ed8";
      
      // Otomatis lanjut ke soal berikutnya setelah 0.5 detik
      setTimeout(() => {
        if (currentQuestion < soal.length - 1) {
          showQuestion(currentQuestion + 1);
        } else {
          alert("Soal sudah selesai!");
          // Tampilkan hasil
          let score = 0;
          soal.forEach((q, i) => {
            if (userAnswers[i] !== undefined) {
              if (typeof q.jawab === 'number') {
                if (userAnswers[i] === q.jawab) score++;
              } else if (q.opsi[userAnswers[i]] === q.jawab) {
                score++;
              }
            }
          });
          alert(`Selesai! Skor: ${score}/${soal.length}`);
        }
      }, 500);
    });
  });
  
  // Event listener untuk nomor di sidebar
  nomorSoalItems.forEach((item, index) => {
    item.addEventListener("click", function() {
      showQuestion(index);
    });
  });
  
  // Tampilkan soal pertama
  showQuestion(0);
});