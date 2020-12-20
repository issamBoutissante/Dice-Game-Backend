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
const { onHoldPoints } = require("./HelperMethods/onHoldPoints");
const { onGameOver } = require("./HelperMethods/onGameOver");
const { onSendMessage } = require("./HelperMethods/onSendMessage");
const { onPlayAgain } = require("./HelperMethods/onPlayAgain");
//here i manage the first join of players
io.on("connection", (socket) => {
  console.log(`${socket.id} has been connected`);
  //whene a player start a game
  onStartNewGame(socket, io);
  //whene a player join an opened game
  onJoinGame(socket, io);
  //whene a player Roll dice
  onRollDice(socket, io);
  //whene a player Hold score points
  onHoldPoints(socket, io);
  //whene game is over
  onGameOver(socket, io);
  //this event will run whene a player send new message
  onSendMessage(socket, io);
  //this event will restart the game
  onPlayAgain(socket, io);
});

//whene a player click a dice i generate a random number and
server.listen("5000", () => {
  console.log("the server started listening");
});
