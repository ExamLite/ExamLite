
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1 = { x: 180, y: 730, direction: 0, color: 'cyan', bullets: [], canShoot: true }; // Blue tank at bottom left
const player2 = { x: 1620, y: 180, direction: 180, color: 'red', bullets: [], canShoot: true }; // Red tank at top right

const flag1 = { x: 70, y: 740, size: 10, color: 'cyan', active: true, heldBy: null, base: { x: 80, y: 820, size: 100 } };
const flag2 = { x: 1730, y: 160, size: 10, color: 'red', active: true, heldBy: null, base: { x: 1720, y: 80, size: 100 } };


const bulletSpeed = 5;
const bulletSize = 6;
const tankSpeed = 3;
const tankSize = 40;
const tankTurnSpeed = 3; // degrees
const walls = [
    // Top-left corner
    { x: 0, y: 0, width: 200, height: 20 }, // Horizontal part of the top
    { x: 0, y: 0, width: 20, height: 200 }, // Vertical part of the left
    { x: 180, y: 0, width: 20, height: 100 }, // Vertical part of the right
    { x: 0, y: 180, width: 100, height: 20 }, // Horizontal part of the bottom

    // Top-right corner
    { x: 1600, y: 0, width: 200, height: 20 }, // Horizontal part of the top
    { x: 1780, y: 0, width: 20, height: 200 }, // Vertical part of the right
    { x: 1600, y: 0, width: 20, height: 100 }, // Vertical part of the left
    { x: 1700, y: 180, width: 100, height: 20 }, // Horizontal part of the bottom

    // Bottom-left corner
    { x: 0, y: 880, width: 200, height: 20 }, // Horizontal part of the bottom
    { x: 0, y: 700, width: 20, height: 200 }, // Vertical part of the left
    { x: 180, y: 800, width: 20, height: 100 }, // Vertical part of the right
    { x: 0, y: 700, width: 100, height: 20 }, // Horizontal part of the top

    // Bottom-right corner
    { x: 1600, y: 880, width: 200, height: 20 }, // Horizontal part of the bottom
    { x: 1780, y: 700, width: 20, height: 200 }, // Vertical part of the right
    { x: 1600, y: 800, width: 20, height: 100 }, // Vertical part of the left
    { x: 1700, y: 700, width: 100, height: 20 }, // Horizontal part of the top

    // Center square
    { x: 700, y: 200, width: 400, height: 20 }, // top
    { x: 700, y: 270, width: 20, height: 130 }, // left 1
    { x: 700, y: 490, width: 20, height: 130 }, // left 2
    { x: 1080, y: 270, width: 20, height: 130 }, // right 1
    { x: 1080, y: 490, width: 20, height: 130 }, // right 2
    { x: 700, y: 680, width: 400, height: 20 }, //  bottom

    // other horizontal
    { x: 400, y: 120, width: 400, height: 20 }, // top 1
    { x: 1000, y: 120, width: 400, height: 20 }, // top 2

    { x: 350, y: 300, width: 20, height: 300 }, // left
    { x: 1450, y: 300, width: 20, height: 300 }, // right

    { x: 400, y: 760, width: 400, height: 20 }, // bottom 1
    { x: 1000, y: 760, width: 400, height: 20 }, // bottom 2

    // portal walls
    { x: 570, y: 410, width: 10, height: 70 }, // blue
    { x: 1250, y: 410, width: 10, height: 70 } // red

];



let gameOverFlag = false;

const powerBoost = { x: 900, y: 450, size: 10, active: true };
const powerBoostDuration = 3000; // 3 seconds
const originalTankSpeed = tankSpeed;

const portals = [
    { x: 500, y: 410, width: 70, height: 70, color: 'blue', colorRange: [239, 240], transform: 180, sparkles: [], linkedPortal: { x: 1210, y: 400, width: 30, height: 100, color: 'blue', colorRange: [180, 240], transform: 180, sparkles: [] } },
    { x: 1260, y: 410, width: 70, height: 70, color: 'red', colorRange: [10, 11], transform: -180, sparkles: [], linkedPortal: { x: 580, y: 400, width: 30, height: 100, color: 'red', colorRange: [0, 60], transform: -180, sparkles: [] } }
];

const spawners = [
    { x: 1230, y: 440, width: 20, height: 10, color: 'blue', colorRange: [239, 240], sparkles: [] },
    { x: 580, y: 440, width: 20, height: 10, color: 'red', colorRange: [10, 11], sparkles: [] }
];

