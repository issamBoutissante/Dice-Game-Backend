const idGenerator = require("id-generator");
const generator = new idGenerator();

const games = [];
const startNewGame = ({ hosterName }) => {
  let newGame = {
    roomId: generator.newId(),
    hosterName,
    friendName: null,
    PlayersNumber: 1,
  };
  games.push[newGame];
  return newGame;
};
const joinGame = ({ friendName, roomId }) => {
  let game = games.find((game) => (game.roomId = roomId));
  if (!game) return { error: "this is not exist" };
  if (game.PlayersNumber === 2)
    return { error: "there is already 2 numbers in this game" };
  game.PlayersNumber++;
  game.friendName = friendName;
  return { game };
};
const removeGame = ({ roomId }) => {
  let index = games.indexOf((game) => game.roomId == roomId);
  if (index == -1) return { error: "this game doesnt exist" };
  return games.splice(index, 1);
};

module.exports = { startNewGame, joinGame, removeGame };
