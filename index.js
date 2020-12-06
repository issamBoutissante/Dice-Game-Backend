const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { emit } = require("process");
const {
  startNewGame,
  joinGame,
  removeGame,
  getGame,
} = require("./GameMethods");

//here i manage the first join of players
io.on("connection", (socket) => {
  console.log(`${socket.id} has been connected`);
  //when a player start a game
  socket.on("startNewGame", ({ name }, callback) => {
    let hosterID = socket.id;
    let { roomId } = startNewGame({ name, hosterID });
    socket.join(roomId);
    callback({ roomId });
  });
  //when a player join an opened game
  socket.on("joinGame", ({ name, roomId }, callback) => {
    console.log(`${name} asked for join [Server]`);
    if (getGame({ roomId })) {
      console.log(`${name} want to join game`);

      io.in(roomId).on("requestAnswer", ({ isAccepted }) => {
        console.log("reuest answerd");
        if (isAccepted) {
          let { game, error } = joinGame({ name, roomId });
          if (error) {
            socket.leave(roomId);
            return callback({ error });
          }
          socket.join(game.roomId);
          game.friendName = name;
          let { hosterName, friendName } = game;
          console.log("the GameSateted has been emited");
          io.to(roomId).emit("GameStarted", { hosterName, friendName });
        } else {
          socket.leave(roomId);
          callback({ error: "the hoster of this game rejected you " });
        }
      });
      io.to(roomId).emit("joinRequest", { name });
    } else {
      callback({ error: "this id is not exist" });
    }
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
