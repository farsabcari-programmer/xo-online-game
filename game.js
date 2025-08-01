// game.js
const params = new URLSearchParams(window.location.search);
const room = params.get("room");
const name = params.get("name");

const roomRef = db.ref("rooms/" + room);
const boardDiv = document.getElementById("board");
const status = document.getElementById("status");

let symbol = null;

roomRef.child("players").on("value", snapshot => {
  const players = snapshot.val();
  if (!players.player2) {
    status.textContent = "في انتظار اللاعب الثاني...";
  } else {
    if (players.player1 === name) symbol = "X";
    else if (players.player2 === name) symbol = "O";

    status.textContent = "دور اللاعب " + symbol;
    initGame();
  }
});

function initGame() {
  boardDiv.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = () => makeMove(i);
    boardDiv.appendChild(cell);
  }

  roomRef.child("board").on("value", snapshot => {
    const board = snapshot.val();
    document.querySelectorAll(".cell").forEach((cell, i) => {
      cell.textContent = board[i];
    });
  });

  roomRef.child("turn").on("value", snapshot => {
    const turn = snapshot.val();
    if (turn === symbol) {
      status.textContent = "دورك!";
    } else {
      status.textContent = "انتظار الخصم...";
    }
  });
}

function makeMove(index) {
  roomRef.once("value", snapshot => {
    const data = snapshot.val();
    if (data.turn !== symbol || data.board[index] !== "") return;

    data.board[index] = symbol;
    roomRef.update({
      board: data.board,
      turn: symbol === "X" ? "O" : "X"
    });
  });
}
