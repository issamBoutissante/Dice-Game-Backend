const onHoldPoints = (socket, io) => {
  socket.on("Hold", ({ roomId, score }) => {
    io.to(roomId).emit("ScoreHolded", { score });
  });
};
module.exports = { onHoldPoints };
