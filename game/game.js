const MAX_SHAPE_SIZE = 300;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startWaveButton = document.getElementById('startWaveButton');

let shapes = [];
let enemies = [];
let isDrawing = false;
let currentShape = null;
let currentDistance = 0;
const TOUCH_THRESHOLD = 10;
let gameOver = false;
let gamePaused = false;
let waveWasInProgress = false;

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const CASTLE_WIDTH = 0.9 * CANVAS_WIDTH;
const CASTLE_HEIGHT = 0.8 * CANVAS_HEIGHT;
const PLAYER_SIZE = 20;
const SPIKE_WIDTH = 40;
const SPIKE_HEIGHT = 40;
const CASTLE_START_X = (CANVAS_WIDTH - CASTLE_WIDTH) / 2;

let waveNumber = 0;
let enemySpawnInterval;
let waveInProgress = false;

const wizardPhrases = ["Take that sucka!", "Avracadava!", "Blamo!", "You shall not pass!", "Get wrecked nerds!", "The boy who lived.. has come to die..", "Welcome to the fitness gram pacer test", "Harry potty who?", "Harry potter and the chamber is loaded"];
let currentPhrase = "";
let phraseTimer = 0;

let buffActive = false;
let buffTimer = 0;
const BUFF_DURATION = 5000; // 5 seconds
const BUFF_COOLDOWN = 30000; // 30 seconds
let buffCooldownTimer = 0;

let sprinkleActive = false;
let sprinkleTimer = 0;
const SPRINKLE_DURATION = 5000; // 5 seconds
const SPRINKLE_COOLDOWN = 30000; // 30 seconds
let sprinkleCooldownTimer = 0;

const buffButton = document.getElementById('buffButton');
buffButton.style.display = 'none'; // Hide buff button initially

const sprinkleButton = document.getElementById('sprinkleButton');
sprinkleButton.style.display = 'none'; // Hide sprinkle button initially

buffButton.addEventListener('click', () => {
    if (buffCooldownTimer <= 0) {
        buffActive = true;
        buffTimer = BUFF_DURATION;
        buffCooldownTimer = BUFF_COOLDOWN;
        buffButton.disabled = true;
        buffButton.classList.add('cooldown');
    }
});

sprinkleButton.addEventListener('click', () => {
    if (sprinkleCooldownTimer <= 0) {
        sprinkleActive = true;
        sprinkleTimer = SPRINKLE_DURATION;
        sprinkleCooldownTimer = SPRINKLE_COOLDOWN;
        sprinkleButton.disabled = true;
        sprinkleButton.classList.add('cooldown');
    }
});

function updateButtons() {
    if (buffCooldownTimer > 0) {
        buffCooldownTimer -= 16.67; // Approximate decrement for each frame (60fps)
        const cooldownPercentage = (BUFF_COOLDOWN - buffCooldownTimer) / BUFF_COOLDOWN;
        buffButton.style.backgroundImage = `linear-gradient(to right, rgba(255, 0, 0, 1) ${cooldownPercentage * 100}%, rgba(255, 0, 0, 0.3) ${cooldownPercentage * 100}%)`;
        if (buffCooldownTimer <= 0) {
            buffButton.disabled = false;
            buffButton.classList.remove('cooldown');
            buffButton.style.backgroundImage = ''; // Reset to original color
        }
    }

    if (sprinkleCooldownTimer > 0) {
        sprinkleCooldownTimer -= 16.67; // Approximate decrement for each frame (60fps)
        const cooldownPercentage = (SPRINKLE_COOLDOWN - sprinkleCooldownTimer) / SPRINKLE_COOLDOWN;
        sprinkleButton.style.backgroundImage = `linear-gradient(to right, rgba(255, 215, 0, 1) ${cooldownPercentage * 100}%, rgba(255, 215, 0, 0.3) ${cooldownPercentage * 100}%)`;
        if (sprinkleCooldownTimer <= 0) {
            sprinkleButton.disabled = false;
            sprinkleButton.classList.remove('cooldown');
            sprinkleButton.style.backgroundImage = ''; // Reset to original color
        }
    }

    if (buffActive) {
        buffTimer -= 16.67; // Approximate decrement for each frame (60fps)
        const buffPercentage = buffTimer / BUFF_DURATION;
        buffButton.style.setProperty('--buff-percentage', `${buffPercentage * 100}%`); // Update progress bar width for the buff duration
        if (buffTimer <= 0) {
            buffActive = false;
            buffButton.style.setProperty('--buff-percentage', '0%'); // Reset progress bar for buff duration
        }
    }

    if (sprinkleActive) {
        sprinkleTimer -= 16.67; // Approximate decrement for each frame (60fps)
        const sprinklePercentage = sprinkleTimer / SPRINKLE_DURATION;
        sprinkleButton.style.setProperty('--sprinkle-percentage', `${sprinklePercentage * 100}%`); // Update progress bar width for the sprinkle duration
        if (sprinkleTimer <= 0) {
            sprinkleActive = false;
            sprinkleButton.style.setProperty('--sprinkle-percentage', '0%'); // Reset progress bar for sprinkle duration
        }
    }
}

