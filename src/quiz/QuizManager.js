export function initQuiz() {
  const introScreen = document.getElementById('quiz-intro');
  const activeScreen = document.getElementById('quiz-active');
  const resultScreen = document.getElementById('quiz-result');
  const reviewContainer = document.getElementById('quiz-review');
  
  const startBtn = document.getElementById('start-quiz-btn');
  const restartBtn = document.getElementById('restart-quiz-btn');
  const nextBtn = document.getElementById('next-q-btn');
  
  const qText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const qCounter = document.getElementById('q-counter');
  const qTimer = document.getElementById('q-timer');
  const finalScore = document.getElementById('final-score');
  const scoreBar = document.getElementById('score-bar');

  const questions = [
    {
      q: "What does LASER stand for?",
      options: ["Light Amplification by Stimulated Emission of Radiation", "Light Absorption by Stimulated Emission of Radiation", "Luminous Amplification by Simulated Emission", "Light Amplification by Spontaneous Emission of Radiation"],
      ans: 0
    },
    {
      q: "Which characteristic of laser refers to it having a single wavelength/color?",
      options: ["Coherence", "Monochromaticity", "Directionality", "High Intensity"],
      ans: 1
    },
    {
      q: "In a Helium-Neon (He-Ne) laser, which atom actually produces the laser light?",
      options: ["Helium", "Neon", "Both equally", "Argon"],
      ans: 1
    },
    {
      q: "The state where more atoms are in the excited state than the ground state is called:",
      options: ["Thermal Equilibrium", "Population Inversion", "Spontaneous Decay", "Plasma State"],
      ans: 1
    },
    {
      q: "Which medical application uses lasers for vision correction?",
      options: ["Dialysis", "LASIK", "MAPPING", "X-RAY"],
      ans: 1
    }
  ];

  let currentQ = 0;
  let score = 0;
  let timerVal = 30;
  let timerInterval = null;
  let userResults = [];

  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', () => {
    currentQ++;
    if(currentQ >= questions.length) {
      endQuiz();
    } else {
      loadQuestion();
    }
  });

  function startQuiz() {
    introScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    activeScreen.classList.remove('hidden');
    
    currentQ = 0;
    score = 0;
    userResults = [];
    loadQuestion();
  }

  function loadQuestion() {
    const qData = questions[currentQ];
    qCounter.textContent = `${currentQ + 1}/${questions.length}`;
    qText.textContent = qData.q;
    
    optionsContainer.innerHTML = '';
    nextBtn.classList.add('hidden');

    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = "p-4 text-left glassmorphism border border-gray-600 rounded-xl hover:bg-white/10 transition-colors w-full group flex justify-between items-center";
      btn.innerHTML = `<span>${opt}</span><span class="opacity-0 group-hover:opacity-50 text-xs">Select</span>`;
      btn.addEventListener('click', () => handleAnswer(idx, btn));
      optionsContainer.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerVal = 30;
    qTimer.textContent = timerVal;
    
    timerInterval = setInterval(() => {
      timerVal--;
      qTimer.textContent = timerVal;
      if(timerVal <= 0) {
        clearInterval(timerInterval);
        handleAnswer(-1, null); // Time out
      }
    }, 1000);
  }

  function handleAnswer(selectedIdx, btnElement) {
    clearInterval(timerInterval);
    
    const btns = optionsContainer.querySelectorAll('button');
    btns.forEach(b => b.disabled = true); 

    const correctIdx = questions[currentQ].ans;
    const isCorrect = selectedIdx === correctIdx;

    userResults.push({
      question: questions[currentQ].q,
      userAnswer: selectedIdx === -1 ? "Timed Out" : questions[currentQ].options[selectedIdx],
      correctAnswer: questions[currentQ].options[correctIdx],
      isCorrect: isCorrect
    });

    if(isCorrect) {
      score++;
      if(btnElement) {
         btnElement.classList.replace('border-gray-600', 'border-green-500');
         btnElement.classList.add('bg-green-500/20');
         btnElement.innerHTML += '<span class="text-green-500">✓</span>';
      }
    } else {
      if(btnElement) {
         btnElement.classList.replace('border-gray-600', 'border-brand-red');
         btnElement.classList.add('bg-brand-red/20');
         btnElement.innerHTML += '<span class="text-brand-red">✗</span>';
      }
      // Highlight correct
      btns[correctIdx].classList.replace('border-gray-600', 'border-green-500');
      btns[correctIdx].classList.add('bg-white/5');
    }

    nextBtn.classList.remove('hidden');
  }

  function endQuiz() {
    activeScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    finalScore.textContent = `${score}/${questions.length}`;
    const percent = (score / questions.length) * 100;
    
    // Animate bar
    scoreBar.style.width = '0%';
    setTimeout(() => {
      scoreBar.style.width = `${percent}%`;
    }, 100);

    // Build Review
    reviewContainer.innerHTML = '<h4 class="font-bold text-center border-b border-white/10 pb-2 mb-4">Question Review</h4>';
    userResults.forEach((res, i) => {
      const item = document.createElement('div');
      item.className = "pb-4 border-b border-white/5";
      item.innerHTML = `
        <div class="font-bold mb-1">${i+1}. ${res.question}</div>
        <div class="flex justify-between text-xs">
          <span class="${res.isCorrect ? 'text-green-400' : 'text-brand-red'}">Your Answer: ${res.userAnswer}</span>
          ${!res.isCorrect ? `<span class="text-green-400">Correct: ${res.correctAnswer}</span>` : ''}
        </div>
      `;
      reviewContainer.appendChild(item);
    });

    // Save to local storage
    const prevBest = localStorage.getItem('laserQuizBest') || 0;
    if(score > prevBest) {
      localStorage.setItem('laserQuizBest', score);
    }
  }
}
