// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB, fill, text,
 *    frameCount, frameRate, mouseX, mouseY
 *    width, height, round, circle
 *    rect, collideRectRect, random,ellipse, createVector, PI
 *    stroke, noStroke, noFill, fill, color
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, keyIsPressed
 *    windowWidth, windowHeight
 */
var p;

function setup()  {
  createCanvas(640,360);
  // Make a new Pendulum with an origin position and armlength
  p = new Pendulum();

}

function draw() {
  background(51);
  p.update();
  p.display();
}

function Pendulum() {
  // Fill all variables
  this.origin = createVector(width/2,0).copy();
  this.position = createVector();
  this.r = 175;
  this.angle = PI/4;

  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.damping = 0.995;   // Arbitrary damping
  this.ballr = this.size = 48.0;      // Arbitrary ball radius
  



  // Function to update position
  this.update = function() {
    var gravity = 0.4;                                               // Arbitrary constant
    this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
    this.aVelocity += this.aAcceleration;                            // Increment velocity
    this.aVelocity *= this.damping;                                  // Arbitrary damping
    this.angle += this.aVelocity;                                    // Increment angle
  };

  this.display = function() {
    this.position.set(this.r*sin(this.angle), this.r*cos(this.angle), 0);         // Polar to cartesian conversion
    this.position.add(this.origin);                                               // Make sure the position is relative to the pendulum's origin

    stroke(255);
    strokeWeight(2);
    // Draw the arm
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    ellipseMode(CENTER);
    fill(127);
    // Draw the shape
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
  };
}