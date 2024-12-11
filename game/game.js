const MAX_SHAPE_SIZE = 300;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let shapes = [];
let enemies = [];
let isDrawing = false;
let currentShape = null;
let currentDistance = 0;
const TOUCH_THRESHOLD = 10;
let gameOver = false;
let gamePaused = false;
let waveWasInProgress = false;
let gameLoopRunning = false; // Flag to control the game loop

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const CASTLE_WIDTH = 0.9 * CANVAS_WIDTH;
const CASTLE_HEIGHT = 0.8 * CANVAS_HEIGHT;
const PLAYER_SIZE = 20;
const SPIKE_WIDTH = 40;
const SPIKE_HEIGHT = 40;
const CASTLE_START_X = (CANVAS_WIDTH - CASTLE_WIDTH) / 2;

let projectiles = [];
let turrets = [];

const startButton = document.getElementById('startButton');
const menuScreen = document.getElementById('menuScreen');
const pauseButton = document.getElementById('pauseButton');
const pauseMenu = document.getElementById('pauseMenu');
const resumeButton = document.getElementById('resumeButton');
const gameMenuBar = document.getElementById('gameMenuBar');
const startWaveButton = document.getElementById('startWaveButton');
const gameOverMenu = document.getElementById('gameOverMenu');
const tryAgainButton = document.getElementById('tryAgainButton');
const waveCounterDiv = document.getElementById('waveCounter');
const coinCounterDiv = document.getElementById('coinCounter');
const turretButton = document.getElementById('turretButton');
const turretCost = 50;
const turretShootingDelay = 800; // Delay in milliseconds (500ms = 0.5 seconds)

const enemyTypes = {
    'enemy1': { size: 20, speed: 2.5, color: '#FF0000' }, // Fastest
    'enemy2': { size: 40, speed: 2.0, color: '#FFA500' },
    'enemy3': { size: 60, speed: 1.5, color: '#FFFF00' },
    'enemy4': { size: 80, speed: 1.0, color: '#008000' }  // Slowest
};

const enemyOrder = ['enemy4', 'enemy3', 'enemy2', 'enemy1'];

let isPlacingTurret = false;
let mouseX = 0;
let mouseY = 0;
const allowedAreaYStart = 120; // Adjust starting Y coordinate for spike area
const allowedAreaYEnd = 160; // Adjust ending Y coordinate for spike area
const allowedAreaXStart = 80; // Adjust starting X coordinate for spike area
const allowedAreaXEnd = 1520; // Adjust ending X coordinate for spike area

let waveNumber = 0;
let coinCount = 0;
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

function transformEnemy(enemy) {
    const currentEnemyIndex = enemyOrder.indexOf(enemy.type);

    if (currentEnemyIndex > 0) {
        const newEnemyType = enemyOrder[currentEnemyIndex - 1];
        enemy.type = newEnemyType;
        enemy.size = enemyTypes[newEnemyType].size;
        enemy.speed = enemyTypes[newEnemyType].speed;
        enemy.color = enemyTypes[newEnemyType].color;
    } else {
        enemies.splice(enemies.indexOf(enemy), 1); // Remove enemy if it is the smallest type
    }
}

function drawTurret(turret) {
    ctx.fillStyle = '#FF00FF'; // Glowing magenta
    ctx.beginPath();
    ctx.moveTo(turret.x, turret.y);
    ctx.lineTo(turret.x - 10, turret.y + 20);
    ctx.lineTo(turret.x + 10, turret.y + 20);
    ctx.closePath();
    ctx.fill();
}
canvas.addEventListener('mousemove', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mouseX = event.clientX - canvasRect.left;
    mouseY = event.clientY - canvasRect.top;
});

canvas.addEventListener('click', (event) => {
    if (isPlacingTurret && mouseY >= allowedAreaYStart && mouseY <= allowedAreaYEnd && mouseX >= allowedAreaXStart && mouseX <= allowedAreaXEnd) {
        placeTurret(mouseX, mouseY);
        isPlacingTurret = false; // Stop placing turret after it's placed
    } else if (isPlacingTurret) {
        alert('You can only place turrets in the highlighted area!');
    } else {
        // Handle click and drag transformation
        const canvasRect = canvas.getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;

        for (const enemy of enemies) {
            const dx = clickX - enemy.x;
            const dy = clickY - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < enemy.size / 2) {
                transformEnemy(enemy); // Transform the enemy on click
                break;
            }
        }
    }
});

function placeTurret(x, y) {
    if (coinCount >= turretCost) {
        coinCount -= turretCost; // Deduct coins
        updateCoinCounter();

        const turret = {
            x: x,
            y: y,
            angle: 0, // Initial angle
            lastShotTime: 0 // Track the last shot time
        };

        turrets.push(turret);
        drawTurrets();
    } else {
        alert('Not enough coins to place a turret!');
    }
}

