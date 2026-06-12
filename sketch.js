let W = 800, H = 600;
let lives = 3;
let score = 0;
let level = 1;


let maxLevels = 5;       
let baseJellySpeed = 2;  
let speedScale = 1;    

let jellyfish = []; 

let jellyfishImg, sbPng, bg, title, gosb, pssbp, psb, winner;
let currentState = 'home'; 


let sb = { x: 300, y: 400, w: 150, h: 150, speed: 11 };

let btns = [
  { label: 'Home', x: 175, y: 20, w: 120, h: 40, action: 'home' },
  { label: 'Start Game', x: 325, y: 20, w: 120, h: 40, action: 'game' },
  { label: 'Instructions', x: 475, y: 20, w: 120, h: 40, action: 'instructions' }
];

function preload() {
  sbPng = loadImage("sbjf.png");
  bg = loadImage("sbbbsr.webp");
  jellyfishImg = loadImage("jf1.gif");
  title = loadImage("titlesb.png");
  gosb = loadImage("gosb.gif");
  pssbp = loadImage("pssbp.png");
  psb = loadImage("psb.png");
  winner = loadImage("winner.gif");
}

function setup() {
  createCanvas(W, H);
  spawnJellyfish(4); 
}

function draw() {
  if (currentState == 'home') {
    drawHome();
  } else if (currentState == 'game') {
    drawGame();
  } else if (currentState == 'instructions') {
    drawInstructions();
  } else if (currentState == 'gameover') {
    drawGameOver();
  } else if (currentState == 'win') {
    drawWin();
  }
  
  drawButtons();
}

function manageJellyfishLogic(winThreshold) {
  if (score >= winThreshold) {
    level = level + 1;
    score = 0;
    
    if (level > maxLevels) {
      currentState = 'win';
      return; 
    }
    spawnJellyfish(4); // Keeps it at 4 jellyfish for the next level
  }

  if (lives <= 0) {
    currentState = 'gameover';
    return;
  }

  for (let j of jellyfish) {
    j.y += j.sp + (level * speedScale); 
    image(jellyfishImg, j.x, j.y, j.w, j.h);

    if (j.y + j.h > sb.y && j.x > sb.x && j.x < sb.x + sb.w && j.y < sb.y + sb.h) {
      score = score + level;
      resetSingleJelly(j);
    }

    if (j.y > H) {
      lives--;
      resetSingleJelly(j);
    }
  }
  
  moveSb();
}

function drawGame() {
  image(bg, 0, 0, W, H);
  
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Lives: " + lives, 20, 80);
  text("Score: " + score, 20, 110);
  text("Level: " + level + " / " + maxLevels, 20, 140);
 
  // Requires fewer points to level up (level * 4 instead of level * 5)
  manageJellyfishLogic(level * 4); 
}

function spawnJellyfish(count) {
  jellyfish = []; 
  for (let i = 0; i < count; i++) {
    jellyfish.push({
      x: random(W - 50),
      y: random(-H, -50), 
      w: 50,
      h: 50,
      sp: random(baseJellySpeed, baseJellySpeed + 2) // Tighter, slower random speed window
    });
  }
}

function resetSingleJelly(j) {
  j.y = random(-200, -50);
  j.x = random(W - j.w);
}

function moveSb() {
  if (keyIsDown(LEFT_ARROW)) sb.x = max(0, sb.x - sb.speed);
  if (keyIsDown(RIGHT_ARROW)) sb.x = min(W - sb.w, sb.x + sb.speed);
  image(sbPng, sb.x, sb.y, sb.w, sb.h);
}

function drawHome() {
  background(100, 150, 255);
  image(title, 210, 160, W / 2, H / 3);
  image(pssbp, 80, 360, W / 5, H / 3);
  image(psb, 450, 360, W / 2, H / 3);
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text("Click 'Start Game' to play", W / 2, H / 2 + 100);
}

function drawInstructions() {
  background("pink");
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("HOW TO PLAY", W / 2, 120);
  textSize(18);
  text("1. Use LEFT and RIGHT arrows to move.\n2. Catch jellyfish to increase your score.\n3. Complete Level " + maxLevels + " to win!\n4. Don't let them hit the ground!\n5. You only get 3 lives.", W / 2, H / 2 + 20);
}

function drawGameOver() {
  background(50, 0, 0);
  image(gosb, 215, 150, W / 2, H / 2);
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Click 'Start Game' to Try Again", W / 2, H - 100);
}

function drawWin() {
  background(200, 255, 200);
  image(winner, 215, 150, W / 2, H / 2);
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text("YOU ARE THE KING OF JELLYFISHING!", W / 2, H - 100);
}

function drawButtons() {
  for (let btn of btns) {
    fill(240);
    rect(btn.x, btn.y, btn.w, btn.h, 5);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }
}

function mousePressed() {
  for (let btn of btns) {
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      currentState = btn.action;
      if (btn.action == 'game') {
        lives = 3;
        score = 0;
        level = 1; 
        sb.x = 300; 
        spawnJellyfish(4); 
      }
    }
  }
}
