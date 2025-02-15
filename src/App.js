
import './App.css';
import { useInfoContext } from './context/Context';
import Auth from './pages/Auth/Auth';
import Chat from './pages/Chat/Chat';


import { ToastContainer, toast } from 'react-toastify';

function App() {

  const {currentUser} = useInfoContext()
  
  return (
    <div className="App">
      {currentUser ? <Chat /> : <Auth />}

      <ToastContainer />
    </div>
  );
}

export default App;
