// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB, fill, text,
 *    frameCount, frameRate, mouseX, mouseY
 *    width, height, round, circle
 *    rect, collideRectRect, random,
 *    stroke, noStroke, noFill, fill, color
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, keyIsPressed
 *    windowWidth, windowHeight
 */
let backgroundImage, gameIsOver, dvdImage;
let batX, batY, lastX, lastY, speed, maxSpeed, velIsPos;
let currentFrame, lastFrame;
let bat, healthBar, pinata, confettiArray;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  //createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  //backgroundImage = loadImage('');
  batX = 50;
  batY = 200;

  maxSpeed = speed = 0;
  gameIsOver = false;
  velIsPos = true;

  bat = new Bat();
  healthBar = new Health();
  pinata = new Pinata();
  ///////
  confettiArray = [];
  for (var i = 0; i < 250; i++) {
    confettiArray.push(new Confetti());
  }
  console.log(confettiArray);
}

/////////// DRAW FUNCTION /////////////
function draw() {
  background(15);

  currentFrame = frameCount;
  //refreshes variables every 30 sec
  if (frameCount % 30 == 0) {
    lastX = batX;
    lastY = batY;
    lastFrame = currentFrame;
  }

  pinata.display();
  pinata.update();
  healthBar.display("green");
  bat.display();
  updateSpeed();

  pinata.checkHit();
  checkMouse();
  healthBar.changeColor();
  checkWin();
  confettiFalling();
  restartGame();

  //pinata.x += pinata.velocity

  if (speed > maxSpeed) {
    maxSpeed = speed;
  }
}
////// end of draw function

function updateSpeed() {
  let deltaX = (batX - lastX) * (batX - lastX);
  let deltaY = (batY - lastY) * (batY - lastY);
  let distance = Math.sqrt(deltaX + deltaY);
  if (currentFrame - lastFrame != 0) {
    speed = round(distance / (currentFrame - lastFrame));
  }
  if (lastX > batX) {
    velIsPos = false;
  } else {
    velIsPos = true;
  }
  //text("Speed: " + speed, 20, 20);
  //text("MaxSpeed: " + maxSpeed, 100, 20);
  //console.log(maxSpeed);
}

class Bat {
  constructor() {
    this.x = batX;
    this.y = batY;
    this.width = 10;
    this.height = 100;
  }

  display() {
    fill(255);
    rect(batX, batY, this.width, this.height);

    if (
      batX <= 0 ||
      batX >= width ||
      batY + bat.height / 2 <= 0 ||
      batY + bat.height / 2 >= height
    ) {
      batX = 50;
      batY = 200;
    }
  }
}

class Health {
  constructor() {
    this.x = 60;
    this.y = 30;
    //this.color = color;
    this.health = 250;
  }

  display(healthColor) {
    strokeWeight(0.5);
    stroke(0);
    fill(100);
    text("Health:", 20, 40);
    fill(healthColor);
    rect(this.x, this.y, this.health, 10);
    noStroke();
  }
  //changes color of the health bar as health goes down
  changeColor() {
    if (this.health < 150 && this.health >= 100) {
      this.display("yellow");
    }
    if (this.health < 100 && this.health >= 50) {
      this.display("orange");
    }
    if (this.health < 50) {
      this.display("red");
    }
  }
}
//end of change color

class Pinata {
  constructor() {
    // this.x = 300;
    // this.y = height / 2;
    // this.size = 60;
    // this.velocity = 0;

    this.origin = createVector(width / 2, 0).copy();
    this.position = createVector();
    this.r = 275;
    this.angle = PI / 21;

    this.aVelocity = 0.0;
    this.aAcceleration = 0.0;
    this.damping = 0.99; // Arbitrary damping
    this.ballr = this.size = 58.0; // Arbitrary ball radius
  }

  display() {
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
    this.position.add(this.origin); // Make sure the position is relative to the pendulum's origin

    stroke(255);
    strokeWeight(2);
    // Draw the arm
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    noStroke();
    ellipseMode(CENTER);
    // Draw the shape
    fill(240, 70, 70);
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
  }

  // Function to update position
  update() {
    var gravity = 0.5; // Arbitrary constant
    this.aAcceleration = ((-1 * gravity) / this.r) * sin(this.angle); // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
    this.aVelocity += this.aAcceleration; // Increment velocity
    this.aVelocity *= this.damping; // Arbitrary damping
    this.angle += this.aVelocity; // Increment angle
  }

  checkHit() {
    var hit = false;
    hit = collideRectCircle(
      batX,
      batY,
      bat.width,
      bat.height,
      this.position.x,
      this.position.y,
      this.size
    );
    if (hit) {
      healthBar.health -= speed;
      batX = 50;
      batY = 200;
      this.velocity = speed;
      if (velIsPos == true) {
        this.angle += speed *= 0.01;
      } else if ((velIsPos = false)) {
        this.angle -= speed *= -0.01;
      }
      if (healthBar.health < 0) {
        healthBar.health = 0;
      }
    }
  }
}

class Confetti {
  constructor() {
    this.x = random(0, width); ///
    this.y = random(height/2-50, height/2+50);
    this.size = random(4, 10);
    this.speed = random(2, 5);
    this.color = random(360);
    this.gravity = random(0.1, 1)
  }

  displayConfetti() {
    noStroke();
    fill(this.color, 100, 100);
    circle(this.x, this.y, this.size);
    
    //falling functionality
    if (this.y < windowHeight-30) {
      this.y = this.y + this.speed;
      this.speed = this.speed + this.gravity;
    }
    if(this.y == windowHeight-30){
      this.speed = 0;
      this.gravity = 0;
    }
  }
}

//bat only moves when dragged by mouse
function checkMouse() {
  var holdBat = false;
  holdBat = collidePointRect(
    mouseX,
    mouseY,
    batX - 100,
    batY,
    bat.width + 260,
    bat.height
  );
  if (holdBat && gameIsOver == false) {
    batX = mouseX - bat.width / 2;
    batY = mouseY - bat.height / 2;
  }
}

function checkWin() {
  if (healthBar.health == 0) {
    gameIsOver = true;
    fill("white");
    text("Congratulations!", 150, 100);
    text("Press any button to restart", 150, 130);
  }
}

function confettiFalling() {
  if (gameIsOver == true) {
    //setTimeout(function() {
      for (var i = 0; i < confettiArray.length; i++)       {
        confettiArray[i].displayConfetti();
        //confettiArray[i].fall();
      }
    //}, 1000);
  }
}

function restartGame() {
  if (gameIsOver && keyIsPressed) {
    gameIsOver = false;
    healthBar.health = 300;
    speed = 0;
  }
}