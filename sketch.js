var ctracker;
var emotionData;
var ec;
var clr;
var sum = 0;
var swipePosition;
var eyePositionL;
var eyePositionR;

function preload() {
  heart = loadImage('assets/heart.png');
}

function setup() {
  // setup camera capture
  var videoInput = createCapture(VIDEO);
  videoInput.size(200, 150);
  videoInput.position(0, 0);


  // setup canvas
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);


  ec = new emotionClassifier();
  ec.init(emotionModel);
  emotionData = ec.getBlank();
  textFont("Courier New");
}

function drawBot(xL, yL, xR, yR, xRect, yRect, wRect, hRect, eyeSize, pupilSize) {
  fill(80);
  rect(xRect, yRect, wRect, hRect);
  fill(255);
  ellipse(xL, yL, eyeSize, eyeSize);
  ellipse(xR, yR, eyeSize, eyeSize);
  fill(0);
  ellipse(eyePositionL, yL, pupilSize, pupilSize);
  ellipse(eyePositionR, yR, pupilSize, pupilSize)

  strokeWeight(5);
  line(windowWidth / 2, 100, windowWidth / 2, 30);
  imageMode(CENTER);
  heart.resize(50, 50);
  image(heart, windowWidth / 2, 30);

  textSize(15);
  text("change your expression", 0, 160);
  text("and see what happens", 0, 170);

}

function swipeRight() {
  //changes ball color to green and moves ball right
  clr = color(0, 255, 0, 120);
  swipePosition = 5 * windowWidth / 6;
  
  //eyes look right
  eyePositionL = windowWidth / 2 - 150;
  eyePositionR = windowWidth / 2 + 250;
  
  //ball and text
  fill(0);
  textSize(15);
  textAlign(LEFT);
  text("woah!!!", swipePosition - 50, 180);
  text("swipe right!", swipePosition - 50, 200);

  //hearts on eyes
  image(heart, eyePositionL, 200, 20, 20);
  image(heart, eyePositionR, 200, 20, 20);

  //smiley face
  strokeWeight(6);
  noFill();
  arc(windowWidth / 2, 350, 300, 200, TWO_PI, PI, OPEN);
  strokeWeight(10);
  line(3 * windowWidth / 4, 400, 3 * windowWidth / 4 + 150, 300);

}

function swipeLeft() {
  //changes ball color to red and moves ball left
  clr = color(255, 0, 0, 120);
  swipePosition = windowWidth / 6;
  
  //eyes look left
  eyePositionL = windowWidth / 2 - 250;
  eyePositionR = windowWidth / 2 + 150;
  
  //ball and text
  fill(0);
  textSize(15);
  textAlign(LEFT);
  text("mehh...", swipePosition - 50, 180);
  text("swipe left!", swipePosition - 50, 200);

  //frowny face
  strokeWeight(6);
  noFill();
  arc(windowWidth / 2, 450, 300, 200, PI, TWO_PI, OPEN);
  strokeWeight(10);
  line(windowWidth / 4, 400, windowWidth / 4 - 150, 300);
}

function draw() {
  clear();
  
  drawBot(windowWidth / 2 - 200, 200, windowWidth / 2 + 200, 200, windowWidth / 4, 100, windowWidth / 2, 400, 150, 50);
  imageMode(CENTER);
  textAlign(CENTER);
  textSize(100);
  text("~true love tinder bot~", windowWidth / 2, 600);

  var cp = ctracker.getCurrentParameters();
  var er = ec.meanPredict(cp);


//if the sum of the values is high, the user is making an expressive face.
//therefore, swipe right.
//if the sum of the the values is low, the user is not making an expressive face.
//therefore, swipe left.

  for (var i = 0; i < er.length; i++) {
    sum = er[0].value + er[1].value + er[2].value + er[3].value + er[4].value + er[5].value;
    print(sum);
    if (sum >= 1.6 || er[5].value >= 0.8) { 
      swipeRight();
    } else { 
      swipeLeft();
    }
    fill(clr);
  }
  
    
  noStroke();
  ellipse(swipePosition, 200, 120, 120);
}