import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import './Chat.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

const Chat = () => {
    const { authUser } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    // useEffect(() => {
    //   return () => dispatch(setSelectedUser(null))
    // }, [])
    return (
        <div className='chat-container'>
            <Sidebar />
            {
                selectedUser ? (
                    <div className='chat-content'>
                        <ChatHeader />
                        <MessageList />
                        <MessageInput />
                    </div>
                ) : (
                    <div className='chat-placeholder'>
                        <h4>Hi , { authUser?.fullname }</h4>
                        <div>Let's start the chat</div>
                    </div>
                )
            }


        </div>
    );
};

export default Chat;
