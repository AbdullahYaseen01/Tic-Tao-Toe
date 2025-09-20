let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newgamebtn = document.querySelector("#new-btn");
let msgcontainer = document.querySelector("#msg-container");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#turn-indicator");

let scoreX = document.querySelector("#scoreX");
let scoreO = document.querySelector("#scoreO");
let scoreDraw = document.querySelector("#scoreDraw");

let modeSelector = document.querySelectorAll("input[name='mode']");
let vsAI = false;

let turn0 = true;  // O starts
let moveCount = 0;

const winpattern = [
  [0,1,2],[0,3,6],[0,4,8],
  [1,4,7],[2,5,8],[3,4,5],
  [6,7,8],[2,4,6]
];

// Listen to mode selector
modeSelector.forEach(radio => {
  radio.addEventListener("change", () => {
    vsAI = document.querySelector("input[name='mode']:checked").value === "ai";
    resetgame();
  });
});

const resetgame = () => {
  turn0 = true;
  moveCount = 0;
  enabledboxes();
  msgcontainer.classList.add("hide");
  turnIndicator.innerText = "Turn: Player O";
  boxes.forEach(box => box.classList.remove("winning-box"));
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (turn0) {
      box.innerText = "O";
      turnIndicator.innerText = "Turn: Player X";
      turn0 = false;
    } else {
      box.innerText = "X";
      turnIndicator.innerText = "Turn: Player O";
      turn0 = true;
    }
    box.disabled = true;
    moveCount++;
    if (checkwinner()) return;

    // AI move if enabled and it's AI's turn
    if (vsAI && !turn0 && !isGameOver()) {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  });
});

const enabledboxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const disabledboxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const showwinner = (winner, pattern = null) => {
  msg.innerText = `🎉 Congratulations, ${winner} wins!`;
  msgcontainer.classList.remove("hide");
  disabledboxes();

  if (pattern) {
    pattern.forEach(index => {
      boxes[index].classList.add("winning-box");
    });
  }

  if (winner === "X") scoreX.innerText = parseInt(scoreX.innerText) + 1;
  else if (winner === "O") scoreO.innerText = parseInt(scoreO.innerText) + 1;
};

const showDraw = () => {
  msg.innerText = "😮 It’s a Draw!";
  msgcontainer.classList.remove("hide");
  scoreDraw.innerText = parseInt(scoreDraw.innerText) + 1;
};

const checkwinner = () => {
  for (let pattern of winpattern) {
    let pos1val = boxes[pattern[0]].innerText;
    let pos2val = boxes[pattern[1]].innerText;
    let pos3val = boxes[pattern[2]].innerText;

    if (pos1val !== "" && pos2val !== "" && pos3val !== "") {
      if (pos1val === pos2val && pos2val === pos3val) {
        showwinner(pos1val, pattern);
        return true;
      }
    }
  }
  if (moveCount === 9) {
    showDraw();
    return true;
  }
  return false;
};

const isGameOver = () => {
  return !msgcontainer.classList.contains("hide");
};

// ✅ Minimax AI Implementation (Unbeatable)
function aiMove() {
  let bestScore = -Infinity;
  let move;
  boxes.forEach((box, i) => {
    if (box.innerText === "") {
      box.innerText = "X"; 
      let score = minimax(false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  if (move !== undefined) {
    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    moveCount++;
    turnIndicator.innerText = "Turn: Player O";
    turn0 = true;
    checkwinner();
  }
}

// Minimax recursive function
function minimax(isMaximizing) {
  let winner = getWinner();
  if (winner !== null) {
    if (winner === "X") return 1;
    if (winner === "O") return -1;
    if (winner === "draw") return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    boxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(false);
        box.innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = "O";
        let score = minimax(true);
        box.innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Helper: check winner for minimax
function getWinner() {
  for (let pattern of winpattern) {
    let a = boxes[pattern[0]].innerText;
    let b = boxes[pattern[1]].innerText;
    let c = boxes[pattern[2]].innerText;
    if (a !== "" && a === b && b === c) return a;
  }
  let openSpots = Array.from(boxes).some(box => box.innerText === "");
  if (!openSpots) return "draw";
  return null;
}

newgamebtn.addEventListener("click", resetgame);
resetbtn.addEventListener("click", resetgame);
