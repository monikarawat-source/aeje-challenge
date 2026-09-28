(function(){
  const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbyHlLdL67bkgSA9ZjEUyHXQfHbYkoTz9QVHkUshKYt3zUOCwQEmy7YlittDfYBvTOFYyw/exec";

  const questions = [
    {
      question:"Which component protects a circuit from excessive current?",
      options:["Fuse","Capacitor","Transformer","Inductor"],
      answer:0
    },
    {
      question:"Which device converts electrical energy into mechanical energy?",
      options:["Generator","Motor","Transformer","Rectifier"],
      answer:1
    },
    {
      question:"What is the SI unit of resistance?",
      options:["Volt","Ampere","Ohm","Watt"],
      answer:2
    },
    {
      question:"Which law relates voltage, current and resistance?",
      options:["Faraday's Law","Ohm's Law","Lenz's Law","Kirchhoff's Law"],
      answer:1
    },
    {
      question:"Which instrument measures electric current?",
      options:["Voltmeter","Wattmeter","Ammeter","Energy Meter"],
      answer:2
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let xp = 0;
  let selectedExam = "";
  let challengeStartTime = null;
  let challengeEndTime = null;
  let signupSubmitted = false;

  const stage = document.getElementById("aeje-stage");

  function detectBranch(){
    const url = window.location.pathname.toLowerCase();
    if(url.includes("/electrical-engineering/")) return "Electrical Engineering";
    if(url.includes("/mechanical-engineering/")) return "Mechanical Engineering";
    if(url.includes("/civil-engineering/")) return "Civil Engineering";
    return "AE/JE";
  }

  function renderStart(){
    stage.innerHTML = `
      <div class="aeje-kicker">AE/JE QUICK CHALLENGE</div>
      <div class="aeje-title">⚡ FIND THE FAULT!</div>
      <div class="aeje-sub">
        Think you can crack <b>5 AE/JE questions?</b><br>
        Test your engineering skills and earn XP.
      </div>

      <div class="aeje-puzzle">
        <div class="aeje-circuit">🔋 ── ⚡ ── 💡</div>
        <strong>This circuit isn't working.</strong><br>
        Can you spot the problem?
      </div>

      <button type="button" class="aeje-btn" id="aeje-start-btn">
        ⚡ START THE CHALLENGE →
      </button>

      <div class="aeje-small">
        5 questions • +10 XP for every correct answer
      </div>
    `;

    document.getElementById("aeje-start-btn").addEventListener("click", function(){
      currentQuestion = 0;
      score = 0;
      xp = 0;
      challengeStartTime = Date.now();
      challengeEndTime = null;
      renderQuestion();
    });
  }

  function renderQuestion(){
    const q = questions[currentQuestion];
    const left = questions.length - currentQuestion - 1;
    const progress = ((currentQuestion) / questions.length) * 100;

    stage.innerHTML = `
      <div class="aeje-kicker">AE/JE QUICK CHALLENGE</div>

      <div class="aeje-meta-row">
        <div class="aeje-pill">🎯 Q ${currentQuestion + 1}/5</div>
        <div class="aeje-pill">⭐ XP ${xp}</div>
        <div class="aeje-pill">🔥 ${left > 0 ? left + " left" : "Final question"}</div>
      </div>

      <div class="aeje-progress">
        <div class="aeje-progress-fill" style="width:${progress}%"></div>
      </div>

      <div class="aeje-status">
        ${currentQuestion === 0 ? "Ready? Every correct answer earns +10 XP." : "Keep going — you're doing great!"}
      </div>

      <div class="aeje-question">${q.question}</div>
      <div class="aeje-options" id="aeje-options"></div>
    `;

    const options = document.getElementById("aeje-options");

    q.options.forEach(function(option,index){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "aeje-option";
      btn.textContent = String.fromCharCode(65 + index) + ". " + option;
      btn.addEventListener("click", function(){
        if(index === q.answer){
          score++;
          xp += 10;
        }

        currentQuestion++;

        if(currentQuestion >= questions.length){
          challengeEndTime = Date.now();
          renderUnlock();
        }else{
          renderQuestion();
        }
      });
      options.appendChild(btn);
    });
  }

  function renderUnlock(){
    stage.innerHTML = `
      <div class="aeje-kicker">AE/JE QUICK CHALLENGE</div>
      <div class="aeje-title">🔓 Unlock Your Result</div>
      <div class="aeje-sub">
        Your challenge is complete. Enter your details to reveal your score.
      </div>

      <label class="aeje-label" for="aeje-exam-select">
        Which exam are you preparing for?
      </label>

      <select class="aeje-select" id="aeje-exam-select">
        <option value="">Select Your Exam</option>
        <option value="SSC JE">SSC JE</option>
        <option value="RRB JE">RRB JE</option>
        <option value="State JE">State JE</option>
        <option value="AE / PSU">AE / PSU</option>
        <option value="GATE">GATE</option>
        <option value="Other">Other</option>
      </select>

      <input class="aeje-input" id="aeje-name" type="text" placeholder="Your Name" autocomplete="name">

      <input class="aeje-input" id="aeje-mobile" type="tel" maxlength="10" inputmode="numeric" placeholder="Mobile Number" autocomplete="tel">

      <button type="button" class="aeje-btn" id="aeje-result-btn">
        🏆 REVEAL MY SCORE →
      </button>

      <div class="aeje-small">
        🔒 Safe & Secure &nbsp; | &nbsp; No Spam
      </div>
    `;

    document.getElementById("aeje-result-btn").addEventListener("click", submitSignupAndShowResult);
  }

  function submitSignupAndShowResult(){
    selectedExam = document.getElementById("aeje-exam-select").value;
    const name = document.getElementById("aeje-name").value.trim();
    const mobile = document.getElementById("aeje-mobile").value.trim();

    if(!selectedExam){
      alert("Please select the exam you are preparing for.");
      return;
    }

    if(name.length < 2){
      alert("Please enter your name.");
      return;
    }

    if(!/^[6-9][0-9]{9}$/.test(mobile)){
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const userData = {
      name:name,
      mobile:mobile,
      targetExam:selectedExam,
      branch:detectBranch(),
      pageURL:window.location.href,
      timestamp:new Date().toISOString()
    };

    if(!signupSubmitted){
      signupSubmitted = true;

      try{
        const form = new URLSearchParams();
        form.append("name",userData.name);
        form.append("mobile",userData.mobile);
        form.append("targetExam",userData.targetExam);
        form.append("branch",userData.branch);
        form.append("pageURL",userData.pageURL);
        form.append("timestamp",userData.timestamp);

        fetch(SHEET_URL,{
          method:"POST",
          mode:"no-cors",
          headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
          body:form.toString()
        }).catch(function(){});
      }catch(e){}
    }

    renderFinal();
  }

  function getTimeTaken(){
    if(!challengeStartTime) return "0s";

    const end = challengeEndTime || Date.now();
    const totalSeconds = Math.max(0, Math.round((end - challengeStartTime)/1000));
    const minutes = Math.floor(totalSeconds/60);
    const seconds = totalSeconds % 60;

    return minutes > 0
      ? minutes + "m " + String(seconds).padStart(2,"0") + "s"
      : seconds + "s";
  }

  function renderFinal(){
    const accuracy = Math.round((score/questions.length)*100);

    stage.innerHTML = `
      <div class="aeje-kicker">AE/JE QUICK CHALLENGE</div>
      <div class="aeje-trophy">🏆</div>
      <div class="aeje-title">Challenge Completed!</div>
      <div class="aeje-sub">Here's your preparation snapshot.</div>

      <div class="aeje-result-box">
        <div class="aeje-result-grid">
          <div class="aeje-stat">
            <span>Score</span>
            <strong>${score}/5</strong>
          </div>

          <div class="aeje-stat">
            <span>Accuracy</span>
            <strong>${accuracy}%</strong>
          </div>

          <div class="aeje-stat">
            <span>XP Earned</span>
            <strong>${xp}</strong>
          </div>

          <div class="aeje-stat">
            <span>Time Taken</span>
            <strong>${getTimeTaken()}</strong>
          </div>

          <div class="aeje-stat">
            <span>Target Exam</span>
            <strong>${selectedExam}</strong>
          </div>

          <div class="aeje-stat">
            <span>Branch</span>
            <strong>${detectBranch()}</strong>
          </div>
        </div>
      </div>

      <button type="button" class="aeje-btn" id="aeje-learning-btn">
        🚀 BOOST MY SCORE →
      </button>
    `;

    document.getElementById("aeje-learning-btn").addEventListener("click",renderLearning);
  }

  function renderLearning(){
    stage.innerHTML = `
      <div class="aeje-kicker">AE/JE QUICK CHALLENGE</div>
      <div class="aeje-title">📘 Continue Learning</div>
      <div class="aeje-sub">
        <strong>Most Asked Top 125 Questions with Solutions for Electrical Engineering AE/JE Exams</strong>
      </div>

      <div class="aeje-resource-list">

        <a class="aeje-resource" href="https://testbook.com/pdf-viewer?u=https://cdn.testbook.com/1754313288707-Network%20Theory.pdf/1754313296.pdf" target="_blank" rel="noopener">
          <div class="aeje-resource-icon">⚡</div>
          <div class="aeje-resource-copy">
            <strong>Network Theory</strong>
            <span>Practice Top 25 Solved Questions – Free PDF</span>
          </div>
          <div>→</div>
        </a>

        <a class="aeje-resource" href="https://testbook.com/pdf-viewer?u=https:%2F%2Fcdn.testbook.com%2F1754313288707-Electrical%20Machine.pdf%2F1754313296.pdf" target="_blank" rel="noopener">
          <div class="aeje-resource-icon">⚙️</div>
          <div class="aeje-resource-copy">
            <strong>Electrical Machine</strong>
            <span>Download 25 Most Asked Questions – PDF</span>
          </div>
          <div>→</div>
        </a>

        <a class="aeje-resource" href="https://testbook.com/pdf-viewer?u=https:%2F%2Fcdn.testbook.com%2F1754313288704-Power%20System.pdf%2F1754313296.pdf" target="_blank" rel="noopener">
          <div class="aeje-resource-icon">🔌</div>
          <div class="aeje-resource-copy">
            <strong>Power System</strong>
            <span>Top 25 Problems with Solutions – PDF</span>
          </div>
          <div>→</div>
        </a>

        <a class="aeje-resource" href="https://testbook.com/pdf-viewer?u=https:%2F%2Fcdn.testbook.com%2F1754313288707-Electrical%20Measurement%20%26%20Instrument.pdf%2F1754313296.pdf" target="_blank" rel="noopener">
          <div class="aeje-resource-icon">📊</div>
          <div class="aeje-resource-copy">
            <strong>Electrical Measurement & Instrumentation</strong>
            <span>25 Solved Questions for Exams – Free PDF</span>
          </div>
          <div>→</div>
        </a>

        <a class="aeje-resource" href="https://testbook.com/pdf-viewer?u=https:%2F%2Fcdn.testbook.com%2F1754313288707-Utilization%20of%20Electrical%20Energy.pdf%2F1754313296.pdf" target="_blank" rel="noopener">
          <div class="aeje-resource-icon">💡</div>
          <div class="aeje-resource-copy">
            <strong>Utilization of Electrical Energy</strong>
            <span>25 Concept-Boosting Questions – PDF</span>
          </div>
          <div>→</div>
        </a>

      </div>

      <button type="button" class="aeje-btn" id="aeje-restart-btn">
        🎮 TRY ANOTHER CHALLENGE →
      </button>
    `;

    document.getElementById("aeje-restart-btn").addEventListener("click",renderStart);
  }

  renderStart();
})();
