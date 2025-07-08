const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');

const fieldWidth = canvas.width;
const fieldHeight = canvas.height;
const pegRadius = 22;
const neutralPegRadius = 15; // Half the size of player pegs
const maxLineLength = 200; // Example maximum length

const gradientColors = [
    [0, 255, 0],   // Green
    [255, 255, 0], // Yellow
    [255, 0, 0]    // Red
];

let currentPlayer = 1;
let isDragging = false;
let selectedPeg = null;
let startDragX = 0;
let startDragY = 0;
let dragEndX = 0;
let dragEndY = 0;
let rotationAngle = 0;
let shotMade = false; // Flag to indicate if a shot has been made
const speedMultiplier = 0.1; // Increased to give more power
const maxPower = 200; // Increased max power for a stronger shot

let player1Score = 0;
let player2Score = 0;

const pegsPlayer1 = [
    { x: 100, y: 100, color: 'blue', vx: 0, vy: 0 },
    { x: 100, y: 200, color: 'blue', vx: 0, vy: 0 },
    { x: 100, y: 300, color: 'blue', vx: 0, vy: 0 },
    { x: 200, y: 150, color: 'blue', vx: 0, vy: 0 },
    { x: 200, y: 250, color: 'blue', vx: 0, vy: 0 }
];

const pegsPlayer2 = [
    { x: 700, y: 100, color: 'red', vx: 0, vy: 0 },
    { x: 700, y: 200, color: 'red', vx: 0, vy: 0 },
    { x: 700, y: 300, color: 'red', vx: 0, vy: 0 },
    { x: 600, y: 150, color: 'red', vx: 0, vy: 0 },
    { x: 600, y: 250, color: 'red', vx: 0, vy: 0 }
];

const neutralPeg = { x: fieldWidth / 2, y: fieldHeight / 2, color: 'cyan', vx: 0, vy: 0, radius: neutralPegRadius };

function drawField() {
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);

    // Create a dull gray gradient for the field background
    const gradient = ctx.createLinearGradient(0, 0, 0, fieldHeight);
    gradient.addColorStop(0, '#2e2e2e'); // Dark gray top gradient color
    gradient.addColorStop(1, '#4e4e4e'); // Light gray bottom gradient color

    // Apply the gradient as the fill style for the field
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, fieldWidth, fieldHeight);

    // Function to draw a glowing border for goals
    function drawGlowingGoal(x, y, width, height, color) {
        ctx.strokeStyle = 'cyan'; // Cyan neon glow outline
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'cyan';

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur

        // Fill the goal with the specified color
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    // Draw goals with neon glow and player colors
    drawGlowingGoal(0, 150, 20, 100, 'blue'); // Left goal with Player 1 color
    drawGlowingGoal(fieldWidth - 20, 150, 20, 100, 'red'); // Right goal with Player 2 color

    // Draw glowing court lines
    function drawGlowingLine(startX, startY, endX, endY, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur
    }

    // Center line
    drawGlowingLine(fieldWidth / 2, 0, fieldWidth / 2, fieldHeight, 'cyan');

    // Horizontal lines near goals
    drawGlowingLine(0, 150, 20, 150, 'cyan'); // Left goal top
    drawGlowingLine(0, 250, 20, 250, 'cyan'); // Left goal bottom
    drawGlowingLine(fieldWidth - 20, 150, fieldWidth, 150, 'cyan'); // Right goal top
    drawGlowingLine(fieldWidth - 20, 250, fieldWidth, 250, 'cyan'); // Right goal bottom

    // Center circle
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'cyan';
    ctx.beginPath();
    ctx.arc(fieldWidth / 2, fieldHeight / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow blur
}

function drawElements() {
    drawField();

    // Function to draw a glowing border for goals
    function drawGlowingGoal(x, y, width, height, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur
    }

    // Draw goals with neon glow
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 150, 20, 100); // Left goal
    ctx.fillRect(fieldWidth - 20, 150, 20, 100); // Right goal

    // Left goal border with red glow for Player 2
    drawGlowingGoal(0, 150, 20, 100, '#');

    // Right goal border with blue glow for Player 1
    drawGlowingGoal(fieldWidth - 20, 150, 20, 100, '#');

    // Draw glowing court lines
    function drawGlowingLine(startX, startY, endX, endY, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow blur
    }

    // Center line
    drawGlowingLine(fieldWidth / 2, 0, fieldWidth / 2, fieldHeight, 'cyan');

    // Center circle
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'cyan';
    ctx.beginPath();
    ctx.arc(fieldWidth / 2, fieldHeight / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow blur

    // Draw pegs with rotating half-circle for current player
    pegsPlayer1.forEach(peg => {
        drawCircle(peg.x, peg.y, pegRadius, peg.color, currentPlayer === 1);
        if (currentPlayer === 1) drawRotatingHalfCircle(peg.x, peg.y, pegRadius + 5, 'blue');
    });
    pegsPlayer2.forEach(peg => {
        drawCircle(peg.x, peg.y, pegRadius, peg.color, currentPlayer === 2);
        if (currentPlayer === 2) drawRotatingHalfCircle(peg.x, peg.y, pegRadius + 5, 'red');
    });

    // Draw neutral peg
    drawCircle(neutralPeg.x, neutralPeg.y, neutralPegRadius, neutralPeg.color, false);

    // Draw guiding line if dragging
if (isDragging && selectedPeg) {
    let dx = dragEndX - selectedPeg.x;
    let dy = dragEndY - selectedPeg.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Cap the line length
    if (distance > maxLineLength) {
        const scale = maxLineLength / distance;
        dx *= scale;
        dy *= scale;
        distance = maxLineLength;
    }

    // Calculate the color based on the distance
    const factor = distance / maxLineLength;
    const lineColor = interpolateMultiColor(gradientColors, factor);

    // Draw dotted line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(selectedPeg.x, selectedPeg.y);
    ctx.lineTo(selectedPeg.x + dx, selectedPeg.y + dy);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]); // Reset line dash
}
}

