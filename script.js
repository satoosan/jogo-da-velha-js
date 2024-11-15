const currentPlayer = document.querySelector(".currentPlayer");
const gameMessage = document.querySelector(".game-message");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const singleplayerBtn = document.getElementById("singleplayer-btn");
const gameContainer = document.querySelector(".game");

let selected = [];
let player = "X";
let isMultiplayer = false;  // Flag to track game mode
let computerPlayer = "O";  // AI player symbol (opposite of human player)

const positions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

// Função para inicializar o jogo
function init() {
  selected = [];
  gameMessage.textContent = ""; // Limpa mensagens anteriores

  if (isMultiplayer) {
    currentPlayer.innerHTML = `Jogador da vez: ${player}`;
  } else {  // Modo singleplayer: mostra mensagem inicial
    currentPlayer.innerHTML = "Você começa! Jogue como 'X'.";
  }

  const buttons = document.querySelectorAll(".game button");
  buttons.forEach(button => {
    button.textContent = "";
    button.disabled = false;  // Habilita todos os botões
    button.addEventListener("click", newMove);
  });

  gameContainer.classList.remove("hidden"); // Mostra o tabuleiro
  
  // Se for no modo singleplayer, o jogador começa a jogar
  if (!isMultiplayer) {
    // Desabilita os botões enquanto o jogador ainda não fez sua jogada
    enableAllButtons();
  }
}


// Função para lidar com uma nova jogada
function newMove(e) {
  const index = e.target.getAttribute("data-i");

  // Evita jogar se alguém já venceu ou se a casa já foi preenchida
  if (selected[index] || gameMessage.textContent) return;

  // Jogada do jogador humano
  e.target.textContent = player;
  e.target.disabled = true;
  selected[index] = player;

  // Verificar se alguém venceu ou houve empate
  if (!check()) {
    if (!isMultiplayer) {
      // Desabilita todos os botões enquanto a máquina joga
      disableAllButtons();
      setTimeout(() => {
        if (!check()) {
          computerMove(); // Só chama a jogada da máquina se o jogo não acabou
        }
      }, 500); // Delay para a jogada da máquina
    } else {
      // Se for multiplayer, alterna entre os jogadores
      player = player === "X" ? "O" : "X";
      currentPlayer.innerHTML = `Jogador da vez: ${player}`;
    }
  }
}

// Função para desabilitar todos os botões
function disableAllButtons() {
  const buttons = document.querySelectorAll(".game button");
  buttons.forEach(button => button.disabled = true);
}

// Função para habilitar todos os botões, mas somente aqueles não preenchidos
function enableAllButtons() {
  const buttons = document.querySelectorAll(".game button");
  buttons.forEach(button => {
    if (!button.textContent) {  // Habilita apenas os botões que não foram preenchidos
      button.disabled = false;
    }
  });
}

// Função para verificar se alguém ganhou ou se houve empate
function check() {
  const currentPlayerSymbol = player;

  const items = selected
    .map((item, i) => [item, i])
    .filter((item) => item[0] === currentPlayerSymbol)
    .map((item) => item[1]);

  // Verificar se há uma combinação vencedora
  for (const pos of positions) {
    if (pos.every((item) => items.includes(item))) {
      gameMessage.textContent = `O jogador '${currentPlayerSymbol}' ganhou!`;
      disableAllButtons();
      return true;
    }
  }

  // Verificar empate (quando todas as casas estão preenchidas)
  if (selected.filter((item) => item).length === 9) {
    gameMessage.textContent = "Deu empate!";
    disableAllButtons();
    return true;
  }

  return false;
}

// Função para a jogada da máquina (implementação básica)
function computerMove() {
  let availableMoves = [];
  for (let i = 0; i < 9; i++) {
    if (!selected[i]) {
      availableMoves.push(i);
    }
  }

  // Escolhe um movimento aleatório
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  const moveIndex = availableMoves[randomIndex];

  selected[moveIndex] = computerPlayer;
  document.querySelector(`button[data-i="${moveIndex}"]`).textContent = computerPlayer;

  // Verifica se a máquina venceu ou se houve empate
  if (check()) return; // Se a máquina venceu, não habilitar os botões

  // Após a jogada da máquina, habilita os botões novamente para o jogador humano
  enableAllButtons();
  // Alterna a vez para o jogador
  player = "X";
  currentPlayer.innerHTML = `Jogador da vez: ${player}`;
}


// Eventos para os botões de modo de jogo
multiplayerBtn.addEventListener("click", () => {
  isMultiplayer = true;
  init();
});

singleplayerBtn.addEventListener("click", () => {
  isMultiplayer = false;
  init();
});

// Inicializa o jogo no modo multiplayer por padrão
isMultiplayer = true;
init();
