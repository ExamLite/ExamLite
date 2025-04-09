const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore');

// Load images
const normalTurtleImage = new Image();
normalTurtleImage.src = 'turtle.png';
const duckingTurtleImage = new Image();
duckingTurtleImage.src = 'turtle_duck.png';

let turtle = {
    x: 50,
    y: 150,
    width: 60, // Increased width for a bigger turtle
    height: 40, // Increased height for a bigger turtle
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    ducking: false,
};

let obstacles = [];
let gameSpeed = 5;
let score = 0;
let highScore = 0;
let gameRunning = false;
let obstacleSpawnCounter = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawTurtle() {
    let turtleImage = turtle.ducking ? duckingTurtleImage : normalTurtleImage;
    let turtleHeight = turtle.ducking ? 20 : turtle.height; // Adjust height when ducking
    let turtleY = turtle.ducking ? turtle.y + 20 : turtle.y; // Adjust position when ducking
    ctx.drawImage(turtleImage, turtle.x, turtleY, turtle.width, turtleHeight);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Lost!', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '20px Arial';
    ctx.fillText('High Score: ' + highScore, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Space to Try Again', canvas.width / 2, canvas.height / 2 + 30);
}

function drawStartMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Spacebar to Get Started', canvas.width / 2, canvas.height / 2);
}

function changeCanvasBackground() {
    const colors = ['#f7f7f7', '#e0f7fa', '#ffe0b2', '#dcedc8', '#ffcdd2'];
    const index = Math.floor(score / 500) % colors.length;
    canvas.style.backgroundColor = colors[index];
}

function update() {
    if (!gameRunning) {
        drawStartMessage();
        return;
    }

    clearCanvas();

    turtle.dy += turtle.gravity;
    turtle.y += turtle.dy;

    if (turtle.y + turtle.height > canvas.height) {
        turtle.y = canvas.height - turtle.height;
        turtle.dy = 0;
        turtle.grounded = true;
    } else {
        turtle.grounded = false;
    }

    drawTurtle();

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        let turtleTop = turtle.ducking ? turtle.y + 30 : turtle.y - 20; // Adjust turtleTop when ducking
        let turtleBottom = turtle.y + turtle.height;
        if (
            turtle.x < obstacles[i].x + obstacles[i].width &&
            turtle.x + turtle.width > obstacles[i].x &&
            turtleTop < obstacles[i].y + obstacles[i].height &&
            turtleBottom > obstacles[i].y
        ) {
            gameRunning = false;
            if (Math.floor(score) > highScore) {
                highScore = Math.floor(score);
            }
            highScoreSpan.textContent = 'High Score: ' + highScore;
            drawGameOver();
            return;
        }

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    for (let obstacle of obstacles) {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    obstacleSpawnCounter++;
    if (obstacleSpawnCounter > 150) {
        const obstacleType = Math.random() > 0.5 ? 'jump' : 'duck';
        const height = obstacleType === 'jump' ? 30 : 20;
        const yPosition = obstacleType === 'jump' ? canvas.height - 30 : canvas.height - 40;
        obstacles.push({
            x: canvas.width,
            y: yPosition,
            width: 50,
            height: height,
        });
        obstacleSpawnCounter = 0;
    }

    score += gameSpeed / 60;
    if (gameSpeed < 10) {
        gameSpeed += 0.001;
    }
    scoreSpan.textContent = 'Score: ' + Math.floor(score);

    changeCanvasBackground(); // Update the canvas background color based on the score

    requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameRunning) {
            gameRunning = true;
            score = 0;
            gameSpeed = 5;
            obstacles = [];
            canvas.style.backgroundColor = '#f7f7f7'; // Reset canvas background color
            update();
        } else if (turtle.grounded) {
            turtle.dy = turtle.jumpPower;
        }
    } else if (e.code === 'ArrowDown') {
        turtle.ducking = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        turtle.ducking = false;
    }
});

// Typing effect for the introduction message
const introductionText = "Welcome to Power Shell!\nHere you'll find an engaging game where you control a turtle, avoid obstacles, and rack up a high score!\n\nPress spacebar to jump.\nPress the down arrow to duck.\n\nGood luck!";
const introductionElement = document.getElementById('introduction');

let index = 0;

function typeIntroduction() {
    if (index < introductionText.length) {
        const char = introductionText.charAt(index);
        introductionElement.textContent += char === '\n' ? '\n' : char;
        index++;
        setTimeout(typeIntroduction, 20); // Adjust the speed of typing here (in milliseconds)
    }
}

window.addEventListener('load', typeIntroduction);

update();
