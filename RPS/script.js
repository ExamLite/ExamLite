const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const objects = [];
const objectTypes = ['rock', 'paper', 'scissors'];

// Load images
const images = {
    rock: new Image(),
    paper: new Image(),
    scissors: new Image(),
};
images.rock.src = 'rock.png';
images.paper.src = 'paper.png';
images.scissors.src = 'scissors.png';

// Object Constructor
function GameObject(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = 20; // Size of the objects
    this.speedX = Math.cos(Math.random() * 2 * Math.PI) * 2; // Set a constant speed for all objects
    this.speedY = Math.sin(Math.random() * 2 * Math.PI) * 2; // Set a constant speed for all objects
}

// Initialize objects with 20 rocks, 20 papers, and 20 scissors
for (let typeIndex = 0; typeIndex < objectTypes.length; typeIndex++) {
    for (let i = 0; i < 20; i++) {
        const type = objectTypes[typeIndex];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        objects.push(new GameObject(type, x, y));
    }
}

// Draw objects
function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        ctx.drawImage(images[obj.type], obj.x - obj.size / 2, obj.y - obj.size / 2, obj.size, obj.size);
    });
}

// Move objects
function moveObjects() {
    objects.forEach(obj => {
        obj.x += obj.speedX;
        obj.y += obj.speedY;

        // Bounce off the edges
        if (obj.x < obj.size / 2 || obj.x > canvas.width - obj.size / 2) {
            obj.speedX *= -1;
            obj.x = Math.max(obj.size / 2, Math.min(canvas.width - obj.size / 2, obj.x));
        }
        if (obj.y < obj.size / 2 || obj.y > canvas.height - obj.size / 2) {
            obj.speedY *= -1;
            obj.y = Math.max(obj.size / 2, Math.min(canvas.height - obj.size / 2, obj.y));
        }
    });
}

// Collision detection and transformation
function handleCollisions() {
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const objA = objects[i];
            const objB = objects[j];
            const dx = objA.x - objB.x;
            const dy = objA.y - objB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < objA.size) {
                if (objA.type === 'rock' && objB.type === 'scissors' ||
                    objA.type === 'scissors' && objB.type === 'paper' ||
                    objA.type === 'paper' && objB.type === 'rock') {
                    objB.type = objA.type;
                } else if (objB.type === 'rock' && objA.type === 'scissors' ||
                           objB.type === 'scissors' && objA.type === 'paper' ||
                           objB.type === 'paper' && objA.type === 'rock') {
                    objA.type = objB.type;
                }
            }
        }
    }
}

// Game loop
function gameLoop() {
    moveObjects();
    handleCollisions();
    drawObjects();
    requestAnimationFrame(gameLoop);
}

gameLoop();
