
const images = [
  "uniforca.jpeg", "esportes.jpeg", "arcanjos.jpeg", "cultura.jpeg", "midia.jpeg",
  "assistentes.jpeg", "atalaia.jpeg", "universitarios.jpeg", "help.jpeg"
];

let board, countdownEl, timerContainer, startScreen, gameScreen, restartBtn;
let firstCard = null;
let secondCard = null;
let lock = true;

document.addEventListener("DOMContentLoaded", () => {
  board = document.getElementById("board");
  countdownEl = document.getElementById("countdown");
  timerContainer = document.getElementById("timer");
  startScreen = document.getElementById("start-screen");
  gameScreen = document.getElementById("game-screen");
  restartBtn = document.getElementById("restart");

  document.getElementById("start-button").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    setTimeout(() => {
      startScreen.style.display = "none";
      gameScreen.style.display = "block";
      gameScreen.classList.remove("hidden");
      startGame();
    }, 600);
  });

  restartBtn.addEventListener("click", restartGame);

  const restartVictory = document.getElementById("restart-victory");
  if (restartVictory) {
    restartVictory.addEventListener("click", () => {
      document.getElementById("victory-screen").style.display = "none";
      gameScreen.style.display = "block";
      restartGame();
    });
  }
});

function createCard(imgSrc) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="img/${imgSrc}" alt="Projeto" />
      </div>
      <div class="card-back"></div>
    </div>
  `;
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function flipCard(card) {
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lock = true;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const img1 = firstCard.querySelector(".card-front img").src;
  const img2 = secondCard.querySelector(".card-front img").src;

  if (img1 === img2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    setTimeout(checkGameEnd, 300);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
    }, 400);
  }

  setTimeout(() => {
    firstCard = null;
    secondCard = null;
    lock = false;
  }, 500);
}

function checkGameEnd() {
  const allMatched = document.querySelectorAll(".card.matched").length;
  if (allMatched === 18) {
    gameScreen.style.display = "none";
    document.getElementById("victory-screen").style.display = "block";
  }
}

function startGame() {
  board.innerHTML = "";
  const selectedImages = images.flatMap(img => [img, img]);
  const shuffled = shuffle(selectedImages);
  
    shuffled.forEach((img, index) => {
      const card = createCard(img);
      card.style.animationDelay = (index * 50) + 'ms';
      board.appendChild(card);
    });
    

  const allCards = document.querySelectorAll(".card");
  allCards.forEach(c => c.classList.add("flipped"));

  let countdown = 5;
  countdownEl.textContent = countdown;
  timerContainer.style.display = "block";

  const interval = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    if (countdown === 0) {
      clearInterval(interval);
      allCards.forEach(c => {
        if (!c.classList.contains("matched")) {
          c.classList.remove("flipped");
        }
      });
      lock = false;
      timerContainer.style.display = "none";
    }
  }, 1000);
}

function restartGame() {
  firstCard = null;
  secondCard = null;
  lock = true;
  startGame();
}
