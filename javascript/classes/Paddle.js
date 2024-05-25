class Paddle {
  constructor(x, y, isLeftPaddle) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 200;
    this.speed = 10;
    this.isLeftPaddle = isLeftPaddle; // Indicates whether it's the left or right paddle
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, 20);
  }

  update() {
    if (this.isLeftPaddle) {
      // Left paddle controlled by left hand
      if (hands.length > 0) {
        const hand = hands.find(
          (hand) => hand.annotations.indexFinger[0][0] < width / 2
        );
        if (hand) {
          const keypoint = hand.landmarks[8]; // Assuming index finger tip for paddle control
          this.y = keypoint[1];
        }
      }
    } else {
      // Right paddle controlled by right hand
      if (hands.length > 0) {
        const hand = hands.find(
          (hand) => hand.annotations.indexFinger[0][0] > width / 2
        );
        if (hand) {
          const keypoint = hand.landmarks[8]; // Assuming index finger tip for paddle control
          this.y = keypoint[1];
        }
      }
    }
  }
}
