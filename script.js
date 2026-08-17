const photoInput = document.getElementById("photoInput");
const target = document.getElementById("target");
const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const effect = document.getElementById("effect");

const holes = document.querySelectorAll(".hole");

let photoURL = "";
let score = 0;
let time = 30;
let playing = false;
let timer;
let moveTimer;
let targetIsVisible = false;

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    photoURL = URL.createObjectURL(file);

    target.src = photoURL;

    message.textContent = "Hazır! 😈";

    target.style.display = "none";
});

startButton.addEventListener("click", function () {

    if (!photoURL) {
        alert("Önce bir fotoğraf yükle!");
        return;
    }

    if (playing) return;

    score = 0;
    time = 30;

    scoreText.textContent = score;
    timeText.textContent = time;

    playing = true;

    startButton.textContent = "OYUN DEVAM EDİYOR";

    message.textContent = "YAKALA! 😂";

    nextTarget();

    timer = setInterval(() => {

        time--;

        timeText.textContent = time;

        if (time <= 0) {
            endGame();
        }

    }, 1000);
});

function nextTarget() {

    if (!playing) return;

    targetIsVisible = false;

    target.style.display = "none";

    const hole = holes[Math.floor(Math.random() * holes.length)];

    const rect = hole.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    const x = rect.left - gameRect.left + (rect.width - 105) / 2;
    const y = rect.top - gameRect.top - 35;

    target.style.left = x + "px";
    target.style.top = y + "px";

    // %20 ihtimalle bomba
    if (Math.random() < 0.20) {

        target.src = "https://em-content.zobj.net/source/apple/391/bomb_1f4a3.png";
        target.dataset.type = "bomb";

    } else {

        target.src = photoURL;
        target.dataset.type = "person";
    }

    target.style.display = "block";
    targetIsVisible = true;

    // 0.6 - 1.4 saniye arasında kaçacak
    const visibleTime = 600 + Math.random() * 800;

    clearTimeout(moveTimer);

    moveTimer = setTimeout(() => {

        if (targetIsVisible && playing) {

            targetIsVisible = false;
            target.style.display = "none";

            if (target.dataset.type === "person") {
                kacmaSesi();
            }

            nextTarget();
        }

    }, visibleTime);
}

target.addEventListener("pointerdown", function (event) {

    if (!playing || !targetIsVisible) return;

    event.preventDefault();

    targetIsVisible = false;

    clearTimeout(moveTimer);

    if (target.dataset.type === "bomb") {

        score -= 2;

        if (score < 0) score = 0;

        scoreText.textContent = score;

        showEffect("💣");

        if (navigator.vibrate) {
            navigator.vibrate([100, 80, 100]);
        }

    } else {

        score++;

        scoreText.textContent = score;

        showEffect("💥");

        if (navigator.vibrate) {
            navigator.vibrate(60);
        }
    }

    target.style.display = "none";

    setTimeout(() => {
        nextTarget();
    }, 250);
});

function showEffect(symbol) {

    effect.textContent = symbol;

    effect.style.left =
        (Math.random() * (game.clientWidth - 70)) + "px";

    effect.style.top =
        (Math.random() * (game.clientHeight - 70)) + "px";

    effect.style.display = "block";

    setTimeout(() => {
        effect.style.display = "none";
    }, 300);
}

function kacmaSesi() {

    const ses = new SpeechSynthesisUtterance(
        "Ne sandın lan beni köpek!"
    );

    ses.lang = "tr-TR";
    ses.rate = 1.15;
    ses.pitch = 0.9;

    speechSynthesis.cancel();
    speechSynthesis.speak(ses);
}

function endGame() {

    playing = false;

    clearInterval(timer);
    clearTimeout(moveTimer);

    target.style.display = "none";

    startButton.textContent = "TEKRAR OYNA";

    message.textContent =
        "Oyun bitti! Skorun: " + score + " 😂";

    alert(
        "😂 OYUN BİTTİ!\n\nSkorun: " + score
    );
}
