const missions = [
  { name: '일어나기', emoji: '☀️', cheer: '좋은 아침이야! 멋지게 시작했어!' },
  { name: '양치하기', emoji: '🪥', cheer: '치카치카 성공! 이가 반짝반짝해!' },
  { name: '세수하기', emoji: '🫧', cheer: '뽀득뽀득! 얼굴이 상쾌해졌어!' },
  { name: '옷 입기', emoji: '👕', cheer: '오늘의 멋쟁이 출동!' },
  { name: '아침 먹기', emoji: '🍙', cheer: '냠냠! 든든하게 힘을 채웠어!' },
  { name: '가방 챙기기', emoji: '🎒', cheer: '준비 완료! 신나는 하루를 가자!' },
  { name: '신발 신기', emoji: '👟', cheer: '씩씩하게 출발 준비 끝!' },
  { name: '장난감 정리', emoji: '🧸', cheer: '정리도 척척! 정말 멋져!' },
  { name: '물 마시기', emoji: '🥤', cheer: '꿀꺽! 건강 에너지가 올라갔어!' },
  { name: '인사하기', emoji: '👋', cheer: '상냥한 인사 성공! 최고야!' }
];

const completed = new Array(missions.length).fill(false);
const rewardLimit = missions.length;
let rewardCount = Math.min(Number(localStorage.getItem('pocketBabyRewardCount')) || 0, rewardLimit);
const missionGrid = document.querySelector('#missionGrid');
const starCount = document.querySelector('#starCount');
const nextMessage = document.querySelector('#nextMessage');
const completionBanner = document.querySelector('#completionBanner');
const toast = document.querySelector('#toast');
const rewardCountElement = document.querySelector('#rewardCount');
const rewardFill = document.querySelector('#rewardFill');
const cardMessage = document.querySelector('#cardMessage');
const heroCharacter = document.querySelector('.hero-character');

function renderMissions() {
  missionGrid.innerHTML = missions.map((mission, index) => `
    <article class="mission-card${completed[index] ? ' completed' : ''}">
      <div class="mission-emoji" aria-hidden="true">${mission.emoji}</div>
      <span class="mission-name">${mission.name}</span>
      <button class="done-button" type="button" data-index="${index}" aria-pressed="${completed[index]}">
        ${completed[index] ? '완료하기 ✓' : '완료하기'}
      </button>
    </article>
  `).join('');
}

function updateProgress() {
  const done = completed.filter(Boolean).length;
  starCount.textContent = done;
  completionBanner.hidden = done !== missions.length;

  const nextIndex = completed.findIndex((isDone) => !isDone);
  if (nextIndex === -1) {
    nextMessage.textContent = '오늘의 모든 미션을 완벽하게 해냈어!';
  } else if (done === 0) {
    nextMessage.textContent = '첫 번째 미션부터 시작해볼까?';
  } else {
    nextMessage.textContent = `${missions[nextIndex].name} 차례야. 준비됐지?`;
  }
}

function updateRewardCard() {
  const percentage = (rewardCount / rewardLimit) * 100;
  rewardCountElement.textContent = rewardCount;
  rewardFill.style.height = `${100 - percentage}%`;
  heroCharacter.setAttribute('aria-label', `피카츄 카드 보상, 10개 중 ${rewardCount}개 완성`);
  cardMessage.textContent = rewardCount === rewardLimit ? '카드 완성! 최고야!' : rewardCount > 0 ? '조금씩 채워지고 있어!' : '할 수 있어!';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

missionGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.done-button');
  if (!button) return;

  const index = Number(button.dataset.index);
  completed[index] = !completed[index];
  rewardCount = Math.max(0, Math.min(rewardLimit, rewardCount + (completed[index] ? 1 : -1)));
  localStorage.setItem('pocketBabyRewardCount', rewardCount);
  renderMissions();
  updateProgress();
  updateRewardCard();

  if (completed[index]) {
    showToast(`✨ ${missions[index].cheer}`);
  } else {
    showToast(`${missions[index].name} 미션을 다시 준비 중이야!`);
  }
});

const today = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
document.querySelector('#todayLabel').textContent = today;
renderMissions();
updateProgress();
updateRewardCard();
