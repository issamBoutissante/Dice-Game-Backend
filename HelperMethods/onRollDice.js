const onRollDice = (socket, io) => {
  socket.on("RollDice", ({ roomId }) => {
    console.log(roomId);
    let ranNum = Math.floor(Math.random() * 6 + 1);
    console.log(ranNum);
    io.to(roomId).emit("DiceRolled", { ranNum });
  });
};

module.exports = { onRollDice };
