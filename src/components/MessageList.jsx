import React from 'react';
import './styles/MessageList.css';
import MessageItem from './MessageItem';
import { useSelector } from 'react-redux';
import useGetMessage from '../hooks/useGetMessages'
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const MessageList = () => {
    useGetMessage()
    useGetRealTimeMessage()

    const { messages } = useSelector(store => store.message);

    return (
        <div className={ `message-list ${messages && messages.length > 0 ? 'has-messages' : ''}` }>
            { messages && messages.length > 0 ? (
                messages.map(message => (
                    <MessageItem key={ message._id } message={ message } />
                ))
            ) : (
                <div className="no-messages">No messages yet</div>
            ) }
        </div>
    );
};

export default MessageList;
