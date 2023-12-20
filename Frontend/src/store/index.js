import { configureStore } from "@reduxjs/toolkit";
import { loadingBarReducer } from 'react-redux-loading-bar'
import tweetSlice from "./tweet-slice";
import authSlice from "./auth-slice";
import userSlice from "./user-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tweet: tweetSlice.reducer,
    user: userSlice.reducer,
    loadingBar: loadingBarReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})


export default store;