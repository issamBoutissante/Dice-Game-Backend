const onRollDice = (socket, io) => {
  socket.on("RollDice", ({ roomId }) => {
    console.log(roomId);
    console.log("Dice Rolled");
    let ranNum = Math.ceil(Math.random() * 6);
    console.log(ranNum);
    io.to(roomId).emit("DiceRolled", { ranNum });
  });
};

module.exports = { onRollDice };
