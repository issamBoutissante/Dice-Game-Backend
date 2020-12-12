const onGameOver = (socket, io) => {
  socket.on("GameOver", ({ winner, roomId }) => {
    console.log("Game Over");
    io.emit("GameOvered", { winner });
  });
};
module.exports = { onGameOver };
