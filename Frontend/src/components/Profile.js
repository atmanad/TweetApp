import { Tab, Tabs } from 'react-bootstrap';
import Tweet from './Tweet';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { forgotPassword } from '../services/UserService';
import { toast } from 'react-toastify'


function Profile({ tweetList, loggedIn }) {
    const [password, setPassword] = useState();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        forgotPassword({ username: id, password: password }).then(res => {
            console.log(res);
            toast.success(res.displayMessage);
        }, error => toast.error(error));
    }

    useEffect(() => {
        if (!loggedIn) navigate('/login');
    }, [loggedIn]);

    let tweets = tweetList?.filter(ele => ele.userId === id);
    // console.log(tweets);



    return (
        <>

            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <Tabs
                        defaultActiveKey="tweets"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="tweets" title="My Tweets">
                            <ul className='dashbard-list'>
                                {
                                    tweets?.map(t => (
                                        <li key={t?.id}>
                                            <Tweet t={t} reply={false} profilePage={true} />
                                        </li>
                                    ))
                                }
                            </ul>
                            {/* <Tweet/> */}
                        </Tab>
                        <Tab eventKey="forgot-pass" className="justify-content-center" title="Change Password">
                            <form className="mx-auto mt-5" onSubmit={handleSubmit} style={{ maxWidth: 400 + "px" }}>
                                <input className='form-control mb-3' name='password' placeholder='Enter new password' onChange={e => setPassword(e.target.value)} />
                                <button className='btn btn-primary' type='submit'>Submit</button>
                            </form>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )

}

export default Profile;