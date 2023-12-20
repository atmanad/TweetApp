import React, {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { CreateTweet } from '../services/TweetService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const NewTweet = ({loggedIn}) => {
    const [tweetObj, setTweetObj] = useState({});
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.user.currentUser);

    useEffect(() => {
        if(!loggedIn)navigate('/login');
    }, [loggedIn]);
        
    const handleChange = (event) => {
        setTweetObj({ ...tweetObj, [event.target.name]: event.target.value })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(tweetObj);
        CreateTweet(currentUser.email, tweetObj).then(() => {
            toast.success("Tweet posted successfully");
            navigate('/dashboard');
        },error => {
            toast.error(error.message);
            console.log(error);
        });
    }

    return (
        <div>
            <h3 className='center mt-5'>Compose new Tweet</h3>
            <form className='new-tweet' onChange={handleChange} onSubmit={handleSubmit}>
                <input name='tag' className='form-control mb-2' placeholder='Enter tag' maxLength={50}/>
                <textarea
                    placeholder="What's happening?"
                    className='form-control mb-3'
                    maxLength={144}
                    name="subject"
                    rows={4}
                />
                <button
                    className='btn btn-primary'
                    type='submit'                >
                    Submit</button>
            </form>
        </div>
    );
}

export default NewTweet