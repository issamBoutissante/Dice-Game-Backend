const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { emit } = require("process");
const { startNewGame, joinGame, removeGame } = require("./GameMethods");

//here i manage the first join of players
io.on("connection", (socket) => {
  console.log(`${socket.id} has been connected`);
  //when a player start a game
  socket.on("startNewGame", ({ hosterName }, callback) => {
    let { roomId } = startNewGame({ hosterName });
    socket.join(roomId);
    callback({ roomId });
  });
  //when a player join an opened game
  socket.on("joinGame", ({ friendName, roomId }) => {
    io.to(roomId).emit("joinRequest", { friendName });
    io.on("requestAccepted", (socket, callback) => {
      console.log(`friend name: ${friendName}`);
      let { game, error } = joinGame({ friendName, roomId });
      if (error) return callback({ error });
      io.join(game.roomId);
      let { hosterName } = game;
      io.to(roomId).emit("GameStarted", { hosterName, friendName, roomId });
      return callback({
        message: `${game.hosterName} accepted you on the game`,
      });
    });
    io.on("requestDenied", (socket, callback) => {
      callback({ error: "rquest denied" });
    });
  });
});
//whene a player click a dice i generate a random number and
//sent it to both players
io.on("RollDice", ({ roomId }) => {
  let gessedNum = Math.floor(Math.random() * 6 + 1);
  io.to(roomId).emit("RollDiceDone", { gessedNum });
});
//whene a player hold his point in a score
io.on("hover", ({ roomId }) => {
  io.to(roomId).emit("hoverDone");
});

io.on("GameOver", ({ roomId }) => {
  io.to(roomId).emit("GameOverDone");
});

server.listen("5000", () => {
  console.log("the server started listening");
});
