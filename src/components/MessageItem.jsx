import React, { useEffect, useRef } from 'react';
import './styles/MessageItem.css';
import { useSelector } from 'react-redux';

const MessageItem = ({ message }) => {
    const scroll = useRef();
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const isSentByCurrentUser = message?.senderId === authUser?._id;

    return (
        <div ref={ scroll } className={ `message-item ${isSentByCurrentUser ? 'me' : 'other'}` }>
            <div className="message-content">
                <p>{ message.message }<span className='timings'> 12:45</span></p>
            </div>
        </div>
    );
};

export default MessageItem;
