
let pick;
let pickfunc;
let reload;
let gvibes = [];
let bvibes = [];
let nvibes = [];
let vibes = [];

let cardX, cardY, cardW, cardH;

function setup() {
    createCanvas(800, 600);

    cardX = width / 2;
    cardY = height / 2;
    cardW = 320;
    cardH = 480;

    reload = createButton("Reload");
    reload.position(cardX - cardW + 60, cardY - cardH/2 + 120); // top-right corner
    reload.style("font-size", "22px");
    reload.style("color", "#1E1432");          // match tarot quote color
    reload.style("font-style", "italic");      // match tarot quote style
    reload.style("padding", "6px 10px");
    reload.style("background-color", "#E6D2F5");
    reload.style("border", "2px solid #B48CC8");
    reload.style("border-radius", "6px");
    reload.mousePressed(reloadCard); // call function on click

    choice();
    noLoop();
}

function draw() {
    // Mystical background
    background(60, 45, 80);

    // Decorative frame on the background
    drawBackgroundBorder();

    drawTarotCard(cardX, cardY, cardW, cardH);

    // Draw quote in the center of the card
    fill(30, 20, 50);
    textSize(22);
    textAlign(CENTER, CENTER);
    textStyle(ITALIC);
    text(pick, cardX, cardY, cardW - 60, cardH - 80); 
}

function goodvibes() {
    gvibes.push("You are closer than you think." , "Your attention is shaping the outcome." , 
        "Trust what is already working." , "You have survived every version of this before." ,
        "The pattern is opening, not closing.");
    pick = random(gvibes);
    print(pick);
}


function badvibes() {
    bvibes.push("What you ignore is becoming louder." , "This feeling is trying to tell you something." , 
        "Certainty will cost you more than doubt." , "The answer arrived before you were ready." , 
        "You are standing too close to see the whole picture.");
    pick = random(bvibes);
    print(pick);
}



function neutralvibes() {
    nvibes.push("What you are noticing is not accidental." , "This is not the end of the process." , 
        "Stillness counts as movement." , "You are allowed to pause without explanation." ,
        "Not everything needs to be resolved today.");
    pick = random(nvibes);
    print(pick);
}


function choice() {
    vibes.push(goodvibes, badvibes, neutralvibes);
    pickfunc = random(vibes);
    pickfunc();
}

function drawTarotCard(x, y, w, h) {
    rectMode(CENTER);

    // Card base color (soft mystical lavender)
    fill(230, 210, 245);
    stroke(180, 140, 200);
    strokeWeight(6);
    rect(x, y, w, h, 25);

    // Ornamental inner border
    noFill();
    stroke(200, 160, 230);
    strokeWeight(3);
    for (let i = 0; i < 4; i++) {
        let offset = i * 12;
        rect(x, y, w - offset, h - offset, 20 + i*4);
    }

  // Corner filigree loops
    stroke(190, 120, 220);
    strokeWeight(2);
    for (let xMult of [-1,1]) {
        for (let yMult of [-1,1]) {
        let cx = x + xMult*(w/2 - 25);
        let cy = y + yMult*(h/2 - 25);
        noFill();
        for (let j = 0; j < 3; j++) {
            ellipse(cx, cy, 10 + j*6, 10 + j*6);
            }
        }
    }
}

// Decorative border/frame around the card
function drawBackgroundBorder() {
    stroke(200, 180, 230);
    strokeWeight(4);
    noFill();
    let margin = 30;       // distance from canvas edge
    let cornerRadius = 40; // smooth corners
    rectMode(CENTER);
    rect(width/2, height/2, width - margin*2, height - margin*2, cornerRadius);
}

function reloadCard() {
  choice(); // pick a new quote
  redraw(); // redraw the canvas with the new quote
}