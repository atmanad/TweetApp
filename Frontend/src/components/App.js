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
import Home from './Home';
import Profile from './Profile';
import { authActions } from '../store/auth-slice';


function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const tweetList = useSelector(state => state.tweet.tweetList);
  const { decodedToken, isExpired } = useJwt(sessionStorage.getItem('token'));
  // console.log(decodedToken);

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
        <Route path='/dashboard' element={<Dashboard loggedIn={isLoggedIn} />} />
        <Route path='/tweet/:id' element={<TweetPage tweetList={tweetList} currentUser={currentUser} />} />
        <Route path='/new' element={<NewTweet loggedIn={isLoggedIn} />} />
        <Route path='/profile/:id' element={<Profile tweetList={tweetList} loggedIn={isLoggedIn} />} />
        <Route path='/login' element={<SignIn loggedIn={isLoggedIn} />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;