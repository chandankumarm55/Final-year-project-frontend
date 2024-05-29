import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Chat from './Pages/Chat';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { host } from './utils/Constant';
import { setSocekt } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';

function App() {
  const disptach = useDispatch()
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);

  useEffect(() => {
    if (authUser) {
      const socket = io(host, {
        query: {
          userId: authUser?._id
        }
      });
      disptach(setSocekt(socket))
      socket.on('getOnlineUsers', (onlineUsers) => {
        disptach(setOnlineUsers(onlineUsers))
      }
      )
      return () => socket.close()
    } else {
      if (socket) {
        socket.close();
        disptach(setSocekt(null))
      }
    }
  }, [authUser]);

  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Chat /> } />
          <Route path='/register' element={ <Register /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/profile/:id' element={ <Profile /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
