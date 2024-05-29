import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null
    },
    reducers: {
        setSocekt: (state, action) => {
            state.socket = action.payload
        }
    }
})

export const { setSocekt } = socketSlice.actions;
export default socketSlice.reducer