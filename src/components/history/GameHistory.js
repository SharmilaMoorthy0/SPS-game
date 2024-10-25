import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function GameHistory() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://sps-backend-er38.onrender.com/all/game');
            if (response.data.status === 1) {
                setGames(response.data.response);
            }  
          
        } catch (error) {
            console.error('Error fetching games:', error);
            toast.error('Failed to fetch game history');
        } finally {
            setLoading(false);
        }}

    useEffect(() => {
        fetchGames();
    }, []);
    const remove = (list) => {
        axios.delete(`https://sps-backend-er38.onrender.com/delete/game/${list._id}`,).then((res) => {
            if (res.data.status === 1) {
                toast.success(res.data.message)
                fetchGames()
            }
            if (res.data.status === 0) {
                toast.success(res.data.message)
            }

        })
    }
    return (
        <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Game History</h2>
            {loading ? (
                <div className="text-white text-lg text-center">Loading...</div>
            ) : games.length > 0 ? (
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
                            {games.map((list, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-center">
                                    <td className="py-2 px-4 border-b">{list.player1}</td>
                                    <td className="py-2 px-4 border-b">{list.score1}</td>
                                    <td className="py-2 px-4 border-b">{list.player2}</td>

                                    <td className="py-2 px-4 border-b">{list.score2}</td>
                                    <td className="py-2 px-4 border-b">
                                        {list.score1 > list.score2 ? `${list.player1} wins!` : list.score1 < list.score2 ? `${list.player2} wins!` :"The game is a tie!" }
                                    </td>
                                    <td className="py-2 px-4 border-b" onClick={() => remove(list)}><i class="fa fa-times text-red-500" aria-hidden="true"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-white text-lg text-center">No games found.</p>
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