function drawShapes() {
    shapes.forEach(shape => {
        shape.points.forEach(point => {
            ctx.fillStyle = shape.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Draw circles for sprinkles
            ctx.fill();
        });
    });
}

function sprinkleConfetti() {
    if (sprinkleActive) {
        for (let i = 0; i < 5; i++) {
            const x = canvas.mouseX + (Math.random() - 0.5) * 100;
            const y = canvas.mouseY + (Math.random() - 0.5) * 100;
            const size = 10 + Math.random() * 20;
            const speed = 2 + Math.random() * 3;

            shapes.push({
                points: [{ x, y }],
                color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
                speed,
                falling: true
            });
        }
    }
}

function updateShapes() {
    shapes.forEach(shape => {
        if (shape.falling) {
            shape.points.forEach(point => {
                point.y += shape.speed;
            });
        }
    });

    shapes = shapes.filter(shape => shape.points.every(point => point.y < canvas.height));
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y -= enemy.speed;
    });

    // Collision detection with shapes
    enemies.forEach(enemy => {
        shapes.forEach(shape => {
            if (isTouchingShape(shape, enemy.x, enemy.y, enemy.size)) {
                enemy.falling = true; // Fall when hit
            }
        });

        // Apply falling effect if collision detected
        if (enemy.falling) {
            enemy.y += 5; // Increase falling speed
        }

        // Remove enemies that have fallen off the canvas
        enemies = enemies.filter(enemy => enemy.y < canvas.height);

        // Check if any enemy reaches the top of the castle
        enemies.forEach(enemy => {
            if (enemy.y <= 160 - SPIKE_HEIGHT) {
                gameOver = true;
            }
        });
    });
}

function isTouchingShape(shape, enemyX, enemyY, enemySize) {
    const enemyRadius = enemySize / 2;

    // Check if the enemy is close to any of the shape's points using bounding circles
    return shape.points.some(point => {
        const distance = Math.sqrt((point.x - enemyX) ** 2 + (point.y - enemyY) ** 2);
        return distance < enemyRadius + TOUCH_THRESHOLD; // Increase the threshold slightly
    });
}

