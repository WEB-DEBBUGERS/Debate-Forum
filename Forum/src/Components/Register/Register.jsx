import { useState, useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth.service';
import { createUserHandle , getUserByHandle } from '../../services/users.service';
 
export default function Register() {
 
    const [user, setUser] = useState({
        handle: '',
        email: '',
        password: ''
    });
 
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();
 
    const register = () => {
        if (!user.email || !user.password || !user.handle) {
            return alert("Please enter valid credentials.");
        }
 
 
        getUserByHandle(user.handle)
        .then(userData => {
            if (userData) {
                throw new Error("Handle already exists. Please choose a different handle.");
            }
            return registerUser(user.email, user.password);
        })
        .then(credentials => {
            return createUserHandle(user.handle, credentials.user.uid, user.email)
            .then(() => {
                setAppState({
                    user: credentials.user,
                    userData: null
                });
        
                navigate('/');
            })
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
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
            <h2>Register</h2>
            <label htmlFor="handle">Handle: </label>
            <input value={user.handle} onChange={updateUser('handle')} type="text" id='handle' name='handle' />
            <br /> <br />
            <label htmlFor="email">Email: </label>
            <input value={user.email} onChange={updateUser('email')} type="email" id='email' name='email' />
            <br /> <br />
            <label htmlFor="password">Password: </label>
            <input value={user.password} onChange={updateUser('password')} type="password" id='password' name='password' />
            <br /> <br />
            <button onClick={register}>Register</button>
        </div>
    );
}
 