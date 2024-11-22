let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let ball = { x: 50, y: 350, radius: 10, dx: 0, dy: -10, speedY: -14 }; // Increased jump height
let platforms = [
    { x: 50, y: 300, width: 100, height: 10 },
    { x: 200, y: 250, width: 100, height: 10 },
    { x: 350, y: 200, width: 100, height: 10 },
    { x: 500, y: 150, width: 100, height: 10 }
];
let coin = { x: 550, y: 100, radius: 10 };
let isJumping = false;
let gravity = 0.4;
let glideSpeed = 5; // Speed of horizontal movement after key press
let friction = 0.9; // Friction to gradually slow down horizontal movement

function startGame() {
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("instructions").style.display = "none";
    requestAnimationFrame(update);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawPlatforms() {
    ctx.fillStyle = "black";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawCoin() {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlatforms();
    drawCoin();
    
    ball.y += ball.dy;
    ball.x += ball.dx; // Update horizontal position based on horizontal velocity

    // Apply friction to gradually slow down horizontal movement
    ball.dx *= friction;

    if (ball.y + ball.radius < canvas.height) {
        ball.dy += gravity;
    } else {
        ball.dy = 0;
        isJumping = false;
    }

    platforms.forEach(platform => {
        if (
            ball.x > platform.x &&
            ball.x < platform.x + platform.width &&
            ball.y + ball.radius > platform.y &&
            ball.y - ball.radius < platform.y + platform.height
        ) {
            // Ensure the ball is above the platform to avoid passing through
            ball.y = platform.y - ball.radius;
            ball.dy = ball.speedY; // Make the ball bounce higher
            isJumping = true;
        }
    });

    if (
        Math.hypot(ball.x - coin.x, ball.y - coin.y) < ball.radius + coin.radius
    ) {
        alert("You win!");
        resetGame();
    }

    requestAnimationFrame(update);
}

function resetGame() {
    ball.x = 50;
    ball.y = 350;
    ball.dy = -10;
    ball.dx = 0;
    isJumping = false;
    startGame();
}

// Adjust horizontal movement when arrow keys are pressed
document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowRight") {
        ball.dx = glideSpeed; // Apply rightward glide speed
    } else if (event.code === "ArrowLeft") {
        ball.dx = -glideSpeed; // Apply leftward glide speed
    } else if (event.code === "Space" && !isJumping) {
        ball.dy = ball.speedY;
        isJumping = true;
    }
});