function startWave() {
    waveNumber++;
    waveInProgress = true;
    startWaveButton.style.display = 'none'; // Hide the button when a wave starts

    const baseEnemyCount = 50; // Base count
    const incrementalIncrease = 10; // Incremental count
    const enemyCount = baseEnemyCount + waveNumber * incrementalIncrease;

    let enemiesSpawned = 0;
    const enemiesPerSpawn = 5; // Number of enemies to spawn together

    enemySpawnInterval = setInterval(() => {
        if (gamePaused) return; // Prevent spawning when the game is paused
        for (let i = 0; i < enemiesPerSpawn; i++) {
            if (enemiesSpawned < enemyCount) {
                const rand = Math.random();
                let enemyType;
                if (rand < 0.14) {
                    enemyType = 'enemy1'; // 14% chance for each enemy type
                } else if (rand < 0.28) {
                    enemyType = 'enemy2';
                } else if (rand < 0.42) {
                    enemyType = 'enemy3';
                } else if (rand < 0.56) {
                    enemyType = 'enemy4';
                } else if (rand < 0.70) {
                    enemyType = 'enemy5';
                } else if (rand < 0.84) {
                    enemyType = 'enemy6';
                } else {
                    enemyType = 'enemy7';
                }

                let enemySize, enemySpeed, enemyColor;
                switch (enemyType) {
                    case 'enemy1':
                        enemySize = 20;
                        enemySpeed = 2.5 + waveNumber * 0.1; // Fastest
                        enemyColor = '#FF0000'; // Red
                        break;
                    case 'enemy2':
                        enemySize = 30;
                        enemySpeed = 2.2 + waveNumber * 0.1;
                        enemyColor = '#FFA500'; // Orange
                        break;
                    case 'enemy3':
                        enemySize = 40;
                        enemySpeed = 1.9 + waveNumber * 0.1;
                        enemyColor = '#FFFF00'; // Yellow
                        break;
                    case 'enemy4':
                        enemySize = 50;
                        enemySpeed = 1.6 + waveNumber * 0.1;
                        enemyColor = '#008000'; // Green
                        break;
                    case 'enemy5':
                        enemySize = 60;
                        enemySpeed = 1.3 + waveNumber * 0.1;
                        enemyColor = '#0000FF'; // Blue
                        break;
                    case 'enemy6':
                        enemySize = 70;
                        enemySpeed = 1.0 + waveNumber * 0.1;
                        enemyColor = '#4B0082'; // Indigo
                        break;
                    case 'enemy7':
                        enemySize = 80;
                        enemySpeed = 0.7 + waveNumber * 0.1; // Slowest
                        enemyColor = '#EE82EE'; // Violet
                        break;
                    default:
                        enemySize = 20;
                        enemySpeed = 2.5 + waveNumber * 0.1;
                        enemyColor = '#FF0000';
                }

                const enemyX = CASTLE_START_X + Math.random() * CASTLE_WIDTH;
                const enemyY = 160 + CASTLE_HEIGHT;
                enemies.push({
                    type: enemyType,
                    x: enemyX,
                    y: enemyY,
                    size: enemySize,
                    speed: enemySpeed,
                    color: enemyColor,
                    falling: false
                });

                enemiesSpawned++;
            }
        }

        if (enemiesSpawned >= enemyCount) {
            clearInterval(enemySpawnInterval);
            waveInProgress = false;
            // Show the Start Wave button after the wave ends
            startWaveButton.style.display = 'block';
        }
    }, 2000 - waveNumber * 100); // Decrease spawn interval with each wave
}

startWaveButton.addEventListener('click', () => {
    startWave();
});


function drawCastle() {
    ctx.fillStyle = '#808080';
    ctx.fillRect(CASTLE_START_X, 160, CASTLE_WIDTH, CASTLE_HEIGHT);

    const towerWidth = 60;
    const towerHeight = 120;
    ctx.fillStyle = '#505050';
    ctx.fillRect(CASTLE_START_X, 160 - towerHeight, towerWidth, towerHeight);
    ctx.fillRect(CASTLE_START_X + CASTLE_WIDTH - towerWidth, 160 - towerHeight, towerWidth, towerHeight);

    ctx.fillStyle = '#808080';
    for (let i = 0; i < CASTLE_WIDTH / SPIKE_WIDTH; i++) {
        if (i % 2 === 0 || i === Math.floor(CASTLE_WIDTH / SPIKE_WIDTH / 2)) {
            ctx.fillRect(CASTLE_START_X + i * SPIKE_WIDTH, 160 - SPIKE_HEIGHT, SPIKE_WIDTH, SPIKE_HEIGHT);
        }
    }

    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 1;
    for (let y = 160; y <= 160 + CASTLE_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(CASTLE_START_X, y);
        ctx.lineTo(CASTLE_START_X + CASTLE_WIDTH, y);
        ctx.stroke();
    }
    for (let x = CASTLE_START_X; x <= CASTLE_START_X + CASTLE_WIDTH; x += 80) {
        for (let y = 160; y <= 160 + CASTLE_HEIGHT; y += 80) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();
        }
    }

    const doorWidth = 150;
    const doorHeight = 250;
    const doorX = CASTLE_START_X + (CASTLE_WIDTH / 2) - (doorWidth / 2);
    const doorY = 160 + CASTLE_HEIGHT - doorHeight;

    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(doorX, doorY + doorHeight);
    ctx.lineTo(doorX, doorY + 80);
    ctx.arc(doorX + doorWidth / 2, doorY + 80, doorWidth / 2, Math.PI, 0, false);
    ctx.lineTo(doorX + doorWidth, doorY + doorHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.fillRect(doorX + 20, doorY + doorHeight - 30, doorWidth - 40, 15);
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(doorX + (i + 1) * (doorWidth / 4) - 10, doorY + 40, 15, doorHeight - 80);
    }

    const windowWidth = 60;
    const windowHeight = 100;
    const windowSpacing = CASTLE_WIDTH / 5;

    ctx.fillStyle = '#8B0000';
    for (let i = 1; i <= 4; i++) {
        const windowX = CASTLE_START_X + (i * windowSpacing) - (windowWidth / 2);
        const windowY = 160 + 200;
        ctx.fillRect(windowX, windowY, windowWidth, windowHeight);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(windowX + windowWidth / 2, windowY);
        ctx.lineTo(windowX + windowWidth / 2, windowY + windowHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(windowX, windowY + windowHeight / 2);
        ctx.lineTo(windowX + windowWidth, windowY + windowHeight / 2);
        ctx.stroke();
    }
}

