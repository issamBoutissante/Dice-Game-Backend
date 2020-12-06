const idGenerator = require("id-generator");
const generator = new idGenerator();

const games = [];
const startNewGame = ({ name, hosterID }) => {
  let roomId = generator.newId();
  let newGame = {
    roomId,
    hosterName: name,
    hosterID,
    friendName: null,
    PlayersNumber: 1,
  };
  games.push(newGame);
  return newGame;
};
const joinGame = ({ name, roomId }) => {
  let game = games.find((game) => game.roomId == roomId);
  if (game.PlayersNumber === 2)
    return { error: "there is already 2 numbers in this game" };
  game.PlayersNumber++;
  game.friendName = name;
  return { game };
};
const removeGame = ({ roomId }) => {
  let index = games.indexOf((game) => game.roomId == roomId);
  if (index == -1) return { error: "this game doesnt exist" };
  return games.splice(index, 1);
};
const getGame = ({ roomId }) => {
  console.log(games);
  let game = games.find((game) => game.roomId == roomId);
  console.log("the roomId is :" + roomId);
  return game;
};

module.exports = { startNewGame, joinGame, removeGame, getGame };
