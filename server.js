import express from 'express'
import http from 'http'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

const game = createGame();
game.addFruit({fruitId: 'fruit1', fruitX: 2, fruitY: 2})
game.addFruit({fruitId: 'fruit2', fruitX: 3, fruitY: 5})
game.addPlayer({playerId: 'player1', playerX: 1, playerY: 4})
game.addPlayer({playerId: 'player2', playerX: 6, playerY: 9})

console.log(game.state);

server.listen(3000, () => {
    console.log(`>> Server listening on port: 3000`)
})