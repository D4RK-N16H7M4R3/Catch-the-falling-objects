const gameContainer = document.getElementById('gameContainer');
const bucket = document.getElementById('bucket');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');
const gameWidth = gameContainer.clientWidth;
const gameHeight = gameContainer.clientHeight;

let score = 0;
let bucketPosition = gameWidth / 2 - bucket.clientWidth / 2;
let gameInterval;
let objectInterval;
let fallingSpeed = 1; // Adjusted for slower speed

document.addEventListener('keydown', moveBucket);
restartButton.addEventListener('click', restartGame);

function moveBucket(event) {
    if (event.key === 'ArrowLeft' && bucketPosition > 0) {
        bucketPosition -= 20;
    } else if (event.key === 'ArrowRight' && bucketPosition < gameWidth - bucket.clientWidth) {
        bucketPosition += 20;
    }
    bucket.style.left = `${bucketPosition}px`;
}

function createObject() {
    const object = document.createElement('div');
    object.classList.add('object');
    object.style.left = `${Math.random() * (gameWidth - 20)}px`;
    gameContainer.appendChild(object);
    let objectTop = 0;
    const fallInterval = setInterval(() => {
        if (objectTop > gameHeight - 60) { // Adjusted for smaller game height
            clearInterval(fallInterval);
            gameContainer.removeChild(object);
        } else {
            objectTop += fallingSpeed;
            object.style.top = `${objectTop}px`;
            checkCollision(object, fallInterval);
        }
    }, 20);
}

function checkCollision(object, interval) {
    const objectRect = object.getBoundingClientRect();
    const bucketRect = bucket.getBoundingClientRect();
    if (
        objectRect.bottom > bucketRect.top &&
        objectRect.top < bucketRect.bottom &&
        objectRect.left < bucketRect.right &&
        objectRect.right > bucketRect.left
    ) {
        clearInterval(interval);
        gameContainer.removeChild(object);
        score++;
        scoreElement.textContent = score;
    }
}

function startGame() {
    score = 0;
    scoreElement.textContent = score;
    bucketPosition = gameWidth / 2 - bucket.clientWidth / 2;
    bucket.style.left = `${bucketPosition}px`;
    fallingSpeed = 1; // Reset to initial speed
    gameInterval = setInterval(() => {
        fallingSpeed += 0.05; // Increase speed more slowly
    }, 1000);
    objectInterval = setInterval(createObject, 1000);
}

function restartGame() {
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    const objects = document.querySelectorAll('.object');
    objects.forEach(object => gameContainer.removeChild(object));
    startGame();
}

startGame();
