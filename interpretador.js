const fs = require("fs");

const programa = fs.readFileSync("meu_programa.txt", "utf8").split("\n");

let saida = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Jogo do Dino com Escudos e Score</title>
  <style>
    canvas { background: white; display: block; margin: auto; border: 2px solid black; }
    button { display: none; margin: 20px auto; padding: 10px; font-size: 18px; }
  </style>
</head>
<body>
  <canvas id="game" width="800" height="300"></canvas>
  <button id="restart">Restart</button>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    let dino = { x: 50, y: 200, w: 40, h: 40, vy: 0, jumping: false };
    let gravity = 1.2;
    let obstacles = [];
    let frames = 0;
    let game;
    let shields = 3;
    let shieldActive = false;
    let shieldTimer = 0;
    let score = 0;

    // Sons
    const jumpSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
    const shieldSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
    const gameOverSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
`;

// Tradução simples
for (let linha of programa) {
  linha = linha.trim().toLowerCase();

  if (linha.includes("dinossauro corre")) {
    saida += `
    function drawDino() {
      ctx.fillStyle = shieldActive ? "blue" : "black";
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    }
    `;
  }

  if (linha.includes("cactos sao obstaculos")) {
    saida += `
    function drawObstacles() {
      for (let o of obstacles) {
        ctx.fillStyle = "green";
        ctx.fillRect(o.x, o.y, o.w, o.h);
      }
    }
    `;
  }

  if (linha.includes("dinossauro pula com espaço")) {
    saida += `
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !dino.jumping) {
        dino.vy = -18;
        dino.jumping = true;
        jumpSound.play();
      }
    });
    `;
  }

  if (linha.includes("se apertar x ativa escudo")) {
    saida += `
    document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "x" && shields > 0 && !shieldActive) {
        shieldActive = true;
        shields--;
        shieldTimer = 100; // duração do escudo (~3s)
        shieldSound.play();
      }
    });
    `;
  }

  if (linha.includes("aparece botao de restart")) {
    saida += `
    document.getElementById("restart").onclick = () => location.reload();
    `;
  }
}

// Loop principal
saida += `
    // Score sobe a cada segundo
    setInterval(() => {
      if (game) score++;
    }, 1000);

    function update() {
      frames++;

      // Gravidade
      dino.y += dino.vy;
      if (dino.y + dino.h >= canvas.height - 20) {
        dino.y = canvas.height - 20 - dino.h;
        dino.vy = 0;
        dino.jumping = false;
      } else {
        dino.vy += gravity;
      }

      // Obstáculos
      if (frames % 90 === 0) {
        obstacles.push({ x: canvas.width, y: canvas.height - 60, w: 20, h: 40 });
      }
      for (let o of obstacles) o.x -= 6;
      obstacles = obstacles.filter(o => o.x + o.w > 0);

      // Colisão
      for (let o of obstacles) {
        if (
          dino.x < o.x + o.w &&
          dino.x + dino.w > o.x &&
          dino.y < o.y + o.h &&
          dino.y + dino.h > o.y
        ) {
          if (!shieldActive) {
            clearInterval(game);
            gameOverSound.play();
            document.getElementById("restart").style.display = "block";
          }
        }
      }

      // Escudo
      if (shieldActive) {
        shieldTimer--;
        if (shieldTimer <= 0) shieldActive = false;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDino();
      drawObstacles();

      // HUD
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText("Escudos: " + shields, 10, 20);
      ctx.fillText("Score: " + score, 10, 40);
    }

    function loop() {
      update();
      draw();
    }

    game = setInterval(loop, 30);
  </script>
</body>
</html>
`;

fs.writeFileSync("saida.html", saida);
console.log("✅ Jogo do Dino com score e sons gerado em saida.html");
