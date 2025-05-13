import { useState, useContext } from "react";
import { AppContext } from "../../state/app.context";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import Navbar from "../../NavBar/Navbar";
import "./Login.css";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const login = () => {
    if (!user.email || !user.password) {
      return alert("Please enter an email and password");
    }

    loginUser(user.email, user.password)
      .then((credentials) => {
        setAppState({
          user: credentials.user,
          userData: null,
        });

        navigate(location.state?.from?.pathname ?? "/");
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed. Please check your credentials and try again.");
      });
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  value={user.email}
                  onChange={updateUser("email")}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  value={user.password}
                  onChange={updateUser("password")}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </>
        </div>
      </div>
    </>
  );
}
