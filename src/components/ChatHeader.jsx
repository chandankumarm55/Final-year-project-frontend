import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { host } from '../utils/Constant';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BsThreeDotsVertical } from "react-icons/bs";
import { setMessages } from '../redux/messageSlice';
import { setAuthUser } from '../redux/userSlice'; // Make sure this import is correct
import './styles/ChatHeader.css';

const ChatHeader = () => {
    const dispatch = useDispatch();
    const { selectedUser, authUser } = useSelector(store => store.user);
    const [popup, setPopup] = useState(false);
    const popupRef = useRef(null);

    const handlePop = () => {
        setPopup(!popup);
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setPopup(false);
        }
    };

    useEffect(() => {
        if (popup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popup]);

    if (!selectedUser) {
        return null;
    }

    const handleClearchat = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${host}/message/deletemessage/${selectedUser._id}`);
            if (res) {
                toast.success('Message deleted');
                dispatch(setMessages());
                setPopup(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockUser = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${host}/user/block/${selectedUser?._id}`);
            console.log(res);
            toast.success(res.data.message);
            dispatch(setAuthUser({ blockedUsers: res.data.blockedUsers }));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='chat-header'>
            <div className='user-info'>
                <Link to={ `/profile/${selectedUser?._id}` }>
                    <img
                        src={ selectedUser?.profile ? `http://localhost:5000/${selectedUser?.profile}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
                        alt="Avatar"
                        className="avatar"
                    />
                </Link>
                <h4>{ selectedUser.fullname }</h4>
            </div>
            <div onClick={ handlePop } className='menu-icon'><BsThreeDotsVertical /></div>
            { popup && (
                <div className='popup' ref={ popupRef }>
                    <div className='popup-item' onClick={ handleClearchat }>Clear Chat</div>
                    <div className='popup-item'>Profile</div>
                    <div className='popup-item' onClick={ handleBlockUser }>
                        {
                            authUser?.blockedUsers?.includes(selectedUser?._id) ? 'Unblock User' : 'Block User'
                        }
                    </div>
                </div>
            ) }
        </div>
    );
};

export default ChatHeader;
