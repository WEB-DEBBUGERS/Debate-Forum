import { useState, useContext } from "react";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import {
  createUserHandle,
  getUserByHandle,
} from "../../services/users.service";
import Navbar from "../../NavBar/Navbar";

import "./Register.css";

export default function Register() {
  const [user, setUser] = useState({
    handle: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = () => {
    if (
      !user.email ||
      !user.password ||
      !user.handle ||
      !user.firstName ||
      !user.lastName
    ) {
      return alert("Please enter all required fields.");
    }

    getUserByHandle(user.handle)
      .then((userData) => {
        if (userData) {
          throw new Error(
            "Handle already exists. Please choose a different handle."
          );
        }
        return registerUser(user.email, user.password);
      })
      .then((credentials) => {
        return createUserHandle(
          user.handle,
          credentials.user.uid,
          user.email,
          user.firstName,
          user.lastName
        ).then(() => {
          setAppState({
            user: credentials.user,
            userData: null,
            firstName: user.firstName,
            lastName: user.lastName,
          });

          navigate("/");
        });
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="register-wrapper">
        <div className="register-box">
          <h2 className="register-title">Register</h2>

          <div className="form-group">
            <label htmlFor="handle">Username</label>
            <input
              value={user.handle}
              onChange={updateUser("handle")}
              type="text"
              id="handle"
              name="handle"
              placeholder="Choose a unique handle"
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              value={user.firstName}
              onChange={updateUser("firstName")}
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              value={user.lastName}
              onChange={updateUser("lastName")}
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
            />
          </div>

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
              placeholder="Create a strong password"
            />
          </div>

          <button onClick={register} className="register-btn">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