function drawCircle(x, y, radius, color, isCurrentPlayer) {
    const gradient = ctx.createRadialGradient(x, y, radius / 2, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'black'); // Dark edge for effect

    ctx.fillStyle = gradient;
    ctx.shadowBlur = isCurrentPlayer ? 10 : 0;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRotatingHalfCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, rotationAngle, rotationAngle + Math.PI, false);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow blur
}

function interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

function interpolateMultiColor(colors, factor) {
    const steps = colors.length - 1;
    const step = Math.floor(factor * steps);
    const stepFactor = (factor * steps) - step;

    const startColor = colors[step];
    const endColor = colors[Math.min(step + 1, steps)];

    return interpolateColor(startColor, endColor, stepFactor);
}

function updatePegPositions() {
    const allPegs = [...pegsPlayer1, ...pegsPlayer2, neutralPeg];
    let pegsStillMoving = false; // Flag to check if pegs are still moving

    // Update positions based on velocities
    allPegs.forEach(peg => {
        peg.x += peg.vx;
        peg.y += peg.vy;

        // Friction to gradually stop the peg
        peg.vx *= 0.98;
        peg.vy *= 0.98;

        // Check if any pegs are still moving
        if (Math.abs(peg.vx) > 0.1 || Math.abs(peg.vy) > 0.1) {
            pegsStillMoving = true;
        }

        // Wall collision detection and response
        if (peg.x - (peg.radius || pegRadius) < 0) {
            peg.x = peg.radius || pegRadius; // Adjust position to be within bounds
            peg.vx *= -1;
        }
        if (peg.x + (peg.radius || pegRadius) > fieldWidth) {
            peg.x = fieldWidth - (peg.radius || pegRadius); // Adjust position to be within bounds
            peg.vx *= -1;
        }
        if (peg.y - (peg.radius || pegRadius) < 0) {
            peg.y = peg.radius || pegRadius; // Adjust position to be within bounds
            peg.vy *= -1;
        }
        if (peg.y + (peg.radius || pegRadius) > fieldHeight) {
            peg.y = fieldHeight - (peg.radius || pegRadius); // Adjust position to be within bounds
            peg.vy *= -1;
        }
    });

    // Peg-to-peg collision detection and response
    for (let i = 0; i < allPegs.length; i++) {
        for (let j = i + 1; j < allPegs.length; j++) {
            const peg1 = allPegs[i];
            const peg2 = allPegs[j];
            const dx = peg2.x - peg1.x;
            const dy = peg2.y - peg1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (peg1.radius || pegRadius) + (peg2.radius || pegRadius)) {
                // Calculate angle, sine, and cosine
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities to the coordinate system of the collision
                const v1 = rotate(peg1.vx, peg1.vy, sin, cos, true);
                const v2 = rotate(peg2.vx, peg2.vy, sin, cos, true);

                // Exchange velocities for an elastic collision
                const temp = v1.x;
                v1.x = v2.x;
                v2.x = temp;

                // Rotate velocities back to the original coordinate system
                const v1F = rotate(v1.x, v1.y, sin, cos, false);
                const v2F = rotate(v2.x, v2.y, sin, cos, false);

                peg1.vx = v1F.x;
                peg1.vy = v1F.y;
                peg2.vx = v2F.x;
                peg2.vy = v2F.y;

                // Update positions to resolve overlap
                const overlap = (peg1.radius || pegRadius) + (peg2.radius || pegRadius) - distance;
                const smallOverlap = overlap / 2;

                peg1.x -= Math.cos(angle) * smallOverlap;
                peg1.y -= Math.sin(angle) * smallOverlap;
                peg2.x += Math.cos(angle) * smallOverlap;
                peg2.y += Math.sin(angle) * smallOverlap;
            }
        }
    }

    // If no pegs are moving and a shot was made, switch turns
    if (!pegsStillMoving && shotMade) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        shotMade = false;
    }
}

