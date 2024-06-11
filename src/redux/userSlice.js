import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authUser: null,
        otherUsers: null,
        selectedUser: null,
        onlineUsers: [],
        blockedUser: []
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setBlockedUser: (state, action) => {
            state.blockedUser = action.payload
        }
    }
});

export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers, setBlockedUser } = userSlice.actions;
export default userSlice.reducer;