function drawPlayer() {
    const wizardX = CASTLE_START_X + (CASTLE_WIDTH / 2);
    const wizardY = 240 - SPIKE_HEIGHT - 80;

    ctx.fillStyle = '#0000FF';
    ctx.beginPath();
    ctx.moveTo(wizardX, wizardY - 60);
    ctx.lineTo(wizardX - 20, wizardY - 20);
    ctx.lineTo(wizardX + 20, wizardY - 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.arc(wizardX, wizardY - 10, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#0000FF';
    ctx.beginPath();
    ctx.moveTo(wizardX - 10, wizardY);
    ctx.lineTo(wizardX - 8, wizardY + 40);
    ctx.lineTo(wizardX + 8, wizardY + 40);
    ctx.lineTo(wizardX + 10, wizardY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(wizardX - 5, wizardY);
    ctx.lineTo(wizardX + 5, wizardY);
    ctx.lineTo(wizardX, wizardY + 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(wizardX - 10, wizardY);
    ctx.lineTo(wizardX - 30, wizardY - 20);
    ctx.moveTo(wizardX + 10, wizardY);
    ctx.lineTo(wizardX + 30, wizardY - 20);
    ctx.stroke();

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wizardX + 30, wizardY - 20);
    ctx.lineTo(wizardX + 30, wizardY - 50);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(wizardX + 30, wizardY - 50, 12, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(wizardX + 30, wizardY - 50, 20, 0, 2 * Math.PI);
    ctx.stroke();
}

function updateChatBubble() {
    if (phraseTimer > 0) {
        phraseTimer--;
    } else {
        if (Math.random() < 0.01) { // 1% chance per frame
            currentPhrase = wizardPhrases[Math.floor(Math.random() * wizardPhrases.length)];
            phraseTimer = 400; // Display the phrase for 400 frames
        } else {
            currentPhrase = "";
        }
    }
}

function drawChatBubble() {
    const wizardX = CASTLE_START_X + (CASTLE_WIDTH / 2);
    const wizardY = 240 - SPIKE_HEIGHT - 80; // Updated wizard position

    if (currentPhrase) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1; 
        ctx.font = '15px Arial';

        const textWidth = ctx.measureText(currentPhrase).width;
        const bubbleWidth = textWidth + 15; 
        const bubbleHeight = 25;

        const bubbleX = wizardX + 60; 
        const bubbleY = wizardY - 40;

        ctx.fillRect(bubbleX - bubbleWidth / 2, bubbleY - bubbleHeight, bubbleWidth, bubbleHeight);
        ctx.strokeRect(bubbleX - bubbleWidth / 2, bubbleY - bubbleHeight, bubbleWidth, bubbleHeight);

        ctx.fillStyle = '#000000';
        ctx.fillText(currentPhrase, bubbleX - textWidth / 2, bubbleY - bubbleHeight / 2);
    }
}

function drawWaveNumber() {
    const wizardX = CASTLE_START_X + (CASTLE_WIDTH / 2);
    const wizardY = 240 - SPIKE_HEIGHT - 80; // Updated wizard position

    const waveNumberX = wizardX - 500; // Move to the right of the wizard
    const waveNumberY = wizardY - 90; // Position it slightly above the wizard

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText(`Wave: ${waveNumber}`, waveNumberX, waveNumberY);
}

function checkWaveEnd() {
    if (gameOver) {
        startWaveButton.style.display = 'none'; // Ensure the start wave button is hidden when the game is over
        return; // Exit the function early if the game is over
    }

    if (!waveInProgress && enemies.length === 0) {
        startWaveButton.style.display = 'block';
    }
}

// Assuming this function handles the game over conditions
function checkGameOverCondition() {
    if (gameOver) {
        triggerGameOver();
    }

    // Show the Try Again button
    const tryAgainButton = document.getElementById('tryAgainButton');
    tryAgainButton.style.display = 'block';
}

const gameOverMenu = document.getElementById('gameOverMenu');
const tryAgainButton = document.getElementById('tryAgainButton');

function triggerGameOver() {
    gameOver = true;
    gameOverMenu.style.display = 'flex'; // Show the Game Over menu
    pauseButton.style.display = 'none'; // Hide the pause button
    buffButton.style.display = 'none'; // Hide the buff button
    sprinkleButton.style.display = 'none'; // Hide the sprinkle button
    startWaveButton.style.display = 'none'; // Ensure the start wave button is hidden
}

tryAgainButton.addEventListener('click', () => {
    location.reload(); // Refresh the page to show the Start menu
});

// Ensure the Game Over menu is hidden initially
window.addEventListener('load', () => {
    gameOverMenu.style.display = 'none';
    pauseMenu.style.display = 'none';
    pauseButton.style.display = 'none';
    buffButton.style.display = 'none';
    sprinkleButton.style.display = 'none';
    canvas.style.display = 'none';
});


// Key binding for spacebar to start the next wave
document.addEventListener('keydown', event => {
    if (event.code === 'Space' && startWaveButton.style.display === 'block') {
        startWaveButton.click(); // Simulate a click on the Start Next Wave button when spacebar is pressed
    } else if (event.key === '1') {
        buffButton.click(); // Simulate a click on the buff button when '1' is pressed
    } else if (event.key === '2') {
        sprinkleButton.click(); // Simulate a click on the sprinkle button when '2' is pressed
    }
});

const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');

let confettiParticles = [];

function createConfetti() {
    for (let i = 0; i < 200; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height,
            r: Math.random() * 6 + 4, // Size of confetti
            d: Math.random() * 10 + 5, // Density (affects speed)
            color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
            tilt: Math.random() * 10 - 10
        });
    }
}

function drawConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(p => {
        confettiCtx.beginPath();
        confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fill();
        p.x += Math.sin(p.d);
        p.y += Math.cos(p.d) + 1;
        p.tilt = Math.sin(p.d) * 15;
        if (p.x > confettiCanvas.width || p.y > confettiCanvas.height) {
            p.x = Math.random() * confettiCanvas.width;
            p.y = -10;
        }
    });
    requestAnimationFrame(drawConfetti);
}

