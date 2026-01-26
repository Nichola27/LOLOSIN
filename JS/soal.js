console.log("JS soal.js dimuat");

// Variabel global
let currentQuestion = 0;
let userAnswers = new Array(30).fill(undefined); // Inisialisasi 20 slot
let userCorrect = new Array(30).fill(false);
let quizCompleted = false;

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM sudah siap");
  
  // Validasi data
  if (typeof soal === 'undefined' || !Array.isArray(soal) || soal.length === 0) {
    document.getElementById("pertanyaan").textContent = "Data soal tidak tersedia";
    console.error("Data soal tidak valid");
    return;
  }
  
  console.log("Data soal ditemukan:", soal.length, "soal");
  
  // Elemen DOM
  const pertanyaanEl = document.getElementById("pertanyaan");
  const opsiButtons = document.querySelectorAll("#opsi .opsi");
  const nomorSoalItems = document.querySelectorAll(".nomor-soal li");
  const progressCurrent = document.querySelector(".progress span:first-child");
  const progressTotal = document.querySelector(".progress span:last-child");
  
  // Tombol navigasi
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  

  if (progressTotal) {
    progressTotal.textContent = soal.length;
  }
  
  // Fungsi untuk menampilkan soal
  function showQuestion(index) {
    if (index < 0 || index >= soal.length) return;
    
    currentQuestion = index;
    const question = soal[index];
    
    // Tampilkan nomor soal dan pertanyaan
    pertanyaanEl.innerHTML = `${question.tanya}`;
    
    // Tampilkan opsi
    opsiButtons.forEach((btn, i) => {
      if (question.opsi && question.opsi[i]) {
        btn.textContent = question.opsi[i];
        btn.dataset.index = i;
        btn.style.display = "flex";
        
        // Reset semua button dulu
        btn.classList.remove("selected", "correct-final", "wrong-final");
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.style.borderColor = "";
        btn.disabled = false;
        
        // Jika sudah dijawab dan quiz belum selesai
        if (userAnswers[index] !== undefined && !quizCompleted) {
          if (userAnswers[index] === i) {
            btn.classList.add("selected");
            btn.style.backgroundColor = "#3b82f6";
            btn.style.color = "white";
          }
        }
        
        // Jika quiz sudah selesai, tampilkan warna benar/salah
        if (quizCompleted && userAnswers[index] !== undefined) {
          if (userAnswers[index] === i) {
            if (userCorrect[index]) {
              btn.classList.add("correct-final");
              btn.style.backgroundColor = "#10b981";
            } else {
              btn.classList.add("wrong-final");
              btn.style.backgroundColor = "#ef4444";
            }
            btn.style.color = "white";
          }
          
          // Tampilkan jawaban yang benar (hijau outline)
          if (typeof question.jawab === 'number' && question.jawab === i) {
            btn.style.border = "3px solid #10b981";
          }
        }
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
      
      // Tandai yang sudah dijawab dengan BACKGROUND BIRU
      if (userAnswers[i] !== undefined && !quizCompleted) {
        item.classList.add("answered");
      } else {
        item.classList.remove("answered");
      }
      
      // Jika quiz selesai, update warna benar/salah
      if (quizCompleted && userAnswers[i] !== undefined) {
        if (userCorrect[i]) {
          item.classList.add("correct");
          item.classList.remove("answered");
        } else {
          item.classList.add("wrong");
          item.classList.remove("answered");
        }
      }
    });
    
    // Update progress (jumlah yang sudah dijawab)
    if (progressCurrent) {
      const answered = userAnswers.filter(answer => answer !== undefined).length;
      progressCurrent.textContent = answered;
    }
    
    // Update tombol navigasi
    updateNavigationButtons();
    
    console.log(`Menampilkan soal ${index + 1}`);
  }
  
  // Fungsi untuk cek jawaban
  function checkAnswer(questionIndex, selectedIndex) {
    const question = soal[questionIndex];
    let isCorrect = false;
    
    if (typeof question.jawab === 'number') {
      isCorrect = (selectedIndex === question.jawab);
    } else {
      isCorrect = (question.opsi[selectedIndex] === question.jawab);
    }
    
    return isCorrect;
  }
  
  // Fungsi update tombol navigasi
  function updateNavigationButtons() {
    if (!prevBtn || !nextBtn || !submitBtn) return;
    
    // Tombol sebelumnya
    prevBtn.disabled = (currentQuestion === 0);
    prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
    
    // Tombol selanjutnya
    if (currentQuestion === soal.length - 1) {
      nextBtn.style.display = "none";
      // Tampilkan submit button jika semua sudah dijawab
      const allAnswered = userAnswers.every(answer => answer !== undefined);
      submitBtn.style.display = allAnswered ? "inline-block" : "none";
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }
  }
  
  // Fungsi untuk tampilkan hasil setelah selesai
  function showResults() {
    quizCompleted = true;
    
    // Hitung skor
    const score = userCorrect.filter(correct => correct).length;
    const totalQuestions = soal.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Tampilkan hasil di alert
    let resultMessage = `📊 HASIL UJIAN\n`;
    resultMessage += `═══════════════════\n`;
    resultMessage += `Jumlah Soal: ${totalQuestions}\n`;
    resultMessage += `Dijawab: ${userAnswers.filter(a => a !== undefined).length}\n`;
    resultMessage += `Benar: ${score}\n`;
    resultMessage += `Salah: ${totalQuestions - score}\n`;
    resultMessage += `Nilai: ${percentage}/100\n\n`;
    
    // Tampilkan nomor yang salah
    const wrongQuestions = [];
    const correctQuestions = [];
    
    soal.forEach((q, i) => {
      if (userAnswers[i] !== undefined) {
        if (userCorrect[i]) {
          correctQuestions.push(i + 1);
        } else {
          wrongQuestions.push(i + 1);
        }
      }
    });
    
    if (wrongQuestions.length > 0) {
      resultMessage += `❌ Soal yang salah: ${wrongQuestions.join(', ')}\n`;
    }
    if (correctQuestions.length > 0) {
      resultMessage += `✅ Soal yang benar: ${correctQuestions.join(', ')}\n`;
    }
    
    resultMessage += `\n`;
    
    // Tampilkan detail soal yang salah
    if (wrongQuestions.length > 0) {
      resultMessage += `📝 Review jawaban salah:\n`;
      wrongQuestions.slice(0, 3).forEach(no => { // Tampilkan maks 3 soal
        const idx = no - 1;
        const question = soal[idx];
        const userAnswer = question.opsi[userAnswers[idx]];
        let correctAnswer = "";
        
        if (typeof question.jawab === 'number') {
          correctAnswer = question.opsi[question.jawab];
        } else {
          correctAnswer = question.jawab;
        }
        
        resultMessage += `Soal ${no}: ${question.tanya}\n`;
        resultMessage += `  ✗ Jawaban kamu: ${userAnswer}\n`;
        resultMessage += `  ✓ Jawaban benar: ${correctAnswer}\n\n`;
      });
      
      if (wrongQuestions.length > 3) {
        resultMessage += `... dan ${wrongQuestions.length - 3} soal lainnya\n\n`;
      }
    }
    
    // Pesan motivasi
    if (percentage === 100) {
      resultMessage += "🎉 SEMPURNA! LUAR BIASA! 🏆";
    } else if (percentage >= 80) {
      resultMessage += "🎉 Excellent! Kerja bagus!";
    } else if (percentage >= 60) {
      resultMessage += "👍 Good job! Tingkatkan lagi!";
    } else if (percentage >= 40) {
      resultMessage += "💪 Lumayan, perlu belajar lebih giat!";
    } else {
      resultMessage += "📚 Jangan menyerah! Ayo belajar lagi!";
    }
    
    // Tampilkan alert
    alert(resultMessage);
    
    // Refresh tampilan untuk update warna
    showQuestion(currentQuestion);
    
    // Nonaktifkan semua button opsi setelah selesai
    opsiButtons.forEach(btn => {
      btn.disabled = true;
    });
    
    // Sembunyikan tombol submit
    submitBtn.style.display = "none";
    
    console.log("Quiz selesai. Skor:", score, "/", totalQuestions);
  }
  
  // Event listener untuk button opsi
  opsiButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      if (quizCompleted) return; // Jangan biarkan jawab setelah selesai
      
      const selectedIndex = parseInt(this.dataset.index);
      const question = soal[currentQuestion];
      
      console.log(`Soal ${currentQuestion + 1}: Memilih opsi ${selectedIndex} (${question.opsi[selectedIndex]})`);
      
      // Simpan jawaban user
      userAnswers[currentQuestion] = selectedIndex;
      
      // Cek dan simpan hasil jawaban
      userCorrect[currentQuestion] = checkAnswer(currentQuestion, selectedIndex);
      
      // Tandai nomor di sidebar dengan BACKGROUND BIRU
      nomorSoalItems[currentQuestion].classList.add("answered");
      
      // Tandai button yang dipilih (biru)
      opsiButtons.forEach(b => {
        b.classList.remove("selected");
        b.style.backgroundColor = "";
        b.style.color = "";
      });
      
      this.classList.add("selected");
      this.style.backgroundColor = "#3b82f6";
      this.style.color = "white";
      
      // Update progress
      if (progressCurrent) {
        const answered = userAnswers.filter(answer => answer !== undefined).length;
        progressCurrent.textContent = answered;
      }
      
      // Update tombol navigasi
      updateNavigationButtons();
      
      // Cek apakah semua sudah dijawab
      const allAnswered = userAnswers.every(answer => answer !== undefined);
      if (allAnswered) {
        console.log("Semua soal sudah dijawab!");
        submitBtn.style.display = "inline-block";
      }
    });
  });
  
  // Event listener untuk tombol navigasi
  if (prevBtn) {
    prevBtn.addEventListener("click", function() {
      if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", function() {
      if (currentQuestion < soal.length - 1) {
        showQuestion(currentQuestion + 1);
      }
    });
  }
  
  if (submitBtn) {
    submitBtn.addEventListener("click", function() {
      // Cek apakah semua sudah dijawab
      const allAnswered = userAnswers.every(answer => answer !== undefined);
      
      if (!allAnswered) {
        // Cari nomor yang belum dijawab
        const unanswered = [];
        userAnswers.forEach((answer, i) => {
          if (answer === undefined) unanswered.push(i + 1);
        });
        
        const confirmSubmit = confirm(`Masih ada ${unanswered.length} soal yang belum dijawab:\nNomor: ${unanswered.join(', ')}\n\nYakin ingin mengakhiri quiz?`);
        
        if (!confirmSubmit) {
          return; // Batalkan jika user tidak yakin
        }
      }
      
      // Tampilkan hasil
      showResults();
    });
  }
  
  // Event listener untuk nomor di sidebar
  nomorSoalItems.forEach((item, index) => {
    item.addEventListener("click", function() {
      showQuestion(index);
    });
  });
  
  // Tampilkan soal pertama
  showQuestion(0);
  
  // Debug info
  console.log("Jumlah button opsi:", opsiButtons.length);
  console.log("Jumlah nomor soal di sidebar:", nomorSoalItems.length);
});