const {
  startNewGame,
  joinGame,
  removeGame,
  getGame,
} = require("../GameMethods");
const onJoinGame = (socket, io) => {
  socket.on("joinGame", ({ name, roomId }, callback) => {
    console.log(`${name} asked for join [Server]`);
    const Game = getGame({ roomId });
    if (Game) {
      socket.join(roomId);
      socket.on("joinAndStartGame", ({ confirmPassword }) => {
        //this confirmPassword for security reason
        if (confirmPassword != Game.confirmPassword) return;
        socket.join(roomId);
        Game.friendName = name;
        io.to(roomId).emit("GameStarted", {
          hosterName: Game.hosterName,
          friendName: name,
        });
      });
      socket.to(roomId).emit("joinRequest", { name, nameId: socket.id });
    } else {
      callback({ error: "this id is not exist" });
    }
  });
};
module.exports = { onJoinGame };
