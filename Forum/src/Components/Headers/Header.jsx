// import { NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AppContext } from "../../state/app.context";
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from "../../config/firebase-config";
// import { useEffect } from "react";
// import { logoutUser } from "../../services/auth.service";
// function Header() {

//     const { user, userData, setAppState } = useContext(AppContext);
//     const navigate = useNavigate();

//     const logout = () => {
//         logoutUser()
//             .then(() => {
//                 setAppState({
//                     user: null,
//                     userData: null
//                 });
//                 navigate('/');
//             })
//             .catch((error) => {
//                 console.error("Logout failed:", error);
//             });
//     }

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setAppState(prev => ({ ...prev, user: currentUser }));
//         });
//         return () => unsubscribe();
//     }, []);


//     return (
//         <header>
//             <nav>
//                 {!user && (
//                     <>
//                         <NavLink to='/login'>Login</NavLink>
//                         <NavLink to='/register'>Register</NavLink>
//                     </>
//                 )}
//             </nav>

//             {user && (
//                 <>
//                     <button onClick={logout}>Logout</button>
//                     {userData && <span>Welcome, {userData.handle}</span>}
//                 </>
//             )}
//         </header>

//     )
// }

// export default Header;
