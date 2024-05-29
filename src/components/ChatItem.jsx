import React from 'react';
import './styles/ChatItem.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { Link } from 'react-router-dom';

const ChatItem = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);

    const isOnline = onlineUsers.includes(user._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    };

    return (
        <div className={ `chat-item ${selectedUser?._id === user?._id ? 'selected' : ''}` } onClick={ () => selectedUserHandler(user) }>
            <Link to={ `/profile/${user?._id}` }>
                <div className="avatar-container">
                    <img src={ user?.profile ? `http://localhost:5000/${user.profile}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
                        alt="Avatar"
                        className="avatar"
                    />
                    <span className={ isOnline ? 'online-dot' : 'offline-dot' }></span>
                </div>
            </Link>
            <div className='chat-info'>
                <h5>{ user.fullname }</h5>
                <p> </p>
            </div>
        </div>
    );
};

export default ChatItem;
