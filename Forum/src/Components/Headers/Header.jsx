import { NavLink  } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
function Header() {

    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = () => {
        logoutUser()
            .then(() => {
                setAppState({
                    user: null,
                    userData: null
                });
                navigate('/login');
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }
    return (
        <header>
            <nav>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/register'>Register</NavLink>
            </nav>
            {user && <button onClick={logout}>Logout</button>}
            {userData && <span>Welcome, {userData.handle}</span>}
        </header>
    )
}

export default Header;