createConfetti();
drawConfetti();

function gameLoop() {
    if (gamePaused) return; // Check if the game is paused
    if (gameOver) {
        return; // Stop the game loop when the game is over
    }

    drawCanvasBackground(); // Draw the radiant gradient background
    drawCastle();
    drawShapes(); // Draw shapes before enemies to ensure visibility
    drawPlayer();
    drawEnemies();
    updateShapes();
    updateEnemies();

    // Handle buff effects
    if (buffActive) {
        buffTimer -= 16.67; // Approximate decrement for each frame (60fps)
        if (buffTimer <= 0) {
            buffActive = false;
        }
    }

    // Manage buff cooldown and button color transition
    updateButtons();

    // Draw the current shape outline
    drawCurrentShapeOutline();

    // Draw the power bar only if buff is not active
    if (!buffActive) {
        drawPowerBar();
    }

    // Display the wave number near the wizard
    drawWaveNumber();

    // Update the chat bubble
    updateChatBubble();
    drawChatBubble();

    sprinkleConfetti(); // Call sprinkleConfetti to ensure sprinkles are on top

    // Check if all enemies are gone and show the start wave button if true
    if (!gameOver) { 
        checkWaveEnd(); 
    }

    // Check for game over condition
    checkGameOverCondition();

    requestAnimationFrame(gameLoop);
}



const startButton = document.getElementById('startButton');
const menuScreen = document.getElementById('menuScreen');
const pauseButton = document.getElementById('pauseButton');
const pauseMenu = document.getElementById('pauseMenu');
const resumeButton = document.getElementById('resumeButton');

