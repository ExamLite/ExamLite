const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1 = { x: 100, y: 400, direction: 'right', color: 'cyan', trail: [] };
const player2 = { x: 1100, y: 400, direction: 'left', color: 'red', trail: [] };

const gridSize = 20;
let gameOver = false;
let speed = 100; // Milliseconds between moves

function drawGrid() {
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#444';
    ctx.stroke();
}

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    player.trail.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}

function movePlayer(player) {
    const head = { x: player.x, y: player.y };
    player.trail.push(head);

    switch (player.direction) {
        case 'up':
            player.y -= gridSize;
            break;
        case 'down':
            player.y += gridSize;
            break;
        case 'left':
            player.x -= gridSize;
            break;
        case 'right':
            player.x += gridSize;
            break;
    }

    if (player.trail.length > 50) {
        player.trail.shift();
    }
}

function detectCollision(player, otherPlayer) {
    if (player.x < 0 || player.x >= canvas.width || player.y < 0 || player.y >= canvas.height) {
        return true;
    }

    // Check collision with own trail
    for (let i = 0; i < player.trail.length - 1; i++) {
        if (player.x === player.trail[i].x && player.y === player.trail[i].y) {
            return true;
        }
    }

    // Check collision with other player's trail
    for (let part of otherPlayer.trail) {
        if (player.x === part.x && player.y === part.y) {
            return true;
        }
    }

    return false;
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    movePlayer(player1);
    movePlayer(player2);

    if (detectCollision(player1, player2)) {
        gameOver = true;
        endGame('Red wins!', 'red');
        return;
    }

    if (detectCollision(player2, player1)) {
        gameOver = true;
        endGame('Cyan wins!', 'cyan');
        return;
    }

    drawPlayer(player1);
    drawPlayer(player2);

    setTimeout(update, speed); // Adjust the speed of the game loop
}

function endGame(winnerMessage, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPlayer(player1);
    drawPlayer(player2);

    ctx.fillStyle = 'yellow';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 100);
    
    ctx.fillStyle = color;
    ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2 - 50);

    showTryAgainButton();
}

function showTryAgainButton() {
    const button = document.createElement('button');
    button.textContent = 'Try Again';
    button.style.position = 'absolute';
    button.style.top = '60%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        location.reload();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && player2.direction !== 'down') player2.direction = 'up';
    if (e.key === 'ArrowDown' && player2.direction !== 'up') player2.direction = 'down';
    if (e.key === 'ArrowLeft' && player2.direction !== 'right') player2.direction = 'left';
    if (e.key === 'ArrowRight' && player2.direction !== 'left') player2.direction = 'right';

    if (e.key === 'w' && player1.direction !== 'down') player1.direction = 'up';
    if (e.key === 's' && player1.direction !== 'up') player1.direction = 'down';
    if (e.key === 'a' && player1.direction !== 'right') player1.direction = 'left';
    if (e.key === 'd' && player1.direction !== 'left') player1.direction = 'right';
});

update();
