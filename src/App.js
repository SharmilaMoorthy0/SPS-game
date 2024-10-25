
import './App.css';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import Home from './components/Home/Home';
import { Toaster } from 'react-hot-toast';
import GameHistory from './components/history/GameHistory';

function App() {
  const toastoption={
    // Define default options
    className: '',
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    },
  
    // Default options for specific types
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/game/history" element={<GameHistory/>}/>
    </Routes>
    <Toaster  position='top-center' toastOptions={toastoption}/>
    </BrowserRouter>
  );
}

export default App;
