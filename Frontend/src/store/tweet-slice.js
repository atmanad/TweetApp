import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
    name: 'tweet',
    initialState: {
        tweetList: []
    },
    reducers: {
        loadTweets(state, action) {
            state.tweetList = action.payload
        },
        addLike(state, action) {
            state.tweetList[action.payload.index].likes.push(action.payload.like);
        },
        addReply(state, action) {
            state.tweetList[action.payload.index].replies.push(action.payload.reply);
        },
        updateTweet(state, action){
            state.tweetList[action.payload.index].subject = action.payload.subject;
        },
        deleteTweet(state, action){
            const newList = state.tweetList.filter(ele => ele.id !== action.payload);
            state.tweetList = newList;
        }
    }
})

export const tweetActions = tweetSlice.actions;

export default tweetSlice;