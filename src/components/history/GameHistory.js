import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function GameHistory() {
    const [games, setGames] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3005/all/game');
            console.log("API Response:", response.data); // Log the response for debugging
            if (response.data.status === 1) {
                setGames(response.data.games || []); // Use fallback to ensure it's an array
            } else {
                toast.error('No games found');
            }  
        } catch (error) {
            console.error('Error fetching games:', error);
            toast.error('Failed to fetch game history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const remove = async (gameId) => {
        try {
            const res = await axios.delete(`http://localhost:3005/delete/game/${gameId}`);
            if (res.data.status === 1) {
                toast.success(res.data.message);
                fetchGames();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error('Error deleting game:', error);
            toast.error('Failed to delete game');
        }
    };

    return (
        <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Game History</h2>
            {loading ? (
                <div className="text-white text-lg text-center">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 border-b">Player 1</th>
                                <th className="py-2 px-4 border-b">Score</th>
                                <th className="py-2 px-4 border-b">Player 2</th>
                                <th className="py-2 px-4 border-b">Score</th>
                                <th className="py-2 px-4 border-b">Result</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.length > 0 ? (
                                games.map((game) => (
                                    <tr key={game.id} className="hover:bg-gray-100 text-center">
                                        <td className="py-2 px-4 border-b">{game.player1}</td>
                                        <td className="py-2 px-4 border-b">{game.score1}</td>
                                        <td className="py-2 px-4 border-b">{game.player2}</td>
                                        <td className="py-2 px-4 border-b">{game.score2}</td>
                                        <td className="py-2 px-4 border-b">
                                            {game.score1 > game.score2
                                                ? `${game.player1} wins!`
                                                : game.score1 < game.score2
                                                ? `${game.player2} wins!`
                                                : 'The game is a tie!'}
                                        </td>
                                        <td className="py-2 px-4 border-b" onClick={() => remove(game.id)}>
                                            <i className="fa fa-times text-red-500" aria-hidden="true"></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No games found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => navigate('/')}
                    className="bg-yellow-500 text-white p-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
}

export default GameHistory;
