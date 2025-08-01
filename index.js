// index.js
function onCreateRoom() {
  const name = document.getElementById("playerName").value.trim();
  const room = document.getElementById("roomCode").value.trim();
  if (!name || !room) return alert("يرجى إدخال الاسم ورمز الغرفة.");

  const roomRef = db.ref("rooms/" + room);
  roomRef.once("value", snapshot => {
    if (snapshot.exists()) {
      alert("رمز الغرفة مستخدم! جرّب رمزًا آخر.");
    } else {
      roomRef.set({
        players: {
          player1: name
        },
        turn: "X",
        board: Array(9).fill("")
      });
      window.location.href = `game.html?room=${room}&name=${name}`;
    }
  });
}

function onJoinRoom() {
  const name = document.getElementById("playerName").value.trim();
  const room = document.getElementById("roomCode").value.trim();
  if (!name || !room) return alert("يرجى إدخال الاسم ورمز الغرفة.");

  const roomRef = db.ref("rooms/" + room);
  roomRef.once("value", snapshot => {
    if (!snapshot.exists()) {
      alert("الغرفة غير موجودة!");
    } else {
      const players = snapshot.val().players || {};
      if (players.player2) {
        alert("الغرفة ممتلئة!");
      } else {
        roomRef.child("players/player2").set(name);
        window.location.href = `game.html?room=${room}&name=${name}`;
      }
    }
  });
}
document.getElementById("create").addEventListener("click", onCreateRoom);
document.getElementById("join").addEventListener("click", onJoinRoom);

