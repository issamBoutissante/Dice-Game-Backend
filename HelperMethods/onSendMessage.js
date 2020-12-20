const onSendMessage = (socket, io) => {
  socket.on("SendMessage", ({ RoomId, message }) => {
    io.to(RoomId).emit("NewMessage", { message });
  });
};
module.exports = { onSendMessage };
