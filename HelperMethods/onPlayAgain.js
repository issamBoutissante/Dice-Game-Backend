const onPlayAgain = (socket, io) => {
  socket.on("PlayAgain", ({ RoomId }) => {
    io.to(RoomId).emit("onPlayAgain");
  });
};
module.exports = { onPlayAgain };
