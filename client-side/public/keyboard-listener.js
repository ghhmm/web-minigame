export default function createKeyboardListener(document) {
    const state = {
        observers: [],
        player: 'player1' 
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction);
    }

    function notifyAll(command){
        for (const observerFunction of state.observers){
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event){
        const keyPressed = event.key;
        const player = 'player1'

        const command = {
            playerId: state.player,
            keyPressed
        }

        notifyAll(command);
    }

    return {
        subscribe
    }
}