let pick;
let pickfunc;

let gvibes = [];
let gdos = [];
let gdonts = [];

let bvibes = [];
let bdos = [];
let bdonts = [];

let nvibes = [];
let ndos = [];
let ndonts = [];

let alignment;

//let vibes = [];

let bridge;
let isConnected = false;

const imageModelURL = 'https://teachablemachine.withgoogle.com/models/Rmoy9_A8V/';

let classifier;
let video;
let label = "Loading...";
let confidence = 0;

function preload() {
    // Load the Teachable Machine model
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(640, 480);

    bridge = new SerialBridge('http://localhost:3000');
    
    bridge.onData('device_1', (data) => {
        console.log("ONDATA ", data);
    });

    bridge.onStatus('device_1', (status, port) => {
         console.log("ONSTATUS2", status, port);
        connectionStatus = status;
        isConnected = (status === 'connected');
        console.log(`Arduino status2: ${status} on ${port}`);
    });

    console.log("P5.js ready");

    // Create the video capture
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Hide the default HTML video element
    
    // Start classifying
    classifyVideo();
}

function draw() {
    background(255);

    // Display the video
    image(video, 0, 0);
    
    // Display classification results
    fill(0, 200);
    rect(0, height - 40, width, 40);
    
    fill(255);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(`Class: ${label} | Confidence: ${(confidence * 100).toFixed(1)}%`, 10, height - 20);
    
    // Call functions based on classification
    


    // choice();
    // noLoop();
}

function classifyVideo() {
    classifier.classify(video, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    
    // Update label and confidence
    label = results[0].label;
    confidence = results[0].confidence;
    
    // Continue classifying
    classifyVideo();
}

// Handle different classifications with if statements
function handleClassification(currentLabel) {
    // Replace these class names with YOUR actual class names from Teachable Machine
    
    if (currentLabel === "happy") {
        goodvibes();
    } else if (currentLabel === "sad") {
        badvibes();
    } else if (currentLabel === "neutral") {
        neutralvibes();
    }
    // Add more conditions for your other classes
}

function goodvibes() {
    gvibes.push("Alignment is favorable; adherence to guidance will reinforce outcomes." , "Opportunities for structured progress are available; act deliberately." , 
        "Positive engagement within approved parameters will be advantageous." , "Expansion is permitted where supervision allows; proceed responsibly." ,
        "Stability and receptivity are in balance; maintain compliance.");

    gdos.push("Do consider civic contribution." , "Do record details; they will matter" , 
        "Do maintain productivity." , "Do reinforce patterns that have succeeded." ,
        "Do encourage alignment in others.");

    gdonts.push("Do not resist the structure that supports you." , "Do not delay recognition of success." , 
        "Do not ignore feedback." , "Do not take liberties without reflection." ,
        "Do not forget to prepare for tomorrows guidance.");

    alignment = Math.floor(70 + confidence * 30);

    pick = random(gvibes) + "\n" + random(gdos) + "\n" + random(gdonts) + "\nAlignment: " + alignment + "%";
    sendToArduino();  
    print(pick);
}


function badvibes() {
    bvibes.push("You are experiencing temporary destabilisation. Remain observant." , "Prioritize stability; external influences are heightened.." , 
        "Maintain caution today. Decisions require careful observation." , "Avoid unnecessary exposure; some situations are not to be tested." , 
        "Certain outcomes remain beyond immediate control — remain compliant.");

    bdos.push("Do observe the patterns you resist." , "Do acknowledge what is unspoken." , 
        "Do avoid speculative thinking." , "Do record your failures— they contain guidance." ,
        "Do limit social exposure.");

    bdonts.push("Do not contact estranged individuals." , "Do not engage in political debate." , 
        "Do not ignore feedback." , "Do not speak before the evidence is clear." ,
        "Do not ignore the signals that arrive today.");

    alignment = Math.floor(confidence * 30);

    pick = random(bvibes) + "\n" + random(bdos) + "\n" + random(bdonts) + "\nAlignment: " + alignment + "%";
    sendToArduino();  
    print(pick);
}



function neutralvibes() {
    nvibes.push("Stability within acceptable parameters." , "Minor fluctuations detected. Continue current routines." , 
        "Maintain vigilance without excess. Observation alone is sufficient." , "Activity within prescribed parameters will yield expected results." ,
        "Proceed with diligence; clarity may be found in measured action.");

    ndos.push("Do complete pending obligations." , "Do maintain dietary consistency." , 
        "Do note what others do and do not." , "Do balance observation with participation." ,
        "Do attend to the routines that structure your day.");

    ndonts.push("Do not overextend energy reserves." , "Do not indulge in excessive nostalgia." , 
        "Do not overlook subtle discrepancies." , "Do not leave actions incomplete." ,
        "Do not neglect what is necessary.");

    alignment = Math.floor(30 + confidence * 40);;

    pick = random(nvibes) + "\n" + random(ndos) + "\n" + random(ndonts) + "\nAlignment: " + alignment + "%";
    sendToArduino();  
    print(pick);
}


//function choice() {
//    vibes.push(goodvibes, badvibes, neutralvibes);
//   pickfunc = random(vibes);
//    pickfunc();
//    sendToArduino();  
//    print(pick);
//}

function sendToArduino() {
    if (isConnected) {
        // Send to Arduino
        bridge.send('device_1', pick.toString());

        // Console log what we're sending
        console.log(`Sending vibe: ${pick}`);
    } else {
        console.log("Bridge not connected yet, cannot send.");
    }
}

function mousePressed() {
    handleClassification(label);
}