export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 20,
            height: 20
        }
    }
    
    const observers = []

    function start(time){
        setInterval(addFruit, time)
    }

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }

    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command);
        }
    }

    function setState(newState){
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);
        const score = 0;

        state.players[playerId] = {
            playerId,
            x: playerX,
            y: playerY,
            score,
            nick: playerId,
            color: ''
        };

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function getScore(playerId){
        state.players[playerId].score+=1;
    }

    function removePlayer(command) {
        const playerId = command.playerId;
        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId: playerId,
        })
    }

    function updateState(time){
        setInterval(() => {
            notifyAll({type: 'update-state', state: state})
        }, time)
    } 

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 999999999)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId;
        delete state.fruits[fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId,
        })
    }

    function addNickname(playerId, nickName) {
        state.players[playerId].nick = nickName;
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player){
                if (player.y-1 >= 0)
                player.y-=1
                else player.y = 19;
            },
            ArrowDown(player){
                if (player.y+1 < state.screen.height)
                player.y+=1
                else player.y = 0;
            },
            ArrowLeft(player){
                if (player.x-1 >= 0)
                player.x-=1
                else player.x = 19
            },
            ArrowRight(player){
                if (player.x+1 < state.screen.width)
                player.x+=1
                else player.x = 0
            },
        }

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];
        if (command.cheat === 1) {
            for (let i=0; i < 4; i++){
                if (moveFunction && player){
                    moveFunction(player);
                    checkFruitCollision(playerId);
                }
            }
        }else {
            if (moveFunction && player){
                moveFunction(player);
                checkFruitCollision(playerId);
            }
        }
        
    }

    function checkFruitCollision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            if (player.x === fruit.x && player.y === fruit.y){
                getScore(playerId)
                removeFruit({fruitId});
                return
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        setState,
        subscribe,
        start,
        addNickname,
        updateState,
        state,
    }
}