import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/UserService'
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/auth-slice';


function Navigationbar() {
    const currentUser = useSelector(state => state.user.currentUser);
    const loggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <>
            <Navbar bg="light" expand="md">
                <Container>
                    <Navbar.Brand style={{ fontWeight: "bold" }}>Tweet App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-center'>
                        <Nav>
                            {loggedIn ? <LoggedIn currentUser={currentUser} /> : <LoggedOut />}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Navigationbar

function LoggedIn({ currentUser }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = () => {
        logout();
        dispatch(authActions.logout());
        navigate('/login');
    }
    return (
        <>
            <NavLink to='/dashboard'>
                Dashboard
            </NavLink>
            <NavLink to='/new'>
                New Tweet
            </NavLink>
            <NavLink to={`/profile/${currentUser.email}`}>
                <span>{currentUser.firstName}.{currentUser.lastName}</span>
            </NavLink>
            <button onClick={handleClick} className="log-btn">Log out</button>
        </>
    )
}
function LoggedOut() {
    return (
        <>
            <NavLink to='/login' style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                Login
            </NavLink>
            <NavLink to='/register' style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                Register
            </NavLink>
        </>
    )

}