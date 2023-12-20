import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Tweet from './Tweet'
import { postAComment } from '../services/TweetService';
import { useDispatch, useSelector } from 'react-redux';
import { tweetActions } from '../store/tweet-slice';
import Loader from './Loader';


const TweetPage = ({tweetList,currentUser }) => {
    const [tweet, setTweet] = useState("");
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const tweetById = tweetList.filter(ele => ele.id == id)[0];
        setTweet(tweetById)
        setLoading(false);
    }, [tweetList]);

    // console.log(tweet);

    return (
        <>
            {loading ? <Loader /> : <TweetReply tweet={tweet} id={id} email={currentUser.email} tweetList={tweetList} setTweet={setTweet} />}
        </>
    )
}


function TweetReply({ tweet, id, email, tweetList, setTweet }) {
    const [reply, setReply] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(reply);
        let newReply = {
            tweetId: id,
            userId: email,
            message: reply
        }
        let newTweet = {
            replies:[newReply]
        }

        postAComment(reply, email, id).then((res) => {
            if (res) {
                tweetList.forEach((element, index) => {
                    if (element.id == id) {
                        dispatch(tweetActions.addReply({
                            index: index,
                            reply: newReply
                        }));
                        setReply("");
                        setTweet(tweet =>({
                            ...tweet,
                            newTweet
                        }));
                    }
                });
                //navigate('/dashboard');

            }
        }, error => console.log(error));
    }

    return (
        <div className='mt-5'>
            <Tweet t={tweet} reply={true} />
            <div>
                <h4 className='center mt-5'>Add a reply</h4>
                <form className='new-tweet' onSubmit={handleSubmit}>
                    <input name='message' className='form-control mb-2' maxLength={144} value={reply} placeholder='Reply...' onChange={(e) => setReply(e.target.value)} />
                    <button className='btn btn-primary' type='submit' disabled={reply == ""}>Submit</button>
                </form>
            </div>
            {/* <NewTweet id={id} /> */}
            {tweet?.replies.length !== 0 && <h4 className='center mt-5'>Replies</h4>}
            <ul>
                {tweet?.replies.map((reply) => (
                    <li key={Math.random()}>
                        <div className='tweet'>
                            <div className='tweet-info'>
                                <div>
                                    <span>{reply.userId}</span>
                                    {/* <div>{datePosted && formatDate(datePosted)}</div> */}
                                    <p>{reply.message}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default TweetPage