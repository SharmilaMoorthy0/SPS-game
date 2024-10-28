import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Initial state
const initialState = {
    player1: '',
    player2: '',
    player1Choice: 'stone',
    player2Choice: 'stone',
    score1: 0,
    score2: 0,
    rounds: 0,
    result: '',
    games: [],
};

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PLAYER_1':
            return { ...state, player1: action.payload };
        case 'SET_PLAYER_2':
            return { ...state, player2: action.payload };
        case 'SET_PLAYER_1_CHOICE':
            return { ...state, player1Choice: action.payload };
        case 'SET_PLAYER_2_CHOICE':
            return { ...state, player2Choice: action.payload };
        case 'INCREMENT_ROUNDS':
            return { ...state, rounds: state.rounds + 1 };
        case 'UPDATE_SCORE':
            return { 
                ...state, 
                score1: action.payload.score1, 
                score2: action.payload.score2 
            };
        case 'SET_RESULT':
            return { ...state, result: action.payload };
        case 'RESET':
            return initialState;
        case 'SET_GAMES':
            return { ...state, games: action.payload };
        default:
            return state;
    }
};

function Home() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const choices = ['stone', 'paper', 'scissors'];

    const playGame = () => {
        if (state.rounds < 6) {
            let roundResult = '';

            if (state.player1Choice === state.player2Choice) {
                roundResult = "It's a tie!";
            } else if (
                (state.player1Choice === 'stone' && state.player2Choice === 'scissors') ||
                (state.player1Choice === 'scissors' && state.player2Choice === 'paper') ||
                (state.player1Choice === 'paper' && state.player2Choice === 'stone')
            ) {
                roundResult = `${state.player1} wins this round!`;
                dispatch({ type: 'UPDATE_SCORE', payload: { score1: state.score1 + 1, score2: state.score2 } });
            } else {
                roundResult = `${state.player2} wins this round!`;
                dispatch({ type: 'UPDATE_SCORE', payload: { score1: state.score1, score2: state.score2 + 1 } });
            }

            dispatch({ type: 'INCREMENT_ROUNDS' });
            dispatch({ type: 'SET_RESULT', payload: roundResult });

            if (state.rounds + 1 === 6) {
                let finalResult;
                if (state.score1 > state.score2) {
                    finalResult = `${state.player1} wins the game!`;
                } else if (state.score1 < state.score2) {
                    finalResult = `${state.player2} wins the game!`;
                } else {
                    finalResult = "The game is a tie!";
                }
                dispatch({ type: 'SET_RESULT', payload: `Final Result: ${finalResult}` });
                saveGame({ player1: state.player1, player2: state.player2, score1: state.score1, score2: state.score2, rounds: 6 });
            }
        } else {
            toast.error("Maximum rounds reached!");
        }
    };

    const saveGame = async (gameData) => {
        try {
            const response = await axios.post('http://localhost:3005/new/game', gameData);
            if (response.data.status === 1) {
                toast.success(response.data.message);
                fetchGames();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error saving game:', error);
            toast.error('Failed to save game');
        }
    };

    const fetchGames = async () => {
        try {
            const response = await axios.get('http://localhost:3005/all/game');
            if (response.data.status === 1) {
                dispatch({ type: 'SET_GAMES', payload: response.data.games || [] });
            } else {
                console.error('Error fetching games:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            toast.error('Failed to fetch game history');
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const resetGame = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">Stone Paper Scissors</h1>
            <div className="mb-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Player 1 Name"
                    value={state.player1}
                    onChange={(e) => dispatch({ type: 'SET_PLAYER_1', payload: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <select
                    onChange={(e) => dispatch({ type: 'SET_PLAYER_1_CHOICE', payload: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
                </select>
            </div>
            <div className="mb-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Player 2 Name"
                    value={state.player2}
                    onChange={(e) => dispatch({ type: 'SET_PLAYER_2', payload: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <select
                    onChange={(e) => dispatch({ type: 'SET_PLAYER_2_CHOICE', payload: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
                </select>
            </div>
            <button
                onClick={playGame}
                className="bg-yellow-500 text-white p-4 rounded hover:bg-yellow-600 w-full max-w-sm mb-4"
            >
                Play Round
            </button>
            <div className="mt-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold">Score</h3>
                <table className="min-w-full">
                    <tbody>
                        <tr>
                            <td className="py-2 px-4 border-b text-blue-600 font-bold">{state.player1}</td>
                            <td className="py-2 px-4 border-b text-blue-600 font-bold">{state.score1}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b text-red-600 font-bold">{state.player2}</td>
                            <td className="py-2 px-4 border-b text-red-600 font-bold">{state.score2}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-white">{state.result}</div>
            <div className="mt-4 flex flex-col items-center space-y-4 w-full max-w-sm">
                <a 
                    className="text-white underline cursor-pointer hover:text-yellow-300" 
                    onClick={() => navigate('/game/history')}
                >
                    Game History
                </a>
                <button 
                    onClick={resetGame}
                    className="bg-green-500 text-white p-4 rounded hover:bg-green-600 w-full"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
}

export default Home;
