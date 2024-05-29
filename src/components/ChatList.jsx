import React, { useEffect, useState } from 'react';
import './styles/ChatList.css';
import ChatItem from './ChatItem';
import useGetOtheruser from '../hooks/useGetOtheruser';
import { useSelector } from 'react-redux';

const ChatList = ({ searchContact }) => {
    useGetOtheruser();
    const { otherUsers } = useSelector(store => store.user);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (searchContact) {
            setFilteredUsers(
                otherUsers.filter(user =>
                    user.fullname && user.fullname.toLowerCase().includes(searchContact.toLowerCase())
                )
            );
        } else {
            setFilteredUsers(otherUsers);
        }
    }, [searchContact, otherUsers]);

    if (!otherUsers) {
        return null;
    }

    return (
        <div className='chat-list'>
            { filteredUsers?.length > 0 ? (
                filteredUsers.map(user => (
                    <ChatItem key={ user._id } user={ user } />
                ))
            ) : (
                <div>No user found</div>
            ) }
        </div>
    );
};

export default ChatList;
