import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { useJwt } from "react-jwt";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Dashboard from './dashboard';
import LoadingBar from 'react-redux-loading-bar'
import NewTweet from './NewTweet'
import TweetPage from './TweetPage'
import Navigationbar from './Navbar';
import Register from './Register';
import SignIn from './SignIn';
import Profile from './Profile';
import { authActions } from '../store/auth-slice';
import BottomBar from './BottomBar';


function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const tweetList = useSelector(state => state.tweet.tweetList);
  const { decodedToken, isExpired } = useJwt(sessionStorage.getItem('token') || "");

  useEffect(() => {
    if (decodedToken !== null && decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(authActions.logout());
    }
  }, [decodedToken]);


  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return (
    <Router>
      <LoadingBar />
      <Navigationbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard" />} />
        <Route path='/dashboard' element={<Dashboard loggedIn={isLoggedIn} />} />
        <Route path='/tweet/:id' element={<TweetPage tweetList={tweetList} currentUser={currentUser} loggedIn={isLoggedIn} />} />
        <Route path='/new' element={<NewTweet loggedIn={isLoggedIn} />} />
        <Route path='/profile/:id' element={<Profile tweetList={tweetList} loggedIn={isLoggedIn} />} />
        <Route path='/login' element={<SignIn loggedIn={isLoggedIn} />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/login"  />} />
      </Routes>
      <BottomBar />
    </Router>
  );
}

export default App;