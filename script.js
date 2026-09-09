const pages = [...document.querySelectorAll(".page")];

function goTo(pageId) {
  pages.forEach(page => page.classList.toggle("active", page.id === pageId));
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll("[data-go]").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    goTo(el.dataset.go);
  });
});

/* 25문항 학과 성향 검사 */
const questions = [
  { text: "수학 문제의 원리를 이해하고 해결하는 과정이 흥미롭다.", weights: { "공학": 2, "자연과학": 1 } },
  { text: "기계나 전자기기의 구조를 보면 작동 원리가 궁금해진다.", weights: { "공학": 2 } },
  { text: "새로운 기술을 이용해 현실의 문제를 해결하는 일에 관심이 있다.", weights: { "공학": 2, "사회·경영": 1 } },
  { text: "프로그래밍이나 자동화 기술을 배우는 것이 재미있을 것 같다.", weights: { "공학": 2 } },
  { text: "설계한 것을 실제로 만들고 개선하는 과정이 좋다.", weights: { "공학": 2, "자연과학": 1 } },

  { text: "자연 현상의 원인을 실험과 관찰을 통해 확인하는 것이 재미있다.", weights: { "자연과학": 2 } },
  { text: "물리, 화학, 지구과학의 원리를 더 깊게 탐구하고 싶다.", weights: { "자연과학": 2 } },
  { text: "어떤 현상을 보면 왜 그런지 끝까지 파고들고 싶다.", weights: { "자연과학": 2, "공학": 1 } },
  { text: "실험 결과를 비교하고 원인을 분석하는 과정이 흥미롭다.", weights: { "자연과학": 2 } },
  { text: "아직 밝혀지지 않은 자연의 원리를 연구하는 직업에 관심이 있다.", weights: { "자연과학": 2 } },

  { text: "인체의 구조와 기능이 어떻게 유지되는지 궁금하다.", weights: { "생명·보건": 2 } },
  { text: "질병의 원인과 치료 방법을 알아보는 데 관심이 있다.", weights: { "생명·보건": 2, "자연과학": 1 } },
  { text: "생명과학 실험이나 생물 관찰 활동이 재미있다.", weights: { "생명·보건": 2, "자연과학": 1 } },
  { text: "사람의 건강과 삶의 질을 높이는 일을 하고 싶다.", weights: { "생명·보건": 2, "사회·경영": 1 } },
  { text: "식품, 약물, 유전, 미생물과 관련된 주제가 흥미롭다.", weights: { "생명·보건": 2 } },

  { text: "사회 문제와 제도가 사람들의 생활에 미치는 영향이 궁금하다.", weights: { "사회·경영": 2 } },
  { text: "사람들과 의견을 나누고 협력해 문제를 해결하는 것을 좋아한다.", weights: { "사회·경영": 2 } },
  { text: "기업이나 조직이 어떻게 운영되고 의사결정을 내리는지 궁금하다.", weights: { "사회·경영": 2 } },
  { text: "경제 뉴스나 사회 변화의 원인을 분석하는 것이 흥미롭다.", weights: { "사회·경영": 2 } },
  { text: "자료와 통계를 바탕으로 현실적인 결론을 내리는 활동을 좋아한다.", weights: { "사회·경영": 2, "자연과학": 1 } },

  { text: "글을 읽고 숨은 의미나 표현 방식을 분석하는 것을 좋아한다.", weights: { "인문·언어": 2 } },
  { text: "역사적 사건이 오늘날 사회에 미친 영향을 생각해 보는 것이 흥미롭다.", weights: { "인문·언어": 2, "사회·경영": 1 } },
  { text: "말이나 글을 통해 생각을 정확하게 표현하는 활동을 좋아한다.", weights: { "인문·언어": 2 } },
  { text: "다른 나라의 언어와 문화에 관심이 많다.", weights: { "인문·언어": 2 } },
  { text: "철학적 질문이나 인간의 가치와 선택에 대해 생각하는 것을 좋아한다.", weights: { "인문·언어": 2 } }
];

