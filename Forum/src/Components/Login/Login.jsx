import { useState, useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/auth.service';
 
export default function Login() {
 
    const [user, setUser] = useState({
        email: '',
        password: ''
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
                userData: null
            });
    
            navigate(location.state?.from?.pathname ?? '/');
        })
        .catch((error) => {
            console.error(error);
            alert("Login failed. Please check your credentials and try again.");
        });
    };
 
    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value
        });
    }
 
 
    return (
        <div>
            <h2>Login</h2>
            <label htmlFor="email">Email: </label>
            <input value={user.email} onChange={updateUser('email')} type="email" id='email' name='email' />
            <br /> <br />
            <label htmlFor="password">Password: </label>
            <input value={user.password} onChange={updateUser('password')} type="password" id='password' name='password' />
            <br /> <br />
            <button onClick={login}>Login</button>
        </div>
    );
}
 
 