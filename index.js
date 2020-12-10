const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { onStartNewGame } = require("./HelperMethods/onStartNewGame");
const { onJoinGame } = require("./HelperMethods/onJoinGame");
const { onRollDice } = require("./HelperMethods/onRollDice");
//here i manage the first join of players
io.on("connection", (socket) => {
  console.log(`${socket.id} has been connected`);
  //when a player start a game
  onStartNewGame(socket, io);
  //when a player join an opened game
  onJoinGame(socket, io);
  //when a player Roll dice
  onRollDice(socket, io);
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
