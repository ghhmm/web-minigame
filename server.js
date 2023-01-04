import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame();
game.start(2000)

game.subscribe((command) => {
    console.log(`Emititing ${command.type}, id: ${command.playerId}`)
    sockets.emit(command.type, command)
})

console.log(game.state);

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`>> Player connected on Server with ID: ${playerId}`)
    
    game.addPlayer({playerId: playerId});

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId: playerId})
        console.log(`Player disconnected, id: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log(`>> Server listening on port: 3000`)
})