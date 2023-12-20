import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { isLoggedIn: false, token: null },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload;
            sessionStorage.setItem('token', action.payload);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.token=null;
            sessionStorage.removeItem('token');
        },
        addToken(state, action) {
            state.token = action.payload;
        }
    }
})

export const authActions = authSlice.actions;

export default authSlice;