class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.dx = 5;
    this.dy = 5;
    this.speed = 1;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.size);
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  increaseSpeed() {
    this.speed += 0.5; // Increase the speed by 0.5
    document.getElementById("speed").innerText = "Speed: " + this.speed;
  }
}
