import React from 'react';
import { Container, Nav,Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/UserService'
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/auth-slice';


function Navigationbar() {
    const currentUser = useSelector(state => state.user.currentUser);
    const loggedIn = useSelector(state => state.auth.isLoggedIn);
    console.log(currentUser);
    console.log(loggedIn);
    return (
        <>
            <Navbar bg="light" expand="md">
                <Container>
                    <Navbar.Brand href="#" style={{fontWeight:"bold"}}>Tweet App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-center'>
                        <Nav>
                            {loggedIn ? <LoggedIn currentUser={currentUser} /> : <LoggedOut />}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* <div className='nav justify-content-center'>
                <ul>
                    {loggedIn ? <LoggedIn currentUser={currentUser} /> : <LoggedOut />}
                </ul>
            </div> */}
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
        console.log('logging out');
    }
    return (
        <>
            <NavLink to='/dashboard' style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                Dashboard
            </NavLink>
            <NavLink to='/new' style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                New Tweet
            </NavLink>
            <NavLink to={`/profile/${currentUser.email}`} style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}>
                <span>{currentUser.firstName}.{currentUser.lastName}</span>
            </NavLink>
            <a>
                <button onClick={handleClick} className="log-btn">Log out</button>
            </a>
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

{/* <Navbar bg="light" expand="lg">
    <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar> */}