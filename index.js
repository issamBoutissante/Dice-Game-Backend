const express = require("express")();
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
  socket.on("joinGame", ({ friendName, roomId }, callback) => {
    io.to(roomId).emit("joinRequest", { friendName });
    io.on("requestAccepted", () => {
      let { game, error } = joinGame({ friendName, roomId });
      if (error) return callback({ error });
      socket.join(game.roomId);
      let { hosterName } = game;
      io.to(roomId).emit("GameStarted", { hosterName, friendName, roomId });
    });
    io.on("requestDenied", (socket, callback) => {
      callback();
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

server.listen("3000", () => {
  console.log("the server started listening");
});
