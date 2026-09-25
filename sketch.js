let headphonePoints = [];
let noiseParticles = [];

let ancOn = false;
let ancAmount = 0;

let ancButton;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 1);

  pixelDensity(1);
  frameRate(30);

  console.log("init setup...");

  createHeadphones();
  createNoiseParticles();

  ancButton = createButton("ANC OFF");
  ancButton.position(windowWidth / 2 - 65, windowHeight - 80);
  ancButton.style("padding", "14px 26px");
  ancButton.style("border-radius", "999px");
  ancButton.style("border", "1px solid rgba(255, 255, 255, 0.45)");
  ancButton.style("background", "rgba(255, 255, 255, 0.08)");
  ancButton.style("color", "white");
  ancButton.style("font-size", "16px");
  ancButton.style("font-weight", "600");
  ancButton.style("letter-spacing", "0.5px");
  ancButton.style("cursor", "pointer");
  ancButton.style("z-index", "10");
  ancButton.mousePressed(toggleANC);

  // console.log("total points:", headphonePoints.length);
}

function draw() {
  background(220, 30, 5);

  orbitControl();

  // ANC
  ancAmount = lerp(ancAmount, ancOn ? 1 : 0, 0.08);

  drawHeadphones();
  drawNoiseParticles();
}

// CREATE HEADPHONES
function createHeadphones() {
  headphonePoints = [];

  createHeadband();

  createEarCup(-175, 75);
  createEarCup(175, 75);

  createConnector(-145);
  createConnector(145);

  console.log("headphones created!");
}

// HEADBAND
function createHeadband() {
  let count = 450; //之後可以再調整數量看看效能

  for (let i = 0; i < count; i++) {
    let angle = random(205, 335);

    let radiusX = random(178, 202);
    let radiusY = random(210, 235);

    headphonePoints.push({
      x: cos(angle) * radiusX,
      y: sin(angle) * radiusY + 90,
      z: random(-22, 22),
      seed: random(1000),
      type: "headband",
    });
  }
}

// EAR CUPS
function createEarCup(centerX, centerY) {
  let count = 850;

  for (let i = 0; i < count; i++) {
    let angle = random(360);
    let radialAmount = sqrt(random());

    let radiusX = radialAmount * 82;
    let radiusY = radialAmount * 112;

    headphonePoints.push({
      x: centerX + cos(angle) * radiusX,
      y: centerY + sin(angle) * radiusY,
      z: random(-55, 55),
      seed: random(1000),
      type: "earcup",
    });
  }
}

// CONNECTORS
function createConnector(centerX) {
  for (let i = 0; i < 120; i++) {
    headphonePoints.push({
      x: centerX + random(-7, 7),
      y: random(-45, 10),
      z: random(-8, 8),
      seed: random(1000),
      type: "connector",
    });
  }
}

// CREATE SURROUNDING NOISE
function createNoiseParticles() {
  noiseParticles = [];
  let count = 350;

  for (let i = 0; i < count; i++) {
    let angleA = random(360);
    let angleB = random(-90, 90);
    let radius = random(170, 330);

    noiseParticles.push({
      x: cos(angleA) * cos(angleB) * radius,
      y: sin(angleB) * radius * 0.8,
      z: sin(angleA) * cos(angleB) * radius,
      seed: random(1000),
      scatterX: random(-1, 1),
      scatterY: random(-1, 1),
      scatterZ: random(-1, 1),
    });
  }
}

// DRAW HEADPHONES
function drawHeadphones() {
  strokeWeight(3.5);
  let time = frameCount * 0.015;

  for (let i = 0; i < headphonePoints.length; i++) {
    let p = headphonePoints[i];
    let strength = 20;

    // different strength based on part type
    if (p.type === "earcup") strength = 32;
    else if (p.type === "headband") strength = 24;
    else if (p.type === "connector") strength = 16;

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
    if (radialDistance < 1) radialDistance = 1; // 避免除以零

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

function toggleANC() {
  ancOn = !ancOn;

  if (ancOn) {
    ancButton.html("ANC ON");
    ancButton.style("background", "rgb(255, 92, 186)");
    ancButton.style("border", "1px solid rgb(255, 92, 186)");
    ancButton.style("color", "white");
  } else {
    ancButton.html("ANC OFF");
    ancButton.style("background", "rgba(255, 255, 255, 0.08)");
    ancButton.style("border", "1px solid rgba(255, 255, 255, 0.45)");
    ancButton.style("color", "white");
  }

  console.log("ANC toggled: ", ancOn);
}

// KEYBOARD
function keyPressed() {
  if (key === "n" || key === "N") {
    toggleANC();
  }
}

// RESIZE
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ancButton.position(windowWidth / 2 - 65, windowHeight - 80);
}
