import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        currentUser:{}
    },
    reducers:{
        setUser(state, action){
            state.currentUser = action.payload;
        }
    }
})

export const userActions = userSlice.actions;

export default userSlice;