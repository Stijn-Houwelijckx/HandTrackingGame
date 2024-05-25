let handpose;
let video;
let hands = [];
let paddleLeft;
let paddleRight;
let ball;
let leftScore = 0;
let rightScore = 0;
let gameStarted = false; // Variable to track if the game has started
let countdown = 5; // Initial countdown value
let speedIncreaseInterval; // Interval for increasing the ball speed
var modelLoaded = false;

function setup() {
  createCanvas(1280, 720);
  video = createCapture(VIDEO);
  video.size(width, height);

  const options = {
    flipHorizontal: false,
    maxContinuousChecks: Infinity,
    detectionConfidence: 0.8,
    scoreThreshold: 0.75,
    iouThreshold: 0.3,
  };

  handpose = ml5.handpose(video, options, modelReady);
  handpose.on("hand", (results) => {
    hands = results;
  });

  video.hide();
}

function modelReady() {
  console.log("Model ready!");
  // Start the countdown when the model is ready

  modelLoaded = true;

  startCountdown();
}

function startCountdown() {
  if (countdown >= 0) {
    setTimeout(() => {
      countdown--;
      startCountdown();
    }, 1000); // Countdown every second (1000 milliseconds)
  } else {
    // Start the game after the countdown reaches 0
    paddleLeft = new Paddle(10, height / 2, true);
    paddleRight = new Paddle(width - 10, height / 2, false);
    ball = new Ball(width / 2, height / 2);
    gameStarted = true;

    document.getElementById("speed").innerText = "Speed: " + ball.speed;

    // Start increasing the ball speed every 10 seconds
    speedIncreaseInterval = setInterval(() => {
      ball.increaseSpeed();
    }, 10000);
  }
}

function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  if (gameStarted && modelLoaded) {
    paddleLeft.update();
    paddleRight.update();
    ball.update();

    paddleLeft.show();
    paddleRight.show();
    ball.show();

    checkCollision();
    checkScore();
  } else if (modelLoaded && !gameStarted) {
    // Display the countdown if the game hasn't started yet
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(255);
    push(); // Save the current transformation state
    translate(width, 0);
    scale(-1, 1);
    text(countdown >= 0 ? countdown : "GO!", width / 2, height / 2);
    pop(); // Restore the transformation state
  } else {
    // Display a message if the model isn't ready yet
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(255);
    push();
    translate(width, 0);
    scale(-1, 1);
    text("Loading...", width / 2, height / 2);
    pop();
  }
}

function checkCollision() {
  // Ball with top and bottom walls
  if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > height) {
    ball.dy *= -1;
  }

  // Ball with paddles
  if (
    ball.x - ball.size / 2 < paddleLeft.x + paddleLeft.width &&
    ball.y > paddleLeft.y - paddleLeft.height / 2 &&
    ball.y < paddleLeft.y + paddleLeft.height / 2
  ) {
    ball.dx *= -1;
  }

  if (
    ball.x + ball.size / 2 > paddleRight.x - paddleRight.width &&
    ball.y > paddleRight.y - paddleRight.height / 2 &&
    ball.y < paddleRight.y + paddleRight.height / 2
  ) {
    ball.dx *= -1;
  }
}

function checkScore() {
  if (ball.x + ball.size / 2 < 0) {
    leftScore++;
    resetBall();
  } else if (ball.x - ball.size / 2 > width) {
    rightScore++;
    resetBall();
  }
  document.getElementById("player1Score").innerText = "Player 1: " + leftScore;
  document.getElementById("player2Score").innerText = "Player 2: " + rightScore;
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.dx *= random() > 0.5 ? 1 : -1;
  ball.dy *= random() > 0.5 ? 1 : -1;
  ball.speed = 1;

  document.getElementById("speed").innerText = "Speed: " + ball.speed;
}
