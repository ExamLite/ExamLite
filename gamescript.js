const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PEG_RADIUS = 20;

// Define game objects
let players = [
    { x: 100, y: HEIGHT / 4, vx: 0, vy: 0, color: '#0072ff', isDragging: false }, // Blue color
    { x: 100, y: HEIGHT / 2, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
    { x: 100, y: (3 * HEIGHT) / 4, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
    { x: 150, y: HEIGHT / 3, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
    { x: 150, y: (2 * HEIGHT) / 3, vx: 0, vy: 0, color: '#0072ff', isDragging: false },

    { x: WIDTH - 100, y: HEIGHT / 4, vx: 0, vy: 0, color: '#ff512f', isDragging: false }, // Red color
    { x: WIDTH - 100, y: HEIGHT / 2, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
    { x: WIDTH - 100, y: (3 * HEIGHT) / 4, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
    { x: WIDTH - 150, y: HEIGHT / 3, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
    { x: WIDTH - 150, y: (2 * HEIGHT) / 3, vx: 0, vy: 0, color: '#ff512f', isDragging: false }
];

const ball = { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0, radius: 10, color: '#FFD700', isDragging: false }; // Gold color for the ball
let currentPlayer = 0;  // 0 for blue player, 1 for red player
let dragging = false;
let dragPeg = null;
let dragStart = null;
let score = { blue: 0, red: 0 };
let shotMade = false;  // Track if a shot has been made

function drawPeg(peg) {
    ctx.fillStyle = peg.color;
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    if (peg.isDragging || ((currentPlayer === 0 && peg.color === '#0072ff') || (currentPlayer === 1 && peg.color === '#ff512f'))) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawField() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    // Center circle
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Center line
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();

    // Goals
    ctx.strokeRect(0, HEIGHT / 3, 20, HEIGHT / 3);
    ctx.strokeRect(WIDTH - 20, HEIGHT / 3, 20, HEIGHT / 3);
}

function drawArrow(fromX, fromY, toX, toY) {
    const headlen = 10; // length of head in pixels
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function handleWallCollision(obj, radius) {
    if (obj.x < radius) {
        obj.x = radius;
        obj.vx *= -1;
    } else if (obj.x > WIDTH - radius) {
        obj.x = WIDTH - radius;
        obj.vx *= -1;
    }

    if (obj.y < radius) {
        obj.y = radius;
        obj.vy *= -1;
    } else if (obj.y > HEIGHT - radius) {
        obj.y = HEIGHT - radius;
        obj.vy *= -1;
    }
}

function handlePegCollision(peg, otherPeg) {
    const dx = otherPeg.x - peg.x;
    const dy = otherPeg.y - peg.y;
    const dist = Math.hypot(dx, dy);

    if (dist < PEG_RADIUS * 2) {
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Rotate peg position
        const pegX = 0;
        const pegY = 0;

        // Rotate otherPeg position
        const otherPegX = dx * cos + dy * sin;
        const otherPegY = dy * cos - dx * sin;

        // Rotate peg velocity
        const pegVX = peg.vx * cos + peg.vy * sin;
        const pegVY = peg.vy * cos - peg.vx * sin;

        // Rotate otherPeg velocity
        const otherPegVX = otherPeg.vx * cos + otherPeg.vy * sin;
        const otherPegVY = otherPeg.vy * cos - otherPeg.vx * sin;

        // Collision reaction
        const combinedMass = PEG_RADIUS * 2;
        const newPegVX = (pegVX * (PEG_RADIUS - PEG_RADIUS) + (2 * PEG_RADIUS * otherPegVX)) / combinedMass;
        const newOtherPegVX = (otherPegVX * (PEG_RADIUS - PEG_RADIUS) + (2 * PEG_RADIUS * pegVX)) / combinedMass;

        peg.vx = newPegVX * cos - pegVY * sin;
        peg.vy = pegVY * cos + newPegVX * sin;
        otherPeg.vx = newOtherPegVX * cos - otherPegVY * sin;
        otherPeg.vy = otherPegVY * cos + newOtherPegVX * sin;

        // Separate pegs to avoid overlap
        const overlap = PEG_RADIUS * 2 - dist;
        peg.x -= (overlap / 2) * cos;
        peg.y -= (overlap / 2) * sin;
        otherPeg.x += (overlap / 2) * cos;
        otherPeg.y += (overlap / 2) * sin;
    }
}

function allPegsStopped() {
    return players.every(peg => Math.abs(peg.vx) < 0.01 && Math.abs(peg.vy) < 0.01);
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Apply friction
    ball.vx *= 0.98;
    ball.vy *= 0.98;

    // Ball collision with walls
    handleWallCollision(ball, ball.radius);

    // Ball collision with pegs
    players.forEach(peg => {
        handlePegCollision(ball, peg);
    });

    // Check for goals
    if (ball.x < 20 && ball.y > HEIGHT / 3 && ball.y < (2 * HEIGHT) / 3) {
        score.red += 1;
        updateScore();
        announceScore("Red Team scored!");
        resetGame();
    } else if (ball.x > WIDTH - 20 && ball.y > HEIGHT / 3 && ball.y < (2 * HEIGHT) / 3) {
        score.blue += 1;
        updateScore();
        announceScore("Blue Team scored!");
        resetGame();
    }
}

function updatePegs() {
    players.forEach(peg => {
        if (!peg.isDragging) {
            peg.x += peg.vx;
            peg.y += peg.vy;

            // Apply friction
            peg.vx *= 0.98;
            peg.vy *= 0.98;

            // Peg collision with walls
            handleWallCollision(peg, PEG_RADIUS);

            // Peg collision with other pegs
            players.forEach(otherPeg => {
                if (peg !== otherPeg && !otherPeg.isDragging) {
                    handlePegCollision(peg, otherPeg);
                }
            });
        }
    });

    // Check if all pegs have stopped moving
    if (shotMade && allPegsStopped()) {
        currentPlayer = 1 - currentPlayer;  // Switch player turn
        shotMade = false;  // Reset shot status
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawField();
    players.forEach(drawPeg);
    drawBall();
    updateBall();
    updatePegs();

    if (dragging && dragPeg) {
        const { x: dragEndX, y: dragEndY } = dragPeg.dragEnd;
        // Calculate the distance and cap it if necessary
        const dx = dragEndX - dragPeg.x;
        const dy = dragEndY - dragPeg.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 100; // Maximum drag distance for max power
        const scalingFactor = distance > maxDistance ? maxDistance / distance : 1.1; // Slight increase in power

        // Cap the end position based on max distance
        const cappedEndX = dragPeg.x + dx * scalingFactor;
        const cappedEndY = dragPeg.y + dy * scalingFactor;

        // Draw the arrow indicating the drag direction and power
        drawArrow(dragPeg.x, dragPeg.y, cappedEndX, cappedEndY);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

canvas.addEventListener('mousedown', (e) => {
    if (!shotMade) {  // Ensure only one shot per turn
        const { offsetX, offsetY } = e;
        players.forEach(peg => {
            const dist = Math.hypot(peg.x - offsetX, peg.y - offsetY);
            if (dist < PEG_RADIUS && ((currentPlayer === 0 && peg.color === '#0072ff') || (currentPlayer === 1 && peg.color === '#ff512f'))) {
                dragging = true;
                dragPeg = peg;
                dragStart = { x: offsetX, y: offsetY };
                peg.isDragging = true;
                peg.dragEnd = { x: offsetX, y: offsetY };
            }
        });
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging && dragPeg) {
        // Update drag end position for later use
        dragPeg.dragEnd = { x: e.offsetX, y: e.offsetY };
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (dragging && dragPeg) {
        const { x: dragEndX, y: dragEndY } = dragPeg.dragEnd;
        const dx = dragEndX - dragPeg.x;
        const dy = dragEndY - dragPeg.y;

        // Calculate the distance and cap it if necessary
        const distance = Math.hypot(dx, dy);
        const maxDistance = 100; // Maximum drag distance for max power
        const scalingFactor = distance > maxDistance ? maxDistance / distance : 1.1; // Slight increase in power

        // Apply capped velocity
        dragPeg.vx = (dx * scalingFactor) / 8;
        dragPeg.vy = (dy * scalingFactor) / 8;

        dragging = false;
        dragPeg.isDragging = false;
        dragPeg = null;
        dragStart = null;

        shotMade = true;  // Mark that a shot has been made
    }
});

function updateScore() {
    document.getElementById('blueScore').textContent = `Blue Team: ${score.blue}`;
    document.getElementById('redScore').textContent = `Red Team: ${score.red}`;
}

function announceScore(message) {
    const announcement = document.getElementById('announcement');
    announcement.textContent = message;
    setTimeout(() => {
        announcement.textContent = '';
    }, 3000);
}

function resetBall() {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = 0;
    ball.vy = 0;
}

function resetGame() {
    resetBall();
    // Reset pegs positions
    players = [
        { x: 100, y: HEIGHT / 4, vx: 0, vy: 0, color: '#0072ff', isDragging: false }, // Blue color
        { x: 100, y: HEIGHT / 2, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
        { x: 100, y: (3 * HEIGHT) / 4, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
        { x: 150, y: HEIGHT / 3, vx: 0, vy: 0, color: '#0072ff', isDragging: false },
        { x: 150, y: (2 * HEIGHT) / 3, vx: 0, vy: 0, color: '#0072ff', isDragging: false },

        { x: WIDTH - 100, y: HEIGHT / 4, vx: 0, vy: 0, color: '#ff512f', isDragging: false }, // Red color
        { x: WIDTH - 100, y: HEIGHT / 2, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
        { x: WIDTH - 100, y: (3 * HEIGHT) / 4, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
        { x: WIDTH - 150, y: HEIGHT / 3, vx: 0, vy: 0, color: '#ff512f', isDragging: false },
        { x: WIDTH - 150, y: (2 * HEIGHT) / 3, vx: 0, vy: 0, color: '#ff512f', isDragging: false }
    ];

    // Check for winner
    if (score.blue === 3) {
        announceScore("Blue Team wins!");
        resetScore();
    } else if (score.red === 3) {
        announceScore("Red Team wins!");
        resetScore();
    }
}

function resetScore() {
    score.blue = 0;
    score.red = 0;
    updateScore();
}
