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
import Home from "./views/Home/Home";
import { Admin } from './Admin/Admin';
import { getAdminData } from "./Admin/Admins";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
  
    setAppState((prev) => ({
      ...prev,
      user, 
    }));
  
    getUserData(user.uid)
      .then(async (data) => {
        if (!data || Object.keys(data).length === 0) {
          console.log("No user data returned");
          return;
        }
  
        const userData = data[Object.keys(data)[0]];
        const adminData = await getAdminData(user.uid);
  
        const isAdmin = adminData ? adminData.isAdmin : false;
  
        setAppState((prev) => ({
          ...prev,
          userData: {
            ...userData,
            isAdmin,
            adminDetails: adminData,
          },
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
      <AppContext.Provider value={{ user: appState.user, userData: appState.userData, setAppState }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/admin' element={<Authenticated><Admin /></Authenticated>} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