// Handle start button click
startButton.addEventListener('click', () => {
    menuScreen.style.display = 'none';
    confettiCanvas.style.display = 'none'; // Hide the confetti canvas when the game starts
    canvas.style.display = 'block';
    buffButton.style.display = 'block'; // Show buff button when game starts
    sprinkleButton.style.display = 'block'; // Show sprinkle button when game starts
    pauseButton.style.display = 'block'; // Show pause button when game starts
    startWave(); // Start the first wave
    gameLoop(); // Start the game loop
});

// Handle pause button click
pauseButton.addEventListener('click', () => {
    gamePaused = true; // Set gamePaused to true
    pauseMenu.style.display = 'flex'; // Show the pause menu
});

// Handle resume button click
resumeButton.addEventListener('click', () => {
    gamePaused = false; // Set gamePaused to false
    pauseMenu.style.display = 'none'; // Hide the pause menu
    gameLoop(); // Resume the game loop
});

// Ensure the Start menu shows by default when the page is refreshed or Try Again button is clicked
window.addEventListener('load', () => {
    menuScreen.style.display = 'flex';
    confettiCanvas.style.display = 'block'; // Show the confetti canvas initially
    pauseMenu.style.display = 'none';
    pauseButton.style.display = 'none';
    buffButton.style.display = 'none';
    sprinkleButton.style.display = 'none';
    canvas.style.display = 'none';
});


canvas.addEventListener('mousedown', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Start drawing a new shape
    isDrawing = true;
    currentShape = {
        points: [{ x: x, y: y }],
        color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
        speed: 2 + Math.random() * 3, // Random speed
        falling: false
    };
    currentDistance = 0;
});

canvas.addEventListener('mousemove', event => {
    const rect = canvas.getBoundingClientRect();
    canvas.mouseX = event.clientX - rect.left;
    canvas.mouseY = event.clientY - rect.top;

    if (isDrawing && currentShape) {
        const x = canvas.mouseX;
        const y = canvas.mouseY;

        const lastPoint = currentShape.points[currentShape.points.length - 1];
        const distance = Math.sqrt((x - lastPoint.x) ** 2 + (y - lastPoint.y) ** 2);

        // Only add points if the shape is within the maximum size or buff is active
        if (currentDistance + distance <= MAX_SHAPE_SIZE * (buffActive ? 5 : 1)) { // 5x shape size if buff is active
            currentShape.points.push({ x: x, y: y });
            currentDistance += distance;
        }
    }
});

canvas.addEventListener('mouseup', event => {
    if (isDrawing && currentShape) {
        const rect = canvas.getBoundingClientRect();
        canvas.mouseX = event.clientX - rect.left;
        canvas.mouseY = event.clientY - rect.top;

        // Finish drawing and start the shape falling
        currentShape.falling = true;
        shapes.push(currentShape);

        currentShape = null;
        isDrawing = false;
    }
});

function drawCurrentShapeOutline() {
    if (isDrawing && currentShape) {
        ctx.strokeStyle = currentShape.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentShape.points[0].x, currentShape.points[0].y);
        currentShape.points.forEach((point, index) => {
            if (index > 0) {
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }
}

function drawPowerBar() {
    const maxWidth = 200;
    const maxHeight = 20;
    const wizardX = CASTLE_START_X + (CASTLE_WIDTH / 2);
    const wizardY = 240 - SPIKE_HEIGHT - 80;
    const x = wizardX - maxWidth / 2;
    const y = wizardY + 50; // Positioned below the wizard

    ctx.fillStyle = '#808080'; // Grey background for the power bar
    ctx.fillRect(x, y, maxWidth, maxHeight);

    if (isDrawing) {
        const percentage = currentDistance / MAX_SHAPE_SIZE;
        const barWidth = percentage * maxWidth;

        // Set solid blue color for the inside of the power bar
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(x, y, barWidth, maxHeight);

        // Add glowing effect for the outline
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 2, y - 2, maxWidth + 4, maxHeight + 4);
    }
}

function drawCanvasBackground() {
    const gradient = ctx.createRadialGradient(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 50, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2);
    gradient.addColorStop(0, '#87CEEB'); // Light blue
    gradient.addColorStop(1, '#00008B'); // Dark blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
