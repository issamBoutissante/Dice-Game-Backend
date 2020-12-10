const {
  startNewGame,
  joinGame,
  removeGame,
  getGame,
} = require("../GameMethods");
const onStartNewGame = (socket, io) => {
  socket.on("startNewGame", ({ name }, callback) => {
    let hosterID = socket.id;
    let { roomId } = startNewGame({ name, hosterID });
    socket.join(roomId);
    socket.on("requestAnswer", ({ isAccepted, name, nameId }) => {
      console.log("reuest answerd");
      if (isAccepted) {
        let { game, error } = joinGame({ name, roomId });
        if (error) {
          //new Idea
          socket.to(nameId).emit("requestError", { error });
          //return callback({ error });
        }
        game.confirmPassword = Math.random();
        io.to(nameId).emit("requestAccepted", {
          confirmPassword: game.confirmPassword,
        });
      } else {
        socket.to(nameId).emit("requestError", {
          error: "the hoster of this game rejected you",
        });
        //callback({ error: " " });
      }
    });
    callback({ roomId });
  });
};
module.exports = { onStartNewGame };
