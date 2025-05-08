import { AppContext } from "../state/app.context";
import { useContext , useLocation} from "react";
import PropTypes from 'prop-types'

export default function Authenticated({ children }) {
    const { user } = useContext(AppContext);
    const location = useLocation();
 
    if (!user) {
        return <Navigate replace to="/login" state={{ from: location }} />;
    }
 
    return (
        <div>
            {children}
        </div>
    )
}
 
Authenticated.propTypes = {
    children: PropTypes.any,
};