// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game configuration
const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Game variables
let playerHealth = 100;
let enemyHealth = 100;
let isGameOver = false;
let spellSpeed = 5;

// Player object
const player = {
    x: 50,
    y: canvasHeight / 2,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue',
    moveUp: false,
    moveDown: false,
    spells: [],
};

// Enemy object
const enemy = {
    x: canvasWidth - 100,
    y: canvasHeight / 2,
    width: 50,
    height: 50,
    color: 'red',
    health: 100,
    moveUp: false,
    moveDown: false,
};

// Spell object
class Spell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = 7;
        this.color = 'purple';
    }

    move() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Functions to update the game state
function updateGame() {
    if (isGameOver) {
        displayGameOver();
        return;
    }

    // Move player
    if (player.moveUp && player.y > 0) player.y -= player.speed;
    if (player.moveDown && player.y < canvasHeight - player.height) player.y += player.speed;

    // Move spells
    player.spells.forEach(spell => {
        spell.move();
        if (spell.x > canvasWidth) {
            player.spells.splice(player.spells.indexOf(spell), 1);
        }
        // Check for collision with enemy
        if (spell.x + spell.width > enemy.x && spell.y + spell.height > enemy.y && spell.y < enemy.y + enemy.height) {
            enemyHealth -= 10;
            player.spells.splice(player.spells.indexOf(spell), 1);
        }
    });

    // Move enemy randomly
    if (Math.random() < 0.01) enemy.moveUp = !enemy.moveUp;
    if (Math.random() < 0.01) enemy.moveDown = !enemy.moveDown;
    if (enemy.moveUp && enemy.y > 0) enemy.y -= 1;
    if (enemy.moveDown && enemy.y < canvasHeight - enemy.height) enemy.y += 1;

    // Check for collision with player
    if (enemy.x < player.x + player.width && enemy.y + enemy.height > player.y && enemy.y < player.y + player.height) {
        playerHealth -= 1;
    }

    // Check for game over
    if (playerHealth <= 0 || enemyHealth <= 0) {
        isGameOver = true;
    }

    drawGame();
}

// Functions to draw on the canvas
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw enemy
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Draw player spells
    player.spells.forEach(spell => spell.draw());

    // Draw health bars
    ctx.fillStyle = 'black';
    ctx.fillText(`Player Health: ${playerHealth}`, 10, 20);
    ctx.fillText(`Enemy Health: ${enemyHealth}`, canvasWidth - 140, 20);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') player.moveUp = true;
    if (event.key === 'ArrowDown') player.moveDown = true;
    if (event.key === ' ') {
        const spell = new Spell(player.x + player.width, player.y + player.height / 2 - 2);
        player.spells.push(spell);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') player.moveUp = false;
    if (event.key === 'ArrowDown') player.moveDown = false;
});

// Display game over screen
function displayGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvasWidth / 2 - 80, canvasHeight / 2);
    if (playerHealth <= 0) {
        ctx.fillText('You were defeated!', canvasWidth / 2 - 120, canvasHeight / 2 + 40);
    } else {
        ctx.fillText('You won the duel!', canvasWidth / 2 - 120, canvasHeight / 2 + 40);
    }
}

// Game loop
function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();