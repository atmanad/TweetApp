import api from '../api/api'

export const loadAllTweet = async () => {
    let tweetList = [];
    try {
        const tweetResponse = await api.Tweet.list();
        const userResponse = await api.User.list();
        const likeResponse = await api.Tweet.likeDetails();
        const replyResponse = await api.Tweet.commentDetails();
        if (tweetResponse.isSuccess && userResponse.isSuccess && likeResponse.isSuccess && replyResponse.isSuccess) {
            var tweets = tweetResponse.result;
            var users = userResponse.result;
            var likes = likeResponse.result;
            var replies = replyResponse.result;

            tweets.forEach(element => {
                let tweet = {
                    ...element,
                    user: users.filter(ele => ele.email === element.userId)[0],
                    likes: likes.filter(ele => ele.tweetId === element.id),
                    replies: replies.filter(ele => ele.tweetId === element.id),
                    hasLiked: likes?.filter(ele => ele.tweetId === element?.id && ele.userId === element.userId)[0]?.id
                }
                tweetList.push(tweet);
            });
            // console.log(tweets);
            // console.log(users);
            return tweetsByDate(tweetList);
        } else {
            // history.push("/login");
            console.log("error from tweet service");
        }
    } catch (error) {
        console.log(error);
    }
};

const tweetsByDate = (tweetList) => {
    return tweetList.sort((a, b) => {
        return Date.parse(b.datePosted) - Date.parse(a.datePosted);
    });
}

export const selectTweet = async (id) => {
    let tweet = {};
    try {
        var response = await api.Tweet.details(id);
        if (response.isSuccess) {
            tweet = response.result;
            const userResponse = await api.User.list();
            let users = userResponse.result;
            tweet.user = users.filter(ele => ele.email === tweet.userId)[0];
            return tweet;
        }
        // console.log(tweet);
    } catch (error) {
        console.log(error);
    }
}

// export const loadLikes = async () => {
//     try {
//         var response = await api.Tweet.likeDetails();
//         let likes = response.result;
//     } catch (error) {
//         console.log(error);
//     }
// };


// export const loadLikeUsers = async () => {
//     let userTweetLikeRegistry = new Map();
//     userTweetLikeRegistry.set(99999, [1, 2, 3]);

//     try {
//         var response = await api.Tweet.likeDetails();

//         response.result.map((x) => {
//             if (userTweetLikeRegistry.has(x.tweetId)) {
//                 userTweetLikeRegistry.get(x.tweetId).push(x.userId);
//             } else {
//                 var user1 = [];
//                 user1.push(x.userId);
//                 userTweetLikeRegistry.set(x.tweetId, user1);
//             }
//         });
//         return userTweetLikeRegistry;
//     } catch (error) {
//         console.log(error);
//     }
// };

export const postALike = async (id, user) => {
    try {
        var response = await api.Tweet.postLike(id, user.email);
        if (response.isSuccess) return true;

    } catch (error) {
        console.log(error);
    }
};

export const CreateTweet = async (username, tweetObj) => {
    try {
        var response = await api.Tweet.createTweet(tweetObj, username);
        if (response.isSuccess) {
            // console.log("Tweet posted");
            // navigate('/');
        }
        else {
            console.log(response.errorMessages)
            console.log(response.innerException);
            throw Error(response.errorMessages);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const postAComment = async (message, email, id) => {
    try {
        var response = await api.Tweet.postComment(
            id,
            email,
            {
                username: email,
                message: message
            }
        );
        if (response.isSuccess) {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
};

export const updateTweet = async (username, id, body) => {
    try {
        var response = await api.Tweet.update(username, id, body);
        if (response.isSuccess) {
            return response.displayMessage;
        }
    } catch (error) {
        throw error;
    }
}

export const deleteTweet = async (username, id) => {
    try {
        var response = api.Tweet.delete(username, id);
        if(response.isSuccess)return response.displayMessage;
        
    } catch (error) {
        throw error;
    }
}