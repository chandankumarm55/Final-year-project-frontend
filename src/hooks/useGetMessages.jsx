import React, { useEffect } from 'react';
import axios from 'axios';
import { host } from '../utils/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, clearMessages } from '../redux/messageSlice'; // Ensure you have a clearMessages action

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear messages when selectedUser changes
        dispatch(clearMessages());

        const fetchMessages = async () => {
            if (!selectedUser?._id) return;

            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${host}/message/${selectedUser._id}`);
                dispatch(setMessages(res.data));
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMessages();
    }, [selectedUser?._id, dispatch]); // Added dispatch to the dependency array
};

export default useGetMessages;
