import React, { useEffect, useRef } from 'react';
import PhaserGame from './game/PhaserGame';

const App = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = new PhaserGame();
        }
    }, []);

    return <div id="game-container"></div>;
};

export default App;