turretButton.addEventListener('click', () => {
    if (coinCount >= turretCost) {
        isPlacingTurret = true;
    } else {
        alert('Not enough coins to place a turret!');
    }
});

function drawTurrets() {
    turrets.forEach(turret => {
        ctx.fillStyle = '#FF00FF'; // Glowing magenta
        ctx.beginPath();
        ctx.moveTo(turret.x, turret.y);
        ctx.lineTo(turret.x - 10, turret.y + 20);
        ctx.lineTo(turret.x + 10, turret.y + 20);
        ctx.closePath();
        ctx.fill();
    });
}

function drawProjectiles() {
    projectiles.forEach(projectile => {
        ctx.fillStyle = '#FFFFFF'; // White color for projectiles
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateProjectiles() {
    projectiles = projectiles.filter(projectile => {
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        // Check for collision with enemies or out of bounds
        return !isProjectileOutOfBounds(projectile) && !isProjectileCollidingWithEnemy(projectile);
    });
}

function isProjectileOutOfBounds(projectile) {
    return projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height;
}

function isProjectileCollidingWithEnemy(projectile) {
    for (const enemy of enemies) {
        const dx = projectile.x - enemy.x;
        const dy = projectile.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.size / 2) {
            transformEnemy(enemy); // Transform the enemy
            projectiles.splice(projectiles.indexOf(projectile), 1); // Remove the projectile
            return true;
        }
    }
    return false;
}

function shootFromTurret(turret) {
    const currentTime = Date.now();

    // Check if the turret can shoot again based on the delay
    if (currentTime - turret.lastShotTime >= turretShootingDelay) {
        const projectileSpeed = 5;
        const projectile = {
            x: turret.x,
            y: turret.y,
            vx: projectileSpeed * Math.cos(turret.angle),
            vy: projectileSpeed * Math.sin(turret.angle)
        };

        projectiles.push(projectile);
        turret.lastShotTime = currentTime; // Update the last shot time
    }
}

function updateTurrets() {
    turrets.forEach(turret => {
        // Find the nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        enemies.forEach(enemy => {
            const dx = enemy.x - turret.x;
            const dy = enemy.y - turret.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy) {
            // Update turret angle to face the nearest enemy
            turret.angle = Math.atan2(nearestEnemy.y - turret.y, nearestEnemy.x - turret.x);
            shootFromTurret(turret);
        }
    });
}

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
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateEnemies() {
    enemies.forEach((enemy, enemyIndex) => {
        let enemyHit = false;

        shapes.forEach((shape) => {
            shape.points = shape.points.filter((point, pointIndex) => {
                const dx = point.x - enemy.x;
                const dy = point.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemy.size / 2 + TOUCH_THRESHOLD) {
                    if (!enemyHit) {
                        transformEnemy(enemy); // Transform the enemy when it collides with a point
                    }
                    enemyHit = true; // Mark enemy as hit
                    return false; // Remove the point upon collision
                }
                return true; // Keep the point if it doesn't collide
            });
        });

        // Apply falling effect if enemy is falling
        if (enemy.falling) {
            enemy.y += 5; // Increase falling speed
        } else {
            enemy.y -= enemy.speed; // Move up otherwise
        }

        // Remove enemies that are completely transformed to the smallest type and not hit again
        if (enemyHit && enemy.type === 'enemy1') {
            enemies.splice(enemyIndex, 1); // Remove the enemy from the array
        }
    });

    // Remove shapes that have no points left
    shapes = shapes.filter(shape => shape.points.length > 0);

    // Remove enemies that have fallen off the canvas
    enemies = enemies.filter(enemy => enemy.y < canvas.height);

    // Check if any enemy reaches the top of the castle
    enemies.forEach(enemy => {
        if (enemy.y <= 160 - SPIKE_HEIGHT) {
            gameOver = true;
        }
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

function updateWaveCounter() {
    waveCounterDiv.innerText = `Wave: ${waveNumber}`;
}

function updateCoinCounter() {
    coinCounterDiv.innerText = `Coins: ${coinCount}`;
}

function completeWave() {
    const coinsEarned = waveNumber * 10; // For example, 10 coins per wave number
    coinCount += coinsEarned;
    startWaveButton.style.display = 'block'; // Show the Start Wave button
    updateWaveCounter(); // Update the wave counter
    updateCoinCounter(); // Update the coin counter
}

function startWave() {
    waveNumber++;
    waveInProgress = true;
    startWaveButton.style.display = 'none'; // Hide the button when a wave starts

    drawWaveNumber(); // Update the wave number display

    const baseEnemyCount = 30; // Base count
    const incrementalIncrease = 10; // Incremental count
    const enemyCount = baseEnemyCount + waveNumber * incrementalIncrease;

    let enemiesSpawned = 0;
    const enemiesPerSpawn = 5; // Number of enemies to spawn together

    const enemySpawnInterval = setInterval(() => {
        if (gamePaused) return; // Prevent spawning when the game is paused
        for (let i = 0; i < enemiesPerSpawn; i++) {
            if (enemiesSpawned < enemyCount) {
                const rand = Math.random();
                let enemyType;
                if (rand < 0.10) {
                    enemyType = 'enemy1'; // 10% chance for each enemy type
                } else if (rand < 0.50) {
                    enemyType = 'enemy2';
                } else if (rand < 0.75) {
                    enemyType = 'enemy3';
                } else {
                    enemyType = 'enemy4';
                }

                const enemyX = CASTLE_START_X + Math.random() * CASTLE_WIDTH;
                const enemyY = canvas.height; // Start from the bottom of the canvas
                enemies.push({
                    type: enemyType,
                    x: enemyX,
                    y: enemyY,
                    size: enemyTypes[enemyType].size,
                    speed: enemyTypes[enemyType].speed,
                    color: enemyTypes[enemyType].color,
                    falling: false
                });

                enemiesSpawned++;
            }
        }

        if (enemiesSpawned >= enemyCount) {
            clearInterval(enemySpawnInterval);
            waveInProgress = false;
            completeWave(); // Call completeWave() when the wave ends
        }
    }, 3000 - waveNumber * 100); // Adjusted interval (3 seconds initially)
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
    const waveCounter = document.getElementById('waveCounter');
    waveCounter.innerText = `Wave: ${waveNumber}`;
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

function checkGameOverCondition() {
    if (gameOver) {
        gameOverMenu.style.display = 'flex'; // Show the Game Over menu
        gameMenuBar.style.display = 'none'; // Hide the game menu bar
        pauseButton.style.display = 'none'; // Hide the pause button
        buffButton.style.display = 'none'; // Hide the buff button
        sprinkleButton.style.display = 'none'; // Hide the sprinkle button
        startWaveButton.style.display = 'none'; // Ensure the start wave button is hidden
        tryAgainButton.style.display = 'block';
    }
}

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
    } else if (event.key === '3') {
        turretButton.click(); // Simulate a click on the sprinkle button when '2' is pressed
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
    if (gamePaused || gameOver) {
        gameLoopRunning = false; // Stop the game loop if the game is paused or over
        return;
    }

    drawCanvasBackground(); // Draw the radiant gradient background
    drawCastle();
    drawShapes(); // Draw shapes before enemies to ensure visibility
    drawPlayer();
    drawEnemies();
    updateShapes();
    updateEnemies();
    drawTurrets(); // Draw turrets
    drawProjectiles(); // Draw projectiles
    updateProjectiles(); // Update projectiles
    updateTurrets(); // Update turrets

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

    // Draw the wave number in the game menu bar
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

    // Highlight allowed area for turret placement
    if (isPlacingTurret) {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Semi-transparent blue
        ctx.fillRect(allowedAreaXStart, allowedAreaYStart, allowedAreaXEnd - allowedAreaXStart, allowedAreaYEnd - allowedAreaYStart);

        // Draw the blue border with glow
        ctx.strokeStyle = '#0000FF'; // Blue color
        ctx.lineWidth = 5; // Width of the border
        ctx.shadowColor = '#0000FF'; // Blue shadow color for glowing effect
        ctx.shadowBlur = 10; // Blur amount for the shadow
        ctx.strokeRect(allowedAreaXStart, allowedAreaYStart, allowedAreaXEnd - allowedAreaXStart, allowedAreaYEnd - allowedAreaYStart);
        ctx.shadowColor = 'transparent'; // Reset shadow color to prevent other elements from glowing

        // Draw the turret following the mouse
        drawTurret(mouseX, mouseY);
    }

    requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    if (!gameLoopRunning) {
        gameLoopRunning = true;
        requestAnimationFrame(gameLoop);
    }
}

function drawTurret(x, y) {
    ctx.fillStyle = '#FF00FF'; // Glowing magenta
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10, y + 20);
    ctx.lineTo(x + 10, y + 20);
    ctx.closePath();
    ctx.fill();
}


// Handle start button click
startButton.addEventListener('click', () => {
    menuScreen.style.display = 'none';
    gameMenuBar.style.display = 'grid'; // Show the menu bar
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
