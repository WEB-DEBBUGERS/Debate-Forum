import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import './App.css'
import { BrowserRouter , Route, Routes } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.service';
import Authenticated from './hoc/Authenticated'
import { useEffect, useState } from 'react';
import { AppContext } from './state/app.context';
import Header from './Components/Headers/Header';

function App() {

  const [appState, setAppState] = useState({
    user: null,
    userData: null
  });
 
  const [user, loading, error] = useAuthState(auth);
 
 
  if (appState.user !== user) {
    setAppState({
      ...appState,
      user
    })
  }
 
  useEffect(() => {
    if (!user) return;
 
    getUserData(appState.user.uid)
    .then(data => {
      const userData = data[Object.keys(data)[0]];
      setAppState({
        ...appState,
        userData
      })
    }
    ).catch((error) => {
      console.error(error);
      alert("Error fetching user data.");
      
    })
 
  }, [user]);
 
  if (loading) {
    return <div className="loading">Loading...</div>
  }
 
  if (error) {
    console.error(error);
    return <div className="error">Error: {error.message}</div>
  }
  
  return (
    <BrowserRouter>
    <AppContext.Provider value={{ ...appState, setAppState }}>
      <Header/>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </AppContext.Provider>
    </BrowserRouter>
  )
}

export default App