const majorsByField = {
  "공학": ["전기전자공학", "컴퓨터공학", "기계공학", "화학공학", "재료공학"],
  "자연과학": ["물리학", "화학", "수학", "지구과학", "천문학"],
  "생명·보건": ["생명공학", "생명과학", "의생명과학", "보건과학", "식품·영양 관련 분야"],
  "사회·경영": ["경제학", "경영학", "행정학", "사회학", "미디어·커뮤니케이션"],
  "인문·언어": ["국어국문학", "영어영문학", "역사학", "철학", "언어학"]
};

let currentQuestion = 0;
let answers = Array(questions.length).fill(null);

const quizIntro = document.getElementById("quiz-intro");
const quizPanel = document.getElementById("quiz-panel");
const quizResult = document.getElementById("quiz-result");
const questionCount = document.getElementById("question-count");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const ratingButtons = [...document.querySelectorAll(".rating")];
const prevButton = document.getElementById("prev-question");
const nextButton = document.getElementById("next-question");

document.getElementById("start-quiz").addEventListener("click", () => {
  quizIntro.classList.remove("visible");
  quizResult.classList.remove("visible");
  quizPanel.classList.add("visible");
  renderQuestion();
});

function renderQuestion() {
  const q = questions[currentQuestion];
  questionCount.textContent = `${currentQuestion + 1} / ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = q.text;

  ratingButtons.forEach(btn => {
    const value = Number(btn.dataset.value);
    btn.classList.toggle("selected", answers[currentQuestion] === value);
  });

  prevButton.style.visibility = currentQuestion === 0 ? "hidden" : "visible";
  nextButton.disabled = answers[currentQuestion] === null;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "결과 보기" : "다음";
}

ratingButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    answers[currentQuestion] = Number(btn.dataset.value);
    renderQuestion();
  });
});

prevButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (answers[currentQuestion] === null) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showMajorResult();
  }
});

function showMajorResult() {
  const fields = Object.keys(majorsByField);
  const raw = Object.fromEntries(fields.map(field => [field, 0]));
  const maxAbs = Object.fromEntries(fields.map(field => [field, 0]));

  questions.forEach((q, index) => {
    const centered = answers[index] - 3;
    fields.forEach(field => {
      const weight = q.weights[field] || 0;
      raw[field] += centered * weight;
      maxAbs[field] += 2 * Math.abs(weight);
    });
  });

  const scores = Object.fromEntries(fields.map(field => {
    const max = maxAbs[field] || 1;
    const percent = Math.round(((raw[field] + max) / (2 * max)) * 100);
    return [field, Math.max(0, Math.min(100, percent))];
  }));

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = sorted[0][0];

  document.getElementById("best-field").textContent = `가장 높은 성향: ${best}`;

  document.getElementById("score-bars").innerHTML = sorted.map(([field, score]) => `
    <div class="score-item">
      <span class="score-name">${field}</span>
      <div class="score-track"><div class="score-fill" style="width:${score}%"></div></div>
      <span class="score-value">${score}%</span>
    </div>
  `).join("");

  document.getElementById("major-list").innerHTML = majorsByField[best].map((major, index) => `
    <div class="major-row">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${major}</strong>
    </div>
  `).join("");

  quizPanel.classList.remove("visible");
  quizResult.classList.add("visible");
}

document.getElementById("restart-quiz").addEventListener("click", () => {
  currentQuestion = 0;
  answers = Array(questions.length).fill(null);
  quizResult.classList.remove("visible");
  quizPanel.classList.add("visible");
  renderQuestion();
});

/* 대학별 참고 등급 데이터
   사용자가 제공한 5등급제 참고 범위를 그대로 반영했습니다.
   실제 합격선이 아니라 학술제용 탐색 데이터입니다.
*/
const universities = [
  { name: "서울대학교", min: 1.0, max: 1.0 },
  { name: "KAIST", min: 1.0, max: 1.0 },
  { name: "연세대학교", min: 1.0, max: 1.1 },
  { name: "고려대학교", min: 1.0, max: 1.1 },
  { name: "포항공과대학교(POSTECH)", min: 1.0, max: 1.1 },
  { name: "성균관대학교", min: 1.1, max: 1.1 },
  { name: "서강대학교", min: 1.1, max: 1.1 },
  { name: "한양대학교", min: 1.1, max: 1.2 },
  { name: "중앙대학교", min: 1.1, max: 1.2 },
  { name: "경희대학교", min: 1.2, max: 1.2 },
  { name: "한국외국어대학교", min: 1.2, max: 1.2 },
  { name: "서울시립대학교", min: 1.2, max: 1.2 },
  { name: "이화여자대학교", min: 1.2, max: 1.2 },
  { name: "건국대학교", min: 1.2, max: 1.3 },
  { name: "동국대학교", min: 1.2, max: 1.3 },
  { name: "홍익대학교", min: 1.3, max: 1.3 },
  { name: "UNIST", min: 1.3, max: 1.3 },
  { name: "숙명여자대학교", min: 1.3, max: 1.3 },
  { name: "국민대학교", min: 1.3, max: 1.4 },
  { name: "숭실대학교", min: 1.3, max: 1.4 },
  { name: "세종대학교", min: 1.4, max: 1.4 },
  { name: "단국대학교", min: 1.4, max: 1.5 },
  { name: "광운대학교", min: 1.4, max: 1.5 },
  { name: "명지대학교", min: 1.5, max: 1.5 },
  { name: "부산대학교", min: 1.4, max: 1.6 },
  { name: "경북대학교", min: 1.4, max: 1.6 },
  { name: "아주대학교", min: 1.5, max: 1.6 },
  { name: "인하대학교", min: 1.5, max: 1.6 },
  { name: "서울과학기술대학교", min: 1.5, max: 1.6 },
  { name: "상명대학교", min: 1.6, max: 1.7 },
  { name: "가톨릭대학교", min: 1.7, max: 1.8 },
  { name: "경기대학교", min: 1.7, max: 1.9 },
  { name: "가천대학교", min: 1.8, max: 2.0 },
  { name: "인천대학교", min: 1.8, max: 2.0 },
  { name: "한양대학교 ERICA", min: 1.8, max: 2.1 },
  { name: "충남대학교", min: 1.8, max: 2.2 },
  { name: "전남대학교", min: 1.9, max: 2.2 },
  { name: "충북대학교", min: 2.0, max: 2.3 },
  { name: "전북대학교", min: 2.0, max: 2.3 },
  { name: "강원대학교", min: 2.1, max: 2.4 },
  { name: "경상국립대학교", min: 2.2, max: 2.5 },
  { name: "한성대학교", min: 2.3, max: 2.6 },
  { name: "서경대학교", min: 2.4, max: 2.7 },
  { name: "삼육대학교", min: 2.4, max: 2.7 },
  { name: "수원대학교", min: 2.5, max: 2.8 },
  { name: "영남대학교", min: 2.5, max: 3.2 },
  { name: "계명대학교", min: 2.6, max: 3.3 },
  { name: "동아대학교", min: 2.7, max: 3.4 },
  { name: "조선대학교", min: 3.0, max: 4.2 },
  { name: "원광대학교", min: 3.2, max: 4.5 },
  { name: "대구대학교", min: 3.4, max: 4.6 },
  { name: "우석대학교", min: 3.5, max: 4.8 },
  { name: "중부대학교", min: 3.8, max: 5.0 }
];

function rangeText(u) {
  return u.min === u.max
    ? `${u.min.toFixed(1)}등급`
    : `${u.min.toFixed(1)} ~ ${u.max.toFixed(1)}등급`;
}

function cardList(items, extraTextFn = null) {
  if (!items.length) {
    return `<p class="grade-range">해당하는 대학이 없습니다.</p>`;
  }

  return `
    <div class="university-list">
      ${items.map(u => `
        <div class="university-item">
          <strong>${u.name}</strong>
          <span style="display:block;color:#777;font-size:12px;margin-top:3px;">
            ${rangeText(u)}
            ${extraTextFn ? ` · ${extraTextFn(u)}` : ""}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

/*
  분류 기준
  - 적정: 현재 등급이 대학 참고 범위 안에 있음
  - 상향: 현재 등급이 해당 대학의 최대 참고등급보다 0.01~0.30 낮은 성적이 필요함
  - 안정: 현재 성적이 대학 참고 범위의 최상단보다 더 좋음
  - 더 노력하면: 0.31~1.00등급 향상 시 참고 범위 진입 가능한 대학 중 가까운 순
*/
document.getElementById("university-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const year = Number(document.getElementById("school-year").value);
  const grade = Number(document.getElementById("current-grade").value);

  if (![1, 2].includes(year)) {
    alert("고등학교 1학년 또는 2학년을 선택해 주세요.");
    return;
  }

  if (!Number.isFinite(grade) || grade < 1 || grade > 5) {
    alert("5등급제 기준 1.00~5.00 사이의 내신을 입력해 주세요.");
    return;
  }

  const match = [];
  const reach = [];
  const safe = [];
  const future = [];

  universities.forEach(u => {
    if (grade >= u.min && grade <= u.max) {
      match.push(u);
    } else if (grade > u.max) {
      const gap = grade - u.max;
      if (gap <= 0.30 + 1e-9) {
        reach.push({ ...u, gap });
      } else if (gap <= 1.00 + 1e-9) {
        future.push({ ...u, gap });
      }
    } else if (grade < u.min) {
      safe.push(u);
    }
  });

  match.sort((a, b) => a.max - b.max || a.min - b.min);
  reach.sort((a, b) => a.gap - b.gap || a.max - b.max);
  safe.sort((a, b) => a.min - b.min);
  future.sort((a, b) => a.gap - b.gap || a.max - b.max);

  // 너무 많은 대학이 한 번에 나오지 않도록 모바일 화면 기준으로 제한
  const safeShown = safe.slice(0, 12);
  const futureShown = future.slice(0, 12);

  document.getElementById("university-title").textContent =
    `현재 내신 ${grade.toFixed(2)} 기준`;

  document.getElementById("university-summary").textContent =
    `${year === 1 ? "고1" : "고2"} 입력값을 대학별 참고 등급 범위와 비교했습니다. 상향·적정·안정은 합격 판정이 아니라 탐색 편의를 위한 분류입니다.`;

  const reachBox = document.getElementById("reach-group");
  const matchBox = document.getElementById("match-group");
  const safeBox = document.getElementById("safe-group");
  const nextBox = document.getElementById("next-group");

  [reachBox, matchBox, safeBox, nextBox].forEach(el => el.classList.remove("hidden"));

  reachBox.innerHTML = `
    <p class="group-kicker">상향 참고</p>
    <h3>조금 더 성적을 올리면</h3>
    <p class="grade-range">현재보다 약 0.01~0.30등급 향상 시 참고 범위에 들어오는 대학입니다.</p>
    ${cardList(reach, u => `${u.gap.toFixed(2)}등급 향상 필요`)}
  `;

  matchBox.innerHTML = `
    <p class="group-kicker">적정 참고</p>
    <h3>현재 등급이 참고 범위 안에 있는 대학</h3>
    <p class="grade-range">현재 내신이 각 대학의 제공된 참고 범위 안에 위치합니다.</p>
    ${cardList(match)}
  `;

  safeBox.innerHTML = `
    <p class="group-kicker">안정 참고</p>
    <h3>현재 성적이 참고 범위보다 좋은 대학</h3>
    <p class="grade-range">목록이 매우 길어질 수 있어 최대 12개만 표시합니다.</p>
    ${cardList(safeShown)}
  `;

  nextBox.innerHTML = `
    <p class="group-kicker">더 노력한다면</p>
    <h3>다음 목표 대학</h3>
    <p class="grade-range">현재보다 약 0.31~1.00등급 향상할 경우 참고 범위에 들어오는 대학 중 가까운 순입니다.</p>
    ${cardList(futureShown, u => `${u.gap.toFixed(2)}등급 향상 필요`)}
  `;
});

