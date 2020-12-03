const express = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { startNewGame, joinGame, removeGame } = require("./GameMethods");

io.on("connection", (socket) => {
  console.log(`${socket.id} has been connected`);
  socket.on("startNewGame", ({ hosterName }, callback) => {
    let { roomId } = startNewGame({ hosterName });
    socket.join(roomId);
    callback({ roomId });
  });
  socket.on("joinGame", ({ friendName, roomId }, callback) => {
    let { game, error } = joinGame({ friendName, roomId });
    if (error) return callback({ error });
    socket.join(game.roomId);
    let { hosterName } = game;
    io.to(roomId).emit("GameStarted", { hosterName, friendName });
  });
});

server.listen("3000", () => {
  console.log("the server started listening");
});
