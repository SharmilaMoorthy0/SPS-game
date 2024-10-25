import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resolveValue } from 'react-hot-toast/headless';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [player1Choice, setPlayer1Choice] = useState('stone');
    const [player2Choice, setPlayer2Choice] = useState('stone');
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [result, setResult] = useState('');
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    const choices = ['stone', 'paper', 'scissors'];

    const playGame = () => {
        if (rounds < 6) {
            let roundResult = '';
    
            // Determine the round result
            if (player1Choice === player2Choice) {
                roundResult = "It's a tie!";
            } else if (
                (player1Choice === 'stone' && player2Choice === 'scissors') ||
                (player1Choice === 'scissors' && player2Choice === 'paper') ||
                (player1Choice === 'paper' && player2Choice === 'stone')
            ) {
                roundResult = `${player1} wins this round!`;
                setScore1(prev => prev + 1); // Update Player 1's score
            } else {
                roundResult = `${player2} wins this round!`;
                setScore2(prev => prev + 1); // Update Player 2's score
            }
    
            setRounds(prev => prev + 1); // Increment the round count
            setResult(roundResult); // Set the current round result
    
            // Check if maximum rounds are reached
            if (rounds  === 6) {
                const finalResult = score1 > score2
                    ? `${player1} wins the game!`
                    : score1 < score2
                        ? `${player2} wins the game!`
                        : "The game is a tie!"; // Handle tie scenario
    
                // Save the final score and result for history
                saveGame({ player1, player2, score1: score1 + (roundResult.includes(player1) ? 1 : 0), score2: score2 + (roundResult.includes(player2) ? 1 : 0), rounds: 6 });
                setResult(prev => `${prev}\n${finalResult}`);
            }
        } else {
            toast.error("Maximum rounds reached!");
        }
    };
    

    const saveGame = async (gameData) => {
         axios.post('https://sps-backend-er38.onrender.com/new/game', gameData).then((response)=>{
            if (response.data.status === 1) {
              toast.success(response.data.message);
              fetchGames();
          } if(response.data.status===0) {
              toast.error(response.data.message);
          }
           }).catch((err)=>{console.log(err)})
           
        
    };

    const fetchGames = () => {
        axios.get('https://sps-backend-er38.onrender.com/all/game').then((response)=>{
              if (response.data.status === 1) {
                setGames(response.data.response);
              }
             }).catch((err)=>{console.log(err)})
            
          }   

    useEffect(() => {
        fetchGames();
    }, []);

    const resetGame = () => {
        setPlayer1('');
        setPlayer2('');
        setPlayer1Choice('stone');
        setPlayer2Choice('stone');
        setScore1(0);
        setScore2(0);
        setRounds(0);
        setResult('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">Stone Paper Scissors</h1>
            <div className="mb-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Player 1 Name"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <select
                    onChange={(e) => setPlayer1Choice(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
                </select>
            </div>
            <div className="mb-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Player 2 Name"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <select
                    onChange={(e) => setPlayer2Choice(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    {choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
                </select>
            </div>
            <button
                onClick={()=>playgame()}
                className="bg-yellow-500 text-white p-4 rounded hover:bg-yellow-600 w-full max-w-sm mb-4"
                disabled={!player1 || !player2}
            >
                Play Round
            </button>
            <div className="mt-4 bg-white p-4 rounded shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold">Score</h3>
                <table className="min-w-full">
                    <tbody>
                        <tr>
                            <td className="py-2 px-4 border-b text-blue-600 font-bold">{player1}</td>
                            <td className="py-2 px-4 border-b text-blue-600 font-bold">{score1}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b text-red-600 font-bold">{player2}</td>
                            <td className="py-2 px-4 border-b text-red-600 font-bold">{score2}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-white">{result}</div>
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
