import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config";
import { getUserData } from "./services/users.service";
import Authenticated from "./hoc/Authenticated";
import { useEffect, useState } from "react";
import { AppContext } from "./state/app.context";
import Header from "./Components/Headers/Header";
import Home from "./views/Home/Home";
function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    setAppState(prev => ({
      ...prev,
      user
    }));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    getUserData(user.uid)
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          console.warn("No user data returned");
          return;
        }

        const userData = data[Object.keys(data)[0]];
        setAppState((prev) => ({
          ...prev,
          userData,
        }));
      })
      .catch((error) => {
        console.error(error);
        alert("Error fetching user data.");
      });
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
