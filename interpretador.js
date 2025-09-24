const fs = require("fs");

// Carrega o programa escrito na linguagem
const programa = fs.readFileSync("meu_programa.txt", "utf8").split("\n");

// Começo do código HTML/JS que vamos gerar
let saida = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Meu Jogo</title>
  <style>
    canvas { background: black; display: block; margin: auto; }
    button { display: none; margin: 20px auto; padding: 10px; font-size: 18px; }
  </style>
</head>
<body>
  <canvas id="game" width="400" height="400"></canvas>
  <button id="restart">Restart</button>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    let box = 20;
    let snake = [{x: 9 * box, y: 10 * box}];
    let direction;
    let food = {
      x: Math.floor(Math.random()*19+1) * box,
      y: Math.floor(Math.random()*19+1) * box
    };
    let game;
`;

// Traduz linha por linha
for (let linha of programa) {
  linha = linha.trim().toLowerCase();

  if (linha === "tela preta") {
    // já é padrão no estilo CSS
  }
  if (linha.includes("pixels brancos formam")) {
    saida += `
    function drawSnake() {
      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }
    }
    `;
  }
  if (linha.includes("obstaculos sao maças")) {
    saida += `
    function drawFood() {
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, box, box);
    }
    `;
  }
  if (linha.includes("cada maca comida minhoca fica maior")) {
    saida += `
    function eatFood(head) {
      if (head.x === food.x && head.y === food.y) {
        food = {
          x: Math.floor(Math.random()*19+1) * box,
          y: Math.floor(Math.random()*19+1) * box
        };
        return true; // não remove a cauda
      }
      return false; // remove a cauda
    }
    `;
  }
  if (linha.includes("se a minhoca tocar nela mesma")) {
    saida += `
    function checkSelfCollision(head) {
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          clearInterval(game);
          document.getElementById("restart").style.display = "block";
        }
      }
    }
    `;
  }
  if (linha.includes("se game over acontecer, aparece botao de restart")) {
    saida += `
    document.getElementById("restart").onclick = () => location.reload();
    `;
  }
}

// Loop principal do jogo
saida += `
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
      if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
      if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
      if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawFood();

      let head = {x: snake[0].x, y: snake[0].y};

      if (direction === "LEFT") head.x -= box;
      if (direction === "UP") head.y -= box;
      if (direction === "RIGHT") head.x += box;
      if (direction === "DOWN") head.y += box;

      if (!eatFood(head)) {
        snake.pop();
      }
      snake.unshift(head);

      checkSelfCollision(head);
    }

    game = setInterval(draw, 150);
  </script>
</body>
</html>
`;

// Salva o arquivo final
fs.writeFileSync("saida.html", saida);
console.log("✅ Código gerado em saida.html");
