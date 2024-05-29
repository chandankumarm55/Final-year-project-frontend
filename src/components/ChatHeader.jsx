import React from 'react';
import './styles/ChatHeader.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ChatHeader = () => {
    const { selectedUser } = useSelector(store => store.user);
    if (!selectedUser) {
        return
    }
    return (
        <div className='chat-header'>
            <Link to={ `/profile/${selectedUser?._id}` }>
                <img
                    src={ selectedUser?.profile ? `http://localhost:5000/${selectedUser?.profile}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
                    alt="Avatar"
                    className="avatar"
                    width="20px"
                    height="20px"
                />
            </Link>

            <h4>{ selectedUser.fullname }</h4>

        </div>
    );
};

export default ChatHeader;