function rotate(x, y, sin, cos, reverse) {
    return {
        x: reverse ? (x * cos + y * sin) : (x * cos - y * sin),
        y: reverse ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

canvas.addEventListener('mousedown', (e) => {
    if (shotMade) return; // Prevent further shots until the next turn

    const { offsetX, offsetY } = e;

    const pegs = currentPlayer === 1 ? pegsPlayer1 : pegsPlayer2;
    for (let peg of pegs) {
        const dx = offsetX - peg.x;
        const dy = offsetY - peg.y;
        if (Math.sqrt(dx * dx + dy * dy) < pegRadius) {
            isDragging = true;
            selectedPeg = peg;
            startDragX = offsetX;
            startDragY = offsetY;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && selectedPeg) {
        const { offsetX, offsetY } = e;
        dragEndX = offsetX;
        dragEndY = offsetY;
        drawElements();
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDragging && selectedPeg) {
        const { offsetX, offsetY } = e;
        const dx = offsetX - startDragX;
        const dy = offsetY - startDragY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) { // Only update velocity if there's actual movement
            // Cap the power
            const power = Math.min(distance, maxPower);

            // Set the velocity based on the drag distance and power
            selectedPeg.vx = (dx / distance) * power * speedMultiplier;
            selectedPeg.vy = (dy / distance) * power * speedMultiplier;

            shotMade = true; // Indicate a shot was made
        }

        isDragging = false;
        selectedPeg = null;

        drawElements(); // Update to ensure the glowing effect changes
    }
});

function checkGoal() {
    if (neutralPeg.x < 20 && neutralPeg.y > 150 && neutralPeg.y < 250) {
        player2Score++;
        alert('Player 2 scores!');
        updateScore();
        resetGame();
    } else if (neutralPeg.x > fieldWidth - 20 && neutralPeg.y > 150 && neutralPeg.y < 250) {
        player1Score++;
        alert('Player 1 scores!');
        updateScore();
        resetGame();
    }
}

function updateScore() {
    player1ScoreElement.textContent = `Player 1: ${player1Score}`;
    player2ScoreElement.textContent = `Player 2: ${player2Score}`;
}

function resetGame() {
    // Reset positions of pegs for Player 1
    pegsPlayer1[0].x = 100; pegsPlayer1[0].y = 100;
    pegsPlayer1[1].x = 100; pegsPlayer1[1].y = 200;
    pegsPlayer1[2].x = 100; pegsPlayer1[2].y = 300;
    pegsPlayer1[3].x = 200; pegsPlayer1[3].y = 150;
    pegsPlayer1[4].x = 200; pegsPlayer1[4].y = 250;

    // Reset positions of pegs for Player 2
    pegsPlayer2[0].x = 700; pegsPlayer2[0].y = 100;
    pegsPlayer2[1].x = 700; pegsPlayer2[1].y = 200;
    pegsPlayer2[2].x = 700; pegsPlayer2[2].y = 300;
    pegsPlayer2[3].x = 600; pegsPlayer2[3].y = 150;
    pegsPlayer2[4].x = 600; pegsPlayer2[4].y = 250;

    // Reset velocities of all pegs
    pegsPlayer1.forEach(peg => { peg.vx = 0; peg.vy = 0; });
    pegsPlayer2.forEach(peg => { peg.vx = 0; peg.vy = 0; });

    // Reset position and velocity of the neutral peg
    neutralPeg.x = fieldWidth / 2;
    neutralPeg.y = fieldHeight / 2;
    neutralPeg.vx = 0;
    neutralPeg.vy = 0;

    drawElements();
}

function gameLoop() {
    updatePegPositions();
    checkGoal();
    drawElements();
    rotationAngle += 0.02; // Increment the angle for rotation
    requestAnimationFrame(gameLoop);
}

// Ensure the game starts with elements drawn
drawElements();
gameLoop();
