let headphonePoints = [];
let noiseParticles = [];

let ancOn = false;
let ancAmount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 1);

  pixelDensity(1);
  frameRate(30);

  createHeadphones();
  createNoiseParticles();
}

function draw() {
  background(220, 30, 5);

  orbitControl();

  if (ancOn) {
    ancAmount = lerp(ancAmount, 1, 0.08);
  } else {
    ancAmount = lerp(ancAmount, 0, 0.08);
  }

  drawHeadphones();
  drawNoiseParticles();
}

// --------------------------------------------------
// CREATE HEADPHONES
// --------------------------------------------------

function createHeadphones() {
  headphonePoints = [];

  createHeadband();

  createEarCup(-175, 75);
  createEarCup(175, 75);

  createConnector(-145);
  createConnector(145);
}

// --------------------------------------------------
// HEADBAND
// --------------------------------------------------

function createHeadband() {
  let count = 450;

  for (let i = 0; i < count; i++) {
    let angle = random(205, 335);

    let radiusX = random(178, 202);
    let radiusY = random(210, 235);

    let x = cos(angle) * radiusX;
    let y = sin(angle) * radiusY + 90;
    let z = random(-22, 22);

    headphonePoints.push({
      x: x,
      y: y,
      z: z,
      seed: random(1000),
      type: "headband",
    });
  }
}

// --------------------------------------------------
// EAR CUPS
// --------------------------------------------------

function createEarCup(centerX, centerY) {
  let count = 850;

  for (let i = 0; i < count; i++) {
    let angle = random(360);

    let radialAmount = sqrt(random());

    let radiusX = radialAmount * 82;
    let radiusY = radialAmount * 112;

    let x = centerX + cos(angle) * radiusX;
    let y = centerY + sin(angle) * radiusY;
    let z = random(-55, 55);

    headphonePoints.push({
      x: x,
      y: y,
      z: z,
      seed: random(1000),
      type: "earcup",
    });
  }
}

// --------------------------------------------------
// CONNECTORS
// --------------------------------------------------

function createConnector(centerX) {
  let count = 120;

  for (let i = 0; i < count; i++) {
    let x = centerX + random(-7, 7);
    let y = random(-45, 10);
    let z = random(-8, 8);

    headphonePoints.push({
      x: x,
      y: y,
      z: z,
      seed: random(1000),
      type: "connector",
    });
  }
}

// --------------------------------------------------
// CREATE SURROUNDING NOISE
// --------------------------------------------------

function createNoiseParticles() {
  noiseParticles = [];

  let count = 350;

  for (let i = 0; i < count; i++) {
    let angleA = random(360);
    let angleB = random(-90, 90);

    let radius = random(170, 330);

    let x = cos(angleA) * cos(angleB) * radius;

    let y = sin(angleB) * radius * 0.8;

    let z = sin(angleA) * cos(angleB) * radius;

    noiseParticles.push({
      x: x,
      y: y,
      z: z,
      seed: random(1000),
      scatterX: random(-1, 1),
      scatterY: random(-1, 1),
      scatterZ: random(-1, 1),
    });
  }
}

// --------------------------------------------------
// DRAW HEADPHONES
// --------------------------------------------------

function drawHeadphones() {
  strokeWeight(3.5);

  let time = frameCount * 0.015;

  for (let i = 0; i < headphonePoints.length; i++) {
    let p = headphonePoints[i];

    let strength = 20;

    if (p.type === "earcup") {
      strength = 32;
    }

    if (p.type === "headband") {
      strength = 24;
    }

    if (p.type === "connector") {
      strength = 16;
    }

    strength *= 1 - ancAmount;

    let n = noise(p.seed, time);

    let movement = map(n, 0, 1, -strength, strength);

    let noisyX = p.x + movement;
    let noisyY = p.y + movement * 0.6;
    let noisyZ = p.z + movement * 1.5;

    let cleanX = p.x;
    let cleanY = p.y;
    let cleanZ = p.z * 0.6;

    let x = lerp(noisyX, cleanX, ancAmount);
    let y = lerp(noisyY, cleanY, ancAmount);
    let z = lerp(noisyZ, cleanZ, ancAmount);

    let hueValue = lerp(325, 195, ancAmount);
    let satValue = lerp(85, 25, ancAmount);

    stroke(hueValue, satValue, 100, 0.9);
    point(x, y, z);
  }
}

// --------------------------------------------------
// DRAW NOISE PARTICLES
// --------------------------------------------------

function drawNoiseParticles() {
  strokeWeight(3);

  let time = frameCount * 0.012;

  for (let i = 0; i < noiseParticles.length; i++) {
    let p = noiseParticles[i];

    let n = noise(p.seed, time);

    let movement = map(n, 0, 1, -45, 45);

    let normalX = p.x + movement;
    let normalY = p.y + movement * 0.5;
    let normalZ = p.z + movement * 1.3;

    let radialDistance = sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

    if (radialDistance < 1) {
      radialDistance = 1;
    }

    let dirX = p.x / radialDistance;
    let dirY = p.y / radialDistance;
    let dirZ = p.z / radialDistance;

    let scatterDistance = 600;

    let scatterX = p.x + dirX * scatterDistance + p.scatterX * 100;

    let scatterY = p.y + dirY * scatterDistance + p.scatterY * 100;

    let scatterZ = p.z + dirZ * scatterDistance + p.scatterZ * 100;

    let x = lerp(normalX, scatterX, ancAmount);
    let y = lerp(normalY, scatterY, ancAmount);
    let z = lerp(normalZ, scatterZ, ancAmount);

    let alphaValue = lerp(0.7, 0, ancAmount);

    stroke(330, 70, 100, alphaValue);
    point(x, y, z);
  }
}

// --------------------------------------------------
// KEYBOARD
// --------------------------------------------------

function keyPressed() {
  if (key === "n" || key === "N") {
    ancOn = !ancOn;
  }
}

// --------------------------------------------------
// RESIZE
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
