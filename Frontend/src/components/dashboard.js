import React, { useEffect } from 'react';
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import Tweet from './Tweet';
import { loadAllTweet } from '../services/TweetService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { tweetActions } from '../store/tweet-slice';
import Loader from './Loader';


const Dashboard = ({ loggedIn }) => {
    const dispatch = useDispatch();
    const loadTweets = () => {
        dispatch(showLoading());
        loadAllTweet().then(response => {
            dispatch(tweetActions.loadTweets(response));
            dispatch(hideLoading());
        }, error => {
            dispatch(hideLoading());
            console.log(error);
        });
    }


    useEffect(() => {
        loadTweets();// eslint-disable-next-line
    }, []);

    const tweetList = useSelector(state => state.tweet.tweetList);

    if (tweetList === undefined || tweetList.length === 0) {
        return <Loader />;
    }

    return (
        tweetList.length !== 0 &&
        (
            <div>
                <ul className='dashboard-list mt-5 pb-5 mb-5'>
                    {tweetList?.map((tweet) => (
                        <li key={tweet?.id}>
                            <Tweet t={tweet} reply={false} loggedIn={loggedIn} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    )

}

export default Dashboard;