function drawPowerBoost(boost) {
    if (boost.active) {
        ctx.fillStyle = '#0BDA51';
        ctx.beginPath();
        ctx.arc(boost.x, boost.y, boost.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function checkPowerBoostCollision(player, boost) {
    const distX = player.x - boost.x;
    const distY = player.y - boost.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < tankSize / 2 + boost.size && boost.active) {
        boost.active = false;
        return true;
    }
    return false;
}

function drawPortal(portal) {
    ctx.save();
    ctx.translate(portal.x + portal.width / 2, portal.y + portal.height / 2);

    // Slow down color change
    const hue = (performance.now() / 100) % (portal.colorRange[1] - portal.colorRange[0]) + portal.colorRange[0];
    portal.color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = portal.color;
    ctx.fillRect(-portal.width / 2, -portal.height / 2, portal.width, portal.height);

    // Draw sparkles
    ctx.fillStyle = 'white';
    for (let i = 0; i < 5; i++) {
        const sparkleX = Math.random() * portal.width - portal.width / 2;
        const sparkleY = Math.random() * portal.height - portal.height / 2;
        ctx.fillRect(sparkleX, sparkleY, 2, 2); // Small sparkles
    }

    ctx.restore();
}

function drawSpawner(spawner) {
    ctx.save();
    ctx.translate(spawner.x + spawner.width / 2, spawner.y + spawner.height / 2);
    spawner.angle += 0.05; // Rotation speed
    ctx.rotate(spawner.angle);

    // Change color within the specified range
    const hue = (performance.now() / 100) % (spawner.colorRange[1] - spawner.colorRange[0]) + spawner.colorRange[0];
    spawner.color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = spawner.color;
    ctx.fillRect(-spawner.width / 2, -spawner.height / 2, spawner.width, spawner.height);

    // Draw sparkles
    ctx.fillStyle = 'white';
    for (let i = 0; i < 5; i++) {
        const sparkleX = Math.random() * spawner.width - spawner.width / 2;
        const sparkleY = Math.random() * spawner.height - spawner.height / 2;
        ctx.fillRect(sparkleX, sparkleY, 2, 2); // Small sparkles
    }

    ctx.restore();
}

function checkPortalCollision(bullet, portal) {
    if (
        bullet.x > portal.x &&
        bullet.x < portal.x + portal.width &&
        bullet.y > portal.y &&
        bullet.y < portal.y + portal.height
    ) {
        const exitPortal = portal.linkedPortal;
        bullet.x = exitPortal.x + exitPortal.width / 2;
        bullet.y = exitPortal.y + exitPortal.height / 2;

        // Apply the transformation (rotation or inversion)
        bullet.angle = (bullet.angle + exitPortal.transform) % 360;

        console.log(`Bullet teleported to portal at (${bullet.x}, ${bullet.y}) with new angle ${bullet.angle}`);
    }
}

function drawFlag(flag) {
    if (flag.active) {
        ctx.fillStyle = flag.color;
        ctx.beginPath();
        ctx.arc(flag.x, flag.y, flag.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBase(base, color) {
    ctx.fillStyle = color;
    ctx.fillRect(base.x - base.size / 2, base.y - base.size / 2, base.size, base.size);
}

function drawTank(player) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.direction * Math.PI / 180);

    // Glow effect if the tank has the flag
    if (flag1.heldBy === player || flag2.heldBy === player) {
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 20;
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(-tankSize / 2, -tankSize / 2, tankSize, tankSize);

    // Draw muzzle
    ctx.fillStyle = 'black';
    ctx.fillRect(tankSize / 2, -tankSize / 8, tankSize / 2, tankSize / 4);

    ctx.fillStyle = 'black';
    ctx.fillRect(-tankSize / 2, -tankSize / 4, tankSize, tankSize / 2);
    ctx.restore();
}

function drawBullet(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
}

function drawWall(wall) {
    ctx.fillStyle = '#FFBF00';
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
}

function updateBullet(bullet) {
    const nextX = bullet.x + bulletSpeed * Math.cos(bullet.angle * Math.PI / 180);
    const nextY = bullet.y + bulletSpeed * Math.sin(bullet.angle * Math.PI / 180);

    let collision = false;

    // Wall collision detection
    walls.forEach(wall => {
        if (
            nextX + bulletSize > wall.x && nextX - bulletSize < wall.x + wall.width &&
            nextY + bulletSize > wall.y && nextY - bulletSize < wall.y + wall.height
        ) {
            collision = true;
            if (bullet.x < wall.x || bullet.x > wall.x + wall.width) {
                bullet.angle = 180 - bullet.angle;
            } else if (bullet.y < wall.y || bullet.y > wall.y + wall.height) {
                bullet.angle = -bullet.angle;
            }
            bullet.bounces++;
        }
    });

    // Portal collision detection
    portals.forEach(portal => checkPortalCollision(bullet, portal));

    // Canvas edge collision detection
    if (nextX < bulletSize || nextX > canvas.width - bulletSize) {
        bullet.angle = 180 - bullet.angle;
        bullet.bounces++;
        collision = true;
    }
    if (nextY < bulletSize || nextY > canvas.height - bulletSize) {
        bullet.angle = -bullet.angle;
        bullet.bounces++;
        collision = true;
    }

    if (!collision) {
        bullet.x = nextX;
        bullet.y = nextY;
    }

    if (bullet.bounces > 3) {
        bullet.active = false;
    }
}

function moveTank(player) {
    let newX = player.x;
    let newY = player.y;

    const speed = player.boosted ? tankSpeed * 2 : tankSpeed;

    if (player.moveForward) {
        newX += speed * Math.cos(player.direction * Math.PI / 180);
        newY += speed * Math.sin(player.direction * Math.PI / 180);
    }
    if (player.moveBackward) {
        newX -= speed * Math.cos(player.direction * Math.PI / 180);
        newY -= speed * Math.sin(player.direction * Math.PI / 180);
    }
    if (player.turnLeft) {
        player.direction -= tankTurnSpeed;
    }
    if (player.turnRight) {
        player.direction += tankTurnSpeed;
    }

    let horizontalCollision = false;
    let verticalCollision = false;

    // Wall collision detection
    walls.forEach(wall => {
        if (
            newX + tankSize / 2 > wall.x &&
            newX - tankSize / 2 < wall.x + wall.width &&
            player.y + tankSize / 2 > wall.y &&
            player.y - tankSize / 2 < wall.y + wall.height
        ) {
            horizontalCollision = true;
        }
        if (
            player.x + tankSize / 2 > wall.x &&
            player.x - tankSize / 2 < wall.x + wall.width &&
            newY + tankSize / 2 > wall.y &&
            newY - tankSize / 2 < wall.y + wall.height
        ) {
            verticalCollision = true;
        }
    });

    // Canvas edge collision detection
    if (newX - tankSize / 2 < 0 || newX + tankSize / 2 > canvas.width) {
        horizontalCollision = true;
    }
    if (newY - tankSize / 2 < 0 || newY + tankSize / 2 > canvas.height) {
        verticalCollision = true;
    }

    if (!horizontalCollision) {
        player.x = newX;
    }
    if (!verticalCollision) {
        player.y = newY;
    }

    // Check for power boost collision
    if (checkPowerBoostCollision(player, powerBoost)) {
        player.boosted = true;
        setTimeout(() => { player.boosted = false; }, powerBoostDuration);
    }
}

function checkCollision(player, bullet) {
    const distX = player.x - bullet.x;
    const distY = player.y - bullet.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < tankSize / 2 + bulletSize;
}

function checkAllBulletCollisions() {
    // Check collisions for player 1 bullets
    player1.bullets.forEach((bullet1, index1) => {
        if (!bullet1.active) return;
        player2.bullets.forEach((bullet2, index2) => {
            if (!bullet2.active) return;
            if (checkBulletCollision(bullet1, bullet2)) {
                bullet1.active = false;
                bullet2.active = false;
            }
        });
    });

    // Check collisions for player 2 bullets
    player2.bullets.forEach((bullet1, index1) => {
        if (!bullet1.active) return;
        player1.bullets.forEach((bullet2, index2) => {
            if (!bullet2.active) return;
            if (checkBulletCollision(bullet1, bullet2)) {
                bullet1.active = false;
                bullet2.active = false;
            }
        });
    });
}

function checkBulletCollision(bullet1, bullet2) {
    const distX = bullet1.x - bullet2.x;
    const distY = bullet1.y - bullet2.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < bulletSize * 2;
}

function gameOver(winnerMessage, color) {
    console.log("Game Over triggered");
    gameOverFlag = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all walls
    walls.forEach(drawWall);

    drawTank(player1);
    drawTank(player2);

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
    switch (e.key) {
        case 'w':
            player1.moveForward = true;
            break;
        case 's':
            player1.moveBackward = true;
            break;
        case 'a':
            player1.turnLeft = true;
            break;
        case 'd':
            player1.turnRight = true;
            break;
        case ' ':
            if (player1.bullets.length < 5) {
                player1.bullets.push({
                    x: player1.x,
                    y: player1.y,
                    angle: player1.direction,
                    color: player1.color,
                    bounces: 0,
                    active: true
                });
            }
            break;
        case 'ArrowUp':
            player2.moveForward = true;
            break;
        case 'ArrowDown':
            player2.moveBackward = true;
            break;
        case 'ArrowLeft':
            player2.turnLeft = true;
            break;
        case 'ArrowRight':
            player2.turnRight = true;
            break;
        case 'Enter':
            if (player2.bullets.length < 5) {
                player2.bullets.push({
                    x: player2.x,
                    y: player2.y,
                    angle: player2.direction,
                    color: player2.color,
                    bounces: 0,
                    active: true
                });
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            player1.moveForward = false;
            break;
        case 's':
            player1.moveBackward = false;
            break;
        case 'a':
            player1.turnLeft = false;
            break;
        case 'd':
            player1.turnRight = false;
            break;
        case 'ArrowUp':
            player2.moveForward = false;
            break;
        case 'ArrowDown':
            player2.moveBackward = false;
            break;
        case 'ArrowLeft':
            player2.turnLeft = false;
            break;
        case 'ArrowRight':
            player2.turnRight = false;
            break;
    }
});

function checkFlagPickup(player, flag, opponentFlag) {
    if (flag.heldBy === player) return; // Players cannot pick up their own flag
    const distX = player.x - opponentFlag.x;
    const distY = player.y - opponentFlag.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < tankSize / 2 + opponentFlag.size && opponentFlag.active) {
        opponentFlag.active = false;
        opponentFlag.heldBy = player;
    }
}

function checkFlagDropOff(player, flag) {
    const base = player === player1 ? flag1.base : flag2.base;

    if (flag.heldBy !== player) {
        console.log("Player is not holding the flag.");
        return false;
    }

    const distX = player.x - base.x;
    const distY = player.y - base.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    const dropOff = distance < tankSize / 2 + base.size / 2;
    if (dropOff) {
        console.log(`${player.color} player dropped off the flag at their base.`);
    }
    return dropOff;
}

function update() {
    if (gameOverFlag) {
        console.log("Game is over, stopping update.");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    walls.forEach(drawWall);
    drawPowerBoost(powerBoost);
    portals.forEach(drawPortal);
    spawners.forEach(drawSpawner);
    drawFlag(flag1);
    drawFlag(flag2);
    drawBase(flag1.base, 'cyan');
    drawBase(flag2.base, 'red');

    moveTank(player1);
    moveTank(player2);

    if (flag1.heldBy) {
        flag1.x = flag1.heldBy.x;
        flag1.y = flag1.heldBy.y;
    }
    if (flag2.heldBy) {
        flag2.x = flag2.heldBy.x;
        flag2.y = flag2.heldBy.y;
    }

    checkFlagPickup(player1, flag1, flag2);
    checkFlagPickup(player2, flag2, flag1);

    // Winning condition for player1
    if (checkFlagDropOff(player1, flag2)) {
        console.log('Flag2 drop off successful');
        gameOver('Cyan wins!', 'cyan');
    }
    // Winning condition for player2
    if (checkFlagDropOff(player2, flag1)) {
        console.log('Flag1 drop off successful');
        gameOver('Red wins!', 'red');
    }

    drawTank(player1);
    drawTank(player2);

    player1.bullets = player1.bullets.filter(bullet => bullet.active);
    player2.bullets = player2.bullets.filter(bullet => bullet.active);

    checkAllBulletCollisions();

    player1.bullets.forEach(bullet => {
        portals.forEach(portal => checkPortalCollision(bullet, portal));
        updateBullet(bullet);
        drawBullet(bullet);
    });

    player2.bullets.forEach(bullet => {
        portals.forEach(portal => checkPortalCollision(bullet, portal));
        updateBullet(bullet);
        drawBullet(bullet);
    });

    player1.bullets.forEach(bullet => {
        if (checkCollision(player2, bullet)) {
            gameOver('Cyan wins!', 'cyan');
        }
    });

    player2.bullets.forEach(bullet => {
        if (checkCollision(player1, bullet)) {
            gameOver('Red wins!', 'red');
        }
    });

    if (!gameOverFlag) {
        requestAnimationFrame(update);
    }
}

update(); // Initialize the game loop