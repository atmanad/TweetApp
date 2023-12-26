import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/UserService'
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/auth-slice';
import { FaHome } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { LuPlusSquare } from "react-icons/lu";
import { MdLogout } from "react-icons/md";

const BottomBar = () => {
    const loggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <div className="bottom-bar">
            {loggedIn ? <LoggedIn /> : <LoggedOut />}
        </div>
    )
}

export default BottomBar;

function LoggedIn() {
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = () => {
        logout();
        dispatch(authActions.logout());
        navigate('/login');
        console.log('logging out');
    }

    return (
        <>
            <Link to='/dashboard' className="bottom-bar_icon home_icon"><FaHome /></Link>
            <Link to='/new' className="bottom-bar_icon plus_icon"><LuPlusSquare /></Link>
            <Link to={`/profile/${currentUser.email}`} className="bottom-bar_icon user_icon"><FaRegUser /></Link>
            {/* <a> */}
                <button onClick={handleClick} className="bottom-bar_logout"><MdLogout /></button>
            {/* </a> */}
        </>
    )
}

function LoggedOut() {
    return (
        <>
            <Link to='/login' className="bottom-bar_icon home_icon">Login</Link>
            <Link to='/register' className="bottom-bar_icon plus_icon">Register</Link>
        </>
    )
}