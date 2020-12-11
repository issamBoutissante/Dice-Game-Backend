const onHoldPoints = (socket, io) => {
  socket.on("Hold", ({ roomId, score }) => {
    console.log("dice Holded and the score is " + score);
    io.to(roomId).emit("ScoreHolded", { score });
  });
};
module.exports = { onHoldPoints };
