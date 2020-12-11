const onHoldPoints = (socket, io) => {
  socket.on("Hold", ({ roomId, score }) => {
    console.log("dice Holded");
    io.to(roomId).emit("ScoreHolded", { score });
  });
};
module.exports = { onHoldPoints };
